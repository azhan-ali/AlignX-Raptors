"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FormData {
  skills: string[];
  year: string;
  goal: string;
  location: string;
  domain: string;
  extra: string;
}

const YEAR_OPTIONS = [
  { value: "1st year", label: "1st Year", emoji: "🌱" },
  { value: "2nd year", label: "2nd Year", emoji: "📚" },
  { value: "3rd year", label: "3rd Year", emoji: "💻" },
  { value: "4th year", label: "4th Year", emoji: "🎓" },
  { value: "fresher", label: "Recent Graduate", emoji: "✨" },
  { value: "working professional", label: "Working Professional", emoji: "💼" },
];

const GOAL_OPTIONS = [
  { value: "internship", label: "Internship", emoji: "🏢", desc: "3–6 months of work experience" },
  { value: "full-time job", label: "Full-time Job", emoji: "💼", desc: "Permanent role" },
  { value: "freelance", label: "Freelance Work", emoji: "🌐", desc: "Project-based work" },
  { value: "research", label: "Research / Publication", emoji: "🔬", desc: "Academic research" },
  { value: "open source contribution", label: "Open Source", emoji: "🛠️", desc: "Contribute to projects" },
];

const LOCATION_OPTIONS = [
  { value: "remote", label: "Remote Only", emoji: "🏠" },
  { value: "hybrid", label: "Hybrid", emoji: "🔄" },
  { value: "on-site", label: "On-site (any city)", emoji: "🏙️" },
  { value: "Delhi NCR", label: "Delhi / NCR", emoji: "📍" },
  { value: "Mumbai", label: "Mumbai", emoji: "📍" },
  { value: "Bangalore", label: "Bangalore", emoji: "📍" },
  { value: "Hyderabad", label: "Hyderabad", emoji: "📍" },
  { value: "Pune", label: "Pune", emoji: "📍" },
];

const DOMAIN_OPTIONS = [
  { value: "web development", label: "Web Development", emoji: "🌐" },
  { value: "artificial intelligence machine learning", label: "AI / Machine Learning", emoji: "🤖" },
  { value: "mobile development android ios", label: "Mobile (Android / iOS)", emoji: "📱" },
  { value: "data science analytics", label: "Data Science", emoji: "📊" },
  { value: "cybersecurity", label: "Cybersecurity", emoji: "🔒" },
  { value: "devops cloud computing", label: "DevOps / Cloud", emoji: "☁️" },
  { value: "ui ux design", label: "UI/UX Design", emoji: "🎨" },
  { value: "game development", label: "Game Development", emoji: "🎮" },
  { value: "blockchain web3", label: "Blockchain / Web3", emoji: "⛓️" },
  { value: "backend engineering systems", label: "Backend Engineering", emoji: "⚙️" },
];

const SKILL_SUGGESTIONS = [
  "Python", "JavaScript", "React", "Node.js", "HTML", "CSS",
  "Java", "C++", "TypeScript", "Next.js", "Django", "Flask",
  "SQL", "MongoDB", "Git", "Docker", "AWS", "Figma",
  "Machine Learning", "TensorFlow", "PyTorch", "NumPy", "Pandas",
  "DSA", "System Design", "REST APIs", "GraphQL", "Kotlin", "Swift",
];

interface GuidedFormProps {
  onSubmit: (text: string, formData: FormData) => void;
  isLoading: boolean;
}

export default function GuidedForm({ onSubmit, isLoading }: GuidedFormProps) {
  const [formData, setFormData] = useState<FormData>({ skills: [], year: "", goal: "", location: "", domain: "", extra: "" });
  const [skillInput, setSkillInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const addSkill = (skill: string) => {
    const s = skill.trim();
    if (s && !formData.skills.includes(s)) {
      setFormData((p) => ({ ...p, skills: [...p.skills, s] }));
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => setFormData((p) => ({ ...p, skills: p.skills.filter((x) => x !== skill) }));

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (formData.skills.length === 0) errs.skills = "Please add at least one skill.";
    if (!formData.year) errs.year = "Please select your current year.";
    if (!formData.goal) errs.goal = "Please select what you are looking for.";
    if (!formData.domain) errs.domain = "Please select a domain.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const text = [
      formData.skills.join(", "),
      formData.year,
      formData.domain,
      formData.goal,
      formData.location && `prefer ${formData.location}`,
      formData.extra,
    ].filter(Boolean).join(", ");
    onSubmit(text, formData);
  };

  const filteredSuggestions = skillInput.length > 0
    ? SKILL_SUGGESTIONS.filter((s) => s.toLowerCase().includes(skillInput.toLowerCase()) && !formData.skills.includes(s)).slice(0, 6)
    : SKILL_SUGGESTIONS.filter((s) => !formData.skills.includes(s)).slice(0, 8);

  const SectionLabel = ({ num, label, required = false }: { num: string; label: string; required?: boolean }) => (
    <div className="flex items-center gap-3 mb-3">
      <span className="w-8 h-8 flex items-center justify-center text-sm font-bold text-white rounded-full flex-shrink-0" style={{ background: "var(--marker-blue)", fontFamily: "var(--font-handwritten)", fontSize: "1.1rem" }}>{num}</span>
      <h3 className="text-xl" style={{ fontFamily: "var(--font-heading)", color: "var(--ink-dark)" }}>
        {label} {required && <span style={{ color: "var(--marker-red)" }}>*</span>}
      </h3>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* ── 1. Skills ── */}
      <div className="sketch-card">
        <SectionLabel num="1" label="What skills do you have?" required />
        <p className="text-sm mb-4" style={{ fontFamily: "var(--font-alt)", color: "var(--pencil-gray)" }}>
          Technologies, languages, tools — anything you know. Pick from suggestions below or type your own.
        </p>

        <div className="flex flex-wrap gap-2 mb-3 min-h-[36px]">
          <AnimatePresence>
            {formData.skills.map((s) => (
              <motion.span key={s} className="sketch-tag flex items-center gap-1.5" style={{ borderColor: "var(--marker-blue)", color: "var(--marker-blue)" }} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ type: "spring", stiffness: 400 }}>
                {s}
                <button onClick={() => removeSkill(s)} className="ml-1 opacity-60 hover:opacity-100 text-lg leading-none" style={{ color: "var(--marker-red)" }}>×</button>
              </motion.span>
            ))}
          </AnimatePresence>
          {formData.skills.length === 0 && (
            <span className="text-sm italic" style={{ color: "var(--pencil-gray)", fontFamily: "var(--font-alt)" }}>No skills added yet — click one below or type your own above</span>
          )}
        </div>

        <div className="flex gap-2 mb-3">
          <input type="text" value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addSkill(skillInput); } }} placeholder="Type a skill and press Enter..." className="sketch-input flex-1" />
          <button onClick={() => addSkill(skillInput)} className="sketch-btn sketch-btn-primary !py-2 !px-4 !text-base" disabled={!skillInput.trim()}>Add +</button>
        </div>

        <div>
          <p className="text-xs mb-2" style={{ fontFamily: "var(--font-alt)", color: "var(--pencil-gray)" }}>⚡ Quick add (click to add):</p>
          <div className="flex flex-wrap gap-1.5">
            {filteredSuggestions.map((s) => (
              <button key={s} onClick={() => addSkill(s)} className="sketch-tag !text-sm hover:opacity-70 transition-opacity cursor-pointer" style={{ borderColor: "var(--pencil-gray)" }}>+ {s}</button>
            ))}
          </div>
        </div>

        {errors.skills && <p className="mt-2 text-sm" style={{ color: "var(--marker-red)", fontFamily: "var(--font-alt)" }}>⚠️ {errors.skills}</p>}
      </div>

      {/* ── 2. Year ── */}
      <div className="sketch-card">
        <SectionLabel num="2" label="Where are you currently?" required />
        <p className="text-sm mb-4" style={{ fontFamily: "var(--font-alt)", color: "var(--pencil-gray)" }}>
          Select your current college year or professional status.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {YEAR_OPTIONS.map((y) => (
            <button key={y.value} onClick={() => setFormData((p) => ({ ...p, year: y.value }))} className="p-3 text-left transition-all" style={{ fontFamily: "var(--font-body)", border: `2px ${formData.year === y.value ? "solid" : "dashed"} ${formData.year === y.value ? "var(--marker-blue)" : "var(--pencil-gray)"}`, borderRadius: "15px 225px 15px 255px / 255px 15px 225px 15px", background: formData.year === y.value ? "var(--highlight-blue)" : "transparent", color: formData.year === y.value ? "var(--marker-blue)" : "var(--ink-medium)", transform: formData.year === y.value ? "translate(2px, 2px)" : "none" }}>
              <span className="text-xl block mb-0.5">{y.emoji}</span>
              <span className="text-sm font-medium">{y.label}</span>
            </button>
          ))}
        </div>
        {errors.year && <p className="mt-2 text-sm" style={{ color: "var(--marker-red)", fontFamily: "var(--font-alt)" }}>⚠️ {errors.year}</p>}
      </div>

      {/* ── 3. Domain ── */}
      <div className="sketch-card">
        <SectionLabel num="3" label="Which domain are you interested in?" required />
        <p className="text-sm mb-4" style={{ fontFamily: "var(--font-alt)", color: "var(--pencil-gray)" }}>
          Choose the field where you want to build your career.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {DOMAIN_OPTIONS.map((d) => (
            <button key={d.value} onClick={() => setFormData((p) => ({ ...p, domain: d.value }))} className="p-3 text-left transition-all" style={{ fontFamily: "var(--font-body)", border: `2px ${formData.domain === d.value ? "solid" : "dashed"} ${formData.domain === d.value ? "var(--marker-green)" : "var(--pencil-gray)"}`, borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px", background: formData.domain === d.value ? "var(--highlight-green)" : "transparent", color: formData.domain === d.value ? "var(--marker-green)" : "var(--ink-medium)", transform: formData.domain === d.value ? "translate(2px, 2px)" : "none" }}>
              <span className="text-xl block mb-0.5">{d.emoji}</span>
              <span className="text-xs leading-tight">{d.label}</span>
            </button>
          ))}
        </div>
        {errors.domain && <p className="mt-2 text-sm" style={{ color: "var(--marker-red)", fontFamily: "var(--font-alt)" }}>⚠️ {errors.domain}</p>}
      </div>

      {/* ── 4. Goal ── */}
      <div className="sketch-card">
        <SectionLabel num="4" label="What are you looking for?" required />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {GOAL_OPTIONS.map((g) => (
            <button key={g.value} onClick={() => setFormData((p) => ({ ...p, goal: g.value }))} className="p-4 text-left flex items-start gap-3 transition-all" style={{ border: `2px ${formData.goal === g.value ? "solid" : "dashed"} ${formData.goal === g.value ? "var(--marker-orange)" : "var(--pencil-gray)"}`, borderRadius: "225px 15px 255px 15px / 15px 255px 15px 225px", background: formData.goal === g.value ? "rgba(232, 133, 58, 0.06)" : "transparent", transform: formData.goal === g.value ? "translate(2px, 2px)" : "none" }}>
              <span className="text-2xl">{g.emoji}</span>
              <div>
                <p className="font-medium" style={{ fontFamily: "var(--font-body)", color: formData.goal === g.value ? "var(--marker-orange)" : "var(--ink-dark)" }}>{g.label}</p>
                <p className="text-xs" style={{ fontFamily: "var(--font-alt)", color: "var(--pencil-gray)" }}>{g.desc}</p>
              </div>
            </button>
          ))}
        </div>
        {errors.goal && <p className="mt-2 text-sm" style={{ color: "var(--marker-red)", fontFamily: "var(--font-alt)" }}>⚠️ {errors.goal}</p>}
      </div>

      {/* ── 5. Location ── */}
      <div className="sketch-card">
        <SectionLabel num="5" label="Location preference? (optional)" />
        <div className="flex flex-wrap gap-2">
          {LOCATION_OPTIONS.map((l) => (
            <button key={l.value} onClick={() => setFormData((p) => ({ ...p, location: p.location === l.value ? "" : l.value }))} className="sketch-tag !text-sm cursor-pointer transition-all" style={{ borderColor: formData.location === l.value ? "var(--marker-purple)" : "var(--pencil-gray)", color: formData.location === l.value ? "var(--marker-purple)" : "var(--ink-light)", background: formData.location === l.value ? "rgba(139, 107, 181, 0.1)" : "rgba(255,255,255,0.5)", transform: formData.location === l.value ? "translate(2px, 2px)" : "none" }}>
              {l.emoji} {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── 6. Extra ── */}
      <div className="sketch-card">
        <SectionLabel num="6" label="Anything else to add? (optional)" />
        <p className="text-sm mb-3" style={{ fontFamily: "var(--font-alt)", color: "var(--pencil-gray)" }}>
          Any specific company, project, or context that might help the AI match you better.
        </p>
        <textarea
          className="sketch-textarea w-full"
          rows={3}
          placeholder={`E.g. "I have a CGPA of 7.5, won a hackathon, prefer a stipend above ₹10,000", or "Looking for something in fintech specifically..."`}
          value={formData.extra}
          onChange={(e) => setFormData((p) => ({ ...p, extra: e.target.value }))}
        />
      </div>

      {/* ── Live Preview ── */}
      {(formData.skills.length > 0 || formData.year || formData.goal) && (
        <motion.div className="sketch-card sketch-border-green" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <p className="text-xs uppercase tracking-wider mb-2" style={{ fontFamily: "var(--font-alt)", color: "var(--pencil-gray)" }}>👁️ This is what will be sent to the AI:</p>
          <p style={{ fontFamily: "var(--font-body)", color: "var(--ink-medium)", fontStyle: "italic" }}>
            &ldquo;{[
              formData.skills.length > 0 ? formData.skills.join(", ") : null,
              formData.year || null,
              formData.domain || null,
              formData.goal || null,
              formData.location ? `prefer ${formData.location}` : null,
              formData.extra || null,
            ].filter(Boolean).join(", ")}&rdquo;
          </p>
        </motion.div>
      )}

      {/* ── Submit ── */}
      <div className="text-center">
        <button id="align-me-btn" onClick={handleSubmit} disabled={isLoading} className="sketch-btn sketch-btn-primary !text-2xl !py-5 !px-16" style={{ opacity: isLoading ? 0.7 : 1 }}>
          {isLoading ? (
            <span className="flex items-center gap-3"><span className="sketch-spinner inline-block !w-6 !h-6 !border-2" />AI is working on it...</span>
          ) : (
            "✨ Align Me!"
          )}
        </button>
        <p className="mt-3 text-sm" style={{ fontFamily: "var(--font-alt)", color: "var(--pencil-gray)" }}>
          Qwen 0.5B will match you against real data — usually takes 10–20 seconds
        </p>
      </div>
    </div>
  );
}
