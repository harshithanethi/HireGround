from __future__ import annotations

import os
import re
from pathlib import Path
from typing import List, Optional

from app.schemas import ParsedResume
from app.services.datasets import infer_college_tier, load_india_context_df


_SKILL_VOCAB = [
    "python",
    "java",
    "javascript",
    "typescript",
    "react",
    "node",
    "fastapi",
    "django",
    "flask",
    "docker",
    "kubernetes",
    "aws",
    "gcp",
    "azure",
    "sql",
    "postgres",
    "mongodb",
    "ml",
    "machine learning",
    "data science",
    "nlp",
    "pytorch",
    "tensorflow",
]


def _extract_text_from_pdf(path: str) -> str:
    # Lazy import so the backend can still start even if system libs for PyMuPDF
    # are missing (e.g., `libstdc++.so.6`).
    try:
        import fitz  # type: ignore
    except ImportError as exc:
        raise RuntimeError(
            "PyMuPDF (fitz) is not available in this environment. "
            "PDF parsing requires libstdc++.so.6. "
            "Install system dependency `libstdc++6` (Debian/Ubuntu) "
            "or enable gcc/libstdcxx in your nix-shell."
        ) from exc

    doc = fitz.open(path)
    try:
        return "".join(page.get_text() for page in doc)
    finally:
        doc.close()


def _extract_text_from_docx(path: str) -> str:
    from docx import Document  # lazy import

    d = Document(path)
    parts: List[str] = []
    for p in d.paragraphs:
        if p.text:
            parts.append(p.text)
    return "\n".join(parts)


def _extract_text(path: str) -> str:
    suffix = Path(path).suffix.lower()
    if suffix == ".pdf":
        return _extract_text_from_pdf(path)
    if suffix == ".docx":
        return _extract_text_from_docx(path)
    raise ValueError("Unsupported file type. Upload PDF or DOCX.")


def extract_email(text: str) -> Optional[str]:
    m = re.search(r"\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b", text, flags=re.I)
    return m.group(0) if m else None


def extract_phone(text: str) -> Optional[str]:
    m = re.search(r"\b(?:\+91[\s-]?)?[6-9]\d{9}\b", text)
    return m.group(0) if m else None


def extract_name(text: str) -> Optional[str]:
    # Heuristic: first non-empty line that looks like a name
    for line in (l.strip() for l in text.splitlines()[:10]):
        if not line:
            continue
        if len(line.split()) in (2, 3) and line.replace(" ", "").isalpha():
            return line.title()
    return None


def extract_college(text: str) -> Optional[str]:
    patterns = [
        r"(?i)\b(?:college|university|institute)\b[^\n]{0,80}",
        r"(?i)\b(IIT\s+[A-Z][A-Za-z]+|NIT\s+[A-Z][A-Za-z]+|IIIT\s+[A-Z][A-Za-z]+|IISc|BITS\s+Pilani|VIT|SRM|Manipal)\b[^\n]{0,60}",
    ]
    for p in patterns:
        m = re.search(p, text)
        if m:
            return m.group(0).strip()
    return None


def extract_cgpa(text: str) -> float:
    m = re.search(
        r"(?i)\b(?:cgpa|gpa)\s*[:\-]?\s*(\d+(?:\.\d+)?)\b|\bpercentage\s*[:\-]?\s*(\d+(?:\.\d+)?)\s*%\b",
        text,
    )
    if not m:
        return 7.5
    val = float(m.group(1) or m.group(2))
    if val > 10:
        # percentage
        return round(min(val / 10.0, 10.0), 2)
    return round(min(val, 10.0), 2)


def count_projects(text: str) -> int:
    return min(len(re.findall(r"(?i)\bproject\b|capstone|final year project", text)), 10)


def count_internships(text: str) -> int:
    return min(len(re.findall(r"(?i)\binternship\b|\binterned\b|summer training", text)), 10)


def count_certs(text: str) -> int:
    return min(len(re.findall(r"(?i)\bcertification\b|\bcoursera\b|\budemy\b|\baws\b|\bazure\b|\bgcp\b", text)), 10)


def detect_first_gen(text: str) -> bool:
    t = text.lower()
    return ("first generation" in t) or ("first-gen" in t) or ("first in family" in t)


def infer_rural(text: str) -> bool:
    t = text.lower()
    return any(w in t for w in ["rural", "village", "taluk", "block", "panchayat"])


def extract_skills(text: str) -> List[str]:
    t = text.lower()
    found: List[str] = []
    for s in _SKILL_VOCAB:
        if s in t:
            found.append(s)
    # normalize presentation
    return sorted({x.title() if x != "ml" else "ML" for x in found})


def infer_district(text: str) -> Optional[str]:
    # Offline-only: match against local district list
    df = load_india_context_df()
    districts = df["district"].dropna().astype(str).tolist()
    # try exact word match for the first ~2000 chars for speed
    hay = text[:2000]
    for d in districts:
        if re.search(rf"(?i)\b{re.escape(d)}\b", hay):
            return d
    return None


def parse_resume(file_path: str) -> ParsedResume:
    """
    Offline resume parsing. Uses only local processing and local CSVs.
    """
    if not os.path.exists(file_path):
        raise FileNotFoundError(file_path)

    text = _extract_text(file_path)
    college_name = extract_college(text)
    district = infer_district(text)
    college_tier = infer_college_tier(college_name)

    return ParsedResume(
        name=extract_name(text),
        email=extract_email(text),
        phone=extract_phone(text),
        skills=extract_skills(text),
        college_name=college_name,
        college_tier=college_tier,
        district=district,
        cgpa=extract_cgpa(text),
        projects_count=count_projects(text),
        internships_count=count_internships(text),
        certifications_count=count_certs(text),
        rural_flag=infer_rural(text),
        first_gen_flag=detect_first_gen(text),
        raw_text_preview=text[:1200],
    )