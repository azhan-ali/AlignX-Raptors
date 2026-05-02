"use client";

import React from "react";
import { motion } from "framer-motion";

interface Opportunity { title: string; company: string; score?: number; missing_skills?: string[]; }

const SKILL_RESOURCES: Record<string, { resource: string; time: string }> = {
  react: { resource: "React Docs (free)", time: "2 weeks" },
  "react.js": { resource: "React Docs (free)", time: "2 weeks" },
  node: { resource: "The Odin Project (free)", time: "1 week" },
  "node.js": { resource: "The Odin Project (free)", time: "1 week" },
  python: { resource: "Python.org Tutorial (free)", time: "1 week" },
  ml: { resource: "Kaggle Learn (free)", time: "3 weeks" },
  ai: { resource: "fast.ai (free)", time: "4 weeks" },
  pandas: { resource: "Kaggle Learn (free)", time: "1 week" },
  numpy: { resource: "Kaggle Learn (free)", time: "1 week" },
  sql: { resource: "SQLBolt (free)", time: "3 days" },
  java: { resource: "MOOC.fi (free)", time: "3 weeks" },
  dsa: { resource: "NeetCode (free)", time: "4 weeks" },
  javascript: { resource: "JavaScript.info (free)", time: "2 weeks" },
  typescript: { resource: "TypeScript Handbook (free)", time: "1 week" },
  git: { resource: "Git Handbook (free)", time: "2 days" },
  docker: { resource: "Docker Docs (free)", time: "3 days" },
  css: { resource: "CSS Tricks (free)", time: "1 week" },
  html: { resource: "MDN Web Docs (free)", time: "3 days" },
  django: { resource: "Django Tutorial (free)", time: "2 weeks" },
  flask: { resource: "Flask Mega-Tutorial (free)", time: "1 week" },
};

export default function SkillGapSection({ results, profileSkills }: { results: Opportunity[]; profileSkills: string[] }) {
  const gapMap = new Map<string, number>();
  results.forEach((r) => {
    (r.missing_skills ?? []).forEach((skill) => {
      const sk = skill.toLowerCase().trim();
      if (sk && !profileSkills.includes(sk)) gapMap.set(sk, (gapMap.get(sk) || 0) + 1);
    });
  });

  const gaps = Array.from(gapMap.entries())
    .map(([skill, count]) => ({ skill, unlocks: count, ...(SKILL_RESOURCES[skill] ?? { resource: "Search online (free)", time: "~1–2 weeks" }) }))
    .sort((a, b) => b.unlocks - a.unlocks)
    .slice(0, 5);

  const currentEligible = results.filter((r) => (r.score ?? 0) >= 50).length;
  const potentialTotal = currentEligible + gaps.reduce((s, g) => s + g.unlocks, 0);

  if (gaps.length === 0) return null;

  return (
    <motion.section id="skillgap-section" className="max-w-4xl mx-auto px-4 py-12" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
      <div className="flex items-center gap-3 mb-6">
        <span className="text-2xl">🔓</span>
        <h2 className="text-3xl md:text-4xl" style={{ fontFamily: "var(--font-heading)", color: "var(--ink-dark)" }}>
          Skill <span className="highlight-green">Growth Path</span>
        </h2>
      </div>

      <div className="sketch-card sketch-border-green">
        <div className="p-3 mb-5 rounded-lg" style={{ background: "var(--highlight-green)", borderLeft: "3px solid var(--marker-green)" }}>
          <p style={{ fontFamily: "var(--font-body)", color: "var(--ink-medium)" }}>
            You currently qualify for{" "}
            <strong style={{ color: "var(--marker-blue)" }}>{currentEligible}</strong> opportunities.
            Learn the skills below to unlock up to{" "}
            <strong style={{ color: "var(--marker-green)" }}>{potentialTotal}</strong> total!
          </p>
        </div>

        <div className="space-y-4">
          {gaps.map((g, idx) => (
            <motion.div key={g.skill} className="flex items-center gap-4 flex-wrap" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 + 0.4 }}>
              <div className="flex items-center gap-2 min-w-[160px]">
                <span style={{ fontFamily: "var(--font-handwritten)", fontSize: "1.3rem", color: "var(--marker-blue)" }}>+ {g.skill}</span>
              </div>
              <svg width="40" height="14" viewBox="0 0 40 14" fill="none" className="flex-shrink-0 hidden sm:block">
                <path d="M2 7 Q10 3, 20 7 T38 7" stroke="var(--pencil-gray)" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M32 3 L38 7 L32 11" stroke="var(--pencil-gray)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
              <span className="sketch-tag !text-sm" style={{ borderColor: "var(--marker-green)", color: "var(--marker-green)" }}>
                🔓 +{g.unlocks} {g.unlocks === 1 ? "opportunity" : "opportunities"}
              </span>
              <span className="text-sm" style={{ fontFamily: "var(--font-alt)", color: "var(--pencil-gray)" }}>
                📖 {g.resource} · ⏱ {g.time}
              </span>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 pt-4" style={{ borderTop: "1.5px dashed var(--paper-lines)" }}>
          <p className="text-center text-lg" style={{ fontFamily: "var(--font-handwritten)", color: "var(--marker-green)" }}>
            ✨ Go from {currentEligible} → {potentialTotal} opportunities with just a few weeks of learning!
          </p>
        </div>
      </div>
    </motion.section>
  );
}
