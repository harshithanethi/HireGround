from __future__ import annotations

import argparse
from pathlib import Path

import pandas as pd


DEFAULT_COLLEGES = [
    ("IIT Madras", "Tier1", 1, "Tamil Nadu"),
    ("IIT Delhi", "Tier1", 2, "Delhi"),
    ("IIT Bombay", "Tier1", 3, "Maharashtra"),
    ("IIT Kanpur", "Tier1", 4, "Uttar Pradesh"),
    ("IIT Kharagpur", "Tier1", 5, "West Bengal"),
    ("NIT Tiruchirappalli", "Tier1", 9, "Tamil Nadu"),
    ("IIIT Hyderabad", "Tier1", 47, "Telangana"),
    ("BITS Pilani", "Tier1", 25, "Rajasthan"),
    ("VIT Vellore", "Tier2", 11, "Tamil Nadu"),
    ("SRM Institute of Science and Technology", "Tier2", 28, "Tamil Nadu"),
    ("Manipal Institute of Technology", "Tier2", 61, "Karnataka"),
    ("Anna University", "Tier2", 14, "Tamil Nadu"),
    ("Amity University", "Tier2", 32, "Uttar Pradesh"),
    ("PSG College of Technology", "Tier2", 63, "Tamil Nadu"),
    ("Local Engineering College", "Tier3", None, None),
    ("Government Polytechnic College", "Tier3", None, None),
]


def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument(
        "--out",
        default=str(Path(__file__).resolve().parents[1] / "data" / "college_tiers.csv"),
        help="Output college_tiers.csv path",
    )
    args = p.parse_args()

    df = pd.DataFrame(DEFAULT_COLLEGES, columns=["college_name", "tier", "nirf_rank", "state"])
    Path(args.out).parent.mkdir(parents=True, exist_ok=True)
    df.to_csv(args.out, index=False)
    print(f"Wrote {len(df)} rows -> {args.out}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

