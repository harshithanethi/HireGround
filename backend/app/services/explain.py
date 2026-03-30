from app.schemas import Candidate, JobDescription
from app.services.scorer import calculate_skill_score


def generate_explanation(
    candidate: Candidate,
    job: JobDescription,
    baseline_score: float,
    context_adjustment: float,
    final_score: float,
    context_reasons: list[str],
):
    explanation = []

    skill_score = calculate_skill_score(candidate, job)

    explanation.append(
        f"Baseline score is {baseline_score}, based on skills, projects, internships, CGPA, certifications, and achievements."
    )
    explanation.append(
        f"Skill match contributed {skill_score} points based on overlap with the job requirements."
    )

    if candidate.projects_count > 0:
        explanation.append(
            f"The candidate has {candidate.projects_count} project(s), which helped the baseline score."
        )

    if candidate.internships_count > 0:
        explanation.append(
            f"The candidate has {candidate.internships_count} internship(s), which helped in traditional screening."
        )

    if context_adjustment > 0:
        explanation.append(
            f"A context adjustment of {context_adjustment} was added to account for opportunity differences."
        )
        explanation.extend(context_reasons)
    else:
        explanation.append("No context adjustment was applied.")

    explanation.append(f"Final score is {final_score}.")
    return explanation