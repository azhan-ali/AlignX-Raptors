from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, field_validator
import uvicorn, time, re, html
from collections import defaultdict

from profile_builder import build_profile
from query_generator import generate_queries
from rag_engine import retrieve_top, retrieve_top_from_list
from llm_scorer import score
from help_matcher import find_helpers
from advisor import generate_narrative
from fetch_data import fetch_all_for_profile

app = FastAPI(
    title="AlignX Backend",
    description="5-step LLM pipeline on Qwen 2.5 0.5B — Garage Inference 2026",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],          # Restrict to frontend only
    allow_methods=["POST", "GET", "OPTIONS"],
    allow_headers=["Content-Type"],
    allow_credentials=False,
)

# ── Rate limiting ─────────────────────────────────────────────────────────────
_rate_store: dict[str, list] = defaultdict(list)

def check_rate_limit(ip: str, max_req: int = 8, window: int = 60) -> bool:
    now = time.time()
    times = _rate_store[ip]
    times[:] = [t for t in times if now - t < window]
    if len(times) >= max_req:
        return False
    times.append(now)
    return True

# ── Input sanitization ────────────────────────────────────────────────────────
INJECTION_PATTERNS = re.compile(
    r'(ignore previous|forget all|system:|<\|im_start\|>|<\|im_end\|>|assistant:|'
    r'you are now|act as|pretend you|disregard|override)',
    re.IGNORECASE
)

def sanitize_input(text: str, max_len: int = 800) -> str:
    text = re.sub(r'<[^>]+>', '', text)                   # Strip HTML tags
    text = html.unescape(text)                            # Decode HTML entities
    text = INJECTION_PATTERNS.sub('[removed]', text)      # Block prompt injection
    text = re.sub(r'\s+', ' ', text).strip()              # Normalize whitespace
    return text[:max_len]

# ── Request model with validation ────────────────────────────────────────────
class MatchRequest(BaseModel):
    text: str

    @field_validator('text')
    @classmethod
    def text_non_empty(cls, v):
        if not v or len(v.strip()) < 5:
            raise ValueError("Please describe yourself in at least a few words.")
        return v

# ── Health check ─────────────────────────────────────────────────────────────
@app.get("/health")
def health():
    return {"status": "ok", "model": "qwen2.5:0.5b", "tier": "Tier 1 — Absolute Garage MAX"}

# ── Main pipeline endpoint ────────────────────────────────────────────────────
@app.post('/api/match')
async def match(request: Request, data: MatchRequest):
    # Rate limiting
    client_ip = request.client.host if request.client else "unknown"
    if not check_rate_limit(client_ip):
        return JSONResponse(
            status_code=429,
            content={"error": "Too many requests. Please wait a moment before trying again."}
        )

    # Sanitize input
    clean_text = sanitize_input(data.text)
    if not clean_text:
        return JSONResponse(status_code=400, content={"error": "Input is empty after sanitization."})

    pipeline_steps = []
    pipeline_start = time.time()

    # ─── STEP 1: LLM Profile Extraction ─────────────────────────────────────
    t = time.time()
    profile = build_profile(clean_text)
    pipeline_steps.append({
        "step": 1,
        "name": "Profile Extraction",
        "method": f"Qwen 2.5 0.5B ({profile.get('extraction_method', 'unknown')})",
        "latency_ms": round((time.time() - t) * 1000),
        "success": len(profile.get('skills', [])) > 0,
        "output_preview": f"Detected {len(profile.get('skills', []))} skills"
    })

    # ─── STEP 2: LLM Query Generation ───────────────────────────────────────
    t = time.time()
    queries, q_method, q_latency = generate_queries(profile)
    pipeline_steps.append({
        "step": 2,
        "name": "Smart Query Generation",
        "method": f"Qwen 2.5 0.5B ({q_method})",
        "latency_ms": q_latency or round((time.time() - t) * 1000),
        "success": True,
        "output_preview": f"Generated {len(queries)} search queries"
    })

    # ─── STEP 3: Live Fetch + RAG Retrieval ─────────────────────────────────
    t = time.time()
    # Fetch live, profile-specific opportunities from Adzuna + Internshala
    live_opps = fetch_all_for_profile(profile)
    # If live fetch fails or returns nothing, fall back to static file
    if not live_opps:
        candidates = retrieve_top(profile, queries=queries, k=8)
        fetch_source = "static-fallback"
    else:
        candidates = retrieve_top_from_list(profile, live_opps, queries=queries, k=8)
        fetch_source = "live"
    pipeline_steps.append({
        "step": 3,
        "name": "RAG Retrieval",
        "method": f"TF-IDF + Cosine Similarity (bigrams) [{fetch_source}: {len(live_opps)} fetched]",
        "latency_ms": round((time.time() - t) * 1000),
        "success": len(candidates) > 0,
        "output_preview": f"Retrieved {len(candidates)} candidates from {len(live_opps)} live opportunities"
    })

    # ─── STEP 4: LLM Scoring ────────────────────────────────────────────────
    t = time.time()
    scored_results = []
    total_llm_attempts = 0
    for c in candidates[:5]:
        result = score(profile, c)
        c_copy = c.copy()
        c_copy.update(result)
        scored_results.append(c_copy)
        total_llm_attempts += result.get('llm_attempts', 1)

    scored_results.sort(key=lambda x: x.get('score', 0), reverse=True)
    pipeline_steps.append({
        "step": 4,
        "name": f"Opportunity Scoring (×{len(candidates[:5])})",
        "method": f"Qwen 2.5 0.5B × {len(candidates[:5])} calls (avg {total_llm_attempts} attempts total)",
        "latency_ms": round((time.time() - t) * 1000),
        "success": True,
        "output_preview": f"Top score: {scored_results[0].get('score', 0)}/100 if scored_results else 'N/A'"
    })

    # ─── STEP 5: Career Narrative ────────────────────────────────────────────
    t = time.time()
    narrative = generate_narrative(profile, scored_results)
    pipeline_steps.append({
        "step": 5,
        "name": "Career Mirror (Narrative)",
        "method": f"Qwen 2.5 0.5B ({narrative.get('method', 'unknown')})",
        "latency_ms": narrative.get('latency_ms', round((time.time() - t) * 1000)),
        "success": True,
        "output_preview": "Personalized career narrative generated"
    })

    # ─── STEP 6: Peer Matching ───────────────────────────────────────────────
    t = time.time()
    helpers = find_helpers(profile)
    pipeline_steps.append({
        "step": 6,
        "name": "Peer Help Matching",
        "method": "TF-IDF Similarity",
        "latency_ms": round((time.time() - t) * 1000),
        "success": True,
        "output_preview": f"Found {len(helpers)} peer matches"
    })

    total_latency = round((time.time() - pipeline_start) * 1000)
    llm_calls_count = 1 + 1 + len(candidates[:5]) + 1  # profile + query + scoring + narrative

    return {
        "profile": profile,
        "results": scored_results,
        "helpers": helpers,
        "narrative": narrative,
        "pipeline": {
            "steps": pipeline_steps,
            "total_latency_ms": total_latency,
            "llm_calls": llm_calls_count,
            "model": "qwen2.5:0.5b",
            "tier": "Tier 1 — Absolute Garage MAX (≤4B params)",
            "cost_usd": 0.00,
            "inference_location": "local (Ollama)"
        }
    }

if __name__ == '__main__':
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
