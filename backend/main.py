from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

from profile_builder import build_profile
from rag_engine import retrieve_top
from llm_scorer import score
from help_matcher import find_helpers

app = FastAPI(title="AlignX Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class MatchRequest(BaseModel):
    text: str

@app.post('/api/match')
def match(data: MatchRequest):
    print(f"Received request: {data.text}")
    
    profile = build_profile(data.text)
    candidates = retrieve_top(profile, k=5)
    
    scored_results = []
    for c in candidates:
        result = score(profile, c)
        c_copy = c.copy()
        if isinstance(result, dict):
            c_copy.update(result)
        scored_results.append(c_copy)
        
    scored_results = sorted(scored_results, key=lambda x: x.get('score', 0), reverse=True)
    helpers = find_helpers(profile)
    
    return {
        'profile': profile,
        'results': scored_results,
        'helpers': helpers
    }

if __name__ == '__main__':
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
