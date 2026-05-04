"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Application {
  id: string;
  title: string;
  company: string;
  status: "saved" | "applied" | "interview" | "rejected" | "offer";
  date: string;
  score?: number;
  notes?: string;
}

const STATUS_CONFIG = {
  saved: { label: "💾 Saved", color: "var(--pencil-gray)", bg: "rgba(160,152,144,0.1)" },
  applied: { label: "📤 Applied", color: "var(--marker-blue)", bg: "rgba(74,126,197,0.1)" },
  interview: { label: "🎤 Interview", color: "var(--marker-orange)", bg: "rgba(232,133,58,0.1)" },
  rejected: { label: "❌ Rejected", color: "var(--marker-red)", bg: "rgba(216,90,90,0.1)" },
  offer: { label: "🎉 Got Offer!", color: "var(--marker-green)", bg: "rgba(91,165,94,0.1)" },
};

const STATUS_ORDER: Application["status"][] = ["saved", "applied", "interview", "rejected", "offer"];

interface ApplicationTrackerProps {
  userEmail: string;
  newResult?: { title: string; company: string; score?: number } | null;
}

export default function ApplicationTracker({ userEmail, newResult }: ApplicationTrackerProps) {
  const storageKey = `alignx_tracker_${userEmail}`;
  const [apps, setApps] = useState<Application[]>([]);
  const [addMode, setAddMode] = useState(false);
  const [form, setForm] = useState({ title: "", company: "", notes: "" });
  const [activeFilter, setActiveFilter] = useState<Application["status"] | "all">("all");
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) setApps(JSON.parse(stored));
  }, [storageKey]);

  const save = (updated: Application[]) => {
    setApps(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  const addApp = () => {
    if (!form.title.trim() || !form.company.trim()) return;
    const newApp: Application = {
      id: Date.now().toString(),
      title: form.title.trim(),
      company: form.company.trim(),
      status: "saved",
      date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
      notes: form.notes.trim(),
    };
    save([newApp, ...apps]);
    setForm({ title: "", company: "", notes: "" });
    setAddMode(false);
  };

  const addFromResult = () => {
    if (!newResult) return;
    const already = apps.find((a) => a.title === newResult.title && a.company === newResult.company);
    if (already) return;
    const newApp: Application = {
      id: Date.now().toString(),
      title: newResult.title,
      company: newResult.company,
      status: "saved",
      date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
      score: newResult.score,
    };
    save([newApp, ...apps]);
  };

  const updateStatus = (id: string, status: Application["status"]) => {
    save(apps.map((a) => (a.id === id ? { ...a, status } : a)));
    setEditingId(null);
  };

  const deleteApp = (id: string) => save(apps.filter((a) => a.id !== id));

  const filtered = activeFilter === "all" ? apps : apps.filter((a) => a.status === activeFilter);

  const counts: Record<string, number> = {};
  STATUS_ORDER.forEach((s) => { counts[s] = apps.filter((a) => a.status === s).length; });

  return (
    <motion.section
      id="application-tracker"
      className="max-w-4xl mx-auto px-4 py-10"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.25 }}
    >
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">📋</span>
          <div>
            <h2 className="text-3xl md:text-4xl" style={{ fontFamily: "var(--font-heading)", color: "var(--ink-dark)" }}>
              Application <span className="highlight-blue">Tracker</span>
            </h2>
            <p className="text-xs" style={{ fontFamily: "var(--font-alt)", color: "var(--pencil-gray)" }}>
              Track every job/internship you apply to
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {newResult && (
            <button onClick={addFromResult} className="sketch-btn sketch-btn-primary !text-sm !py-1.5 !px-4">
              + Add Top Match
            </button>
          )}
          <button onClick={() => setAddMode(true)} className="sketch-btn !text-sm !py-1.5 !px-4" style={{ borderColor: "var(--marker-blue)", color: "var(--marker-blue)", boxShadow: "2px 2px 0px var(--marker-blue)" }}>
            + Add Manually
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-5 gap-2 mb-6">
        {STATUS_ORDER.map((s) => (
          <motion.button
            key={s}
            onClick={() => setActiveFilter(activeFilter === s ? "all" : s)}
            className="sketch-card !p-3 text-center transition-all"
            style={{
              borderColor: activeFilter === s ? STATUS_CONFIG[s].color : "var(--paper-lines)",
              background: activeFilter === s ? STATUS_CONFIG[s].bg : "var(--paper-bg)",
            }}
            whileHover={{ y: -2 }}
          >
            <p className="text-2xl font-bold" style={{ fontFamily: "var(--font-handwritten)", color: STATUS_CONFIG[s].color }}>
              {counts[s] || 0}
            </p>
            <p className="text-xs leading-tight" style={{ fontFamily: "var(--font-alt)", color: "var(--pencil-gray)" }}>
              {STATUS_CONFIG[s].label}
            </p>
          </motion.button>
        ))}
      </div>

      {/* Add Form */}
      <AnimatePresence>
        {addMode && (
          <motion.div
            className="sketch-card sketch-border-blue mb-5"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <h3 className="text-xl mb-4" style={{ fontFamily: "var(--font-heading)", color: "var(--ink-dark)" }}>➕ Add Application</h3>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm mb-1" style={{ fontFamily: "var(--font-alt)", color: "var(--ink-light)" }}>Job Title *</label>
                <input type="text" className="sketch-input w-full" placeholder="e.g. Frontend Developer Intern" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm mb-1" style={{ fontFamily: "var(--font-alt)", color: "var(--ink-light)" }}>Company *</label>
                <input type="text" className="sketch-input w-full" placeholder="e.g. Google, Razorpay..." value={form.company} onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))} />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm mb-1" style={{ fontFamily: "var(--font-alt)", color: "var(--ink-light)" }}>Notes (optional)</label>
              <input type="text" className="sketch-input w-full" placeholder="Deadline, referral contact, source..." value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} />
            </div>
            <div className="flex gap-3">
              <button onClick={addApp} className="sketch-btn sketch-btn-primary !text-base !py-2 !px-6">Save 💾</button>
              <button onClick={() => setAddMode(false)} className="sketch-btn !text-base !py-2 !px-4">Cancel</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Applications List */}
      {filtered.length === 0 ? (
        <div className="sketch-card text-center py-12">
          <p className="text-4xl mb-3">📭</p>
          <p className="text-xl" style={{ fontFamily: "var(--font-handwritten)", color: "var(--ink-light)" }}>
            {apps.length === 0 ? "No applications tracked yet!" : "No applications in this category."}
          </p>
          <p className="text-sm mt-1" style={{ fontFamily: "var(--font-alt)", color: "var(--pencil-gray)" }}>
            Start by adding your first application above.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {filtered.map((app, idx) => (
              <motion.div
                key={app.id}
                className="sketch-card flex flex-col sm:flex-row items-start sm:items-center gap-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: idx * 0.05 }}
                layout
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-lg font-bold" style={{ fontFamily: "var(--font-heading)", color: "var(--ink-dark)" }}>
                      {app.title}
                    </p>
                    {app.score && (
                      <span className="sketch-tag !text-xs !py-0.5 !px-2" style={{ borderColor: "var(--marker-blue)", color: "var(--marker-blue)" }}>
                        {app.score}/100 match
                      </span>
                    )}
                  </div>
                  <p className="text-sm" style={{ fontFamily: "var(--font-body)", color: "var(--ink-medium)" }}>
                    🏢 {app.company} · 📅 {app.date}
                  </p>
                  {app.notes && (
                    <p className="text-xs mt-1 italic" style={{ fontFamily: "var(--font-alt)", color: "var(--pencil-gray)" }}>
                      📝 {app.notes}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {editingId === app.id ? (
                    <div className="flex flex-wrap gap-1.5">
                      {STATUS_ORDER.map((s) => (
                        <button
                          key={s}
                          onClick={() => updateStatus(app.id, s)}
                          className="sketch-tag !text-xs !py-0.5 !px-2 cursor-pointer"
                          style={{ borderColor: STATUS_CONFIG[s].color, color: STATUS_CONFIG[s].color, background: app.status === s ? STATUS_CONFIG[s].bg : "transparent" }}
                        >
                          {STATUS_CONFIG[s].label}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <button
                      onClick={() => setEditingId(app.id)}
                      className="sketch-tag !text-sm cursor-pointer"
                      style={{ borderColor: STATUS_CONFIG[app.status].color, color: STATUS_CONFIG[app.status].color, background: STATUS_CONFIG[app.status].bg }}
                    >
                      {STATUS_CONFIG[app.status].label}
                    </button>
                  )}
                  <button onClick={() => deleteApp(app.id)} className="text-lg opacity-40 hover:opacity-80 transition-opacity" style={{ color: "var(--marker-red)" }}>×</button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {apps.length > 0 && (
        <p className="text-center text-xs mt-5" style={{ fontFamily: "var(--font-alt)", color: "var(--pencil-gray)" }}>
          💡 Click any status badge to update it · × to delete · Data saved locally in your browser
        </p>
      )}
    </motion.section>
  );
}
