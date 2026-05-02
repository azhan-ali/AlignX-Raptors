from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import json, numpy as np


def load_opportunities():
    try:
        with open('data/opportunities.json', 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return []


def retrieve_top(profile: dict, queries: list[str] = None, k: int = 10) -> list:
    """
    Step 3 of AlignX pipeline.
    Uses LLM-generated queries (from Step 2) + raw skill query for retrieval.
    Falls back to skill-only query if no LLM queries provided.
    """
    opps = load_opportunities()
    if not opps:
        return []

    # Build corpus
    texts = [
        f"{o.get('title','')} {o.get('skills_required','')} {o.get('company','')} {o.get('type','')}"
        for o in opps
    ]

    vec = TfidfVectorizer(stop_words='english', ngram_range=(1, 2))
    mat = vec.fit_transform(texts)

    # Build combined query: LLM-generated + raw skills
    all_queries = []
    if queries:
        all_queries.extend(queries)
    raw_query = " ".join(profile.get("skills", [])) + " " + profile.get("goal", "") + " " + profile.get("domain", "")
    all_queries.append(raw_query)

    # Score each query and take max per document (union retrieval)
    combined_scores = np.zeros(len(opps))
    for q in all_queries:
        if not q.strip():
            continue
        try:
            qv = vec.transform([q])
            s = cosine_similarity(qv, mat).flatten()
            combined_scores = np.maximum(combined_scores, s)
        except Exception:
            pass

    idx = np.argsort(combined_scores)[::-1][:k]
    return [opps[i] for i in idx if combined_scores[i] > 0]
