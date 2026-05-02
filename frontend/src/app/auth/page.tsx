"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<"login" | "signup">((searchParams.get("mode") as "login" | "signup") ?? "login");
  const [form, setForm] = useState({ name: "", email: "", password: "", year: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const m = searchParams.get("mode");
    if (m === "signup" || m === "login") setMode(m);
  }, [searchParams]);

  const validate = () => {
    if (!form.email || !form.password) return "Both email and password are required.";
    if (mode === "signup" && !form.name) return "Please enter your name.";
    if (form.password.length < 6) return "Password must be at least 6 characters.";
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
      const newUser = { name: form.name, email: form.email, password: form.password, year: form.year };
      users.push(newUser);
      localStorage.setItem("alignx_users", JSON.stringify(users));
      localStorage.setItem("alignx_user", JSON.stringify({ name: form.name, email: form.email, year: form.year }));
    } else {
      const users = JSON.parse(localStorage.getItem("alignx_users") || "[]");
      const user = users.find((u: { email: string; password: string }) => u.email === form.email && u.password === form.password);
      if (!user) { setError("Incorrect email or password."); return; }
      localStorage.setItem("alignx_user", JSON.stringify({ name: user.name, email: user.email, year: user.year }));
    }

    setSuccess(true);
    setTimeout(() => router.push("/opportunities"), 1500);
  };

  const YEAR_OPTIONS = ["1st Year", "2nd Year", "3rd Year", "4th Year", "Recent Graduate", "Working Professional"];

  return (
    <main className="pt-20 min-h-screen flex items-center justify-center px-4">
      <motion.div className="w-full max-w-md" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <span className="text-3xl">✏️</span>
            <span className="text-3xl font-bold" style={{ fontFamily: "var(--font-heading)", color: "var(--ink-dark)" }}>
              Align<span style={{ color: "var(--marker-blue)" }}>X</span>
            </span>
          </Link>
          <h1 className="text-3xl" style={{ fontFamily: "var(--font-heading)", color: "var(--ink-dark)" }}>
            {mode === "login" ? "Welcome back! 👋" : "Join AlignX ✨"}
          </h1>
          <p className="text-sm mt-1" style={{ fontFamily: "var(--font-alt)", color: "var(--pencil-gray)" }}>
            {mode === "login" ? "Continue building your career path." : "Free forever, no credit card needed."}
          </p>
        </div>

        <div className="flex mb-6 sketch-card !p-1 !py-1">
          {(["login", "signup"] as const).map((m) => (
            <button key={m} onClick={() => { setMode(m); setError(""); }} className="flex-1 py-2.5 text-center transition-all" style={{ fontFamily: "var(--font-handwritten)", fontSize: "1.2rem", borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px", background: mode === m ? "var(--marker-blue)" : "transparent", color: mode === m ? "white" : "var(--ink-light)" }}>
              {m === "login" ? "🔑 Login" : "✨ Sign Up"}
            </button>
          ))}
        </div>

        <div className="sketch-card">
          <AnimatePresence>
            {success && (
              <motion.div className="text-center py-6" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
                <p className="text-5xl mb-3">🎉</p>
                <p className="text-2xl" style={{ fontFamily: "var(--font-handwritten)", color: "var(--marker-green)" }}>
                  {mode === "signup" ? "Account created successfully!" : "Welcome back!"}
                </p>
                <p className="text-sm mt-2" style={{ fontFamily: "var(--font-alt)", color: "var(--pencil-gray)" }}>
                  Redirecting you to Opportunities...
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {!success && (
            <form onSubmit={handleSubmit} className="space-y-5">
              {mode === "signup" && (
                <div>
                  <label className="block text-sm mb-1" style={{ fontFamily: "var(--font-alt)", color: "var(--ink-light)" }}>Your Name 👤</label>
                  <input type="text" placeholder="e.g. Azhan, Riya, Rahul..." value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className="sketch-input w-full" />
                </div>
              )}

              <div>
                <label className="block text-sm mb-1" style={{ fontFamily: "var(--font-alt)", color: "var(--ink-light)" }}>Email Address 📧</label>
                <input type="email" placeholder="you@college.ac.in" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} className="sketch-input w-full" />
              </div>

              <div>
                <label className="block text-sm mb-1" style={{ fontFamily: "var(--font-alt)", color: "var(--ink-light)" }}>Password 🔒</label>
                <input type="password" placeholder="At least 6 characters..." value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} className="sketch-input w-full" />
              </div>

              {mode === "signup" && (
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

              {error && (
                <motion.p className="text-sm" style={{ color: "var(--marker-red)", fontFamily: "var(--font-alt)" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  ⚠️ {error}
                </motion.p>
              )}

              <button type="submit" className="sketch-btn sketch-btn-primary w-full !text-xl !py-3">
                {mode === "login" ? "🔑 Log In" : "🚀 Create Account"}
              </button>

              <p className="text-center text-sm" style={{ fontFamily: "var(--font-alt)", color: "var(--pencil-gray)" }}>
                {mode === "login" ? (
                  <>Don&apos;t have an account?{" "}
                    <button type="button" onClick={() => setMode("signup")} style={{ color: "var(--marker-blue)", textDecoration: "underline" }}>Sign up</button>
                  </>
                ) : (
                  <>Already have an account?{" "}
                    <button type="button" onClick={() => setMode("login")} style={{ color: "var(--marker-blue)", textDecoration: "underline" }}>Log in</button>
                  </>
                )}
              </p>
            </form>
          )}
        </div>

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
