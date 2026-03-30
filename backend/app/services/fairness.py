from app.schemas import CandidateScoreResult


def build_fairness_summary(results: list[CandidateScoreResult]) -> dict:
    if not results:
        return {
            "total_candidates": 0,
            "avg_baseline_score": 0,
            "avg_final_score": 0,
            "candidates_improved": 0
        }

    avg_baseline = sum(r.baseline_score for r in results) / len(results)
    avg_final = sum(r.final_score for r in results) / len(results)
    improved = sum(1 for r in results if r.final_score > r.baseline_score)

    return {
        "total_candidates": len(results),
        "avg_baseline_score": round(avg_baseline, 2),
        "avg_final_score": round(avg_final, 2),
        "candidates_improved": improved
    }