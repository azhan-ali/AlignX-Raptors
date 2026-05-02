from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import json
import numpy as np

def load_opportunities():
    try:
        with open('data/opportunities.json', 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return []

def retrieve_top(profile: dict, k=15) -> list:
    opps = load_opportunities()
    if not opps:
        return []
        
    texts = [f"{o['title']} {o.get('skills_required','')} {o.get('company','')}" for o in opps]
    vec = TfidfVectorizer(stop_words='english')
    mat = vec.fit_transform(texts)
    
    q = " ".join(profile["skills"]) + " " + profile["goal"]
    qv = vec.transform([q])
    
    scores = cosine_similarity(qv, mat).flatten()
    idx = np.argsort(scores)[::-1][:k]
    
    return [opps[i] for i in idx]
