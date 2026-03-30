from __future__ import annotations


def calculate_afs(baseline_score: float, context_adjustment: float) -> float:
    """
    Adaptive Fairness Score (AFS), 0-100.

    Roadmap formula:
      AFS = (Context_Adjustment / Baseline_Score) * 100
    """
    if baseline_score <= 0:
        return 0.0
    return round(min((context_adjustment / baseline_score) * 100.0, 100.0), 2)

