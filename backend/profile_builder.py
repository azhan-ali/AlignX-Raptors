import re

SKILLS = {
    "web":  ["html","css","javascript","js","react","node","django","flask","next.js","tailwind"],
    "ai":   ["python","ml","tensorflow","pytorch","sklearn","ai","nlp","pandas","numpy"],
    "data": ["sql","excel","tableau","powerbi","data analysis"],
    "cs":   ["java","c++","c","dsa","algorithms","git","linux","system design"],
}

def build_profile(text: str) -> dict:
    t = text.lower()
    skills = []
    for cat, keywords in SKILLS.items():
        for kw in keywords:
            if re.search(rf'\b{re.escape(kw)}\b', t):
                skills.append(kw)
    
    skills = list(set(skills))
    
    year = re.search(r"(1st|2nd|3rd|4th|fresher)", t)
    goal = re.search(r"(internship|job|project|freelance)", t)
    
    return {
        "skills": skills,
        "skill_score": min(len(skills)*10, 100),
        "year": year.group() if year else "unknown",
        "goal": goal.group() if goal else "internship",
        "raw": text
    }
