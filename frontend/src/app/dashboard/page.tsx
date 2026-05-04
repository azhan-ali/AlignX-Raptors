"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import ApplicationTracker from "@/components/ApplicationTracker";
import { useAuth } from "@/hooks/useAuth";

interface HistoryEntry {
  id: string;
  date: string;
  time: string;
  profile: { skills: string[]; skill_score: number; year: string; goal: string; };
  topResult: { title: string; company: string; score?: number } | null;
  totalResults: number;
  narrative?: { summary: string; encouragement: string; };
}

const STAT_COLORS = [
  "var(--marker-blue)",
  "var(--marker-green)",
  "var(--marker-orange)",
  "var(--marker-purple)",
];

export default function DashboardPage() {
  const { user, loading } = useAuth(true);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "tracker" | "history">("overview");

  useEffect(() => {
    if (!user) return;
    const key = `alignx_history_${user.email}`;
    const stored = localStorage.getItem(key);
    if (stored) setHistory(JSON.parse(stored));
  }, [user]);

  const deleteHistoryEntry = (id: string) => {
    if (!user) return;
    const updated = history.filter((h) => h.id !== id);
    setHistory(updated);
    localStorage.setItem(`alignx_history_${user.email}`, JSON.stringify(updated));
  };

  const trackerApps: { status: string }[] = user
    ? JSON.parse(localStorage.getItem(`alignx_tracker_${user.email}`) || "[]")
    : [];

  const statsCards = [
    { label: "Matches Run", value: history.length, icon: "🎯" },
    { label: "Skills Tracked", value: history[0]?.profile.skills.length || 0, icon: "💡" },
    { label: "Jobs Tracked", value: trackerApps.length, icon: "📋" },
    { label: "Best Score", value: history.reduce((best, h) => Math.max(best, h.topResult?.score || 0), 0) + "/100", icon: "⭐" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--paper-bg)" }}>
        <div className="text-center">
          <div className="sketch-spinner mx-auto mb-4" />
          <p style={{ fontFamily: "var(--font-handwritten)", color: "var(--marker-blue)", fontSize: "1.3rem" }}>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const TABS = [
    { id: "overview", label: "📊 Overview" },
    { id: "tracker", label: "📋 App Tracker" },
    { id: "history", label: "🕓 Match History" },
  ] as const;

  return (
    <>
      <Navbar />
      <main className="pt-20 pb-20 min-h-screen">
        <div className="max-w-5xl mx-auto px-4">

          {/* Header */}
          <motion.div className="mb-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl sketch-border-blue" style={{ background: "var(--highlight-blue)" }}>
                🎓
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: "var(--font-heading)", color: "var(--ink-dark)" }}>
                  Hey, {user.name}! 👋
                </h1>
                <p className="text-base" style={{ fontFamily: "var(--font-alt)", color: "var(--pencil-gray)" }}>
                  {user.email} · {user.year || "Student"}
                </p>
              </div>
              <div className="ml-auto">
                <Link href="/opportunities" className="sketch-btn sketch-btn-primary !text-base !py-2 !px-6">
                  🎯 New Match
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            {statsCards.map((s, i) => (
              <motion.div key={s.label} className="sketch-card text-center !py-5" whileHover={{ y: -3 }}>
                <p className="text-3xl mb-1">{s.icon}</p>
                <p className="text-3xl font-bold" style={{ fontFamily: "var(--font-handwritten)", color: STAT_COLORS[i] }}>
                  {s.value}
                </p>
                <p className="text-xs" style={{ fontFamily: "var(--font-alt)", color: "var(--pencil-gray)" }}>{s.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Tabs */}
          <div className="flex gap-1 p-1 sketch-card !py-1 !px-1 mb-8 w-fit">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="px-4 py-2 transition-all text-sm"
                style={{
                  fontFamily: "var(--font-alt)",
                  borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px",
                  background: activeTab === tab.id ? "var(--marker-blue)" : "transparent",
                  color: activeTab === tab.id ? "white" : "var(--ink-light)",
                  fontWeight: activeTab === tab.id ? "600" : "normal",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">

            {/* OVERVIEW TAB */}
            {activeTab === "overview" && (
              <motion.div key="overview" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>

                {/* Quick Actions */}
                <div className="grid md:grid-cols-3 gap-5 mb-8">
                  {[
                    { icon: "🎯", title: "Run New Match", desc: "Find fresh opportunities", href: "/opportunities", color: "var(--marker-blue)", border: "sketch-border-blue" },
                    { icon: "📋", title: "Track Applications", desc: "Update your job progress", onClick: () => setActiveTab("tracker"), color: "var(--marker-green)", border: "sketch-border-green" },
                    { icon: "🕓", title: "View History", desc: "See past match results", onClick: () => setActiveTab("history"), color: "var(--marker-orange)", border: "sketch-border-orange" },
                  ].map((card) => (
                    <motion.div key={card.title} whileHover={{ y: -4 }}>
                      {card.href ? (
                        <Link href={card.href} className={`sketch-card ${card.border} block text-center !py-6 hover:opacity-90 transition-opacity`}>
                          <p className="text-4xl mb-2">{card.icon}</p>
                          <p className="text-xl font-bold" style={{ fontFamily: "var(--font-heading)", color: card.color }}>{card.title}</p>
                          <p className="text-sm" style={{ fontFamily: "var(--font-alt)", color: "var(--pencil-gray)" }}>{card.desc}</p>
                        </Link>
                      ) : (
                        <button onClick={card.onClick} className={`sketch-card ${card.border} w-full text-center !py-6`}>
                          <p className="text-4xl mb-2">{card.icon}</p>
                          <p className="text-xl font-bold" style={{ fontFamily: "var(--font-heading)", color: card.color }}>{card.title}</p>
                          <p className="text-sm" style={{ fontFamily: "var(--font-alt)", color: "var(--pencil-gray)" }}>{card.desc}</p>
                        </button>
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Last Result Preview */}
                {history.length > 0 && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <h2 className="text-2xl mb-4" style={{ fontFamily: "var(--font-heading)", color: "var(--ink-dark)" }}>
                      🕓 Your Last Match Result
                    </h2>
                    <div className="sketch-card sketch-border-green" style={{ background: "rgba(91,165,94,0.04)" }}>
                      <div className="flex justify-between items-start flex-wrap gap-3">
                        <div>
                          <p className="text-xs uppercase tracking-wider mb-1" style={{ fontFamily: "var(--font-alt)", color: "var(--pencil-gray)" }}>
                            Matched on {history[0].date} at {history[0].time}
                          </p>
                          <p className="text-xl font-bold" style={{ fontFamily: "var(--font-heading)", color: "var(--ink-dark)" }}>
                            🎯 Top Match: {history[0].topResult?.title || "N/A"}
                          </p>
                          <p className="text-base" style={{ fontFamily: "var(--font-body)", color: "var(--ink-medium)" }}>
                            🏢 {history[0].topResult?.company || "N/A"} · Score: {history[0].topResult?.score || "N/A"}/100
                          </p>
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {history[0].profile.skills.slice(0, 6).map((s) => (
                              <span key={s} className="sketch-tag !text-xs !py-0.5 !px-2">{s}</span>
                            ))}
                          </div>
                        </div>
                        <Link href="/opportunities" className="sketch-btn sketch-btn-primary !text-sm !py-2 !px-5">
                          Run Again 🔄
                        </Link>
                      </div>
                      {history[0].narrative?.encouragement && (
                        <div className="mt-4 p-3 rounded-lg italic" style={{ background: "var(--highlight-green)", fontFamily: "var(--font-body)", color: "var(--ink-medium)" }}>
                          💚 "{history[0].narrative.encouragement}"
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {history.length === 0 && (
                  <div className="sketch-card text-center py-16">
                    <p className="text-5xl mb-4">🚀</p>
                    <h2 className="text-3xl mb-2" style={{ fontFamily: "var(--font-heading)", color: "var(--ink-dark)" }}>
                      You haven&apos;t run a match yet!
                    </h2>
                    <p className="text-lg mb-6" style={{ fontFamily: "var(--font-body)", color: "var(--ink-light)" }}>
                      Find your perfect internship or job in seconds.
                    </p>
                    <Link href="/opportunities" className="sketch-btn sketch-btn-primary !text-xl !py-4 !px-10">
                      🎯 Find My Match
                    </Link>
                  </div>
                )}
              </motion.div>
            )}

            {/* APPLICATION TRACKER TAB */}
            {activeTab === "tracker" && (
              <motion.div key="tracker" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <ApplicationTracker
                  userEmail={user.email}
                  newResult={history[0]?.topResult || null}
                />
              </motion.div>
            )}

            {/* HISTORY TAB */}
            {activeTab === "history" && (
              <motion.div key="history" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <h2 className="text-2xl mb-6" style={{ fontFamily: "var(--font-heading)", color: "var(--ink-dark)" }}>
                  🕓 Match History <span className="text-lg" style={{ color: "var(--pencil-gray)" }}>({history.length} sessions saved)</span>
                </h2>

                {history.length === 0 ? (
                  <div className="sketch-card text-center py-12">
                    <p className="text-4xl mb-3">📭</p>
                    <p className="text-xl" style={{ fontFamily: "var(--font-handwritten)", color: "var(--ink-light)" }}>No history yet.</p>
                    <p className="text-sm mt-1" style={{ fontFamily: "var(--font-alt)", color: "var(--pencil-gray)" }}>
                      Run a match and click "Save to Dashboard" to store results here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <AnimatePresence>
                      {history.map((entry, idx) => (
                        <motion.div
                          key={entry.id}
                          className="sketch-card"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          layout
                        >
                          <div className="flex justify-between items-start flex-wrap gap-3">
                            <div className="flex-1">
                              <p className="text-xs uppercase tracking-wider mb-1" style={{ fontFamily: "var(--font-alt)", color: "var(--pencil-gray)" }}>
                                {entry.date} · {entry.time} · {entry.totalResults} matches found
                              </p>
                              <p className="text-xl font-bold mb-1" style={{ fontFamily: "var(--font-heading)", color: "var(--ink-dark)" }}>
                                🎯 {entry.topResult?.title || "No match found"} — {entry.topResult?.company}
                              </p>
                              <div className="flex items-center gap-4 flex-wrap">
                                <span className="sketch-tag !text-xs !py-0.5" style={{ borderColor: "var(--marker-blue)", color: "var(--marker-blue)" }}>
                                  Score: {entry.profile.skill_score}/100
                                </span>
                                <span className="text-sm" style={{ fontFamily: "var(--font-alt)", color: "var(--ink-light)" }}>
                                  🎯 {entry.profile.goal} · 🎓 {entry.profile.year}
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                {entry.profile.skills.slice(0, 5).map((s) => (
                                  <span key={s} className="sketch-tag !text-xs !py-0.5 !px-2">{s}</span>
                                ))}
                                {entry.profile.skills.length > 5 && (
                                  <span className="text-xs" style={{ color: "var(--pencil-gray)", fontFamily: "var(--font-alt)" }}>
                                    +{entry.profile.skills.length - 5} more
                                  </span>
                                )}
                              </div>
                            </div>
                            <button onClick={() => deleteHistoryEntry(entry.id)} className="text-xl opacity-40 hover:opacity-80 transition-opacity" style={{ color: "var(--marker-red)" }} title="Delete this entry">
                              ×
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>
    </>
  );
}
