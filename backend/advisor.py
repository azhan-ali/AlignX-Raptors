import requests, json, time
from validator import extract_json, validate_narrative

OLLAMA_URL = 'http://localhost:11434/api/generate'
MODEL = 'qwen2.5:0.5b'

NARRATIVE_PROMPT = '''You are AlignX, a career coach. Write a personalized career mirror for this student.

Student: {year} student, knows {skills}, wants {goal} in {domain}
Best job match: "{top_title}" at {top_company} (fit score: {top_score}/100)
Key skills to learn: {missing}

Return ONLY this JSON:
{{"summary": "One sentence honest assessment of where this student stands right now.", "gap_insight": "One sentence about the ONE skill that would unlock the most opportunities for them.", "action_plan": ["Specific action 1 (e.g. Build a portfolio project using React)", "Specific action 2 (e.g. Complete a free SQL course on Kaggle)", "Specific action 3 (e.g. Apply to 5 companies with your current skill set)"], "encouragement": "One short motivational sentence."}}

JSON only:'''

NARRATIVE_SIMPLE = '''Career advice JSON for {goal} seeker who knows {skills}:
{{"summary": "Student has solid foundational skills.", "gap_insight": "Focus on building projects to demonstrate skills.", "action_plan": ["Build a portfolio project", "Contribute to open source", "Apply to entry-level roles"], "encouragement": "Every expert was once a beginner."}}
JSON:'''


def generate_narrative(profile: dict, top_results: list) -> dict:
    """
    Step 5 of AlignX pipeline — the 'Career Mirror'.
    Qwen 0.5B writes a personalized career narrative with:
    - Honest current-state summary
    - Key gap insight (the ONE thing holding them back)
    - 3-step concrete action plan
    - Motivational encouragement

    This is the 'wow' feature — a 0.5B model writing human-quality career advice.
    """
    start = time.time()

    top = top_results[0] if top_results else {}
    missing_skills = top.get('missing_skills', ['experience'])[:3]

    prompt = NARRATIVE_PROMPT.format(
        year=profile.get('year', 'student'),
        skills=", ".join(profile.get('skills', [])[:6]),
        goal=profile.get('goal', 'internship'),
        domain=profile.get('domain', 'tech'),
        top_title=top.get('title', 'Software Developer')[:50],
        top_company=top.get('company', 'a tech company')[:30],
        top_score=top.get('score', 50),
        missing=", ".join(missing_skills) if missing_skills else "project experience",
    )

    # Attempt 1: Full prompt
    result = _try_llm(prompt, 300)

    # Attempt 2: Simplified prompt
    if not result:
        time.sleep(0.3)
        simple = NARRATIVE_SIMPLE.format(
            goal=profile.get('goal', 'internship'),
            skills=", ".join(profile.get('skills', [])[:4]),
        )
        result = _try_llm(simple, 200)

    latency = round((time.time() - start) * 1000)

    if result:
        return {**result.model_dump(), "latency_ms": latency, "method": "llm"}

    # Hard fallback — never fails
    return {
        "summary": f"You're a {profile.get('level', 'beginner')}-level {profile.get('domain', 'tech')} student with {len(profile.get('skills', []))} skills — a solid foundation to build on.",
        "gap_insight": f"Your biggest unlock is {missing_skills[0] if missing_skills else 'real-world project experience'} — learn it and your match rate improves significantly.",
        "action_plan": [
            "Build one complete project showcasing your top skills",
            f"Learn {missing_skills[0] if missing_skills else 'a trending tool in your domain'} via free resources",
            "Apply to 10 opportunities this week — start before you feel ready",
        ],
        "encouragement": "You're closer than you think — every expert started exactly where you are.",
        "latency_ms": latency,
        "method": "fallback",
    }


def _try_llm(prompt: str, max_tokens: int) -> object | None:
    try:
        r = requests.post(OLLAMA_URL, json={
            "model": MODEL,
            "prompt": prompt,
            "stream": False,
            "options": {"temperature": 0.3, "num_predict": max_tokens}
        }, timeout=25)
        if r.status_code == 200:
            raw = r.json().get('response', '')
            data = extract_json(raw)
            if data:
                return validate_narrative(data)
    except Exception as e:
        print(f"[Advisor] LLM call failed: {e}")
    return None
