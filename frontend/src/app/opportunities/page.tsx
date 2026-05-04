"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import GuidedForm from "@/components/GuidedForm";
import VoiceInput from "@/components/VoiceInput";
import ProfileDashboard from "@/components/ProfileDashboard";
import OpportunityMatcher from "@/components/OpportunityMatcher";
import SkillGapSection from "@/components/SkillGapSection";
import HelpMatcherSection from "@/components/HelpMatcherSection";
import CareerCoach from "@/components/CareerCoach";

import SaveResults from "@/components/SaveResults";
import { useAuth } from "@/hooks/useAuth";

interface Profile { skills: string[]; skill_score: number; year: string; goal: string; domain?: string; level?: string; raw: string; extraction_method?: string; }
interface Opportunity { title: string; company: string; location?: string; type?: string; score?: number; matched_skills?: string[]; missing_skills?: string[]; reason?: string; confidence?: string; }
interface Helper { name?: string; skills: string[]; topic?: string; availability?: string; match_percent?: number; }
interface Narrative { summary: string; gap_insight: string; action_plan: string[]; encouragement: string; method?: string; }
interface PipelineStep { step: number; name: string; method: string; latency_ms: number; success: boolean; output_preview: string; }
interface PipelineData { steps: PipelineStep[]; total_latency_ms: number; llm_calls: number; model: string; tier: string; cost_usd: number; inference_location: string; }
interface ApiResponse { profile: Profile; results: Opportunity[]; helpers: Helper[]; narrative: Narrative; pipeline: PipelineData; }

function WavyDivider() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-2">
      <svg width="100%" height="14" viewBox="0 0 800 14" preserveAspectRatio="none" fill="none">
        <path d="M0 7 Q50 2, 100 7 T200 7 T300 7 T400 7 T500 7 T600 7 T700 7 T800 7" stroke="var(--paper-lines)" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  );
}

const LOADING_STEPS = [
  { emoji: "🧠", text: "Step 1: Qwen 0.5B is extracting your profile..." },
  { emoji: "🔍", text: "Step 2: Generating smart search queries..." },
  { emoji: "📡", text: "Step 3: Fetching real opportunities from data..." },
  { emoji: "⚡", text: "Step 4: Scoring each match (5 LLM calls)..." },
  { emoji: "🪞", text: "Step 5: Writing your Career Mirror narrative..." },
  { emoji: "🤝", text: "Step 6: Finding your peer helpers..." },
];

export default function OpportunitiesPage() {
  const { user, loading: authLoading } = useAuth(true);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [inputMode, setInputMode] = useState<"form" | "voice">("form");
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const [loadingStep, setLoadingStep] = useState(0);

  // Cycle through loading steps for UX feedback
  useEffect(() => {
    if (!isLoading) { setLoadingStep(0); return; }
    const iv = setInterval(() => {
      setLoadingStep((p) => (p < LOADING_STEPS.length - 1 ? p + 1 : p));
    }, 2800);
    return () => clearInterval(iv);
  }, [isLoading]);

  async function handleSubmit(text: string) {
    if (!text.trim()) return;
    setIsLoading(true);
    setError(null);
    setData(null);
    setLoadingStep(0);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${apiUrl}/api/match`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (res.status === 429) throw new Error("Too many requests! Please wait 60 seconds before trying again.");
      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const json: ApiResponse = await res.json();
      setData(json);
      setTimeout(() => document.getElementById("results-anchor")?.scrollIntoView({ behavior: "smooth" }), 200);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not connect to the AlignX backend. Make sure it is running on port 8000.");
    } finally {
      setIsLoading(false);
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--paper-bg)" }}>
        <div className="text-center">
          <div className="sketch-spinner mx-auto mb-4" />
          <p style={{ fontFamily: "var(--font-handwritten)", color: "var(--marker-blue)", fontSize: "1.3rem" }}>Checking your account...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <>
      <Navbar />
      <main className="pt-20 pb-20">
        <div className="max-w-3xl mx-auto px-4">
          <motion.div className="text-center mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl mb-3" style={{ fontFamily: "var(--font-heading)", color: "var(--ink-dark)" }}>
              Hey {user.name}!{" "}
              <span className="highlight-yellow">Describe Yourself</span> 🎓
            </h1>
            <p className="text-lg max-w-xl mx-auto mb-5" style={{ fontFamily: "var(--font-body)", color: "var(--ink-light)" }}>
              No resume needed. AlignX runs a 6-step AI pipeline on Qwen 0.5B to find your best career matches.
            </p>

            {/* Input mode toggle */}
            <div className="inline-flex items-center gap-1 p-1 sketch-card !py-1 !px-1">
              {(["form", "voice"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setInputMode(m)}
                  className="px-4 py-2 text-sm transition-all"
                  style={{
                    fontFamily: "var(--font-alt)",
                    borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px",
                    background: inputMode === m ? "var(--marker-blue)" : "transparent",
                    color: inputMode === m ? "white" : "var(--ink-light)",
                  }}
                >
                  {m === "form" ? "📝 Step-by-step form" : "🎙️ Voice interview"}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Form or Voice */}
          <AnimatePresence mode="wait">
            {inputMode === "form" ? (
              <motion.div key="form" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <GuidedForm onSubmit={handleSubmit} isLoading={isLoading} />
              </motion.div>
            ) : (
              <motion.div key="voice" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <VoiceInput
                  onTranscript={setVoiceTranscript}
                  onSubmit={handleSubmit}
                  isLoading={isLoading}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                className="sketch-card mt-6"
                style={{ borderColor: "var(--marker-red)", background: "rgba(216,90,90,0.05)" }}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              >
                <p style={{ fontFamily: "var(--font-body)", color: "var(--marker-red)" }}>⚠️ {error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                className="sketch-card mt-10 text-center py-10"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              >
                <div className="sketch-spinner mx-auto mb-5" />
                <AnimatePresence mode="wait">
                  <motion.div
                    key={loadingStep}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <p className="text-3xl mb-2">{LOADING_STEPS[loadingStep].emoji}</p>
                    <p className="text-xl" style={{ fontFamily: "var(--font-handwritten)", color: "var(--marker-blue)" }}>
                      {LOADING_STEPS[loadingStep].text}
                    </p>
                  </motion.div>
                </AnimatePresence>
                <p className="text-sm mt-4" style={{ fontFamily: "var(--font-alt)", color: "var(--pencil-gray)" }}>
                  Qwen 2.5 0.5B · Running locally · ₹0 cost · Please wait 10–20 seconds
                </p>
                <div className="flex justify-center gap-1.5 mt-5">
                  {LOADING_STEPS.map((_, i) => (
                    <div
                      key={i}
                      className="w-2 h-2 rounded-full transition-all duration-300"
                      style={{ background: i <= loadingStep ? "var(--marker-blue)" : "var(--paper-lines)" }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Results */}
        <div id="results-anchor" />
        <AnimatePresence>
          {data && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

              {/* Success banner */}
              <div className="max-w-3xl mx-auto px-4 mt-8">
                <div className="p-4 sketch-card sketch-border-green text-center">
                  <p className="text-xl" style={{ fontFamily: "var(--font-handwritten)", color: "var(--marker-green)" }}>
                    🎉 Done! Qwen 0.5B ran {data.pipeline?.llm_calls ?? "?"} LLM calls in {((data.pipeline?.total_latency_ms ?? 0) / 1000).toFixed(1)}s for ₹0. Scroll down!
                  </p>
                </div>

                {/* Save Results Banner — right after success */}
                <div className="mt-4">
                  <SaveResults data={data} userEmail={user.email} />
                </div>
              </div>

              {/* Pipeline status hidden — results shown directly */}
              <ProfileDashboard profile={data.profile} />

              <WavyDivider />
              <OpportunityMatcher results={data.results} />

              <WavyDivider />
              {data.narrative && <CareerCoach narrative={data.narrative} userName={user.name} />}

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
