from __future__ import annotations


def calculate_ceos_candidate(
    baseline_score: float,
    context_adjustment: float,
    max_possible_adjustment: float,
) -> float:
    """
    Per-candidate CEOS: how much equity-correction was applied, scaled 0-100.
    We use a simple candidate-level proxy consistent with the batch CEOS components.
    """
    if max_possible_adjustment <= 0:
        return 0.0
    return round(min((context_adjustment / max_possible_adjustment) * 100.0, 100.0), 2)


def calculate_ceos_batch(
    total_candidates: int,
    adjusted_candidates: int,
    avg_adjustment: float,
    max_possible_adjustment: float,
    rural_representation_gain: float,
) -> float:
    """
    Roadmap batch CEOS formula:
      CEOS = (Adjusted_Candidates / Total_Candidates) * 50
           + (Avg_Adjustment / Max_Possible) * 30
           + (Rural_Representation_Gain) * 20
    Returns 0-100.
    """
    if total_candidates <= 0 or max_possible_adjustment <= 0:
        return 0.0

    part1 = (adjusted_candidates / total_candidates) * 50.0
    part2 = (avg_adjustment / max_possible_adjustment) * 30.0
    part3 = max(0.0, rural_representation_gain) * 20.0
    return round(min(part1 + part2 + part3, 100.0), 2)

