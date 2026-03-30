from __future__ import annotations

from typing import List, Tuple

from app.schemas import ParsedResume
from app.services.datasets import get_district_context


MAX_ADJUSTMENT = 25.0


def calculate_context_adjustment_v1(parsed: ParsedResume) -> Tuple[float, List[str], List[str]]:
    """
    Context-aware opportunity credits using non-overlapping factors.
    We intentionally avoid direct rural bonus because district opportunity and infra
    already capture geographic constraints more precisely.
    Returns (adjustment_points, breakdown_strings, context_signals_used)
    """
    adjustment = 0.0
    breakdown: List[str] = []
    signals: List[str] = []

    ctx = get_district_context(parsed.district)

    # 1) Educational access gap (institutional)
    if parsed.college_tier == "Tier3":
        adjustment += 6.0
        breakdown.append("Educational access gap: Tier-3 college (+6)")
        signals.append("college_tier")
    elif parsed.college_tier == "Tier2":
        adjustment += 3.0
        breakdown.append("Educational access gap: Tier-2 college (+3)")
        signals.append("college_tier")

    if ctx.college_infra_index < 4.0:
        adjustment += 2.0
        breakdown.append(f"Local college infrastructure gap (+2, infra={round(ctx.college_infra_index,2)})")
        signals.append("college_infra_index")

    # 2) Labor market access gap (continuous, not binary)
    # Gap from threshold 3.0 scaled by 2.5, capped at 7
    if ctx.job_opportunity_index < 3.0:
        market_gap = min((3.0 - ctx.job_opportunity_index) * 2.5, 7.0)
        market_gap = round(market_gap, 2)
        adjustment += market_gap
        breakdown.append(
            f"Labor market access gap (+{market_gap}, opportunity_index={round(ctx.job_opportunity_index,2)})"
        )
        signals.append("job_opportunity_index")

    # 3) Digital + local infrastructure access gap
    if ctx.rural_infra_index < 4.0:
        adjustment += 4.0
        breakdown.append(f"Digital/access infrastructure gap (+4, infra={round(ctx.rural_infra_index,2)})")
        signals.append("rural_infra_index")
    elif ctx.rural_infra_index < 6.0:
        adjustment += 2.0
        breakdown.append(f"Moderate digital/access infrastructure gap (+2, infra={round(ctx.rural_infra_index,2)})")
        signals.append("rural_infra_index")

    # 4) Family educational capital
    if parsed.first_gen_flag:
        adjustment += 4.0
        breakdown.append("First-generation learner support (+4)")
        signals.append("first_gen_flag")

    # 5) Demonstrated resilience signal
    if parsed.projects_count >= 2 and parsed.internships_count == 0:
        adjustment += 3.0
        breakdown.append("Resilience: strong projects despite zero internships (+3)")
        signals.append("projects_vs_internships")

    if adjustment > MAX_ADJUSTMENT:
        adjustment = MAX_ADJUSTMENT
        breakdown.append("Adjustment cap applied (+25 max)")

    return round(adjustment, 2), breakdown, sorted(set(signals))

