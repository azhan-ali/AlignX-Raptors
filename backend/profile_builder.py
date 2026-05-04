import requests, json, re, time
from validator import extract_json, validate_profile

OLLAMA_URL = 'http://localhost:11434/api/generate'
MODEL = 'qwen2.5:0.5b'

# ── Step 1 prompt: highly constrained so 0.5B can handle it ──────────────────
PROFILE_PROMPT = '''Extract career info from this student description. Return ONLY valid JSON.

Student text: "{text}"

Use this JSON structure but fill in the real extracted data:
{{"skills": ["<skill1>", "<skill2>"], "year": "<year>", "goal": "<goal>", "domain": "<domain>", "level": "<level>", "location": "<location>"}}

Rules:
- skills: extract tech skills (languages, frameworks) from text
- year: 1st year / 2nd year / 3rd year / 4th year / fresher / working professional
- goal: internship / job / freelance / research
- domain: web / ai / data / mobile / devops / cybersecurity
- level: beginner / intermediate / advanced
- location: remote / hybrid / on-site

JSON only, no explanation:'''

# ── Regex fallback skills dictionary ──────────────────────────────────────────
SKILL_MAP = {
    "web":    ["html","css","javascript","js","react","node","django","flask","next.js","tailwind","express","vue","angular","typescript"],
    "ai":     ["python","ml","tensorflow","pytorch","sklearn","ai","nlp","pandas","numpy","keras","huggingface","langchain"],
    "data":   ["sql","excel","tableau","powerbi","data analysis","mongodb","postgresql","mysql"],
    "cs":     ["java","c++","c","dsa","algorithms","git","linux","system design","docker","kubernetes","aws","gcp","azure"],
    "mobile": ["kotlin","swift","flutter","react native","android","ios"],
}

def _llm_build(text: str, attempt: int = 0) -> dict | None:
    """Try to extract profile using Qwen 0.5B. Returns None on failure."""
    # Simplify prompt on retry
    prompt = PROFILE_PROMPT.format(text=text[:400] if attempt == 0 else text[:200])
    if attempt > 0:
        prompt = f'Return JSON with skills list from: "{text[:150]}"\nJSON: {{"skills": [], "year": "unknown", "goal": "internship", "domain": "general", "level": "beginner", "location": "any"}}'

    try:
        r = requests.post(OLLAMA_URL, json={
            "model": MODEL,
            "prompt": prompt,
            "stream": False,
            "options": {"temperature": 0.05, "num_predict": 250, "stop": ["\n\n"]}
        }, timeout=20)

        if r.status_code != 200:
            return None

        raw = r.json().get('response', '')
        data = extract_json(raw)
        if not data:
            return None

        validated = validate_profile(data)
        if validated and len(validated.skills) > 0:
            return validated.model_dump()

    except Exception as e:
        print(f"[ProfileBuilder] LLM attempt {attempt} failed: {e}")

    return None


def _regex_build(text: str) -> dict:
    """Fallback: regex-based skill extraction when LLM is unavailable."""
    t = text.lower()
    skills = []
    for keywords in SKILL_MAP.values():
        for kw in keywords:
            if re.search(rf'\b{re.escape(kw)}\b', t):
                skills.append(kw)
    skills = list(set(skills))

    year_match = re.search(r"(1st|2nd|3rd|4th|fresher|working professional)", t)
    goal_match = re.search(r"(internship|job|project|freelance|research)", t)

    return {
        "skills": skills,
        "year": year_match.group() if year_match else "unknown",
        "goal": goal_match.group() if goal_match else "internship",
        "domain": "general",
        "level": "beginner" if len(skills) <= 3 else "intermediate" if len(skills) <= 7 else "advanced",
        "location": "any",
    }


def build_profile(text: str) -> dict:
    """
    Step 1 of AlignX pipeline.
    Attempts LLM-based extraction (Qwen 0.5B) with up to 2 retries,
    then falls back to regex if unavailable.
    Returns a profile dict with extraction_method metadata.
    """
    start = time.time()

    # Try LLM (max 2 attempts)
    for attempt in range(2):
        result = _llm_build(text, attempt)
        if result:
            latency = round((time.time() - start) * 1000)
            return {
                **result,
                "skill_score": min(len(result["skills"]) * 10, 100),
                "raw": text,
                "extraction_method": "llm",
                "llm_latency_ms": latency,
            }
        if attempt == 0:
            time.sleep(0.5)

    # Fallback
    fallback = _regex_build(text)
    return {
        **fallback,
        "skill_score": min(len(fallback["skills"]) * 10, 100),
        "raw": text,
        "extraction_method": "regex_fallback",
        "llm_latency_ms": 0,
    }
