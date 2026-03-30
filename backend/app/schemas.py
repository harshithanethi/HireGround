from typing import List, Optional
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