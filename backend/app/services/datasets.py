from __future__ import annotations

from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path
from typing import Any, Dict, Optional

import pandas as pd


@dataclass(frozen=True)
class DistrictContext:
    district: str
    state: Optional[str]
    opportunity_index: float  # 0-10
    job_opportunity_index: float  # 0-10 (kept for roadmap naming)
    rural_infra_index: float  # 0-10
    college_infra_index: float  # 0-10


def _backend_data_dir() -> Path:
    # backend/app/services/ -> backend/data/
    return Path(__file__).resolve().parents[2] / "data"


@lru_cache(maxsize=1)
def load_india_context_df() -> pd.DataFrame:
    """
    Offline dataset loader. Must not do any network calls.
    """
    path = _backend_data_dir() / "india_context.csv"
    if path.exists():
        try:
            df = pd.read_csv(path)
            if len(df.index) > 0:
                df.columns = [c.strip() for c in df.columns]
                return df
        except Exception:
            pass

    # Fallback: derive a lightweight opportunity index from bundled census dataset.
    census_path = _backend_data_dir() / "india-districts-census-2011.csv"
    if not census_path.exists():
        raise FileNotFoundError(
            f"Missing datasets at {path} and {census_path}. Add CSVs under backend/data/."
        )

    cdf = pd.read_csv(census_path)
    cdf.columns = [c.strip() for c in cdf.columns]

    internet_rate = cdf["Households_with_Internet"] / cdf["Households"]
    electric_rate = cdf["Housholds_with_Electric_Lighting"] / cdf["Households"]
    literacy_rate = cdf["Literate"] / cdf["Population"]
    urban_rate = cdf["Urban_Households"] / cdf["Households"]

    def _norm_0_10(s: pd.Series) -> pd.Series:
        s = pd.to_numeric(s, errors="coerce")
        lo = float(s.min())
        hi = float(s.max())
        if hi - lo < 1e-9:
            return pd.Series([5.0] * len(s), index=s.index)
        return ((s - lo) / (hi - lo) * 10.0).clip(0, 10)

    rural_infra = _norm_0_10(electric_rate * 0.5 + internet_rate * 0.5)
    college_infra = _norm_0_10(literacy_rate * 0.7 + internet_rate * 0.3)
    job_opportunity = _norm_0_10(urban_rate * 0.6 + internet_rate * 0.4)
    derived = pd.DataFrame(
        {
            "state": cdf["State name"].astype(str),
            "district": cdf["District name"].astype(str),
            "opportunity_index": (job_opportunity * 0.7 + college_infra * 0.3).round(3),
            "job_opportunity_index": job_opportunity.round(3),
            "college_infra_index": college_infra.round(3),
            "rural_infra_index": rural_infra.round(3),
        }
    ).sort_values(["state", "district"])

    # Persist for subsequent runs (optional; safe for offline usage).
    try:
        derived.to_csv(path, index=False)
    except Exception:
        pass

    return derived


@lru_cache(maxsize=1)
def load_college_tiers_df() -> pd.DataFrame:
    path = _backend_data_dir() / "college_tiers.csv"
    if path.exists():
        try:
            df = pd.read_csv(path)
            if len(df.index) > 0:
                df.columns = [c.strip() for c in df.columns]
                return df
        except Exception:
            pass

    # Fallback minimal mapping (keeps demo functional).
    df = pd.DataFrame(
        [
            {"college_name": "IIT Madras", "tier": "Tier1", "nirf_rank": 1, "state": "Tamil Nadu"},
            {"college_name": "IIT Delhi", "tier": "Tier1", "nirf_rank": 2, "state": "Delhi"},
            {"college_name": "NIT Tiruchirappalli", "tier": "Tier1", "nirf_rank": 9, "state": "Tamil Nadu"},
            {"college_name": "IIIT Hyderabad", "tier": "Tier1", "nirf_rank": 47, "state": "Telangana"},
            {"college_name": "BITS Pilani", "tier": "Tier1", "nirf_rank": 25, "state": "Rajasthan"},
            {"college_name": "VIT Vellore", "tier": "Tier2", "nirf_rank": 11, "state": "Tamil Nadu"},
            {"college_name": "SRM Institute of Science and Technology", "tier": "Tier2", "nirf_rank": 28, "state": "Tamil Nadu"},
            {"college_name": "Anna University", "tier": "Tier2", "nirf_rank": 14, "state": "Tamil Nadu"},
            {"college_name": "Local Engineering College", "tier": "Tier3", "nirf_rank": None, "state": None},
        ]
    )
    try:
        df.to_csv(path, index=False)
    except Exception:
        pass
    return df


def _safe_float(v: Any, default: float = 0.0) -> float:
    try:
        return float(v)
    except Exception:
        return default


def get_district_context(district_name: Optional[str]) -> DistrictContext:
    """
    Returns district context (indices in 0-10 scale) with safe fallbacks.
    """
    df = load_india_context_df()
    if not district_name:
        return DistrictContext(
            district="UNKNOWN",
            state=None,
            opportunity_index=5.0,
            job_opportunity_index=5.0,
            rural_infra_index=5.0,
            college_infra_index=5.0,
        )

    match = df[df["district"].str.lower() == str(district_name).strip().lower()]
    if match.empty:
        # Fallback: partial contains
        match = df[df["district"].str.lower().str.contains(str(district_name).strip().lower())]

    if match.empty:
        return DistrictContext(
            district=str(district_name),
            state=None,
            opportunity_index=5.0,
            job_opportunity_index=5.0,
            rural_infra_index=5.0,
            college_infra_index=5.0,
        )

    row = match.iloc[0].to_dict()
    opportunity_index = _safe_float(row.get("opportunity_index", row.get("job_opportunity_index", 5.0)), 5.0)
    job_opportunity_index = _safe_float(row.get("job_opportunity_index", opportunity_index), opportunity_index)
    rural_infra_index = _safe_float(row.get("rural_infra_index", 5.0), 5.0)
    college_infra_index = _safe_float(row.get("college_infra_index", 5.0), 5.0)
    return DistrictContext(
        district=str(row.get("district", district_name)),
        state=row.get("state"),
        opportunity_index=opportunity_index,
        job_opportunity_index=job_opportunity_index,
        rural_infra_index=rural_infra_index,
        college_infra_index=college_infra_index,
    )


def infer_college_tier(college_name: Optional[str]) -> str:
    """
    Uses local CSV mapping. Falls back to heuristic tiers.
    """
    if not college_name:
        return "Tier3"

    df = load_college_tiers_df()
    name_norm = str(college_name).strip().lower()
    exact = df[df["college_name"].str.lower() == name_norm]
    if not exact.empty:
        tier = str(exact.iloc[0].get("tier", "Tier3")).strip()
        return tier or "Tier3"

    # heuristic fallback
    up = str(college_name).upper()
    tier1_tokens = ["IIT", "IISc", "NIT", "BITS", "IIIT"]
    tier2_tokens = ["VIT", "SRM", "MANIPAL", "ANNA UNIVERSITY", "AMITY"]
    if any(t in up for t in tier1_tokens):
        return "Tier1"
    if any(t in up for t in tier2_tokens):
        return "Tier2"
    return "Tier3"
