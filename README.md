# ✏️ AlignX — Smart Career Matching + Peer Help Community

> **Garage Inference 2026 Submission** · [May 1–4, 2026]  
> **Model:** `qwen2.5:0.5b` via Ollama · **Tier:** Tier 1 — Absolute Garage MAX (≤4B params)  
> **Problem:** 15 million+ Indian graduates can't find the right opportunity — and can't get the right peer help.  
> **Solution:** A 6-step LLM pipeline on a 500M parameter model that matches, scores, and coaches you.

---

## 🤖 Exact Model Declaration

| Field | Value |
|-------|-------|
| **Model** | `qwen2.5:0.5b` (Qwen 2.5, 500M parameters) |
| **Quantization** | Default Ollama Q4_K_M |
| **Inference** | Local CPU via Ollama |
| **Tier** | **Tier 1 — Absolute Garage MAX** (≤4B params) |
| **Cost per query** | **₹0.00** |
| **Avg latency** | 8–18 seconds (6 pipeline steps) |

---

## 🏗️ Architecture — The 6-Step Pipeline

```
User Input (text or voice)
        │
        ▼
[SANITIZE] — Strip HTML, block prompt injection, limit to 800 chars
        │
        ▼
Step 1: 🧠 Profile Extraction     [Qwen 2.5 0.5B]   ~1-2s
        Extract: skills, year, goal, domain, level, location from raw text
        → Validated with Pydantic schema
        → Falls back to regex if LLM unavailable
        │
        ▼
Step 2: 🔍 Smart Query Generation  [Qwen 2.5 0.5B]   ~0.5-1s
        Generate 2-3 optimized search queries for better RAG retrieval
        → Union retrieval (max score across all queries)
        │
        ▼
Step 3: 📡 RAG Retrieval           [TF-IDF + Cosine]  ~0.05s
        Search 100+ real opportunities (Adzuna API + Internshala)
        using LLM-generated queries + raw skill query
        │
        ▼
Step 4: ⚡ Opportunity Scoring     [Qwen 2.5 0.5B × 5] ~3-8s
        Score top 5 candidates: matched skills, missing skills, reason, confidence
        → 3-attempt retry with prompt simplification on failure
        → Pydantic validation on all outputs
        │
        ▼
Step 5: 🪞 Career Mirror Narrative [Qwen 2.5 0.5B]   ~1-2s
        Write personalized: summary, gap insight, 3-step action plan, encouragement
        → The "wow" feature — a 500M model acting as a career coach
        │
        ▼
Step 6: 🤝 Peer Help Matching      [TF-IDF]           ~0.05s
        Match user with peers who can help close their skill gap
```

**Total LLM calls per request:** 7–8 on `qwen2.5:0.5b`  
**Total cost:** ₹0.00 (fully local inference)

---

## ⚙️ Engineering Techniques Used

| Technique | Where | Purpose |
|-----------|-------|---------|
| **Structured Prompts** | All LLM steps | Constrain 0.5B model to return valid JSON |
| **RAG** | Step 3 | Retrieval over 100+ real opportunities |
| **Multi-Step Pipeline** | Steps 1→2→3→4→5→6 | Small model excels at narrow, well-defined tasks |
| **Validation Layers** | Pydantic schemas | Catch hallucinations, clamp scores, validate enums |
| **Retry Logic** | Steps 1, 4, 5 | Up to 3 attempts with prompt simplification |
| **Fallback Chains** | All LLM steps | Deterministic fallback — system never breaks |
| **LLM Query Generation** | Step 2 | Better RAG retrieval via LLM-written search queries |
| **Input Sanitization** | main.py | Strip HTML, block prompt injection patterns |
| **Rate Limiting** | main.py | 8 requests/minute per IP |
| **Web Speech API** | VoiceInput.tsx | Voice-to-text — no cloud, completely free |

---

## 💰 Cost & Performance Metrics

| Metric | Value |
|--------|-------|
| **Inference cost** | ₹0.00 / query (fully local) |
| **Model size** | ~500MB download (one time) |
| **RAM usage** | ~600MB during inference |
| **Avg total latency** | 8–18 seconds |
| **Step 1 (profile)** | ~1,200ms |
| **Step 2 (queries)** | ~700ms |
| **Step 3 (RAG)** | ~50ms |
| **Step 4 (scoring × 5)** | ~4,000ms |
| **Step 5 (narrative)** | ~1,500ms |
| **Step 6 (peer match)** | ~50ms |
| **LLM calls per request** | 7–8 |
| **Fallback rate** | ~15% (Step 4 simplifies prompt on retry) |

---

## 🚨 Known Failures (Honest)

| Failure | Frequency | How Handled |
|---------|-----------|-------------|
| Qwen 0.5B returns malformed JSON | ~20% of calls | 3-attempt retry with simpler prompt, then fallback |
| Qwen 0.5B hallucinates skills not in input | ~10% of calls | Pydantic validation rejects unknown fields |
| Internshala scraper breaks if site changes | Occasionally | Falls back to cached opportunities.json data |
| Very short inputs produce weak profiles | Common | Regex fallback fills gaps; form guides users |
| LLM narrative may be generic for rare domains | Sometimes | Fallback hardcoded narrative is always coherent |
| Voice input accuracy varies by accent | ~85% accuracy | Live transcript shown for user correction |

---

## 🚀 One-Command Setup

### Prerequisites
- Python 3.10+
- Node.js 18+
- [Ollama](https://ollama.ai) installed

### Setup (Windows)
```powershell
# 1. Pull the model (only once, ~500MB)
ollama pull qwen2.5:0.5b

# 2. Start Ollama
ollama serve

# 3. Install backend deps
cd backend
pip install -r requirements.txt

# 4. Start backend
python -m uvicorn main:app --reload --port 8000

# 5. In a new terminal — install frontend deps
cd frontend
npm install

# 6. Start frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

### Setup (Mac/Linux)
```bash
ollama pull qwen2.5:0.5b && ollama serve &
cd backend && pip install -r requirements.txt && python -m uvicorn main:app --reload --port 8000 &
cd frontend && npm install && npm run dev
```

---

## 🎯 Real Data Sources

| Source | Type | Volume | Method |
|--------|------|--------|--------|
| [Adzuna API](https://developer.adzuna.com) | Jobs | ~50 per fetch | REST API (free tier) |
| [Internshala](https://internshala.com) | Internships | ~50 per scrape | BeautifulSoup scraper |
| `data/help_profiles.json` | Peer helpers | Static sample | Hand-curated |

To refresh job data:
```bash
cd backend && python fetch_data.py && python scrape_internshala.py
```

---

## 📁 Project Structure

```
AlignX/
├── backend/
│   ├── main.py              # FastAPI app — rate limiting, sanitization, pipeline
│   ├── profile_builder.py   # Step 1: LLM profile extraction (Qwen 0.5B)
│   ├── query_generator.py   # Step 2: LLM search query generation (Qwen 0.5B)
│   ├── rag_engine.py        # Step 3: TF-IDF retrieval with union query
│   ├── llm_scorer.py        # Step 4: Scoring with 3-attempt retry (Qwen 0.5B)
│   ├── advisor.py           # Step 5: Career Mirror narrative (Qwen 0.5B)
│   ├── help_matcher.py      # Step 6: Peer matching (TF-IDF)
│   ├── validator.py         # Pydantic schemas for all LLM outputs
│   ├── fetch_data.py        # Adzuna API job fetcher
│   ├── scrape_internshala.py# Internshala scraper
│   └── data/
│       ├── opportunities.json
│       └── help_profiles.json
│
└── frontend/
    ├── src/app/
    │   ├── page.tsx             # Landing page
    │   ├── opportunities/       # Main pipeline page
    │   └── auth/                # Login / Signup
    └── src/components/
        ├── Navbar.tsx
        ├── LandingPage.tsx
        ├── GuidedForm.tsx       # 6-step structured input
        ├── VoiceInput.tsx       # 🆕 Voice interview mode
        ├── PipelineStatus.tsx   # 🆕 Live pipeline step display
        ├── CareerCoach.tsx      # 🆕 Career Mirror narrative
        ├── ProfileDashboard.tsx
        ├── OpportunityMatcher.tsx
        ├── SkillGapSection.tsx
        └── HelpMatcherSection.tsx
```

---

## 🏆 The Wow Gap

**What judges expect from a 500M model:** Basic text classification, maybe a simple Q&A.

**What AlignX does with qwen2.5:0.5b:**
1. Extracts structured career profiles from free-form text (NER-equivalent)
2. Generates optimized semantic search queries
3. Scores opportunities with multi-field reasoning
4. Writes personalized career narratives with action plans
5. Does all of this 7–8 times per user request, in sequence, with retry and validation

A 500M model running a 6-step reasoning pipeline for real career matching — that's the gap.

---

## 👤 Division of Labor

| Component | Built by | AI-assisted |
|-----------|----------|-------------|
| Backend pipeline (Steps 1–6) | Human | Prompt engineering for 0.5B |
| Validation + retry logic | Human | Schema design |
| Frontend (Next.js + Tailwind + Framer) | Human + AI pair | Component architecture |
| Adzuna API integration | Human | — |
| Internshala scraper | Human | — |
| Voice input (Web Speech API) | Human | — |
| Prompt engineering for Qwen 0.5B | Human | Testing + iteration |

---

## 📜 License

MIT — open source, fully reproducible, runs on any laptop.

---

*Built in 72 hours for Garage Inference 2026. One real problem. One cheap model. Smart engineering.*
