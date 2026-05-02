import requests, json, time
from validator import extract_json

OLLAMA_URL = 'http://localhost:11434/api/generate'
MODEL = 'qwen2.5:0.5b'

QUERY_PROMPT = '''Generate 2 job search queries for this student. Be specific.
Student: knows {skills}, wants {goal} in {domain}, level: {level}

Return ONLY this JSON:
{{"queries": ["python django backend internship india", "machine learning engineer fresher remote"]}}
JSON:'''

def generate_queries(profile: dict) -> list[str]:
    """
    Step 2 of AlignX pipeline.
    Qwen 0.5B generates optimized RAG search queries from the user profile.
    Falls back to skill-based query on failure.
    """
    start = time.time()
    skills_str = ", ".join(profile.get('skills', [])[:6])
    prompt = QUERY_PROMPT.format(
        skills=skills_str,
        goal=profile.get('goal', 'internship'),
        domain=profile.get('domain', 'general'),
        level=profile.get('level', 'beginner'),
    )
    try:
        r = requests.post(OLLAMA_URL, json={
            "model": MODEL,
            "prompt": prompt,
            "stream": False,
            "options": {"temperature": 0.2, "num_predict": 100}
        }, timeout=12)

        if r.status_code == 200:
            raw = r.json().get('response', '')
            data = extract_json(raw)
            if data and isinstance(data.get('queries'), list):
                qs = [q for q in data['queries'] if isinstance(q, str) and len(q) > 3]
                if qs:
                    latency = round((time.time() - start) * 1000)
                    return qs[:3], "llm", latency
    except Exception as e:
        print(f"[QueryGen] LLM failed: {e}")

    # Fallback: build query from skills + goal
    fallback_query = f"{skills_str} {profile.get('goal', 'internship')} {profile.get('domain', '')}"
    return [fallback_query.strip()], "fallback", 0
