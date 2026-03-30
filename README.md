
# HireGround
## Key Features

- **Real-world India context**: District job density, college tier mapping, rural/urban infra gaps
- **Side-by-side comparison**: Uniform model vs Opportunity Credit model
- **Individual explainability**: Every candidate gets a Fairness Passport
- **Adaptive fairness**: CEOS tracks + auto-adjusts credits per context cell
- **Offline capable**: Edge-friendly, runs on low-spec devices
- **Bias-safe**: Environmental signals only, adversarial audits

## How It Works
Upload resume → Extract skills, experience, education and other metrics

Map to context → "Rural Tier-3, low job density district"

Baseline score → 78/100 (skills match)

Opportunity Credit → +7 (4x fewer local jobs, poor college infra)

Final score → 85/100 → Shortlist #1

## Results

| Metric | Uniform Model | FairBridge |
|--------|---------------|------------|
| Rural shortlist share | 12% | **28%** ↑133% |
| Top talent preserved | 95% | **94%** |
| CEOS (fairness score) | 0.62 | **0.87** ↑40% |
| Explainability | None | **Passport per candidate** |

## Tech Stack
Frontend: React + Tailwind CSS+ Chart.js 
Backend: FastAPI + Python
Database: PostgreSQL
Fairness: Custom Opportunity Credit engine
Context: India district/college opportunity indices
Deployment: Docker + Vercel/Netlify

## Data Sources

- **Resume features**: Synthetic + Kaggle hiring datasets
- **Context layer**: District job density, college placement rates, rural/urban infra gaps
- **Realism**: Mapped to actual Indian circumstances + census data


## Problem Statement Deliverables 

- **Working prototype**: Resume screening with context-aware decisions
- **Context integration**: District/college opportunity signals
- **Side-by-side comparison**: Uniform vs FairBridge outcomes
- **Explanation mechanism**: Individual Fairness Passports
- **Other Deliverables**:
  - Bias-safe personalization 
  - India-focused data 
  - Adaptive fairness scoring (CEOS) 
  - Offline capability 


## Project Structure
hireground/
├── src/
│ ├── core/ # Opportunity Credit engine
│ ├── context/ # India opportunity cells
│ └── models/ # Baseline scorer + CEOS
├── frontend/ # React + Tailwind dashboard
├── api/ # FastAPI backend
└── demo/ # Streamlit demo
