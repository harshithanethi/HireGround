from app.schemas import Candidate


def calculate_context_adjustment(candidate: Candidate):
    adjustment = 0.0
    reasons = []

    if candidate.college_tier >= 3:
        adjustment += 4
        reasons.append("Added bonus for lower college tier.")

    if candidate.location_type.lower() == "rural":
        adjustment += 4
        reasons.append("Added bonus for rural background.")

    if candidate.financial_constraints:
        adjustment += 4
        reasons.append("Added resilience bonus for financial constraints.")

    if candidate.first_generation_student:
        adjustment += 3
        reasons.append("Added bonus for first-generation student status.")

    if candidate.internet_access.lower() == "low":
        adjustment += 3
        reasons.append("Added bonus for low internet access.")
    elif candidate.internet_access.lower() == "moderate":
        adjustment += 1.5
        reasons.append("Added small bonus for moderate internet access constraints.")

    if candidate.projects_count >= 2 and candidate.internships_count == 0:
        adjustment += 4
        reasons.append("Added resilience bonus for strong projects despite no internships.")

    return round(adjustment, 2), reasons