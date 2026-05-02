"use client";

import React from "react";
import { motion } from "framer-motion";

interface Profile {
  skills: string[];
  skill_score: number;
  year: string;
  goal: string;
  raw: string;
}

function SketchCircleScore({ score }: { score: number }) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 70 ? "var(--marker-green)" : score >= 40 ? "var(--marker-orange)" : "var(--marker-red)";

  return (
    <div className="relative w-32 h-32 flex-shrink-0">
      <svg width="128" height="128" viewBox="0 0 128 128" className="transform -rotate-90">
        <circle cx="64" cy="64" r={radius} fill="none" stroke="var(--paper-lines)" strokeWidth="8" strokeDasharray="6 4" />
        <motion.circle cx="64" cy="64" r={radius} fill="none" stroke={color} strokeWidth="8" strokeLinecap="round" strokeDasharray={circumference} initial={{ strokeDashoffset: circumference }} animate={{ strokeDashoffset: offset }} transition={{ duration: 1.4, ease: "easeOut" }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold" style={{ fontFamily: "var(--font-handwritten)", color }}>{score}</span>
        <span className="text-xs" style={{ fontFamily: "var(--font-alt)", color: "var(--ink-light)" }}>/ 100</span>
      </div>
    </div>
  );
}

export default function ProfileDashboard({ profile }: { profile: Profile }) {
  return (
    <motion.section id="profile-section" className="max-w-4xl mx-auto px-4 py-12" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      <div className="flex items-center gap-3 mb-6">
        <span className="text-2xl">📋</span>
        <h2 className="text-3xl md:text-4xl" style={{ fontFamily: "var(--font-heading)", color: "var(--ink-dark)" }}>
          Your <span className="highlight-yellow">AI Profile</span>
        </h2>
      </div>

      <div className="sketch-card flex flex-col md:flex-row items-start gap-8">
        <div className="flex flex-col items-center gap-2">
          <SketchCircleScore score={profile.skill_score} />
          <p className="text-sm" style={{ fontFamily: "var(--font-alt)", color: "var(--ink-light)" }}>Profile Strength</p>
        </div>

        <div className="flex-1 space-y-5">
          <div>
            <p className="text-sm mb-2 uppercase tracking-wider" style={{ fontFamily: "var(--font-alt)", color: "var(--pencil-gray)" }}>Detected Skills</p>
            <div className="flex flex-wrap gap-2">
              {profile.skills.length ? (
                profile.skills.map((s) => (
                  <motion.span key={s} className="sketch-tag" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 400, damping: 15 }}>{s}</motion.span>
                ))
              ) : (
                <span className="text-sm italic" style={{ color: "var(--pencil-gray)" }}>No skills detected — try adding more detail to your profile!</span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-6">
            <div>
              <p className="text-xs uppercase tracking-wider" style={{ color: "var(--pencil-gray)", fontFamily: "var(--font-alt)" }}>Goal</p>
              <p className="text-xl" style={{ fontFamily: "var(--font-handwritten)", color: "var(--marker-blue)" }}>🎯 {profile.goal}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider" style={{ color: "var(--pencil-gray)", fontFamily: "var(--font-alt)" }}>Year</p>
              <p className="text-xl" style={{ fontFamily: "var(--font-handwritten)", color: "var(--marker-purple)" }}>🎓 {profile.year}</p>
            </div>
          </div>

          <div className="p-3 rounded-lg text-sm italic" style={{ background: "var(--highlight-yellow)", fontFamily: "var(--font-body)", color: "var(--ink-medium)", borderLeft: "3px solid var(--marker-yellow)" }}>
            &ldquo;{profile.raw}&rdquo;
          </div>
        </div>
      </div>
    </motion.section>
  );
}
