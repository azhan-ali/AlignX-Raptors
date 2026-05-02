"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import GuidedForm from "@/components/GuidedForm";
import ProfileDashboard from "@/components/ProfileDashboard";
import OpportunityMatcher from "@/components/OpportunityMatcher";
import SkillGapSection from "@/components/SkillGapSection";
import HelpMatcherSection from "@/components/HelpMatcherSection";

interface Profile { skills: string[]; skill_score: number; year: string; goal: string; raw: string; }
interface Opportunity { title: string; company: string; location?: string; type?: string; score?: number; matched_skills?: string[]; missing_skills?: string[]; reason?: string; confidence?: string; }
interface Helper { name?: string; skills: string[]; topic?: string; availability?: string; match_percent?: number; }
interface ApiResponse { profile: Profile; results: Opportunity[]; helpers: Helper[]; }

function WavyDivider() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-2">
      <svg width="100%" height="14" viewBox="0 0 800 14" preserveAspectRatio="none" fill="none">
        <path d="M0 7 Q50 2, 100 7 T200 7 T300 7 T400 7 T500 7 T600 7 T700 7 T800 7" stroke="var(--paper-lines)" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export default function OpportunitiesPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(text: string) {
    setIsLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await fetch("http://localhost:8000/api/match", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text }) });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const json: ApiResponse = await res.json();
      setData(json);
      setTimeout(() => document.getElementById("results-anchor")?.scrollIntoView({ behavior: "smooth" }), 200);
    } catch (err) {
      console.error(err);
      setError("Could not connect to the AlignX backend. Please make sure the server is running on port 8000.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="pt-20 pb-20">
        <div className="max-w-3xl mx-auto px-4">
          <motion.div className="text-center mb-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-sm mb-2 uppercase tracking-widest" style={{ fontFamily: "var(--font-alt)", color: "var(--pencil-gray)" }}>
              ✏️ Step 1 of 1 — Tell us about yourself
            </p>
            <h1 className="text-4xl md:text-5xl mb-3" style={{ fontFamily: "var(--font-heading)", color: "var(--ink-dark)" }}>
              Describe <span className="highlight-yellow">Yourself</span> 🎓
            </h1>
            <p className="text-lg max-w-xl mx-auto" style={{ fontFamily: "var(--font-body)", color: "var(--ink-light)" }}>
              No resume needed. No perfect words needed. Fill in these 6 simple steps and AlignX will do the rest.
            </p>
          </motion.div>

          <GuidedForm onSubmit={handleSubmit} isLoading={isLoading} />

          <AnimatePresence>
            {error && (
              <motion.div className="sketch-card mt-6" style={{ borderColor: "var(--marker-red)", background: "rgba(216,90,90,0.05)" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <p style={{ fontFamily: "var(--font-body)", color: "var(--marker-red)" }}>⚠️ {error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isLoading && (
              <motion.div className="sketch-card mt-10 text-center py-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="sketch-spinner mx-auto mb-4" />
                <p className="text-xl" style={{ fontFamily: "var(--font-handwritten)", color: "var(--marker-blue)" }}>✨ Analyzing your profile...</p>
                <p className="text-sm mt-2" style={{ fontFamily: "var(--font-alt)", color: "var(--pencil-gray)" }}>
                  Fetching real jobs · Scoring with Qwen 0.5B · Finding matching peers
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div id="results-anchor" />
        <AnimatePresence>
          {data && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="max-w-3xl mx-auto px-4 mt-8">
                <div className="p-4 sketch-card sketch-border-green text-center">
                  <p className="text-xl" style={{ fontFamily: "var(--font-handwritten)", color: "var(--marker-green)" }}>
                    🎉 Match found! Scroll down to see your results.
                  </p>
                </div>
              </div>
              <ProfileDashboard profile={data.profile} />
              <WavyDivider />
              <OpportunityMatcher results={data.results} />
              <WavyDivider />
              <SkillGapSection results={data.results} profileSkills={data.profile.skills} />
              <WavyDivider />
              <HelpMatcherSection helpers={data.helpers} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </>
  );
}
