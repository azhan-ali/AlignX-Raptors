import requests, json, time
from validator import extract_json, validate_scoring

OLLAMA_URL = 'http://localhost:11434/api/generate'
MODEL = 'qwen2.5:0.5b'

# ── Step 3 prompt: narrowly scoped so 0.5B succeeds ──────────────────────────
SCORE_PROMPT = '''You are AlignX. Score how well this student fits this opportunity.
Student skills: {skills}
Student goal: {goal}
Opportunity: {title} at {company} — requires: {description}

Return ONLY this JSON:
{{"score": <0-100>, "matched_skills": ["<skill>"], "missing_skills": ["<skill>"], "reason": "One sentence why.", "confidence": "<low/medium/high>"}}

JSON only:'''

SCORE_PROMPT_SIMPLE = '''Score fit 0-100. Student knows: {skills}. Job needs: {description}.
Return: {{"score": 65, "matched_skills": [], "missing_skills": [], "reason": "Brief reason.", "confidence": "low"}}
JSON:'''

def _call_llm(prompt: str, max_tokens: int = 200) -> dict | None:
    try:
        r = requests.post(OLLAMA_URL, json={
            "model": MODEL,
            "prompt": prompt,
            "stream": False,
            "options": {"temperature": 0.1, "num_predict": max_tokens}
        }, timeout=20)
        if r.status_code == 200:
            raw = r.json().get('response', '')
            data = extract_json(raw)
            if data:
                return validate_scoring(data)
    except Exception as e:
        print(f"[Scorer] LLM call failed: {e}")
    return None


def score(profile: dict, opp: dict) -> dict:
    """
    Step 3 of AlignX pipeline.
    Scores an opportunity against a profile using Qwen 0.5B.
    Implements: structured prompts + validation + 3-attempt retry with prompt simplification.
    """
    start = time.time()
    attempts = 0

    # Attempt 1: Full detailed prompt
    prompt = SCORE_PROMPT.format(
        skills=", ".join(profile.get('skills', [])[:8]),
        goal=profile.get('goal', 'internship'),
        title=opp.get('title', '')[:60],
        company=opp.get('company', '')[:40],
        description=opp.get('skills_required', '')[:200],
    )
    result = _call_llm(prompt)
    attempts += 1

    # Attempt 2: Simplified prompt
    if not result:
        time.sleep(0.3)
        simple_prompt = SCORE_PROMPT_SIMPLE.format(
            skills=", ".join(profile.get('skills', [])[:5]),
            description=opp.get('skills_required', '')[:100],
        )
        result = _call_llm(simple_prompt, max_tokens=120)
        attempts += 1

    # Attempt 3: Ultra-minimal prompt
    if not result:
        time.sleep(0.3)
        micro_prompt = f'JSON score for {profile.get("goal","internship")} match: {{"score": 50, "matched_skills": [], "missing_skills": [], "reason": "Partial match.", "confidence": "low"}}'
        result = _call_llm(micro_prompt, max_tokens=80)
        attempts += 1

    # Fallback: deterministic scoring (never fails)
    if not result:
        user_skills = set(profile.get('skills', []))
        opp_text = (opp.get('skills_required', '') + ' ' + opp.get('title', '')).lower()
        overlap = sum(1 for s in user_skills if s in opp_text)
        fallback_score = min(35 + overlap * 12, 90)

        return {
            "score": fallback_score,
            "matched_skills": [s for s in user_skills if s in opp_text][:4],
            "missing_skills": ["experience"],
            "reason": f"Calculated via fallback: {overlap} skill overlap found.",
            "confidence": "low",
            "llm_attempts": attempts,
            "scoring_method": "fallback",
            "scoring_latency_ms": round((time.time() - start) * 1000),
        }

    latency = round((time.time() - start) * 1000)
    return {
        **result.model_dump(),
        "llm_attempts": attempts,
        "scoring_method": "llm",
        "scoring_latency_ms": latency,
    }
