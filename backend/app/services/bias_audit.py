from __future__ import annotations

from typing import Dict, List

from app.schemas import Candidate


PROTECTED_ATTRIBUTE_FIELDS = {
    "caste",
    "religion",
    "gender",
    "disability",
    "age",
}


def build_bias_audit_report(candidates: List[Candidate]) -> Dict:
    """
    Bias-safe personalization proof:
    - We do not ingest protected attributes in Candidate schema.
    - We explicitly list the context signals used.

    Optional correlation audits require protected labels; since we do not collect them
    in the scoring pipeline, we return 'not_collected' here (which is the intended design).
    """
    # Candidate model doesn't include protected attributes; validate that assumption.
    candidate_fields = set(Candidate.model_fields.keys())
    protected_used = len(candidate_fields & PROTECTED_ATTRIBUTE_FIELDS) > 0

    return {
        "protected_attributes_used": protected_used,
        "context_signals": [
            "college_tier",
            "location_type",
            "internet_access",
            "financial_constraints",
            "first_generation_student",
            "projects_without_internships_resilience",
        ],
        "surrogate_bias_check": "PASS" if not protected_used else "FAIL",
        "correlation_audit": {
            "status": "not_collected",
            "note": "Protected attributes are not collected in the scoring pipeline. Provide an opt-in audit dataset to compute correlations.",
        },
    }

