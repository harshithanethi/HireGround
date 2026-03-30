from fastapi import APIRouter
from app.schemas import BatchScoreRequest, BatchScoreResponse, CandidateScoreResult
from app.services.scorer import calculate_baseline_score
from app.services.context import calculate_context_adjustment
from app.services.explain import generate_explanation
from app.services.fairness import build_fairness_summary

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

    return BatchScoreResponse(
        results=temp_results,
        fairness_summary=fairness_summary
    )