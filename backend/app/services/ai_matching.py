from __future__ import annotations

from typing import Iterable

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


def _normalize_skills(skills: Iterable[str]) -> set[str]:
    return {s.strip().lower() for s in skills if str(s).strip()}


def _semantic_similarity(candidate_text: str, jd_text: str) -> float:
    """
    Lightweight local NLP similarity (offline) using TF-IDF + cosine.
    Returns 0..1.
    """
    c = (candidate_text or "").strip()
    j = (jd_text or "").strip()
    if not c or not j:
        return 0.0

    vec = TfidfVectorizer(ngram_range=(1, 2), stop_words="english")
    mat = vec.fit_transform([c, j])
    sim = cosine_similarity(mat[0:1], mat[1:2])[0][0]
    return float(max(0.0, min(sim, 1.0)))


def calculate_ai_skill_match_score(
    candidate_skills: list[str],
    candidate_text: str,
    required_skills: list[str],
    preferred_skills: list[str],
) -> float:
    """
    AI-driven candidate-job fit score (0..40):
    - 60% semantic similarity (TF-IDF cosine over resume text vs JD text)
    - 40% explicit skill coverage (required + preferred)
    """
    cskills = _normalize_skills(candidate_skills)
    req = _normalize_skills(required_skills)
    pref = _normalize_skills(preferred_skills)

    req_cov = (len(cskills & req) / len(req)) if req else 0.0
    pref_cov = (len(cskills & pref) / len(pref)) if pref else 0.0

    # combine coverage with stronger weight on required skills
    coverage = 0.75 * req_cov + 0.25 * pref_cov

    jd_text = " ".join(list(req) + list(pref))
    semantic = _semantic_similarity(candidate_text=candidate_text, jd_text=jd_text)

    hybrid = 0.60 * semantic + 0.40 * coverage
    return round(max(0.0, min(hybrid * 40.0, 40.0)), 2)

