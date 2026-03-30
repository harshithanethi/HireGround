from fastapi import UploadFile, File
from services.parser import parse_resume

@app.post("/api/parse-resume")
async def parse_endpoint(file: UploadFile = File(...)):
    """NEW: Parse → returns structured data for your scorer"""
    contents = await file.read()
    with open(f"/tmp/{file.filename}", "wb") as f:
        f.write(contents)
    parsed = parse_resume(f"/tmp/{file.filename}")
    return parsed

@app.post("/api/score-candidate")
async def score_candidate(request: CandidateRequest, file: UploadFile = File(None)):
    if file:  # Auto-parse
        parsed = parse_resume(file_path)
        baseline = baseline_score(parsed)  # YOUR existing scorer
        adjustment, explain = get_opportunity_credit(parsed)  # YOUR context
    else:  # Manual input fallback
        baseline = baseline_score(request.parsed_data)
    
    return {
        "baseline": baseline,
        "adjustment": adjustment,
        "final": min(100, baseline + adjustment),
        "passport": generate_passport(parsed, explain)
    }