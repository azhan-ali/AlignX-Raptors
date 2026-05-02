"use client";

import React from "react";
import { motion } from "framer-motion";

interface Helper { name?: string; skills: string[]; topic?: string; availability?: string; match_percent?: number; }

const AVATARS = ["🧑‍💻", "👩‍🎓", "🧑‍🔬", "👨‍💻", "👩‍💻"];

export default function HelpMatcherSection({ helpers }: { helpers: Helper[] }) {
  if (!helpers || helpers.length === 0) return null;

  return (
    <motion.section id="helper-section" className="max-w-4xl mx-auto px-4 py-12 pb-20" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.45 }}>
      <div className="flex items-center gap-3 mb-6">
        <span className="text-2xl">🤝</span>
        <h2 className="text-3xl md:text-4xl" style={{ fontFamily: "var(--font-heading)", color: "var(--ink-dark)" }}>
          Community <span style={{ color: "var(--marker-purple)" }}>Help Matcher</span>
        </h2>
      </div>

      <p className="mb-6" style={{ fontFamily: "var(--font-body)", color: "var(--ink-light)" }}>
        These peers can help you with the skills you need. Connect, learn together, and grow! 🌱
      </p>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {helpers.map((h, idx) => {
          const matchPct = h.match_percent ?? 50;
          const avatar = AVATARS[idx % AVATARS.length];

          return (
            <motion.div
              key={idx}
              className="sketch-card sketch-border-purple"
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.12 + 0.5, type: "spring", stiffness: 300, damping: 20 }}
              whileHover={{ rotate: [-0.5, 0.5, -0.3, 0], transition: { duration: 0.4 } }}
            >
              <div
                className="absolute -top-3 -right-3 px-3 py-1 text-sm font-bold"
                style={{ fontFamily: "var(--font-handwritten)", background: matchPct >= 80 ? "var(--marker-green)" : matchPct >= 50 ? "var(--marker-orange)" : "var(--pencil-gray)", color: "white", borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px", border: "2px solid white", fontSize: "1.1rem" }}
              >
                {matchPct}% match
              </div>

              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl" style={{ border: "2px dashed var(--marker-purple)", background: "rgba(139, 107, 181, 0.08)" }}>
                  {avatar}
                </div>
                <div>
                  <p className="text-xl font-bold" style={{ fontFamily: "var(--font-handwritten)", color: "var(--ink-dark)" }}>{h.name ?? `Peer ${idx + 1}`}</p>
                  <p className="text-xs" style={{ fontFamily: "var(--font-alt)", color: "var(--pencil-gray)" }}>🕐 Available: {h.availability ?? "flexible"}</p>
                </div>
              </div>

              {h.topic && <p className="text-sm mb-2" style={{ fontFamily: "var(--font-body)", color: "var(--ink-medium)" }}>📚 <strong>{h.topic}</strong></p>}

              <div className="flex flex-wrap gap-1.5 mb-4">
                {h.skills.map((s) => <span key={s} className="sketch-tag !text-xs !py-0.5 !px-2" style={{ borderColor: "var(--marker-purple)", color: "var(--marker-purple)" }}>{s}</span>)}
              </div>

              <button className="sketch-btn w-full text-center !text-base !py-2" style={{ borderColor: "var(--marker-purple)", color: "var(--marker-purple)", boxShadow: "3px 3px 0px var(--marker-purple)" }}>
                🔗 Connect Now
              </button>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm" style={{ fontFamily: "var(--font-alt)", color: "var(--pencil-gray)" }}>
          💡 Skill Exchange idea: &ldquo;I&apos;ll teach you React, you teach me DSA&rdquo; — trade your strengths!
        </p>
      </div>
    </motion.section>
  );
}
