from __future__ import annotations

from collections import Counter
from typing import Dict, List

from app.schemas import Candidate, CandidateScoreResult


def _shortlist_rate(candidates: List[Candidate], shortlisted_names: set[str]) -> float:
    if not candidates:
        return 0.0
    in_group = len(candidates)
    shortlisted = sum(1 for c in candidates if c.name in shortlisted_names)
    return shortlisted / in_group if in_group else 0.0


def build_group_fairness(
    candidates: List[Candidate],
    results: List[CandidateScoreResult],
    shortlist_threshold: float = 80.0,
) -> Dict:
    """
    Group-level fairness metrics (tier-wise, rural/urban), comparing uniform vs equitable shortlists.
    """
    by_name = {r.candidate_name: r for r in results}
    uniform_shortlisted = {r.candidate_name for r in results if r.baseline_score >= shortlist_threshold}
    equitable_shortlisted = {r.candidate_name for r in results if r.final_score >= shortlist_threshold}

    tier_groups: dict[int, list[Candidate]] = {1: [], 2: [], 3: []}
    rural_group: list[Candidate] = []
    urban_group: list[Candidate] = []

    for c in candidates:
        tier_groups.get(int(c.college_tier), tier_groups[3]).append(c)
        if c.location_type.lower() == "rural":
            rural_group.append(c)
        else:
            urban_group.append(c)

    tier_rates = {}
    for tier, group in tier_groups.items():
        tier_rates[f"tier{tier}_uniform_shortlist_rate"] = round(_shortlist_rate(group, uniform_shortlisted), 4)
        tier_rates[f"tier{tier}_equitable_shortlist_rate"] = round(_shortlist_rate(group, equitable_shortlisted), 4)

    rural_uniform = _shortlist_rate(rural_group, uniform_shortlisted)
    rural_equitable = _shortlist_rate(rural_group, equitable_shortlisted)
    urban_uniform = _shortlist_rate(urban_group, uniform_shortlisted)
    urban_equitable = _shortlist_rate(urban_group, equitable_shortlisted)

    rural_representation_gain = max(0.0, rural_equitable - rural_uniform)  # 0..1

    return {
        **tier_rates,
        "rural_uniform_shortlist_rate": round(rural_uniform, 4),
        "rural_equitable_shortlist_rate": round(rural_equitable, 4),
        "urban_uniform_shortlist_rate": round(urban_uniform, 4),
        "urban_equitable_shortlist_rate": round(urban_equitable, 4),
        "rural_representation_gain": round(rural_representation_gain, 4),
        "shortlist_threshold": shortlist_threshold,
        "counts": {
            "total": len(candidates),
            "uniform_shortlisted": len(uniform_shortlisted),
            "equitable_shortlisted": len(equitable_shortlisted),
        },
        "tier_counts": dict(Counter(int(c.college_tier) for c in candidates)),
    }

