"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const DoodleCircle = ({ color = "var(--marker-orange)", size = 80 }: { color?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
    <circle cx="40" cy="40" r="35" stroke={color} strokeWidth="2" strokeDasharray="8 6" />
    <circle cx="40" cy="40" r="20" stroke={color} strokeWidth="1.5" strokeDasharray="4 4" />
  </svg>
);

const DoodleSquare = () => (
  <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
    <rect x="5" y="5" width="50" height="50" stroke="var(--marker-purple)" strokeWidth="2" strokeDasharray="6 4" transform="rotate(12 30 30)" />
  </svg>
);

const DoodleStar = () => (
  <svg width="24" height="24" viewBox="0 0 24 24">
    <path d="M12 2 L14.5 9.5 L22 12 L14.5 14.5 L12 22 L9.5 14.5 L2 12 L9.5 9.5 Z" fill="var(--marker-yellow)" />
  </svg>
);

const WavyLine = () => (
  <svg width="100%" height="12" viewBox="0 0 600 12" preserveAspectRatio="none" fill="none">
    <path d="M0 6 Q50 2, 100 6 T200 6 T300 6 T400 6 T500 6 T600 6" stroke="var(--paper-lines)" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

interface Feature { icon: string; title: string; desc: string; color: string; border: string; }

const features: Feature[] = [
  { icon: "🧠", title: "Smart Profile Builder", desc: "Describe yourself in plain text or voice — 'I know Python, 2nd year CSE.' AI instantly extracts your skills, goal, domain, and experience level.", color: "var(--marker-blue)", border: "sketch-border-blue" },
  { icon: "📡", title: "Real Data RAG Engine", desc: "Fetches real jobs and internships from Adzuna API + Internshala. No fake data — actual companies, actual live roles.", color: "var(--marker-green)", border: "sketch-border-green" },
  { icon: "📊", title: "AI Scoring Engine", desc: "Qwen 0.5B scores every opportunity from 0–100. It tells you exactly why each one matched — matched skills, missing skills, confidence level.", color: "var(--marker-orange)", border: "sketch-border-orange" },
  { icon: "🔓", title: "Skill Gap Unlock Path", desc: "It works like a game — learn one skill and see how many more opportunities unlock. 'Learn React → +8 jobs.' A concrete roadmap for growth.", color: "var(--marker-green)", border: "sketch-border-green" },
  { icon: "🪞", title: "Career Mirror", desc: "A 500M LLM writes your personalized career summary, gap insight, and a 3-step action plan. Your honest career coach — for ₹0.", color: "var(--marker-purple)", border: "sketch-border-purple" },
  { icon: "🤝", title: "AI Peer Help Matcher", desc: "Stuck on DSA? AI finds a peer who knows it, is in your domain, and available. Chat with them directly inside the app!", color: "var(--marker-purple)", border: "sketch-border-purple" },
  { icon: "💰", title: "Salary Estimator", desc: "Get an instant salary range based on your skills and market data. See which skill gives you the highest pay bump.", color: "var(--marker-orange)", border: "sketch-border-orange" },
  { icon: "📋", title: "Application Tracker", desc: "Track every job you apply to — Saved → Applied → Interview → Offer. Your personal Kanban board, all in one place.", color: "var(--marker-blue)", border: "sketch-border-blue" },
  { icon: "💾", title: "Save & Share Results", desc: "Save any match session to your Dashboard. Compare results over time or share your profile link with mentors.", color: "var(--marker-green)", border: "sketch-border-green" },
  { icon: "📊", title: "Personal Dashboard", desc: "Your career hub — view match history, track applications, see salary estimates, and connect with peers. All behind a real account.", color: "var(--marker-blue)", border: "sketch-border-blue" },
];

const competitors = ["LinkedIn", "Internshala", "ADPList", "AlignX"];
const rows = [
  { label: "Intelligent Matching", vals: ["Partial", "No", "Partial", "Yes ✅"] },
  { label: "Proof / Explanation", vals: ["No", "No", "No", "Yes ✅"] },
  { label: "Skill Gap Analysis", vals: ["No", "No", "No", "Yes ✅"] },
  { label: "Peer Chat / Matching", vals: ["No", "No", "Mentors only", "Yes ✅"] },
  { label: "Salary Estimator", vals: ["Partial", "No", "No", "Yes ✅"] },
  { label: "Application Tracker", vals: ["Yes", "No", "No", "Yes ✅"] },
  { label: "Personal Dashboard", vals: ["Yes", "No", "Partial", "Yes ✅"] },
  { label: "India Focused", vals: ["Partial", "Yes", "No", "Yes ✅"] },
  { label: "Free + Transparent AI", vals: ["No", "Yes", "Partial", "Yes ✅"] },
];

export default function LandingPage() {
  return (
    <main className="pt-16">
      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20 text-center overflow-hidden">
        <motion.div className="absolute top-14 left-6 opacity-30 hidden lg:block" animate={{ rotate: [0, 8, -8, 0] }} transition={{ duration: 7, repeat: Infinity }}><DoodleCircle /></motion.div>
        <motion.div className="absolute top-24 right-8 opacity-25 hidden lg:block" animate={{ y: [0, -10, 0] }} transition={{ duration: 5, repeat: Infinity }}><DoodleSquare /></motion.div>
        <motion.div className="absolute bottom-32 left-20 opacity-30 hidden lg:block" animate={{ rotate: [0, 360] }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }}><DoodleStar /></motion.div>
        <motion.div className="absolute bottom-20 right-16 opacity-25 hidden lg:block" animate={{ rotate: [0, -6, 6, 0] }} transition={{ duration: 6, repeat: Infinity }}><DoodleCircle color="var(--marker-purple)" size={60} /></motion.div>

        <motion.div className="max-w-4xl mx-auto" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <motion.div
            className="inline-flex items-center gap-2 mb-6 px-4 py-2 sketch-border-light"
            style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px", background: "rgba(255,255,255,0.5)" }}
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
          >
            <span className="text-sm" style={{ fontFamily: "var(--font-alt)", color: "var(--ink-light)" }}>
              ⚡ Garage Inference Challenge &nbsp;·&nbsp; Tiny Model, Big Impact
            </span>
          </motion.div>

          <h1 className="text-6xl md:text-8xl font-bold mb-4 leading-none" style={{ fontFamily: "var(--font-heading)", color: "var(--ink-dark)" }}>
            Align<span style={{ color: "var(--marker-blue)" }}>X</span>
          </h1>

          <motion.p className="text-2xl md:text-3xl mb-4 leading-snug" style={{ fontFamily: "var(--font-handwritten)", color: "var(--ink-medium)" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            Smart <span className="highlight-blue">Career Matching</span> + <span className="highlight-yellow">Peer Help Community</span>
          </motion.p>

          <motion.p className="text-lg md:text-xl mb-4 max-w-2xl mx-auto" style={{ fontFamily: "var(--font-body)", color: "var(--ink-light)", lineHeight: "1.7" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
            Every year, 15 million+ graduates enter the Indian job market. The problem isn&apos;t a
            lack of opportunities — it&apos;s that{" "}
            <strong style={{ color: "var(--ink-dark)" }}>
              students don&apos;t know which ones are right for them.
            </strong>
          </motion.p>

          <motion.p className="text-base mb-10 max-w-xl mx-auto italic" style={{ fontFamily: "var(--font-alt)", color: "var(--pencil-gray)" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
            &ldquo;We didn&apos;t build another job platform — we built a system that understands you,
            proves its recommendations, and connects you with peers who can help.&rdquo;
          </motion.p>

          <motion.div className="flex flex-wrap items-center justify-center gap-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }}>
            <Link href="/opportunities" className="sketch-btn sketch-btn-primary !text-xl !py-4 !px-10">🎯 Find My Match →</Link>
            <Link href="/auth?mode=signup" className="sketch-btn !text-xl !py-4 !px-8">Sign Up Free ✨</Link>
          </motion.div>

          <motion.div className="flex items-center justify-center gap-8 mt-12 flex-wrap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
            {[
              { num: "100+", label: "Real Opportunities" },
              { num: "₹0", label: "Total Cost" },
              { num: "0.5B", label: "Qwen AI Model" },
              { num: "10", label: "Powerful Features" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl font-bold" style={{ fontFamily: "var(--font-handwritten)", color: "var(--marker-blue)" }}>{s.num}</p>
                <p className="text-sm" style={{ fontFamily: "var(--font-alt)", color: "var(--pencil-gray)" }}>{s.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      <WavyLine />

      {/* ── WHAT IS ALIGNX ── */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-4xl md:text-5xl mb-4" style={{ fontFamily: "var(--font-heading)", color: "var(--ink-dark)" }}>What is AlignX? 🤔</h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ fontFamily: "var(--font-body)", color: "var(--ink-light)" }}>
            AlignX is a full AI-powered career platform for Indian students. Log in once — get a personal dashboard with matching, tracking, coaching, and peer support.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {[
            {
              icon: "😰", title: "Problem A — Finding the Right Opportunity",
              points: [
                "No intelligent matching — just keyword searches",
                "No proof — platforms never explain why something fits you",
                "No skill gap guidance — what to learn after a rejection?",
                "No salary insight — you don't know what to expect",
              ],
              color: "var(--marker-red)", bgColor: "rgba(216, 90, 90, 0.05)",
            },
            {
              icon: "😔", title: "Problem B — Growing Your Career Solo",
              points: [
                "No peer matching to find someone who can help you learn",
                "No way to track all your job applications in one place",
                "No personalized action plan — just generic advice",
                "No dashboard to see your career progress over time",
              ],
              color: "var(--marker-orange)", bgColor: "rgba(232, 133, 58, 0.05)",
            },
          ].map((p) => (
            <motion.div key={p.title} className="sketch-card" style={{ borderColor: p.color, background: p.bgColor }} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h3 className="text-xl mb-4" style={{ fontFamily: "var(--font-heading)", color: p.color }}>{p.icon} {p.title}</h3>
              <ul className="space-y-2">
                {p.points.map((pt) => (
                  <li key={pt} className="flex items-start gap-2 text-sm" style={{ fontFamily: "var(--font-body)", color: "var(--ink-medium)" }}>
                    <span style={{ color: p.color, flexShrink: 0 }}>✗</span> {pt}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <div className="text-center my-10">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
            <p className="text-5xl mb-2">↓</p>
            <p className="text-2xl" style={{ fontFamily: "var(--font-handwritten)", color: "var(--marker-green)" }}>
              AlignX solves all of this — in one free platform! 🚀
            </p>
          </motion.div>
        </div>
      </section>

      <WavyLine />

      {/* ── 10 POWERFUL FEATURES ── */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <motion.div className="text-center mb-4" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <span className="sketch-tag !text-sm" style={{ borderColor: "var(--marker-orange)", color: "var(--marker-orange)" }}>✦ Everything you need, nothing you don&apos;t</span>
        </motion.div>
        <motion.div className="text-center mb-4" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
          <h2 className="text-4xl md:text-6xl mb-3" style={{ fontFamily: "var(--font-heading)", color: "var(--ink-dark)", lineHeight: "1.1" }}>
            10 Features that <span className="highlight-blue">actually help</span> you
          </h2>
          <p className="text-xl max-w-2xl mx-auto" style={{ fontFamily: "var(--font-handwritten)", color: "var(--ink-medium)" }}>
            Not fluff. Not generic. Built specifically for Indian students who are tired of applying blindly.
          </p>
        </motion.div>

        {/* Big Feature Cards - Top 3 */}
        <motion.div className="grid md:grid-cols-3 gap-5 mb-5 mt-12" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }}>

          <motion.div className="sketch-card sketch-border-blue md:col-span-2" whileHover={{ y: -5 }} style={{ background: "linear-gradient(135deg, rgba(74,126,197,0.04) 0%, rgba(255,255,255,0) 100%)" }}>
            <div className="flex items-start gap-4">
              <div className="text-5xl flex-shrink-0">🧠</div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-2xl" style={{ fontFamily: "var(--font-heading)", color: "var(--marker-blue)" }}>Smart Profile Builder</h3>
                  <span className="sketch-tag !text-xs !py-0.5 !px-2" style={{ borderColor: "var(--marker-green)", color: "var(--marker-green)" }}>2 sec ⚡</span>
                </div>
                <p className="text-base mb-3" style={{ fontFamily: "var(--font-body)", color: "var(--ink-medium)" }}>
                  Just <strong>speak or type naturally</strong> — &ldquo;I know Python, 2nd year CSE, want ML internship.&rdquo; Qwen 0.5B reads between the lines and builds your full professional profile instantly.
                </p>
                <div className="flex gap-3 flex-wrap">
                  <span className="text-sm" style={{ fontFamily: "var(--font-alt)", color: "var(--marker-blue)" }}>✓ Voice input support</span>
                  <span className="text-sm" style={{ fontFamily: "var(--font-alt)", color: "var(--marker-blue)" }}>✓ Auto skill extraction</span>
                  <span className="text-sm" style={{ fontFamily: "var(--font-alt)", color: "var(--marker-blue)" }}>✓ 0–100 profile score</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div className="sketch-card sketch-border-orange" whileHover={{ y: -5 }} style={{ background: "linear-gradient(135deg, rgba(232,133,58,0.04) 0%, rgba(255,255,255,0) 100%)" }}>
            <div className="text-5xl mb-3">💰</div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-xl" style={{ fontFamily: "var(--font-heading)", color: "var(--marker-orange)" }}>Salary Estimator</h3>
              <span className="sketch-tag !text-xs !py-0.5 !px-2" style={{ borderColor: "var(--marker-orange)", color: "var(--marker-orange)" }}>NEW</span>
            </div>
            <p className="text-sm mb-3" style={{ fontFamily: "var(--font-body)", color: "var(--ink-medium)" }}>Know your worth <em>before</em> you apply. Get a realistic ₹ range based on your actual skills — not some generic number.</p>
            <p className="text-xl font-bold" style={{ fontFamily: "var(--font-handwritten)", color: "var(--marker-green)" }}>₹5K → ₹45K/month 💸</p>
          </motion.div>
        </motion.div>

        {/* Middle Row */}
        <motion.div className="grid md:grid-cols-3 gap-5 mb-5" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>

          <motion.div className="sketch-card sketch-border-green" whileHover={{ y: -5 }}>
            <div className="text-5xl mb-3">📡</div>
            <h3 className="text-xl mb-2" style={{ fontFamily: "var(--font-heading)", color: "var(--marker-green)" }}>Real Data Only</h3>
            <p className="text-sm mb-3" style={{ fontFamily: "var(--font-body)", color: "var(--ink-medium)" }}>100+ <strong>live opportunities</strong> fetched fresh every time — Adzuna API + Internshala scraper. Zero fake listings, ever.</p>
            <div className="p-2 rounded-lg text-center" style={{ background: "var(--highlight-green)", border: "1.5px dashed var(--marker-green)" }}>
              <p className="text-sm font-bold" style={{ fontFamily: "var(--font-handwritten)", color: "var(--marker-green)" }}>50 jobs + 50 internships = 100+ matches</p>
            </div>
          </motion.div>

          <motion.div className="sketch-card sketch-border-orange" whileHover={{ y: -5 }}>
            <div className="text-5xl mb-3">⚡</div>
            <h3 className="text-xl mb-2" style={{ fontFamily: "var(--font-heading)", color: "var(--marker-orange)" }}>AI Scoring Engine</h3>
            <p className="text-sm mb-3" style={{ fontFamily: "var(--font-body)", color: "var(--ink-medium)" }}>Qwen 0.5B scores every opportunity <strong>0–100</strong> with full reasoning — matched skills, missing skills, why it&apos;s a fit. No black box.</p>
            <div className="flex justify-between text-sm" style={{ fontFamily: "var(--font-alt)", color: "var(--pencil-gray)" }}>
              <span>🤖 5 LLM calls</span><span>⏱ ~15 seconds</span><span>₹0 cost</span>
            </div>
          </motion.div>

          <motion.div className="sketch-card sketch-border-purple" whileHover={{ y: -5 }}>
            <div className="text-5xl mb-3">🪞</div>
            <h3 className="text-xl mb-2" style={{ fontFamily: "var(--font-heading)", color: "var(--marker-purple)" }}>Career Mirror</h3>
            <p className="text-sm mb-2" style={{ fontFamily: "var(--font-body)", color: "var(--ink-medium)" }}>Your personal AI coach writes a <strong>brutally honest</strong> career summary + 3-step action plan. No sugar-coating.</p>
            <p className="text-sm italic" style={{ fontFamily: "var(--font-alt)", color: "var(--pencil-gray)" }}>&ldquo;You&apos;re strong in Python but React is holding you back from 8 more jobs.&rdquo;</p>
          </motion.div>
        </motion.div>

        {/* Bottom Row */}
        <motion.div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.25 }}>

          <motion.div className="sketch-card sketch-border-green" whileHover={{ y: -5 }}>
            <div className="text-4xl mb-2">🔓</div>
            <h3 className="text-lg mb-2" style={{ fontFamily: "var(--font-heading)", color: "var(--marker-green)" }}>Skill Gap Path</h3>
            <p className="text-sm mb-2" style={{ fontFamily: "var(--font-body)", color: "var(--ink-medium)" }}>See exactly which skill unlocks the most jobs for you.</p>
            <p className="font-bold" style={{ fontFamily: "var(--font-handwritten)", color: "var(--marker-green)", fontSize: "1.1rem" }}>Learn React → +8 jobs 🚀</p>
          </motion.div>

          <motion.div className="sketch-card sketch-border-purple" whileHover={{ y: -5 }}>
            <div className="text-4xl mb-2">💬</div>
            <h3 className="text-lg mb-2" style={{ fontFamily: "var(--font-heading)", color: "var(--marker-purple)" }}>Peer Chat</h3>
            <p className="text-sm" style={{ fontFamily: "var(--font-body)", color: "var(--ink-medium)" }}>Message matched peers <strong>directly inside</strong> the app. No spam, no LinkedIn cold DMs — real help only.</p>
          </motion.div>

          <motion.div className="sketch-card sketch-border-blue" whileHover={{ y: -5 }}>
            <div className="text-4xl mb-2">📋</div>
            <h3 className="text-lg mb-2" style={{ fontFamily: "var(--font-heading)", color: "var(--marker-blue)" }}>App Tracker</h3>
            <p className="text-sm" style={{ fontFamily: "var(--font-body)", color: "var(--ink-medium)" }}>Track every application — Saved → Applied → Interview → Offer. Your personal Kanban, always ready.</p>
          </motion.div>

          <motion.div className="sketch-card sketch-border-green" whileHover={{ y: -5 }}>
            <div className="text-4xl mb-2">📊</div>
            <h3 className="text-lg mb-2" style={{ fontFamily: "var(--font-heading)", color: "var(--marker-blue)" }}>Dashboard</h3>
            <p className="text-sm" style={{ fontFamily: "var(--font-body)", color: "var(--ink-medium)" }}>Your career hub — history, salary, matches, peers. One place. Zero confusion.</p>
          </motion.div>
        </motion.div>

        {/* Bottom CTA bar */}
        <motion.div className="mt-10 sketch-card sketch-border-blue text-center" style={{ background: "var(--highlight-blue)" }} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <p className="text-2xl" style={{ fontFamily: "var(--font-handwritten)", color: "var(--ink-dark)" }}>
            All 10 features. One platform. Zero cost. <span style={{ color: "var(--marker-blue)" }}>Forever free for students. 🎓</span>
          </p>
        </motion.div>
      </section>

      <WavyLine />

      {/* ── HOW IT WORKS ── */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <motion.div className="text-center mb-4" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <span className="sketch-tag !text-sm" style={{ borderColor: "var(--marker-green)", color: "var(--marker-green)" }}>✦ Takes less than 20 seconds to start</span>
        </motion.div>
        <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
          <h2 className="text-4xl md:text-6xl mb-3" style={{ fontFamily: "var(--font-heading)", color: "var(--ink-dark)", lineHeight: "1.1" }}>
            From <span className="highlight-yellow">confused</span> to <span className="highlight-green">hired</span> — in 8 steps
          </h2>
          <p className="text-xl" style={{ fontFamily: "var(--font-handwritten)", color: "var(--ink-medium)" }}>
            No CV. No cover letter. No keyword gaming. Just you, honestly.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connecting line */}
          <div className="absolute left-6 top-8 bottom-8 w-0.5 hidden md:block" style={{ background: "repeating-linear-gradient(to bottom, var(--paper-lines) 0px, var(--paper-lines) 8px, transparent 8px, transparent 14px)" }} />

          <div className="space-y-5">
            {[
              {
                num: "1", emoji: "🔐", title: "Create your free account",
                desc: "30 seconds. Just name + email. Unlock your personal dashboard, match history, and salary tracker — all waiting for you.",
                badge: "30 sec setup", badgeColor: "var(--marker-green)",
                impact: "Your data stays private. No spam. No credit card.",
              },
              {
                num: "2", emoji: "🎤", title: "Speak or type in plain language",
                desc: "\"I know React and Python, I\'m in 3rd year CSE, looking for a remote internship.\" That&apos;s all we need. No resume uploads, no perfect wording required.",
                badge: "Voice supported", badgeColor: "var(--marker-purple)",
                impact: "Works in Hinglish too. Just be yourself.",
              },
              {
                num: "3", emoji: "🧠", title: "AI extracts your complete profile",
                desc: "Qwen 0.5B reads your words and builds a structured profile: skills list, domain, goal, experience level, and a 0–100 readiness score.",
                badge: "< 2 seconds", badgeColor: "var(--marker-blue)",
                impact: "\"Score 38/100 — Beginner-Intermediate ML track.\"  It just knows.",
              },
              {
                num: "4", emoji: "📡", title: "100+ real opportunities fetched live",
                desc: "Not a database from 2022. Fresh jobs from Adzuna API + Internshala scraped right now. Real companies, real roles, real deadlines.",
                badge: "Live data", badgeColor: "var(--marker-orange)",
                impact: "50 jobs + 50 internships = 100+ real matches every time.",
              },
              {
                num: "5", emoji: "⚡", title: "Every match gets an AI score + reason",
                desc: "The LLM doesn\'t just rank — it explains. \"You match 4/6 required skills. Missing: Docker, Kubernetes. Confidence: High.\" Zero guessing.",
                badge: "5 LLM calls", badgeColor: "var(--marker-blue)",
                impact: "Transparent. Honest. Never a black box.",
              },
              {
                num: "6", emoji: "🪞", title: "Your Career Mirror is written for you",
                desc: "A 500M model writes your honest career summary, identifies the ONE thing holding you back, and gives you a 3-step action plan. For free.",
                badge: "Personalized", badgeColor: "var(--marker-purple)",
                impact: "\"Learn React in 2 weeks — it unlocks 8 more jobs for you specifically.\"  ",
              },
              {
                num: "7", emoji: "💰", title: "Know your salary before you apply",
                desc: "Your Salary Estimator shows a realistic ₹ range based on YOUR skills and the current Indian market. No surprises in the HR call.",
                badge: "Instant", badgeColor: "var(--marker-orange)",
                impact: "\"Your React skill is your highest-value asset. Lean in.\"  ",
              },
              {
                num: "8", emoji: "🤝", title: "Chat with peers. Track every application.",
                desc: "Message matched peers who can actually help you. Then track every application (Saved → Applied → Interview → Offer) in your dashboard. All saved.",
                badge: "Your career hub", badgeColor: "var(--marker-green)",
                impact: "Everything in one place. Come back anytime — your progress waits for you.",
              },
            ].map((step, idx) => (
              <motion.div
                key={step.num}
                className="sketch-card flex items-start gap-5 md:ml-10 relative"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.07, duration: 0.5 }}
                whileHover={{ x: 4 }}
              >
                {/* Step circle */}
                <div
                  className="text-2xl font-bold flex-shrink-0 w-14 h-14 flex items-center justify-center rounded-full md:-ml-17"
                  style={{
                    fontFamily: "var(--font-handwritten)",
                    color: "white",
                    background: step.badgeColor,
                    border: "3px dashed rgba(255,255,255,0.4)",
                    minWidth: "56px",
                    boxShadow: `4px 4px 0px ${step.badgeColor}40`,
                  }}
                >
                  {step.emoji}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap mb-1">
                    <p className="text-xl font-bold" style={{ fontFamily: "var(--font-heading)", color: "var(--ink-dark)" }}>
                      Step {step.num} — {step.title}
                    </p>
                    <span
                      className="sketch-tag !text-xs !py-0.5 !px-2"
                      style={{ borderColor: step.badgeColor, color: step.badgeColor }}
                    >
                      {step.badge}
                    </span>
                  </div>

                  <p className="text-base mb-2" style={{ fontFamily: "var(--font-body)", color: "var(--ink-medium)", lineHeight: "1.6" }}>
                    {step.desc}
                  </p>

                  <p
                    className="text-sm italic"
                    style={{ fontFamily: "var(--font-alt)", color: step.badgeColor }}
                  >
                    → {step.impact}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="mt-14 text-center sketch-card"
          style={{ borderColor: "var(--marker-blue)", background: "var(--highlight-blue)" }}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <p className="text-3xl mb-3">🚀</p>
          <p className="text-2xl mb-2" style={{ fontFamily: "var(--font-heading)", color: "var(--ink-dark)" }}>
            You&apos;re literally 30 seconds away from your best match.
          </p>
          <p className="text-lg mb-5" style={{ fontFamily: "var(--font-handwritten)", color: "var(--ink-light)" }}>
            15 million graduates. Most apply blindly. You don&apos;t have to.
          </p>
          <a href="/auth?mode=signup" className="sketch-btn sketch-btn-primary !text-xl !py-4 !px-12 inline-block">
            🎯 Start for Free — No CV needed
          </a>
        </motion.div>
      </section>

      <WavyLine />

      {/* ── COMPARISON TABLE ── */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <motion.div className="text-center mb-10" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <h2 className="text-4xl md:text-5xl mb-3" style={{ fontFamily: "var(--font-heading)", color: "var(--ink-dark)" }}>
            AlignX vs <span className="highlight-yellow">Others</span>
          </h2>
        </motion.div>

        <motion.div className="sketch-card overflow-x-auto" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <table className="w-full text-sm" style={{ fontFamily: "var(--font-body)" }}>
            <thead>
              <tr style={{ borderBottom: "2px dashed var(--paper-lines)" }}>
                <th className="text-left py-3 pr-4" style={{ color: "var(--ink-light)" }}>Feature</th>
                {competitors.map((c) => (
                  <th key={c} className="py-3 px-3 text-center" style={{ color: c === "AlignX" ? "var(--marker-blue)" : "var(--ink-medium)", fontFamily: c === "AlignX" ? "var(--font-heading)" : "var(--font-body)", fontSize: c === "AlignX" ? "1.1rem" : "inherit" }}>
                    {c === "AlignX" ? "✏️ AlignX" : c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rIdx) => (
                <tr key={row.label} style={{ borderBottom: "1px dashed var(--paper-lines)", background: rIdx % 2 === 0 ? "transparent" : "rgba(255,255,255,0.3)" }}>
                  <td className="py-3 pr-4" style={{ color: "var(--ink-medium)" }}>{row.label}</td>
                  {row.vals.map((v, vIdx) => (
                    <td key={vIdx} className="py-3 px-3 text-center" style={{ color: v.includes("✅") ? "var(--marker-green)" : v === "No" ? "var(--pencil-gray)" : "var(--ink-medium)", fontWeight: v.includes("✅") ? "600" : "normal" }}>
                      {v}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </section>

      <WavyLine />

      {/* ── FINAL CTA ── */}
      <section className="max-w-3xl mx-auto px-6 py-20 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
          <div className="sketch-card sketch-border-blue">
            <p className="text-5xl mb-4">🚀</p>
            <h2 className="text-4xl mb-4" style={{ fontFamily: "var(--font-heading)", color: "var(--ink-dark)" }}>Ready to find your path?</h2>
            <p className="text-lg mb-8" style={{ fontFamily: "var(--font-body)", color: "var(--ink-light)" }}>
              Describe yourself in plain language — no perfect words needed. AlignX&apos;s AI takes care of the rest.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/opportunities" className="sketch-btn sketch-btn-primary !text-xl !py-4 !px-10">🎯 Start Matching Now →</Link>
              <Link href="/auth?mode=signup" className="sketch-btn !text-xl !py-4 !px-8">Create Profile 🎓</Link>
            </div>
            <p className="text-sm mt-6" style={{ fontFamily: "var(--font-alt)", color: "var(--pencil-gray)" }}>
              ✨ Free · No credit card · Built in India 🇮🇳
            </p>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 mt-4" style={{ borderTop: "2px dashed var(--paper-lines)" }}>
        <p className="text-lg" style={{ fontFamily: "var(--font-handwritten)", color: "var(--ink-light)" }}>
          ✏️ AlignX — Real problem. Tiny model. Smart engineering.
        </p>
        <p className="text-xs mt-1" style={{ fontFamily: "var(--font-alt)", color: "var(--pencil-gray)" }}>
          Built with Qwen 0.5B · RAG · Real APIs · ₹0 cost · Made in India 🇮🇳
        </p>
      </footer>
    </main>
  );
}
