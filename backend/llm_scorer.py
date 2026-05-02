import requests
import json
import re

PROMPT = '''You are AlignX, a strict career matching AI. Return ONLY valid JSON and nothing else.
User Profile: {profile}
Opportunity: {opp}

Analyze how well the user fits this opportunity.
Return exactly this JSON structure:
{{"score": 85, "matched_skills": ["python"], "missing_skills": ["react"], "reason": "Fits because...", "confidence": "high"}}'''

def score(profile, opp):
    try:
        r = requests.post('http://localhost:11434/api/generate', json={
            "model": "qwen2.5:0.5b",
            "prompt": PROMPT.format(profile=json.dumps(profile), opp=json.dumps(opp)),
            "stream": False
        })
        
        if r.status_code == 200:
            txt = r.json().get('response', '')
            match = re.search(r'\{.*\}', txt, re.DOTALL)
            if match:
                return json.loads(match.group(0))
    except Exception as e:
        print(f"LLM Error: {e}")
        
    overlap = len(set(profile['skills']).intersection(set(opp.get('skills_required','').lower().split())))
    return {
        "score": min(40 + overlap * 10, 95),
        "matched_skills": profile['skills'][:2],
        "missing_skills": ["experience"],
        "reason": "Calculated via fallback logic because LLM was unavailable.",
        "confidence": "low"
    }
