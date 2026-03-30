from app.schemas import Candidate, JobDescription


def calculate_skill_score(candidate: Candidate, job: JobDescription) -> float:
    candidate_skills = {skill.strip().lower() for skill in candidate.skills}
    required_skills = {skill.strip().lower() for skill in job.required_skills}
    preferred_skills = {skill.strip().lower() for skill in job.preferred_skills}

    required_score = 0.0
    preferred_score = 0.0

    if required_skills:
        matched_required = len(candidate_skills & required_skills)
        required_score = (matched_required / len(required_skills)) * 35

    if preferred_skills:
        matched_preferred = len(candidate_skills & preferred_skills)
        preferred_score = (matched_preferred / len(preferred_skills)) * 10

    return round(required_score + preferred_score, 2)


def calculate_baseline_score(candidate: Candidate, job: JobDescription) -> float:
    skill_score = calculate_skill_score(candidate, job)
    projects_score = min(candidate.projects_count * 4, 12)
    internships_score = min(candidate.internships_count * 5, 15)
    cgpa_score = min((candidate.cgpa / 10) * 12, 12)
    certifications_score = min(candidate.certifications_count * 2, 8)
    achievements_score = min(candidate.achievements_count * 2, 8)

    total = (
        skill_score
        + projects_score
        + internships_score
        + cgpa_score
        + certifications_score
        + achievements_score
    )

    return round(min(total, 100), 2)