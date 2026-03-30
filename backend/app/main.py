from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.auth import router as auth_router
from app.routes.batch import router as batch_router
from app.routes.scoring import router as scoring_router



app = FastAPI(title="HireGround API", version="0.2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(scoring_router, prefix="/api", tags=["scoring"])
app.include_router(batch_router, prefix="/api", tags=["batch"])
app.include_router(auth_router, prefix="/api", tags=["auth"])

@app.get("/api/health")
def health_check():
    return {"status": "ok", "service": "HireGround API"}