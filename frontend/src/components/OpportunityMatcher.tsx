"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Opportunity {
  title: string; company: string; location?: string; type?: string;
  score?: number; matched_skills?: string[]; missing_skills?: string[];
  reason?: string; confidence?: string;
}

function confidenceColor(c?: string) {
  if (c === "high") return "var(--marker-green)";
  if (c === "medium") return "var(--marker-orange)";
  return "var(--marker-red)";
}

function scoreBarColor(score: number) {
  if (score >= 75) return "var(--marker-green)";
  if (score >= 50) return "var(--marker-orange)";
  return "var(--marker-red)";
}

function ScoreTag({ score }: { score: number }) {
  const label = score >= 75 ? "Strong Match" : score >= 50 ? "Moderate Match" : "Weak Match";
  return <span className="sketch-tag text-sm !py-1" style={{ borderColor: scoreBarColor(score), color: scoreBarColor(score) }}>{label}</span>;
}

export default function OpportunityMatcher({ results }: { results: Opportunity[] }) {
  const [expanded, setExpanded] = React.useState<number | null>(null);

  return (
    <motion.section id="results-section" className="max-w-4xl mx-auto px-4 py-12" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}>
      <div className="flex items-center gap-3 mb-6">
        <span className="text-2xl">🎯</span>
        <h2 className="text-3xl md:text-4xl" style={{ fontFamily: "var(--font-heading)", color: "var(--ink-dark)" }}>
          Smart <span className="highlight-blue">Matches</span>
        </h2>
      </div>

      <div className="space-y-5">
        {results.map((opp, idx) => {
          const score = opp.score ?? 0;
          const isOpen = expanded === idx;

          return (
            <motion.div
              key={idx}
              className="sketch-card cursor-pointer"
              style={{ borderColor: idx === 0 ? "var(--marker-blue)" : idx === 1 ? "var(--marker-green)" : "var(--ink-light)" }}
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.12 }}
              onClick={() => setExpanded(isOpen ? null : idx)}
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-lg font-bold" style={{ fontFamily: "var(--font-handwritten)", color: "var(--marker-blue)" }}>#{idx + 1}</span>
                    <h3 className="text-xl truncate" style={{ fontFamily: "var(--font-heading)", color: "var(--ink-dark)" }}>{opp.title}</h3>
                  </div>
                  <p className="text-sm" style={{ fontFamily: "var(--font-body)", color: "var(--ink-light)" }}>
                    {opp.company} · {opp.location ?? "India"} · {opp.type ?? "job"}
                  </p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <ScoreTag score={score} />
                  <span className="text-3xl font-bold" style={{ fontFamily: "var(--font-handwritten)", color: scoreBarColor(score) }}>{score}</span>
                </div>
              </div>

              <div className="mt-3 score-bar-track">
                <motion.div className="score-bar-fill" style={{ background: scoreBarColor(score) }} initial={{ width: 0 }} animate={{ width: `${Math.min(score, 100)}%` }} transition={{ duration: 1.2, ease: "easeOut", delay: idx * 0.15 + 0.3 }} />
              </div>

              <AnimatePresence>
                {isOpen && (
                  <motion.div className="mt-4 pt-4 space-y-3" style={{ borderTop: "1.5px dashed var(--paper-lines)" }} initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
                    {opp.reason && (
                      <div className="p-3 rounded-lg" style={{ background: "var(--highlight-blue)", borderLeft: "3px solid var(--marker-blue)" }}>
                        <p className="text-xs uppercase tracking-wider mb-1" style={{ color: "var(--pencil-gray)", fontFamily: "var(--font-alt)" }}>Why this fits you</p>
                        <p style={{ fontFamily: "var(--font-body)", color: "var(--ink-medium)" }}>{opp.reason}</p>
                      </div>
                    )}
                    {opp.matched_skills && opp.matched_skills.length > 0 && (
                      <div>
                        <p className="text-xs uppercase tracking-wider mb-1" style={{ color: "var(--pencil-gray)", fontFamily: "var(--font-alt)" }}>✅ Skills you already have</p>
                        <div className="flex flex-wrap gap-2">
                          {opp.matched_skills.map((s) => <span key={s} className="sketch-tag" style={{ borderColor: "var(--marker-green)", color: "var(--marker-green)" }}>{s}</span>)}
                        </div>
                      </div>
                    )}
                    {opp.missing_skills && opp.missing_skills.length > 0 && (
                      <div>
                        <p className="text-xs uppercase tracking-wider mb-1" style={{ color: "var(--pencil-gray)", fontFamily: "var(--font-alt)" }}>📌 Skills to learn next</p>
                        <div className="flex flex-wrap gap-2">
                          {opp.missing_skills.map((s) => <span key={s} className="sketch-tag" style={{ borderColor: "var(--marker-red)", color: "var(--marker-red)" }}>{s}</span>)}
                        </div>
                      </div>
                    )}
                    {opp.confidence && (
                      <p className="text-sm" style={{ fontFamily: "var(--font-alt)", color: "var(--pencil-gray)" }}>
                        AI Confidence: <span style={{ color: confidenceColor(opp.confidence), fontWeight: 700 }}>{opp.confidence.toUpperCase()}</span>
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <p className="text-xs mt-2 text-right" style={{ fontFamily: "var(--font-alt)", color: "var(--pencil-gray)" }}>
                {isOpen ? "▲ click to collapse" : "▼ click to see AI reasoning"}
              </p>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}
