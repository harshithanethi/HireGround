
# HireGround

Context-aware, **offline-safe** resume screening that compares a uniform baseline model vs an equitable “opportunity credit” model, with **quantified fairness tracking (CEOS/AFS)** and a **bias-audit report proving no protected attributes are used**.

## 🧱 Exact Tech Stack (current repo)

### Backend
- **Python** (runtime)
- **FastAPI** (HTTP API)
- **Pydantic v2** (schemas / validation)
- **Uvicorn** (dev server)
- **PyMuPDF** (`fitz`) + **python-docx** (offline resume parsing)
- **pandas + numpy** (offline India context dataset loading + derived indices)
- **scikit-learn (TF-IDF + cosine similarity)** for local AI resume↔JD semantic matching

### Frontend
- **React (Vite)** (UI)
- **Tailwind CSS** (styling)
- **Fetch API** (HTTP calls; no extra client lib required)

### Data (offline, bundled)
- `backend/data/india-districts-census-2011.csv` (used to **derive** `india_context.csv` if missing/empty)
- `backend/data/india_context.csv` (district opportunity/infra indices; auto-generated at runtime if empty)
- `backend/data/college_tiers.csv` (college→tier mapping; auto-filled with a minimal set if empty)

## ✅ What’s implemented vs your hackathon checklist

- **Offline mode**: No external API calls. Parsing + scoring + context lookups are local.
- **AI scoring layer**: baseline match uses local NLP semantic similarity (TF-IDF + cosine) + explicit skill coverage.
- **Side-by-side ranking**: Batch endpoint returns baseline ranks vs final ranks + rank shifts.
- **Fairness Passport**: Single scoring returns adjustment breakdown + AFS/CEOS + “protected attributes used: false”.
- **Quantified fairness tracking**:
  - **AFS**: per-candidate \((\text{adjustment}/\text{baseline})\cdot 100\)
  - **CEOS**: per-candidate and batch CEOS (roadmap-style components)
  - **Group metrics**: tier-wise and rural/urban shortlist rates (uniform vs equitable)
- **Bias audit dashboard data**: Backend emits an explicit report stating protected attributes are not collected/used.

## 🏃 Run locally

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open the UI, set **API base** to `http://localhost:8000/api`, then:
- **Single**: upload a PDF/DOCX → “Parse + score” → see AFS/CEOS + breakdown
- **Batch**: upload multiple resumes → “Score batch” → see comparison table + group fairness + bias audit

## 🔐 Google Auth setup

### 1) Create Google OAuth Web Client
- In Google Cloud Console, create an OAuth 2.0 **Web application** client.
- Add frontend origin (for local dev): `http://localhost:5173`

### 2) Backend env
Set these before starting FastAPI:

```bash
export GOOGLE_CLIENT_ID="your-google-web-client-id.apps.googleusercontent.com"
export HIREGROUND_JWT_SECRET="replace-with-a-strong-secret"
export HIREGROUND_JWT_EXPIRES_SECONDS="86400"
```

### 3) Frontend env
Create `frontend/.env` (see `frontend/.env.example` for the exact keys):

```bash
VITE_API_URL=http://localhost:8000
VITE_GOOGLE_CLIENT_ID=your-google-web-client-id.apps.googleusercontent.com
```

Now sign in from the **Authentication** section in the UI.

## 🔌 API endpoints (implemented)

- `GET /api/health`
- `POST /api/v1/auth/google` (Google ID token -> API access token + user profile)
- `GET /api/v1/auth/me` (Bearer access token -> current user)
- `POST /api/v1/parse-resume` (PDF/DOCX → `ParsedResume`)
- `POST /api/v1/score-single` (`ParsedResume` + `JobDescription` → passport + AFS/CEOS)
- `POST /api/score-batch` (JSON candidates → baseline vs final ranks + fairness summary)
- `POST /api/v1/score-batch-files` (multipart: many files + job fields → batch results + dashboard summary)
- `GET /api/v1/context-stats` (dataset stats for dashboard)

## 📁 Repo structure

```
HireGround/
  backend/
    app/
      main.py
      routes/
        scoring.py
        batch.py
      services/
        parser.py
        datasets.py
        scorer.py            # existing baseline scorer (legacy Candidate)
        context.py           # existing adjustment logic (legacy Candidate)
        scorer_v1.py         # roadmap-weight baseline (ParsedResume)
        context_v1.py        # roadmap adjustment rules (ParsedResume)
        pipeline.py          # score pipeline (passport + AFS/CEOS)
        ceos.py, afs.py
        group_fairness.py
        bias_audit.py
        analytics.py
    data/
  frontend/
    src/App.jsx
```
