from pydantic import BaseModel, field_validator
from typing import List, Optional
import json, re


class ProfileSchema(BaseModel):
    skills: List[str]
    year: str
    goal: str
    domain: str
    level: str
    location: str

    @field_validator('skills')
    @classmethod
    def skills_non_empty(cls, v):
        return [s.lower().strip() for s in v if s.strip()][:15]

    @field_validator('goal')
    @classmethod
    def valid_goal(cls, v):
        valid = ['internship', 'job', 'freelance', 'research', 'open source']
        v = v.lower()
        return v if any(g in v for g in valid) else 'internship'

    @field_validator('level')
    @classmethod
    def valid_level(cls, v):
        return v if v in ['beginner', 'intermediate', 'advanced'] else 'beginner'


class ScoringSchema(BaseModel):
    score: int
    matched_skills: List[str]
    missing_skills: List[str]
    reason: str
    confidence: str

    @field_validator('score')
    @classmethod
    def clamp_score(cls, v):
        return max(0, min(100, int(v)))

    @field_validator('confidence')
    @classmethod
    def valid_confidence(cls, v):
        return v if v in ['high', 'medium', 'low'] else 'low'

    @field_validator('matched_skills', 'missing_skills')
    @classmethod
    def list_of_strings(cls, v):
        return [str(s).lower().strip() for s in v if s][:8]


class NarrativeSchema(BaseModel):
    summary: str
    gap_insight: str
    action_plan: List[str]
    encouragement: str

    @field_validator('action_plan')
    @classmethod
    def limit_actions(cls, v):
        return v[:3]


def extract_json(text: str) -> Optional[dict]:
    """Robustly extract JSON from LLM output."""
    # Try direct parse
    text = text.strip()
    try:
        return json.loads(text)
    except Exception:
        pass

    # Try regex extract
    match = re.search(r'\{.*\}', text, re.DOTALL)
    if match:
        try:
            return json.loads(match.group(0))
        except Exception:
            pass

    # Try to fix common LLM mistakes: trailing commas, single quotes
    try:
        fixed = re.sub(r',\s*([}\]])', r'\1', text)
        fixed = fixed.replace("'", '"')
        match2 = re.search(r'\{.*\}', fixed, re.DOTALL)
        if match2:
            return json.loads(match2.group(0))
    except Exception:
        pass

    return None


def validate_profile(data: dict) -> Optional[ProfileSchema]:
    try:
        return ProfileSchema(**data)
    except Exception:
        return None


def validate_scoring(data: dict) -> Optional[ScoringSchema]:
    try:
        return ScoringSchema(**data)
    except Exception:
        return None


def validate_narrative(data: dict) -> Optional[NarrativeSchema]:
    try:
        return NarrativeSchema(**data)
    except Exception:
        return None
