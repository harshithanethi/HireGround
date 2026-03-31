import os
import tempfile
from typing import List, Optional

from fastapi import APIRouter, File, Form, UploadFile

from app.schemas import BatchScoreRequest, BatchScoreResponse, CandidateScoreResult
from app.services.ceos import calculate_ceos_batch
from app.services.group_fairness import build_group_fairness
from app.services.scorer import calculate_baseline_score
from app.services.context import calculate_context_adjustment
from app.services.explain import generate_explanation
from app.services.fairness import build_fairness_summary
from app.services.bias_audit import build_bias_audit_report
from app.services.parser import parse_resume
from app.services.pipeline import score_from_parsed

router = APIRouter()


@router.post("/score-batch", response_model=BatchScoreResponse)
def score_batch(payload: BatchScoreRequest):
    temp_results = []

    for candidate in payload.candidates:
        baseline_score = calculate_baseline_score(candidate, payload.job)
        context_adjustment, reasons = calculate_context_adjustment(candidate)
        final_score = round(min(baseline_score + context_adjustment, 100), 2)

        explanation = generate_explanation(
            candidate,
            payload.job,
            baseline_score,
            context_adjustment,
            final_score,
            reasons,
        )

        temp_results.append(
            CandidateScoreResult(
                candidate_id=candidate.id,
                candidate_name=candidate.name,
                baseline_score=baseline_score,
                context_adjustment=context_adjustment,
                final_score=final_score,
                explanation=explanation,
            )
        )

    baseline_sorted = sorted(temp_results, key=lambda x: x.baseline_score, reverse=True)
    final_sorted = sorted(temp_results, key=lambda x: x.final_score, reverse=True)

    baseline_ranks = {r.candidate_name: i + 1 for i, r in enumerate(baseline_sorted)}
    final_ranks = {r.candidate_name: i + 1 for i, r in enumerate(final_sorted)}

    for result in temp_results:
        result.baseline_rank = baseline_ranks[result.candidate_name]
        result.final_rank = final_ranks[result.candidate_name]
        result.rank_shift = result.baseline_rank - result.final_rank

    fairness_summary = build_fairness_summary(temp_results)
    group_fairness = build_group_fairness(payload.candidates, temp_results)
    audit = build_bias_audit_report(payload.candidates)

    adjusted_candidates = sum(1 for r in temp_results if r.context_adjustment > 0)
    avg_adjustment = (
        sum(r.context_adjustment for r in temp_results) / len(temp_results) if temp_results else 0.0
    )

    # Rural representation gain: (equitable_rural_rate - uniform_rural_rate), normalized to 0..1 for CEOS formula.
    rural_gain = float(group_fairness.get("rural_representation_gain", 0.0))
    ceos_batch = calculate_ceos_batch(
        total_candidates=len(temp_results),
        adjusted_candidates=adjusted_candidates,
        avg_adjustment=avg_adjustment,
        max_possible_adjustment=25.0,
        rural_representation_gain=rural_gain,
    )

    return BatchScoreResponse(
        results=temp_results,
        fairness_summary={
            **fairness_summary,
            "ceos_batch": ceos_batch,
            "group_fairness": group_fairness,
            "bias_audit": audit,
        }
    )


@router.post("/v1/score-batch-files", response_model=BatchScoreResponse)
async def score_batch_files_v1(
    files: List[UploadFile] = File(...),
    job_title: str = Form(...),
    required_skills: str = Form(""),
    preferred_skills: str = Form(""),
    shortlist_threshold: Optional[float] = Form(None),
):
    """
    Offline batch demo endpoint:
    Upload PDFs/DOCX + provide job fields in a multipart form.
    Returns the same response shape as /score-batch for easy UI reuse.
    """
    from app.schemas import Candidate, CandidateScoreV1, JobDescription

    job = JobDescription(
        title=job_title,
        required_skills=[s.strip() for s in required_skills.split(",") if s.strip()],
        preferred_skills=[s.strip() for s in preferred_skills.split(",") if s.strip()],
    )

    threshold = float(shortlist_threshold) if shortlist_threshold is not None else 80.0

    candidates: List[Candidate] = []
    v1_passports_by_name: dict[str, dict] = {}
    results: List[CandidateScoreResult] = []

    for f in files:
        suffix = os.path.splitext(f.filename or "")[1].lower()
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            tmp.write(await f.read())
            tmp_path = tmp.name
        try:
            parsed = parse_resume(tmp_path)
            # Legacy Candidate object is used only to group candidates for fairness metrics.
            candidates.append(
                Candidate(
                    id=None,
                    name=parsed.name or (f.filename or "Unknown"),
                    skills=parsed.skills,
                    projects_count=parsed.projects_count,
                    internships_count=parsed.internships_count,
                    cgpa=parsed.cgpa,
                    certifications_count=parsed.certifications_count,
                    achievements_count=0,
                    college_tier=(
                        1 if parsed.college_tier == "Tier1" else 2 if parsed.college_tier == "Tier2" else 3
                    ),
                    location_type="rural" if parsed.rural_flag else "urban",
                    internet_access="good",
                    financial_constraints=False,
                    first_generation_student=parsed.first_gen_flag,
                )
            )
            v1: CandidateScoreV1 = score_from_parsed(parsed, job)
            name = v1.candidate_name
            v1_passports_by_name[name] = v1.passport.model_dump()

            results.append(
                CandidateScoreResult(
                    candidate_id=None,
                    candidate_name=name,
                    baseline_score=v1.baseline_score,
                    context_adjustment=v1.context_adjustment,
                    final_score=v1.final_score,
                    explanation=v1.adjustment_breakdown,
                )
            )
        finally:
            try:
                os.remove(tmp_path)
            except OSError:
                pass

    baseline_sorted = sorted(results, key=lambda x: x.baseline_score, reverse=True)
    final_sorted = sorted(results, key=lambda x: x.final_score, reverse=True)

    baseline_ranks = {r.candidate_name: i + 1 for i, r in enumerate(baseline_sorted)}
    final_ranks = {r.candidate_name: i + 1 for i, r in enumerate(final_sorted)}

    for result in results:
        result.baseline_rank = baseline_ranks[result.candidate_name]
        result.final_rank = final_ranks[result.candidate_name]
        result.rank_shift = result.baseline_rank - result.final_rank

    fairness_summary = build_fairness_summary(results)
    group_fairness = build_group_fairness(candidates, results, shortlist_threshold=threshold)
    audit = build_bias_audit_report(candidates)

    adjusted_candidates = sum(1 for r in results if r.context_adjustment > 0)
    avg_adjustment = (
        sum(r.context_adjustment for r in results) / len(results) if results else 0.0
    )

    rural_gain = float(group_fairness.get("rural_representation_gain", 0.0))
    ceos_batch = calculate_ceos_batch(
        total_candidates=len(results),
        adjusted_candidates=adjusted_candidates,
        avg_adjustment=avg_adjustment,
        max_possible_adjustment=25.0,
        rural_representation_gain=rural_gain,
    )

    fairness_summary_payload = {
        **fairness_summary,
        "ceos_batch": ceos_batch,
        "group_fairness": group_fairness,
        "bias_audit": audit,
        "v1_passports": v1_passports_by_name,
        "shortlist_threshold_override": threshold,
    }

    return BatchScoreResponse(results=results, fairness_summary=fairness_summary_payload)