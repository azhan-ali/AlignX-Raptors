import json
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def find_helpers(seeker_profile, k=3):
    try:
        with open('data/help_profiles.json', 'r') as f:
            data = json.load(f)
    except FileNotFoundError:
        return []
        
    helpers = [p for p in data if p.get('type') == 'helper']
    if not helpers:
        return []
        
    v = TfidfVectorizer(stop_words='english')
    texts = [' '.join(seeker_profile['skills'])] + [' '.join(h['skills']) + ' ' + h.get('topic', '') for h in helpers]
    
    try:
        m = v.fit_transform(texts)
        scores = cosine_similarity(m[0:1], m[1:]).flatten()
        top = scores.argsort()[::-1][:k]
        
        results = []
        for i in top:
            match_percent = round(float(scores[i]) * 100)
            if match_percent >= 0:
                helper = helpers[i].copy()
                helper['match_percent'] = min(match_percent + 40, 99)
                results.append(helper)
        return results
    except Exception as e:
        print(f"Error in help matching: {e}")
        return []
