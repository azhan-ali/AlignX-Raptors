# ✏️ AlignX — The 3-Role AI Career Ecosystem

<div align="center">
  <p><strong>Garage Inference 2026 Submission</strong> 🏆</p>
  <p><em>Built on <strong>Tier 1 — Absolute Garage MAX</strong> (≤4B parameters)</em></p>
  <p><strong>Model:</strong> <code>qwen2.5:0.5b</code> via Ollama · <strong>Cost per user:</strong> ₹0.00</p>
</div>

---

## 🚀 The Vision: Beyond Job Boards

Every year, 15 million+ Indian graduates enter the job market. Traditional platforms offer them keyword-based search bars and endless cold DMs on LinkedIn. 

**AlignX is different.** It's not a job board; it's an **AI-powered Career Ecosystem** connecting three critical roles:

1. 🎓 **The Learner** — Students seeking real opportunities, skill gap analysis, and guidance.
2. 📚 **The Student Mentor** — Peers who have cracked the code and want to teach others (Free/Paid).
3. 🏢 **The Industry Expert** — Working professionals offering company culture insights, interview tips, and mentorship.

With just a **500M parameter model (`qwen2.5:0.5b`)**, AlignX orchestrates intelligent matching across all three roles, completely locally, at zero cost.

---

## 💎 The "Wow" Gap: What a 500M Model Can Actually Do

What do judges expect from a 500M parameter model? Basic text classification? A simple Q&A bot?

**Here is what AlignX does with `qwen2.5:0.5b`:**
- **Information Extraction:** Reads natural language ("I know Python, 2nd year CSE") and extracts a strict structured JSON profile (NER-equivalent).
- **Query Engineering:** Synthesizes optimized search queries for the RAG engine.
- **Deep Scoring:** Scores 100+ real-time jobs fetched via Adzuna API & Internshala with multi-field reasoning (Matched Skills, Missing Skills, Confidence Score).
- **Career Coaching:** Acts as a 'Career Mirror', writing personalized, brutally honest narratives and a 3-step action plan to bridge skill gaps.
- **Ecosystem Matching:** Matches Learners with Student Mentors and Company Advisors based on semantic overlap.

**All of this happens 7-8 times per user request, in sequence, with automated retry logic and Pydantic validation.** *That* is the wow gap.

---

## 🏗️ The 3-Role Ecosystem Features

### 🎓 1. For Learners
* **Smart Profile Builder:** Speak or type naturally. AI extracts your skills and goals.
* **Live RAG Opportunity Match:** Scrapes real, live jobs and scores them specifically for you.
* **Skill Gap Path:** Tells you exactly which skill to learn next to unlock more jobs.
* **AI Mentor & Advisor Match:** Find the perfect student mentor or company advisor to guide you.
* **Application & Salary Tracker:** Manage your applications and get instant salary estimates.

### 📚 2. For Student Mentors
* **Personalized Dashboard:** List the subjects/courses you can teach.
* **Flexible Pricing:** Choose to teach for free or set a price per session.
* **Booking Management:** Review incoming student requests, accept, and complete sessions.

### 🏢 3. For Industry Experts
* **Dual Profiles:** List yourself as a Skill Mentor or a Company Culture Advisor.
* **Share Insider Knowledge:** Post interview tips and culture details about your specific company (Google, Amazon, etc.).
* **Connect & Give Back:** Manage student bookings directly through your expert dashboard.

---

## 🧠 Architecture — The 6-Step AI Pipeline

```text
User Input (text or voice)
        │
        ▼
[SANITIZE] — Strip HTML, block prompt injection
        │
        ▼
Step 1: 🧠 Profile Extraction     [Qwen 2.5 0.5B]   ~1-2s
        Extract: skills, year, goal, domain, level from raw text
        │
        ▼
Step 2: 🔍 Smart Query Generation  [Qwen 2.5 0.5B]   ~0.5-1s
        Generate optimized search queries for better RAG retrieval
        │
        ▼
Step 3: 📡 RAG Retrieval           [TF-IDF + Cosine]  ~0.05s
        Search 100+ REAL opportunities (Adzuna API + Internshala)
        │
        ▼
Step 4: ⚡ Opportunity Scoring     [Qwen 2.5 0.5B × 5] ~3-8s
        Score top 5 candidates. Generates exact reasoning & confidence.
        │
        ▼
Step 5: 🪞 Career Mirror Narrative [Qwen 2.5 0.5B]   ~1-2s
        Write personalized gap insight & 3-step action plan.
        │
        ▼
Step 6: 🤝 Ecosystem Matching      [AI-assisted Keyword Matching]
        Connect User ↔ Mentor ↔ Advisor based on profile.
```

---

## ⚙️ Hardcore Engineering Constraints

To make a 500M model behave like GPT-4, we implemented strict engineering guards:
- **Pydantic Validation:** Every LLM output is clamped and validated against strict schemas.
- **3-Attempt Retry Logic:** If the model hallucinates or breaks JSON, the prompt is automatically simplified, and the system retries up to 3 times.
- **Deterministic Fallbacks:** If the LLM completely fails, regex and static fallbacks take over. The app *never* crashes.
- **Rate Limiting & Sanitization:** Built-in protection against prompt injection and spam.

---

## 🚀 How to Run & Test (For Judges)

We made testing entirely frictionless. You can run the backend locally and connect our beautiful frontend to it instantly.

### Prerequisites
- Python 3.10+
- [Ollama](https://ollama.ai) installed

### 1. Start the Local AI Backend
```bash
# 1. Pull the tiny 500M model (~300MB download)
ollama pull qwen2.5:0.5b
ollama serve

# 2. Clone the repo & Start backend
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```

### 2. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:3000`. The frontend will automatically route all AI requests to your local backend.

> **Pro-Tip for Testing:** Go to `http://localhost:3000/auth?mode=signup` to see the new 3-Role selection cards and role-specific dashboards!

---

## 📊 Live Data Sources
We don't use fake CSVs.
- **Adzuna API:** Fetches real jobs dynamically.
- **Internshala Scraper:** Fetches live internships using BeautifulSoup.
*To refresh data manually, run:* `cd backend && python fetch_data.py && python scrape_internshala.py`

---

## 👨‍💻 Division of Labor
| Component | Built by | 
|-----------|----------|
| **Backend Pipeline (Steps 1–6)** | Human |
| **Validation + Retry Logic** | Human |
| **Frontend Architecture & 3-Role System** | Human + AI Pair | 
| **Data Scrapers & APIs** | Human | 
| **Prompt Engineering for Qwen 0.5B** | Human | 

---

### *Built for Garage Inference 2026. One real problem. One tiny model. Smart engineering.* 🇮🇳
