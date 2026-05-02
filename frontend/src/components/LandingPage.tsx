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
  { icon: "🧠", title: "Smart Profile Builder", desc: "Just describe yourself in plain text — 'I know Python, 2nd year CSE.' The AI instantly builds a structured profile with your skills, goal, and experience level.", color: "var(--marker-blue)", border: "sketch-border-blue" },
  { icon: "📡", title: "Real Data RAG Engine", desc: "Fetches real jobs and internships from Adzuna API + Internshala. No fake data — actual companies, actual live roles.", color: "var(--marker-green)", border: "sketch-border-green" },
  { icon: "📊", title: "AI Scoring Engine", desc: "A Tiny LLM (Qwen 0.5B) scores every opportunity from 0–100. It tells you exactly why each one matched — no black box.", color: "var(--marker-orange)", border: "sketch-border-orange" },
  { icon: "✅", title: "Proof-Based Results", desc: "Every result comes with full reasoning — matched skills, missing skills, and your next step. Completely transparent, no guessing.", color: "var(--marker-blue)", border: "sketch-border-blue" },
  { icon: "🔓", title: "Skill Gap Unlock Path", desc: "It works like a game — learn one skill and see how many more opportunities unlock. 'Learn React → +8 jobs.' A concrete roadmap for growth.", color: "var(--marker-green)", border: "sketch-border-green" },
  { icon: "🤝", title: "AI Help Matcher", desc: "Stuck on DSA? The AI finds a peer who knows it well, is in your domain, and is available on weekends. Real peer connections, not just forums.", color: "var(--marker-purple)", border: "sketch-border-purple" },
];

const competitors = ["LinkedIn", "Internshala", "ADPList", "AlignX"];
const rows = [
  { label: "Intelligent Matching", vals: ["Partial", "No", "Partial", "Yes ✅"] },
  { label: "Proof / Explanation", vals: ["No", "No", "No", "Yes ✅"] },
  { label: "Skill Gap Analysis", vals: ["No", "No", "No", "Yes ✅"] },
  { label: "Peer Help Matching", vals: ["No", "No", "Mentors only", "Yes ✅"] },
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
            Every year, 15 million+ graduates enter the Indian job market. The problem isn't a
            lack of opportunities — it's that{" "}
            <strong style={{ color: "var(--ink-dark)" }}>
              students don't know which ones are right for them.
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
              { num: "7", label: "Core Features" },
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
            AlignX is an AI-powered platform built specifically for college students and freshers in India. It solves two problems at once:
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {[
            {
              icon: "😰", title: "Problem A — Finding the Right Opportunity",
              points: [
                "No intelligent matching — just keyword searches",
                "No proof — platforms never explain why something fits you",
                "No skill gap guidance — what to do after a rejection?",
                "Platforms like LinkedIn and Internshala return generic results",
              ],
              color: "var(--marker-red)", bgColor: "rgba(216, 90, 90, 0.05)",
            },
            {
              icon: "😔", title: "Problem B — Getting Real Peer Help",
              points: [
                "People who need help and people who can help aren't in the same place",
                "No matching system to find the right peer or mentor",
                "LinkedIn groups are full of spam — real help is rare",
                "ADPList exists but isn't focused on Indian students",
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
              AlignX solves both problems in one single platform!
            </p>
          </motion.div>
        </div>
      </section>

      <WavyLine />

      {/* ── 7 FEATURES ── */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-4xl md:text-5xl mb-3" style={{ fontFamily: "var(--font-heading)", color: "var(--ink-dark)" }}>
            7 Core <span className="highlight-blue">Features</span>
          </h2>
          <p className="text-base" style={{ fontFamily: "var(--font-alt)", color: "var(--pencil-gray)" }}>
            Everything in one place — from intelligent career matching to peer community support
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, idx) => (
            <motion.div key={f.title} className={`sketch-card ${f.border}`} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.08 }} whileHover={{ y: -4 }}>
              <div className="text-4xl mb-3">{f.icon}</div>
              <h3 className="text-xl mb-2" style={{ fontFamily: "var(--font-heading)", color: f.color }}>{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--ink-medium)" }}>{f.desc}</p>
              {idx === 5 && (
                <div className="mt-3 pt-3" style={{ borderTop: "1.5px dashed var(--paper-lines)" }}>
                  <p className="text-xs" style={{ fontFamily: "var(--font-alt)", color: "var(--pencil-gray)" }}>
                    💡 Skill Exchange: &ldquo;I&apos;ll teach you React, you teach me DSA.&rdquo;
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      <WavyLine />

      {/* ── HOW IT WORKS ── */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <motion.div className="text-center mb-12" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <h2 className="text-4xl md:text-5xl mb-3" style={{ fontFamily: "var(--font-heading)", color: "var(--ink-dark)" }}>How It Works ⚙️</h2>
        </motion.div>

        <div className="space-y-4">
          {[
            { num: "1", title: "Tell us about yourself", desc: "Your skills, year, goal, preferences — in plain English. No forms, no resume uploads.", emoji: "💬" },
            { num: "2", title: "AI builds your profile", desc: "In 2 seconds: skills extracted, score 38/100, goal = ML internship, level = beginner-intermediate.", emoji: "🧠" },
            { num: "3", title: "Real data is fetched", desc: "50 fresh jobs from Adzuna API + 50 internships from Internshala = 100+ live opportunities.", emoji: "📡" },
            { num: "4", title: "Tiny LLM scores everything", desc: "Qwen 0.5B rates each opportunity with structured JSON output — 5 final scores generated.", emoji: "🤖" },
            { num: "5", title: "Results + proof shown", desc: "Match score, reason, missing skills, and your next step — you know exactly what to do.", emoji: "✅" },
            { num: "6", title: "Get connected with peers", desc: "Need help with React? The system suggests a peer with 91% compatibility who can help you.", emoji: "🤝" },
          ].map((step, idx) => (
            <motion.div key={step.num} className="sketch-card flex items-start gap-5" initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }}>
              <div className="text-3xl font-bold flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full" style={{ fontFamily: "var(--font-handwritten)", color: "white", background: "var(--marker-blue)", border: "2.5px dashed rgba(255,255,255,0.5)", minWidth: "48px" }}>
                {step.num}
              </div>
              <div>
                <p className="text-xl mb-1" style={{ fontFamily: "var(--font-heading)", color: "var(--ink-dark)" }}>{step.emoji} {step.title}</p>
                <p className="text-sm" style={{ fontFamily: "var(--font-body)", color: "var(--ink-light)" }}>{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
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
