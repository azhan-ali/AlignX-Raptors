"use client";

import { motion } from "framer-motion";

interface Narrative {
  summary: string;
  gap_insight: string;
  action_plan: string[];
  encouragement: string;
  method?: string;
}

interface CareerCoachProps {
  narrative: Narrative;
  userName?: string;
}

export default function CareerCoach({ narrative, userName }: CareerCoachProps) {
  const steps = narrative.action_plan?.slice(0, 3) ?? [];

  return (
    <motion.section
      id="career-coach-section"
      className="max-w-4xl mx-auto px-4 py-10"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center gap-3 mb-5">
        <span className="text-2xl">🪞</span>
        <div>
          <h2 className="text-2xl md:text-3xl" style={{ fontFamily: "var(--font-heading)", color: "var(--ink-dark)" }}>
            Your Career Mirror
          </h2>
          <p className="text-xs" style={{ fontFamily: "var(--font-alt)", color: "var(--pencil-gray)" }}>
            Written by Qwen 2.5 0.5B — a 500M parameter model giving you real career advice
          </p>
        </div>
      </div>

      {/* Main narrative card */}
      <div className="sketch-card sketch-border-purple" style={{ background: "rgba(139,107,181,0.04)" }}>

        {/* Greeting */}
        {userName && (
          <p className="text-sm mb-3" style={{ fontFamily: "var(--font-alt)", color: "var(--pencil-gray)" }}>
            Hey {userName} 👋 — here&apos;s your honest career picture:
          </p>
        )}

        {/* Summary */}
        <motion.div
          className="p-4 mb-4 rounded-lg"
          style={{ background: "var(--highlight-yellow)", border: "2px dashed var(--marker-yellow)" }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-xs uppercase tracking-wider mb-1" style={{ fontFamily: "var(--font-alt)", color: "var(--pencil-gray)" }}>
            📊 Where you stand right now
          </p>
          <p className="text-lg leading-snug" style={{ fontFamily: "var(--font-body)", color: "var(--ink-dark)" }}>
            {narrative.summary}
          </p>
        </motion.div>

        {/* Gap Insight */}
        <motion.div
          className="p-4 mb-5 rounded-lg"
          style={{ background: "rgba(232,133,58,0.06)", border: "2px dashed var(--marker-orange)", borderLeft: "4px solid var(--marker-orange)" }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35 }}
        >
          <p className="text-xs uppercase tracking-wider mb-1" style={{ fontFamily: "var(--font-alt)", color: "var(--pencil-gray)" }}>
            🔑 The ONE thing holding you back
          </p>
          <p className="text-base" style={{ fontFamily: "var(--font-body)", color: "var(--ink-medium)" }}>
            {narrative.gap_insight}
          </p>
        </motion.div>

        {/* 3-Step Action Plan */}
        <div className="mb-5">
          <p className="text-sm uppercase tracking-wider mb-3" style={{ fontFamily: "var(--font-alt)", color: "var(--pencil-gray)" }}>
            🗺️ Your 3-step action plan
          </p>
          <div className="space-y-2">
            {steps.map((action, idx) => (
              <motion.div
                key={idx}
                className="flex items-start gap-3 p-3 rounded-lg"
                style={{ background: "rgba(255,255,255,0.6)", border: "1.5px dashed var(--paper-lines)" }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + idx * 0.12 }}
              >
                <span
                  className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold text-white"
                  style={{ background: ["var(--marker-blue)", "var(--marker-green)", "var(--marker-purple)"][idx], minWidth: "2rem" }}
                >
                  {idx + 1}
                </span>
                <p style={{ fontFamily: "var(--font-body)", color: "var(--ink-medium)", paddingTop: "0.2rem" }}>
                  {action}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Encouragement banner */}
        <motion.div
          className="text-center p-4 rounded-lg"
          style={{ background: "rgba(119,181,160,0.1)", border: "2px dashed var(--marker-green)" }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
        >
          <span className="text-2xl">💚</span>
          <p className="mt-1 text-lg" style={{ fontFamily: "var(--font-handwritten)", color: "var(--marker-green)" }}>
            {narrative.encouragement}
          </p>
        </motion.div>

        {/* Model attribution */}
        <p className="text-center text-xs mt-3" style={{ fontFamily: "var(--font-alt)", color: "var(--pencil-gray)" }}>
          ✏️ Generated by <strong>Qwen 2.5 0.5B</strong> running locally — 500M params, ₹0 cost
          {narrative.method === "fallback" && " (rule-based fallback used)"}
        </p>
      </div>
    </motion.section>
  );
}
