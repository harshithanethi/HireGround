from __future__ import annotations

from collections import Counter
from typing import Any, Dict, Optional

from app.schemas import ContextStatsResponse
from app.services.datasets import load_college_tiers_df, load_india_context_df


def build_context_stats(sample_size: Optional[int] = None) -> ContextStatsResponse:
    india = load_india_context_df()
    colleges = load_college_tiers_df()

    districts_count = int(india["district"].nunique()) if "district" in india.columns else int(len(india))
    oi = india["opportunity_index"] if "opportunity_index" in india.columns else india.get("job_opportunity_index")
    oi = oi.dropna().astype(float) if oi is not None else None

    opportunity_index_summary: Dict[str, float] = {}
    if oi is not None and len(oi) > 0:
        opportunity_index_summary = {
            "min": float(oi.min()),
            "p25": float(oi.quantile(0.25)),
            "median": float(oi.quantile(0.5)),
            "p75": float(oi.quantile(0.75)),
            "max": float(oi.max()),
            "mean": float(oi.mean()),
        }

    tier_counts = Counter()
    if "tier" in colleges.columns:
        tier_counts.update([str(x) for x in colleges["tier"].dropna().tolist()])

    sample_rows = []
    if sample_size:
        sample_rows = india.head(int(sample_size)).to_dict(orient="records")

    return ContextStatsResponse(
        districts_count=districts_count,
        opportunity_index_summary=opportunity_index_summary,
        college_tier_counts=dict(tier_counts),
        sample_rows=sample_rows,  # for UI sanity checks
    )

