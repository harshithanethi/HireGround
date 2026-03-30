from __future__ import annotations

import argparse
from pathlib import Path

import numpy as np
import pandas as pd


def _normalize_0_10(s: pd.Series) -> pd.Series:
    s = pd.to_numeric(s, errors="coerce")
    if s.isna().all():
        return pd.Series([5.0] * len(s), index=s.index)
    lo = float(s.min())
    hi = float(s.max())
    if hi - lo < 1e-9:
        return pd.Series([5.0] * len(s), index=s.index)
    return ((s - lo) / (hi - lo) * 10.0).clip(0, 10)


def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument(
        "--census",
        default=str(Path(__file__).resolve().parents[1] / "data" / "india-districts-census-2011.csv"),
        help="Path to india-districts-census-2011.csv",
    )
    p.add_argument(
        "--out",
        default=str(Path(__file__).resolve().parents[1] / "data" / "india_context.csv"),
        help="Output india_context.csv path",
    )
    p.add_argument("--rows", type=int, default=200, help="How many districts to keep")
    args = p.parse_args()

    df = pd.read_csv(args.census)
    df.columns = [c.strip() for c in df.columns]

    # Proxy features (purely opportunity/infrastructure signals)
    internet_rate = df["Households_with_Internet"] / df["Households"]
    electric_rate = df["Housholds_with_Electric_Lighting"] / df["Households"]
    literacy_rate = df["Literate"] / df["Population"]
    urban_rate = df["Urban_Households"] / df["Households"]

    # Build indices (0-10). These are not demographics; they describe access/opportunity.
    rural_infra = _normalize_0_10((electric_rate * 0.5 + internet_rate * 0.5))
    college_infra = _normalize_0_10((literacy_rate * 0.7 + internet_rate * 0.3))
    job_opportunity = _normalize_0_10((urban_rate * 0.6 + internet_rate * 0.4))

    out = pd.DataFrame(
        {
            "state": df["State name"].astype(str),
            "district": df["District name"].astype(str),
            "opportunity_index": (job_opportunity * 0.7 + college_infra * 0.3).round(3),
            "job_opportunity_index": job_opportunity.round(3),
            "college_infra_index": college_infra.round(3),
            "rural_infra_index": rural_infra.round(3),
        }
    )

    out = out.sort_values(["state", "district"]).head(args.rows)
    Path(args.out).parent.mkdir(parents=True, exist_ok=True)
    out.to_csv(args.out, index=False)
    print(f"Wrote {len(out)} rows -> {args.out}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

