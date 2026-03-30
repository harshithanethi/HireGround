from __future__ import annotations

from app.schemas import CandidateScoreV1, FairnessPassport, JobDescription, ParsedResume
from app.services.afs import calculate_afs
from app.services.ceos import calculate_ceos_candidate
from app.services.context_v1 import calculate_context_adjustment_v1
from app.services.scorer_v1 import calculate_baseline_score_v1


def score_from_parsed(parsed: ParsedResume, job: JobDescription) -> CandidateScoreV1:
    baseline = calculate_baseline_score_v1(parsed, job)
    adjustment, breakdown, context_signals = calculate_context_adjustment_v1(parsed)
    final_score = round(min(baseline + adjustment, 100.0), 2)

    afs = calculate_afs(baseline_score=baseline, context_adjustment=adjustment)
    ceos = calculate_ceos_candidate(
        baseline_score=baseline,
        context_adjustment=adjustment,
        max_possible_adjustment=25.0,
    )

    passport = FairnessPassport(
        adjustment_breakdown=breakdown,
        context_signals_used=context_signals,
        protected_attributes_used=False,
        ceos_score=ceos,
        afs_score=afs,
    )

    return CandidateScoreV1(
        candidate_name=parsed.name or "Unknown",
        baseline_score=baseline,
        context_adjustment=adjustment,
        final_score=final_score,
        adjustment_breakdown=breakdown,
        passport=passport,
    )

