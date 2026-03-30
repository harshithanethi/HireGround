# HireGround Data Model Documentation

## 🗃️ Core Data Models 

### 1. **`ParsedResume`** - PDF Extraction Output
```python
from pydantic import BaseModel, Field
from typing import List, Literal
from datetime import datetime

class ParsedResume(BaseModel):
    candidate_id: str = Field(..., description="Unique ID")
    raw_text: str = Field(max_length=5000)
    
    # Academic
    college_name: str = Field(default="Unknown College")
    college_tier: Literal["Tier1", "Tier2", "Tier3"] = Field(default="Tier3")
    cgpa: float = Field(ge=0, le=10, default=7.0)
    
    # Location Context
    district: str = Field(default="Unknown District")
    is_rural: bool = Field(default=False)
    is_first_gen: bool = Field(default=False)
    
    # Experience
    skills: List[str] = Field(default_factory=list)
    projects_count: int = Field(ge=0, default=0)
    internships_count: int = Field(ge=0, default=0)
    certifications_count: int = Field(ge=0, default=0)
    
    parsed_at: datetime = Field(default_factory=datetime.now)
```

### 2. **`ScoringResult`** - Dual Scoring Output
```python
class ContextAdjustment(BaseModel):
    reason: str              # "Tier3 college"
    points: int              # 12

class ScoringResult(BaseModel):
    candidate_id: str
    baseline_score: float    # Uniform: 72.5
    adjustments: List[ContextAdjustment] = Field(default_factory=list)
    total_adjustment: int    # Max +30
    final_score: float       # Capped 100 max
    rank_shift: str = None   # "15→3"
    is_shortlisted: bool
```

### 3. **`BatchAnalytics`** - CEOS Fairness Metrics
```python
class BatchAnalytics(BaseModel):
    total_candidates: int
    ceos_score: float        # 87.2
    rural_share_uniform: float  # 12.0%
    rural_share_equitable: float # 28.0%
    top_talent_preservation: float  # 94.5%
    candidates: List[ScoringResult]
```

## 🌍 Context Lookup Tables

### **`data/india_context.csv`**
```csv
district,job_density_per_100k,rural_infra_index,hdi
District A,8200,0.85,0.92
District B,4500,0.72,0.78
District C,2100,0.45,0.62
```

## 🔌 API Examples

### **`/api/score-candidate` Response**
```json
{
  "candidate_id": "cand_123",
  "baseline_score": 72.5,
  "adjustments": [
    {"reason": "Tier3 college", "points": 12},
    {"reason": "Low-job district", "points": 10}
  ],
  "total_adjustment": 22,
  "final_score": 94.5,
  "rank_shift": "18→3"
}
```

### **`/api/score-batch` Summary**
```json
{
  "ceos_score": 87.2,
  "rural_share_uniform": 12.0,
  "rural_share_equitable": 28.0
}
```

## 🏗️ PostgreSQL Schema (Future)
```sql
CREATE TABLE parsed_resumes (
    candidate_id VARCHAR(50) PRIMARY KEY,
    college_tier VARCHAR(10),
    district VARCHAR(100),
    final_score DECIMAL(4,2),
    ceos_score DECIMAL(4,2)
);

CREATE TABLE district_context (
    district VARCHAR(100) PRIMARY KEY,
    job_density DECIMAL(8,2)
);
```

## 📊 Relationships
