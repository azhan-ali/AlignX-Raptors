"use client";

import React from "react";
import { motion } from "framer-motion";

/* ── tiny inline SVG doodles ───────────────────────────── */
const Arrow = () => (
  <svg width="60" height="30" viewBox="0 0 60 30" fill="none" className="inline-block mx-1">
    <path d="M2 15 Q15 5, 30 15 T58 15" stroke="var(--marker-blue)" strokeWidth="2" strokeLinecap="round" fill="none" />
    <path d="M50 10 L58 15 L50 20" stroke="var(--marker-blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

const Sparkle = ({ className = "" }: { className?: string }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" className={`inline-block ${className}`}>
    <path d="M10 0 L12 8 L20 10 L12 12 L10 20 L8 12 L0 10 L8 8 Z" fill="var(--marker-yellow)" />
  </svg>
);

const Squiggle = () => (
  <svg width="120" height="12" viewBox="0 0 120 12" className="block mx-auto my-4" fill="none">
    <path d="M2 6 Q10 2, 20 6 T40 6 T60 6 T80 6 T100 6 T118 6" stroke="var(--pencil-gray)" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

/* ── The component ─────────────────────────────────────── */
interface HeroSectionProps {
  onSubmit: (text: string) => void;
  isLoading: boolean;
}

export default function HeroSection({ onSubmit, isLoading }: HeroSectionProps) {
  const [inputText, setInputText] = React.useState("");

  const handleSubmit = () => {
    if (inputText.trim()) onSubmit(inputText.trim());
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-16">
      {/* Decorative doodles */}
      <motion.div
        className="absolute top-12 left-8 opacity-30 hidden md:block"
        animate={{ rotate: [0, 5, -5, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
      >
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          <circle cx="40" cy="40" r="35" stroke="var(--marker-orange)" strokeWidth="2" strokeDasharray="8 6" />
          <circle cx="40" cy="40" r="20" stroke="var(--marker-orange)" strokeWidth="1.5" strokeDasharray="4 4" />
        </svg>
      </motion.div>

      <motion.div
        className="absolute top-20 right-12 opacity-25 hidden md:block"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
          <rect x="5" y="5" width="50" height="50" rx="2" stroke="var(--marker-purple)" strokeWidth="2" strokeDasharray="6 4" transform="rotate(12 30 30)" />
        </svg>
      </motion.div>

      <motion.div
        className="absolute bottom-24 left-16 opacity-20 hidden md:block"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <Sparkle />
      </motion.div>

      {/* ── Main Content ── */}
      <motion.div
        className="max-w-3xl w-full text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Tiny label */}
        <motion.p
          className="text-[var(--ink-light)] text-lg mb-3"
          style={{ fontFamily: "var(--font-alt)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Sparkle className="mr-1" /> powered by tiny AI <Sparkle className="ml-1" />
        </motion.p>

        {/* Headline */}
        <h1
          className="text-5xl md:text-7xl font-bold leading-tight mb-2"
          style={{ fontFamily: "var(--font-heading)", color: "var(--ink-dark)" }}
        >
          Align
          <span style={{ color: "var(--marker-blue)" }}>X</span>
        </h1>

        <motion.p
          className="text-2xl md:text-3xl mt-2 mb-1"
          style={{ fontFamily: "var(--font-handwritten)", color: "var(--ink-medium)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Find Your <span className="highlight-yellow">True Career Path</span> &{" "}
          <span className="highlight-blue">Community</span>
        </motion.p>

        <motion.p
          className="text-base md:text-lg mb-8 max-w-xl mx-auto"
          style={{ fontFamily: "var(--font-body)", color: "var(--ink-light)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Tell us about yourself — skills, goals, year — and our tiny AI will match you with real
          internships, show proof, find your skill gaps, and connect you with peers who can help.
        </motion.p>

        <Squiggle />

        {/* ── Input Area ── */}
        <motion.div
          className="mt-6 sketch-card max-w-2xl mx-auto"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          {/* Little tab label */}
          <div
            className="absolute -top-5 left-6 px-3 py-1 text-sm"
            style={{
              fontFamily: "var(--font-alt)",
              color: "var(--marker-blue)",
              background: "var(--paper-bg)",
              border: "1.5px solid var(--marker-blue)",
              borderRadius: "8px 8px 0 0",
            }}
          >
            ✏️ describe yourself
          </div>

          <textarea
            id="hero-input"
            className="sketch-textarea w-full"
            rows={4}
            placeholder={`Example: "Python, web dev jaanta hoon, 2nd year CSE, ML internship chahiye, remote prefer karta hoon..."`}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />

          <div className="flex items-center justify-between mt-5 flex-wrap gap-3">
            <p
              className="text-sm"
              style={{ fontFamily: "var(--font-alt)", color: "var(--pencil-gray)" }}
            >
              <Arrow /> press the button or hit Enter
            </p>

            <button
              id="align-me-btn"
              className="sketch-btn sketch-btn-primary"
              onClick={handleSubmit}
              disabled={isLoading || !inputText.trim()}
              style={{ opacity: isLoading || !inputText.trim() ? 0.6 : 1 }}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="sketch-spinner inline-block !w-5 !h-5 !border-2" />
                  Aligning...
                </span>
              ) : (
                "✨ Align Me!"
              )}
            </button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="flex items-center justify-center gap-6 mt-10 flex-wrap"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          {[
            { num: "100+", label: "Real Opportunities" },
            { num: "₹0", label: "Total Cost" },
            { num: "0.5B", label: "Tiny Model" },
          ].map((s) => (
            <div key={s.label} className="text-center px-4">
              <p
                className="text-2xl font-bold"
                style={{ fontFamily: "var(--font-handwritten)", color: "var(--marker-blue)" }}
              >
                {s.num}
              </p>
              <p className="text-sm" style={{ color: "var(--ink-light)", fontFamily: "var(--font-alt)" }}>
                {s.label}
              </p>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
