from __future__ import annotations

import os
import tempfile
from typing import Optional

from fastapi import APIRouter, File, UploadFile

from app.schemas import (
    ParsedResume,
    ScoreParsedRequest,
    ScoreResponseV1,
    ContextStatsResponse,
)
from app.services.analytics import build_context_stats
from app.services.pipeline import score_from_parsed
from app.services.parser import parse_resume


router = APIRouter()


@router.post("/v1/parse-resume", response_model=ParsedResume)
async def parse_resume_v1(file: UploadFile = File(...)):
    """
    Offline-safe parsing: PDF/DOCX -> ParsedResume.
    No external network calls; uses local heuristics + local CSV lookups.
    """
    suffix = os.path.splitext(file.filename or "")[1].lower()
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        tmp.write(await file.read())
        tmp_path = tmp.name
    try:
        return parse_resume(tmp_path)
    finally:
        try:
            os.remove(tmp_path)
        except OSError:
            pass


@router.post("/v1/score-single", response_model=ScoreResponseV1)
def score_single_v1(payload: ScoreParsedRequest):
    """
    Score a single already-parsed resume against a job description.
    Returns baseline vs equitable score + Fairness Passport + AFS/CEOS.
    """
    result = score_from_parsed(payload.parsed, payload.job)
    return ScoreResponseV1(result=result)


@router.get("/v1/context-stats", response_model=ContextStatsResponse)
def context_stats_v1(sample_size: Optional[int] = None):
    """
    Lightweight dataset stats for the dashboard (offline mode).
    """
    return build_context_stats(sample_size=sample_size)