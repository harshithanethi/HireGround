from __future__ import annotations

from app.schemas import JobDescription, ParsedResume
from app.services.ai_matching import calculate_ai_skill_match_score


def _skill_score(skills: list[str], job: JobDescription) -> float:
    # Backward-compatible helper retained for callers that only pass skills.
    return calculate_ai_skill_match_score(
        candidate_skills=skills,
        candidate_text=" ".join(skills),
        required_skills=job.required_skills,
        preferred_skills=job.preferred_skills,
    )


def calculate_baseline_score_v1(parsed: ParsedResume, job: JobDescription) -> float:
    """
    Baseline (uniform) scoring target ~100 points, aligned to your roadmap weights.
    Uses an AI-driven match component (local NLP semantic similarity + skill coverage).
    """
    skill_score = calculate_ai_skill_match_score(
        candidate_skills=parsed.skills,
        candidate_text=(parsed.raw_text_preview or " ".join(parsed.skills)),
        required_skills=job.required_skills,
        preferred_skills=job.preferred_skills,
    )  # 40 total
    cgpa_score = min((parsed.cgpa / 10.0) * 20.0, 20.0)  # 20
    projects_score = min(parsed.projects_count * 5.0, 15.0)  # 15
    internships_score = min(parsed.internships_count * 10.0, 20.0)  # 20
    certs_score = min(parsed.certifications_count * 3.0, 10.0)  # 10

    total = skill_score + cgpa_score + projects_score + internships_score + certs_score
    return round(min(total, 100.0), 2)

