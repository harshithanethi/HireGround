from __future__ import annotations

from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class Candidate(BaseModel):
    id: Optional[str] = None
    name: str
    skills: List[str] = Field(default_factory=list)
    projects_count: int = 0
    internships_count: int = 0
    cgpa: float = 0.0
    certifications_count: int = 0
    achievements_count: int = 0

    college_tier: int = 3
    location_type: str = "urban"
    internet_access: str = "good"
    financial_constraints: bool = False
    first_generation_student: bool = False


class JobDescription(BaseModel):
    title: str
    required_skills: List[str] = Field(default_factory=list)
    preferred_skills: List[str] = Field(default_factory=list)


class ScoreRequest(BaseModel):
    candidate: Candidate
    job: JobDescription


class CandidateScoreResult(BaseModel):
    candidate_id: Optional[str] = None
    candidate_name: str
    baseline_score: float
    context_adjustment: float
    final_score: float
    explanation: List[str]
    baseline_rank: Optional[int] = None
    final_rank: Optional[int] = None
    rank_shift: Optional[int] = None


class ScoreResponse(BaseModel):
    result: CandidateScoreResult

class BatchScoreRequest(BaseModel):
    candidates: List[Candidate]
    job: JobDescription


class BatchScoreResponse(BaseModel):
    results: List[CandidateScoreResult]
    fairness_summary: dict


# ----------------------------
# v1 pipeline (parser -> score)
# ----------------------------


class ParsedResume(BaseModel):
    """
    Output of offline resume parsing. This is deliberately *not* a protected-attribute carrier.
    Any sensitive attributes used for bias audits live in separate, opt-in audit datasets.
    """

    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None

    skills: List[str] = Field(default_factory=list)
    college_name: Optional[str] = None
    college_tier: str = "Tier3"  # Tier1/Tier2/Tier3
    district: Optional[str] = None

    cgpa: float = 0.0
    projects_count: int = 0
    internships_count: int = 0
    certifications_count: int = 0

    rural_flag: bool = False
    first_gen_flag: bool = False

    raw_text_preview: Optional[str] = None


class ScoreParsedRequest(BaseModel):
    parsed: ParsedResume
    job: JobDescription


class FairnessPassport(BaseModel):
    adjustment_breakdown: List[str] = Field(default_factory=list)
    context_signals_used: List[str] = Field(default_factory=list)
    protected_attributes_used: bool = False
    ceos_score: float = 0.0
    afs_score: float = 0.0


class CandidateScoreV1(BaseModel):
    candidate_id: Optional[str] = None
    candidate_name: str
    baseline_score: float
    context_adjustment: float
    final_score: float
    adjustment_breakdown: List[str] = Field(default_factory=list)
    passport: FairnessPassport


class ScoreResponseV1(BaseModel):
    result: CandidateScoreV1


class ContextStatsResponse(BaseModel):
    districts_count: int
    opportunity_index_summary: Dict[str, float]
    college_tier_counts: Dict[str, int]
    sample_rows: List[Dict[str, Any]] = Field(default_factory=list)


class GoogleAuthRequest(BaseModel):
    id_token: str


class UserProfile(BaseModel):
    sub: str
    email: Optional[str] = None
    name: Optional[str] = None
    picture: Optional[str] = None


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserProfile