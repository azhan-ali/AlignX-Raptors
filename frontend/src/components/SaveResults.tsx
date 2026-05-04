"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface SaveResultsProps {
  data: {
    profile: { skills: string[]; skill_score: number; year: string; goal: string; };
    results: { title: string; company: string; score?: number; reason?: string; matched_skills?: string[]; missing_skills?: string[]; }[];
    narrative?: { summary: string; gap_insight: string; action_plan: string[]; encouragement: string; };
  };
  userEmail: string;
}

export default function SaveResults({ data, userEmail }: SaveResultsProps) {
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const saveToHistory = () => {
    const key = `alignx_history_${userEmail}`;
    const history = JSON.parse(localStorage.getItem(key) || "[]");
    const entry = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
      time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      profile: data.profile,
      topResult: data.results[0] || null,
      totalResults: data.results.length,
      narrative: data.narrative,
    };
    history.unshift(entry);
    // keep only last 10
    localStorage.setItem(key, JSON.stringify(history.slice(0, 10)));
    setSaved(true);
  };

  const copyShareLink = () => {
    const shareData = {
      skills: data.profile.skills.slice(0, 5),
      score: data.profile.skill_score,
      goal: data.profile.goal,
      topMatch: data.results[0]?.title || "N/A",
    };
    const encoded = btoa(JSON.stringify(shareData));
    const url = `${window.location.origin}/share?d=${encoded}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <motion.div
      className="sketch-card sketch-border-green flex flex-col sm:flex-row items-center gap-4 justify-between"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div>
        <p className="text-lg font-bold" style={{ fontFamily: "var(--font-heading)", color: "var(--ink-dark)" }}>
          💾 Save these results to your Dashboard
        </p>
        <p className="text-sm" style={{ fontFamily: "var(--font-alt)", color: "var(--pencil-gray)" }}>
          View them later, track progress, and compare over time.
        </p>
      </div>
      <div className="flex gap-3 flex-shrink-0">
        <AnimatePresence mode="wait">
          {saved ? (
            <motion.span
              key="saved"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="sketch-btn !text-sm !py-2 !px-4"
              style={{ borderColor: "var(--marker-green)", color: "var(--marker-green)" }}
            >
              ✅ Saved!
            </motion.span>
          ) : (
            <motion.button
              key="save"
              onClick={saveToHistory}
              className="sketch-btn sketch-btn-primary !text-sm !py-2 !px-4"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              💾 Save to Dashboard
            </motion.button>
          )}
        </AnimatePresence>

        <motion.button
          onClick={copyShareLink}
          className="sketch-btn !text-sm !py-2 !px-4"
          style={{
            borderColor: copied ? "var(--marker-green)" : "var(--marker-purple)",
            color: copied ? "var(--marker-green)" : "var(--marker-purple)",
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {copied ? "🔗 Link Copied!" : "🔗 Share Results"}
        </motion.button>
      </div>
    </motion.div>
  );
}
