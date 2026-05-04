"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import type { UserRole } from "@/hooks/useAuth";

/* ─── Role Selection Cards ─── */
const ROLES: { id: UserRole; icon: string; title: string; subtitle: string; color: string; border: string; bg: string }[] = [
  {
    id: "user",
    icon: "🎓",
    title: "I'm a Learner",
    subtitle: "Find mentors, career matches & guidance",
    color: "var(--marker-blue)",
    border: "sketch-border-blue",
    bg: "rgba(74,126,197,0.06)",
  },
  {
    id: "student_mentor",
    icon: "📚",
    title: "Student Mentor",
    subtitle: "I'm a student & I want to teach others",
    color: "var(--marker-green)",
    border: "sketch-border-green",
    bg: "rgba(91,165,94,0.06)",
  },
  {
    id: "industry_expert",
    icon: "💼",
    title: "Industry Expert",
    subtitle: "Working professional — mentor or advisor",
    color: "var(--marker-purple)",
    border: "sketch-border-purple",
    bg: "rgba(139,107,181,0.06)",
  },
];

const YEAR_OPTIONS = ["1st Year", "2nd Year", "3rd Year", "4th Year", "Recent Graduate"];
const SEMESTER_OPTIONS = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"];
const INDUSTRY_OPTIONS = ["IT / Software", "Finance", "Healthcare", "Education", "E-Commerce", "Manufacturing", "Consulting", "Media", "Other"];
const EXP_OPTIONS = ["0-1 years", "1-3 years", "3-5 years", "5-10 years", "10+ years"];

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<"login" | "signup">((searchParams.get("mode") as "login" | "signup") ?? "login");
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [step, setStep] = useState<"role" | "form">("role");

  // Common fields
  const [form, setForm] = useState({
    name: "", email: "", password: "", year: "", phone: "",
    // Student Mentor fields
    college: "", branch: "", semester: "", studentSkills: "" as string, studentId: "",
    // Industry Expert fields
    company: "", designation: "", experienceYears: "", industry: "", linkedIn: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const m = searchParams.get("mode");
    if (m === "signup" || m === "login") setMode(m);
  }, [searchParams]);

  // Reset to role selection when switching to signup
  useEffect(() => {
    if (mode === "signup") {
      setStep("role");
      setSelectedRole(null);
    }
  }, [mode]);

  const validate = () => {
    if (!form.email || !form.password) return "Both email and password are required.";
    if (mode === "signup" && !form.name) return "Please enter your name.";
    if (form.password.length < 6) return "Password must be at least 6 characters.";
    if (mode === "signup" && !form.phone) return "Phone number is required.";

    if (mode === "signup" && selectedRole === "student_mentor") {
      if (!form.college) return "Please enter your college name.";
      if (!form.branch) return "Please enter your branch/department.";
      if (!form.semester) return "Please select your semester.";
    }

    if (mode === "signup" && selectedRole === "industry_expert") {
      if (!form.company) return "Please enter your company name.";
      if (!form.designation) return "Please enter your designation.";
      if (!form.experienceYears) return "Please select your experience.";
      if (!form.industry) return "Please select your industry.";
    }

    return "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setError("");

    if (mode === "signup") {
      const users = JSON.parse(localStorage.getItem("alignx_users") || "[]");
      const exists = users.find((u: { email: string }) => u.email === form.email);
      if (exists) { setError("This email is already registered. Please log in instead."); return; }

      const skillsArray = form.studentSkills ? form.studentSkills.split(",").map(s => s.trim()).filter(Boolean) : [];

      const newUser = {
        name: form.name,
        email: form.email,
        password: form.password,
        year: form.year,
        phone: form.phone,
        role: selectedRole || "user",
        // Student Mentor fields
        ...(selectedRole === "student_mentor" && {
          college: form.college,
          branch: form.branch,
          semester: form.semester,
          studentSkills: skillsArray,
          studentId: form.studentId,
        }),
        // Industry Expert fields
        ...(selectedRole === "industry_expert" && {
          company: form.company,
          designation: form.designation,
          experienceYears: form.experienceYears,
          industry: form.industry,
          linkedIn: form.linkedIn,
        }),
      };

      users.push(newUser);
      localStorage.setItem("alignx_users", JSON.stringify(users));

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _pw, ...userWithoutPassword } = newUser;
      localStorage.setItem("alignx_user", JSON.stringify(userWithoutPassword));
    } else {
      const users = JSON.parse(localStorage.getItem("alignx_users") || "[]");
      const user = users.find((u: { email: string; password: string }) => u.email === form.email && u.password === form.password);
      if (!user) { setError("Incorrect email or password."); return; }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _pw, ...userWithoutPassword } = user;
      if (!userWithoutPassword.role) userWithoutPassword.role = "user";
      localStorage.setItem("alignx_user", JSON.stringify(userWithoutPassword));
    }

    setSuccess(true);

    // Route to role-specific dashboard
    const nextUrl = searchParams.get("next");
    if (nextUrl) {
      setTimeout(() => router.push(nextUrl), 1500);
    } else if (mode === "signup") {
      const dashMap: Record<string, string> = {
        user: "/dashboard",
        student_mentor: "/mentor-dashboard",
        industry_expert: "/expert-dashboard",
      };
      setTimeout(() => router.push(dashMap[selectedRole || "user"]), 1500);
    } else {
      // On login, read user role from stored data
      const stored = JSON.parse(localStorage.getItem("alignx_user") || "{}");
      const dashMap: Record<string, string> = {
        user: "/dashboard",
        student_mentor: "/mentor-dashboard",
        industry_expert: "/expert-dashboard",
      };
      setTimeout(() => router.push(dashMap[stored.role || "user"]), 1500);
    }
  };

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setStep("form");
    setError("");
  };

  return (
    <main className="pt-20 min-h-screen flex items-center justify-center px-4">
      <motion.div className="w-full max-w-lg" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <span className="text-3xl">✏️</span>
            <span className="text-3xl font-bold" style={{ fontFamily: "var(--font-heading)", color: "var(--ink-dark)" }}>
              Align<span style={{ color: "var(--marker-blue)" }}>X</span>
            </span>
          </Link>
          <h1 className="text-3xl" style={{ fontFamily: "var(--font-heading)", color: "var(--ink-dark)" }}>
            {mode === "login" ? "Welcome back! 👋" : step === "role" ? "Join AlignX ✨" : `Join as ${ROLES.find(r => r.id === selectedRole)?.title}`}
          </h1>
          <p className="text-sm mt-1" style={{ fontFamily: "var(--font-alt)", color: "var(--pencil-gray)" }}>
            {mode === "login" ? "Continue building your career path." : step === "role" ? "Choose how you want to use AlignX" : "Complete your profile to get started"}
          </p>
        </div>

        {/* Login / Signup Toggle */}
        <div className="flex mb-6 sketch-card !p-1 !py-1">
          {(["login", "signup"] as const).map((m) => (
            <button key={m} onClick={() => { setMode(m); setError(""); }} className="flex-1 py-2.5 text-center transition-all" style={{ fontFamily: "var(--font-handwritten)", fontSize: "1.2rem", borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px", background: mode === m ? "var(--marker-blue)" : "transparent", color: mode === m ? "white" : "var(--ink-light)" }}>
              {m === "login" ? "🔑 Login" : "✨ Sign Up"}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* ─── SUCCESS STATE ─── */}
          {success && (
            <motion.div className="sketch-card text-center py-10" key="success" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
              <p className="text-5xl mb-3">🎉</p>
              <p className="text-2xl" style={{ fontFamily: "var(--font-handwritten)", color: "var(--marker-green)" }}>
                {mode === "signup" ? "Account created successfully!" : "Welcome back!"}
              </p>
              <p className="text-sm mt-2" style={{ fontFamily: "var(--font-alt)", color: "var(--pencil-gray)" }}>
                Redirecting you to your Dashboard...
              </p>
            </motion.div>
          )}

          {/* ─── ROLE SELECTION (Signup Only) ─── */}
          {!success && mode === "signup" && step === "role" && (
            <motion.div key="role-select" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <div className="space-y-4">
                {ROLES.map((role, idx) => (
                  <motion.button
                    key={role.id}
                    onClick={() => handleRoleSelect(role.id)}
                    className={`sketch-card ${role.border} w-full text-left !py-5 hover:opacity-90 transition-all`}
                    style={{ background: role.bg }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ y: -3, scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-4xl">{role.icon}</span>
                      <div>
                        <p className="text-xl font-bold" style={{ fontFamily: "var(--font-heading)", color: role.color }}>
                          {role.title}
                        </p>
                        <p className="text-sm" style={{ fontFamily: "var(--font-alt)", color: "var(--pencil-gray)" }}>
                          {role.subtitle}
                        </p>
                      </div>
                      <span className="ml-auto text-2xl" style={{ color: role.color }}>→</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* ─── SIGNUP FORM ─── */}
          {!success && mode === "signup" && step === "form" && (
            <motion.div key="signup-form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              {/* Back button */}
              <button
                onClick={() => { setStep("role"); setError(""); }}
                className="mb-4 text-sm flex items-center gap-1 hover:opacity-70 transition-opacity"
                style={{ fontFamily: "var(--font-alt)", color: "var(--marker-blue)" }}
              >
                ← Change role
              </button>

              <div className="sketch-card">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Common: Name */}
                  <div>
                    <label className="block text-sm mb-1" style={{ fontFamily: "var(--font-alt)", color: "var(--ink-light)" }}>Your Name 👤</label>
                    <input type="text" placeholder="e.g. Azhan, Riya, Rahul..." value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className="sketch-input w-full" />
                  </div>

                  {/* Common: Email */}
                  <div>
                    <label className="block text-sm mb-1" style={{ fontFamily: "var(--font-alt)", color: "var(--ink-light)" }}>Email Address 📧</label>
                    <input type="email" placeholder="you@college.ac.in" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} className="sketch-input w-full" />
                  </div>

                  {/* Common: Password */}
                  <div>
                    <label className="block text-sm mb-1" style={{ fontFamily: "var(--font-alt)", color: "var(--ink-light)" }}>Password 🔒</label>
                    <input type="password" placeholder="At least 6 characters..." value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} className="sketch-input w-full" />
                  </div>

                  {/* Common: Phone */}
                  <div>
                    <label className="block text-sm mb-1" style={{ fontFamily: "var(--font-alt)", color: "var(--ink-light)" }}>Phone Number 📱</label>
                    <input type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} className="sketch-input w-full" />
                  </div>

                  {/* ─── USER-SPECIFIC: Year ─── */}
                  {selectedRole === "user" && (
                    <div>
                      <label className="block text-sm mb-2" style={{ fontFamily: "var(--font-alt)", color: "var(--ink-light)" }}>Where are you currently? 🎓</label>
                      <div className="flex flex-wrap gap-1.5">
                        {YEAR_OPTIONS.map((y) => (
                          <button type="button" key={y} onClick={() => setForm((p) => ({ ...p, year: y }))} className="sketch-tag !text-sm cursor-pointer" style={{ borderColor: form.year === y ? "var(--marker-blue)" : "var(--pencil-gray)", color: form.year === y ? "var(--marker-blue)" : "var(--ink-light)", background: form.year === y ? "var(--highlight-blue)" : "transparent" }}>
                            {y}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ─── STUDENT MENTOR SPECIFIC ─── */}
                  {selectedRole === "student_mentor" && (
                    <>
                      <div className="pt-2 pb-1" style={{ borderTop: "1.5px dashed var(--paper-lines)" }}>
                        <p className="text-sm font-bold" style={{ fontFamily: "var(--font-alt)", color: "var(--marker-green)" }}>📚 Student Verification Details</p>
                      </div>

                      <div>
                        <label className="block text-sm mb-1" style={{ fontFamily: "var(--font-alt)", color: "var(--ink-light)" }}>College / University 🏫</label>
                        <input type="text" placeholder="e.g. IIT Delhi, BITS Pilani..." value={form.college} onChange={(e) => setForm((p) => ({ ...p, college: e.target.value }))} className="sketch-input w-full" />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm mb-1" style={{ fontFamily: "var(--font-alt)", color: "var(--ink-light)" }}>Branch 📖</label>
                          <input type="text" placeholder="e.g. CSE, ECE..." value={form.branch} onChange={(e) => setForm((p) => ({ ...p, branch: e.target.value }))} className="sketch-input w-full" />
                        </div>
                        <div>
                          <label className="block text-sm mb-2" style={{ fontFamily: "var(--font-alt)", color: "var(--ink-light)" }}>Semester</label>
                          <div className="flex flex-wrap gap-1">
                            {SEMESTER_OPTIONS.map((s) => (
                              <button type="button" key={s} onClick={() => setForm((p) => ({ ...p, semester: s }))} className="sketch-tag !text-xs !py-0.5 !px-2 cursor-pointer" style={{ borderColor: form.semester === s ? "var(--marker-green)" : "var(--pencil-gray)", color: form.semester === s ? "var(--marker-green)" : "var(--ink-light)", background: form.semester === s ? "var(--highlight-green)" : "transparent" }}>
                                {s}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm mb-1" style={{ fontFamily: "var(--font-alt)", color: "var(--ink-light)" }}>Your Skills (comma separated) 💡</label>
                        <input type="text" placeholder="e.g. Python, React, DSA, ML..." value={form.studentSkills} onChange={(e) => setForm((p) => ({ ...p, studentSkills: e.target.value }))} className="sketch-input w-full" />
                      </div>

                      <div>
                        <label className="block text-sm mb-1" style={{ fontFamily: "var(--font-alt)", color: "var(--ink-light)" }}>Student ID (optional, for verification) 🆔</label>
                        <input type="text" placeholder="e.g. 2024CSE001" value={form.studentId} onChange={(e) => setForm((p) => ({ ...p, studentId: e.target.value }))} className="sketch-input w-full" />
                      </div>
                    </>
                  )}

                  {/* ─── INDUSTRY EXPERT SPECIFIC ─── */}
                  {selectedRole === "industry_expert" && (
                    <>
                      <div className="pt-2 pb-1" style={{ borderTop: "1.5px dashed var(--paper-lines)" }}>
                        <p className="text-sm font-bold" style={{ fontFamily: "var(--font-alt)", color: "var(--marker-purple)" }}>💼 Professional Details</p>
                      </div>

                      <div>
                        <label className="block text-sm mb-1" style={{ fontFamily: "var(--font-alt)", color: "var(--ink-light)" }}>Company Name 🏢</label>
                        <input type="text" placeholder="e.g. Google, TCS, Infosys..." value={form.company} onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))} className="sketch-input w-full" />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm mb-1" style={{ fontFamily: "var(--font-alt)", color: "var(--ink-light)" }}>Designation 🏷️</label>
                          <input type="text" placeholder="e.g. SDE-1, Manager..." value={form.designation} onChange={(e) => setForm((p) => ({ ...p, designation: e.target.value }))} className="sketch-input w-full" />
                        </div>
                        <div>
                          <label className="block text-sm mb-2" style={{ fontFamily: "var(--font-alt)", color: "var(--ink-light)" }}>Experience</label>
                          <div className="flex flex-wrap gap-1">
                            {EXP_OPTIONS.map((ex) => (
                              <button type="button" key={ex} onClick={() => setForm((p) => ({ ...p, experienceYears: ex }))} className="sketch-tag !text-xs !py-0.5 !px-2 cursor-pointer" style={{ borderColor: form.experienceYears === ex ? "var(--marker-purple)" : "var(--pencil-gray)", color: form.experienceYears === ex ? "var(--marker-purple)" : "var(--ink-light)", background: form.experienceYears === ex ? "rgba(139,107,181,0.15)" : "transparent" }}>
                                {ex}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm mb-2" style={{ fontFamily: "var(--font-alt)", color: "var(--ink-light)" }}>Industry 🏭</label>
                        <div className="flex flex-wrap gap-1.5">
                          {INDUSTRY_OPTIONS.map((ind) => (
                            <button type="button" key={ind} onClick={() => setForm((p) => ({ ...p, industry: ind }))} className="sketch-tag !text-sm cursor-pointer" style={{ borderColor: form.industry === ind ? "var(--marker-purple)" : "var(--pencil-gray)", color: form.industry === ind ? "var(--marker-purple)" : "var(--ink-light)", background: form.industry === ind ? "rgba(139,107,181,0.15)" : "transparent" }}>
                              {ind}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm mb-1" style={{ fontFamily: "var(--font-alt)", color: "var(--ink-light)" }}>LinkedIn Profile (optional) 🔗</label>
                        <input type="url" placeholder="https://linkedin.com/in/..." value={form.linkedIn} onChange={(e) => setForm((p) => ({ ...p, linkedIn: e.target.value }))} className="sketch-input w-full" />
                      </div>
                    </>
                  )}

                  {error && (
                    <motion.p className="text-sm" style={{ color: "var(--marker-red)", fontFamily: "var(--font-alt)" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      ⚠️ {error}
                    </motion.p>
                  )}

                  <button type="submit" className="sketch-btn sketch-btn-primary w-full !text-xl !py-3">
                    🚀 Create Account
                  </button>

                  <p className="text-center text-sm" style={{ fontFamily: "var(--font-alt)", color: "var(--pencil-gray)" }}>
                    Already have an account?{" "}
                    <button type="button" onClick={() => setMode("login")} style={{ color: "var(--marker-blue)", textDecoration: "underline" }}>Log in</button>
                  </p>
                </form>
              </div>
            </motion.div>
          )}

          {/* ─── LOGIN FORM ─── */}
          {!success && mode === "login" && (
            <motion.div key="login-form" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <div className="sketch-card">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm mb-1" style={{ fontFamily: "var(--font-alt)", color: "var(--ink-light)" }}>Email Address 📧</label>
                    <input type="email" placeholder="you@college.ac.in" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} className="sketch-input w-full" />
                  </div>

                  <div>
                    <label className="block text-sm mb-1" style={{ fontFamily: "var(--font-alt)", color: "var(--ink-light)" }}>Password 🔒</label>
                    <input type="password" placeholder="At least 6 characters..." value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} className="sketch-input w-full" />
                  </div>

                  {error && (
                    <motion.p className="text-sm" style={{ color: "var(--marker-red)", fontFamily: "var(--font-alt)" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      ⚠️ {error}
                    </motion.p>
                  )}

                  <button type="submit" className="sketch-btn sketch-btn-primary w-full !text-xl !py-3">
                    🔑 Log In
                  </button>

                  <p className="text-center text-sm" style={{ fontFamily: "var(--font-alt)", color: "var(--pencil-gray)" }}>
                    Don&apos;t have an account?{" "}
                    <button type="button" onClick={() => setMode("signup")} style={{ color: "var(--marker-blue)", textDecoration: "underline" }}>Sign up</button>
                  </p>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-center text-xs mt-4" style={{ fontFamily: "var(--font-alt)", color: "var(--pencil-gray)" }}>
          ✨ Free · No credit card · Your data stays on your device
        </p>
      </motion.div>
    </main>
  );
}

export default function AuthPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div className="pt-20 text-center" style={{ fontFamily: "var(--font-alt)", color: "var(--pencil-gray)" }}>Loading...</div>}>
        <AuthForm />
      </Suspense>
    </>
  );
}
