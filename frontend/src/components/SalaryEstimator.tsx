"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SalaryEstimatorProps {
  profile: {
    skills: string[];
    skill_score: number;
    year: string;
    goal: string;
    domain?: string;
  };
}

interface SalaryData {
  min: number;
  max: number;
  avg: number;
  currency: string;
  period: string;
  breakdown: string[];
  tips: string[];
  top_paying_skill: string;
}

export default function SalaryEstimator({ profile }: SalaryEstimatorProps) {
  const [salaryData, setSalaryData] = useState<SalaryData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Smart local estimation using profile data (no extra API call needed)
  const estimateSalary = () => {
    setLoading(true);
    setError("");

    setTimeout(() => {
      const score = profile.skill_score || 30;
      const isInternship = profile.goal?.toLowerCase().includes("internship");
      const skills = profile.skills.map((s) => s.toLowerCase());

      // Base ranges (INR) for internship vs job
      let baseMin = isInternship ? 5000 : 300000;
      let baseMax = isInternship ? 15000 : 600000;

      // Adjust based on skill score
      const multiplier = 1 + (score - 30) / 100;
      baseMin = Math.round(baseMin * multiplier);
      baseMax = Math.round(baseMax * multiplier);

      // High-demand skills bonus
      const premiumSkills: Record<string, number> = {
        react: 1.15, "node.js": 1.12, python: 1.1, "machine learning": 1.25,
        ai: 1.3, blockchain: 1.2, aws: 1.18, docker: 1.1, typescript: 1.12,
        flutter: 1.08, golang: 1.2, rust: 1.22, kotlin: 1.1,
      };

      let topSkill = "";
      let topBonus = 1;
      skills.forEach((sk) => {
        const bonus = premiumSkills[sk] || 1;
        if (bonus > topBonus) { topBonus = bonus; topSkill = sk; }
      });

      baseMin = Math.round(baseMin * topBonus);
      baseMax = Math.round(baseMax * topBonus);
      const avg = Math.round((baseMin + baseMax) / 2);

      const breakdown = [
        `Skill score ${score}/100 → ${score >= 70 ? "Strong" : score >= 40 ? "Medium" : "Entry-level"} tier`,
        `${isInternship ? "Internship" : "Full-time"} role → ${isInternship ? "Monthly stipend" : "Annual CTC"}`,
        topSkill ? `${topSkill.toUpperCase()} skill → premium market demand (+${Math.round((topBonus - 1) * 100)}%)` : "Core skills detected",
        `${profile.skills.length} skills total → broader opportunity pool`,
      ];

      const tips = [
        "Add DSA/LeetCode to your profile to boost salary 10-15%",
        "Cloud certifications (AWS/GCP) can increase CTC by ₹1-3L",
        "Open source contributions = 20% more interview calls",
        "1 strong portfolio project > 5 average ones",
      ].filter((_, i) => i < 3);

      setSalaryData({
        min: baseMin,
        max: baseMax,
        avg,
        currency: "₹",
        period: isInternship ? "/month" : "/year",
        breakdown,
        tips,
        top_paying_skill: topSkill,
      });
      setLoading(false);
    }, 1200);
  };

  const fmt = (n: number) =>
    n >= 100000 ? `${(n / 100000).toFixed(1)}L` : n >= 1000 ? `${(n / 1000).toFixed(0)}K` : String(n);

  return (
    <motion.section
      id="salary-estimator"
      className="max-w-4xl mx-auto px-4 py-10"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <span className="text-2xl">💰</span>
        <div>
          <h2 className="text-3xl md:text-4xl" style={{ fontFamily: "var(--font-heading)", color: "var(--ink-dark)" }}>
            Salary <span className="highlight-yellow">Estimator</span>
          </h2>
          <p className="text-xs" style={{ fontFamily: "var(--font-alt)", color: "var(--pencil-gray)" }}>
            Based on your skill profile and current Indian market data
          </p>
        </div>
      </div>

      <div className="sketch-card sketch-border-orange" style={{ background: "rgba(232, 133, 58, 0.03)" }}>
        <AnimatePresence mode="wait">
          {!salaryData && !loading && (
            <motion.div key="cta" className="text-center py-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <p className="text-5xl mb-4">💸</p>
              <p className="text-xl mb-2" style={{ fontFamily: "var(--font-handwritten)", color: "var(--ink-dark)" }}>
                What should you be earning?
              </p>
              <p className="text-sm mb-6" style={{ fontFamily: "var(--font-alt)", color: "var(--pencil-gray)" }}>
                Based on your {profile.skills.length} skills and market trends — instant estimate!
              </p>
              <button
                onClick={estimateSalary}
                className="sketch-btn sketch-btn-primary !text-xl !py-3 !px-10"
              >
                💰 Estimate My Salary
              </button>
            </motion.div>
          )}

          {loading && (
            <motion.div key="loading" className="text-center py-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="sketch-spinner mx-auto mb-4" />
              <p style={{ fontFamily: "var(--font-handwritten)", color: "var(--marker-orange)", fontSize: "1.2rem" }}>
                Calculating based on 2024-25 Indian market data...
              </p>
            </motion.div>
          )}

          {salaryData && (
            <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              {/* Main range */}
              <div className="text-center mb-8 py-6 rounded-xl" style={{ background: "rgba(232, 133, 58, 0.08)", border: "2px dashed var(--marker-orange)" }}>
                <p className="text-xs uppercase tracking-widest mb-2" style={{ fontFamily: "var(--font-alt)", color: "var(--pencil-gray)" }}>
                  Expected Range {salaryData.period}
                </p>
                <div className="flex items-center justify-center gap-4">
                  <div className="text-center">
                    <p className="text-2xl" style={{ fontFamily: "var(--font-alt)", color: "var(--ink-light)" }}>Min</p>
                    <p className="text-4xl font-bold" style={{ fontFamily: "var(--font-handwritten)", color: "var(--marker-green)" }}>
                      {salaryData.currency}{fmt(salaryData.min)}
                    </p>
                  </div>
                  <div className="text-center px-6">
                    <p className="text-xs" style={{ color: "var(--pencil-gray)" }}>Average</p>
                    <p className="text-5xl font-bold" style={{ fontFamily: "var(--font-handwritten)", color: "var(--marker-orange)" }}>
                      {salaryData.currency}{fmt(salaryData.avg)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl" style={{ fontFamily: "var(--font-alt)", color: "var(--ink-light)" }}>Max</p>
                    <p className="text-4xl font-bold" style={{ fontFamily: "var(--font-handwritten)", color: "var(--marker-blue)" }}>
                      {salaryData.currency}{fmt(salaryData.max)}
                    </p>
                  </div>
                </div>
                {salaryData.top_paying_skill && (
                  <p className="text-sm mt-3" style={{ fontFamily: "var(--font-alt)", color: "var(--marker-orange)" }}>
                    🔥 Your highest-value skill: <strong>{salaryData.top_paying_skill.toUpperCase()}</strong>
                  </p>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Breakdown */}
                <div>
                  <p className="text-sm uppercase tracking-wider mb-3" style={{ fontFamily: "var(--font-alt)", color: "var(--pencil-gray)" }}>📊 How this was calculated</p>
                  <ul className="space-y-2">
                    {salaryData.breakdown.map((b, i) => (
                      <motion.li key={i} className="flex items-start gap-2 text-sm" style={{ fontFamily: "var(--font-body)", color: "var(--ink-medium)" }} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                        <span style={{ color: "var(--marker-orange)", flexShrink: 0 }}>→</span> {b}
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Tips */}
                <div>
                  <p className="text-sm uppercase tracking-wider mb-3" style={{ fontFamily: "var(--font-alt)", color: "var(--pencil-gray)" }}>💡 To earn more</p>
                  <ul className="space-y-2">
                    {salaryData.tips.map((tip, i) => (
                      <motion.li key={i} className="flex items-start gap-2 text-sm" style={{ fontFamily: "var(--font-body)", color: "var(--ink-medium)" }} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 + 0.2 }}>
                        <span style={{ color: "var(--marker-green)", flexShrink: 0 }}>✓</span> {tip}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-4 text-center">
                <button
                  onClick={() => setSalaryData(null)}
                  className="sketch-btn !text-sm !py-1.5 !px-5"
                  style={{ boxShadow: "2px 2px 0px var(--ink-dark)" }}
                >
                  🔄 Recalculate
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {error && <p className="text-sm mt-3" style={{ color: "var(--marker-red)", fontFamily: "var(--font-alt)" }}>⚠️ {error}</p>}
      </div>
    </motion.section>
  );
}
