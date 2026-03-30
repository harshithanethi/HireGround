from fastapi import APIRouter
from app.schemas import ScoreRequest, ScoreResponse, CandidateScoreResult
from app.services.scorer import calculate_baseline_score
from app.services.context import calculate_context_adjustment
from app.services.explain import generate_explanation

router = APIRouter()


@router.post("/score-candidate", response_model=ScoreResponse)
def score_candidate(payload: ScoreRequest):
    candidate = payload.candidate
    job = payload.job

    baseline_score = calculate_baseline_score(candidate, job)
    context_adjustment, context_reasons = calculate_context_adjustment(candidate)
    final_score = round(min(baseline_score + context_adjustment, 100), 2)

    explanation = generate_explanation(
        candidate=candidate,
        job=job,
        baseline_score=baseline_score,
        context_adjustment=context_adjustment,
        final_score=final_score,
        context_reasons=context_reasons,
    )

    result = CandidateScoreResult(
        candidate_id=candidate.id,
        candidate_name=candidate.name,
        baseline_score=baseline_score,
        context_adjustment=context_adjustment,
        final_score=final_score,
        explanation=explanation,
        baseline_rank=1,
        final_rank=1,
        rank_shift=0,
    )

    return ScoreResponse(result=result)