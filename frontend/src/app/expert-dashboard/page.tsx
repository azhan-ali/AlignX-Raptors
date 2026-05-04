"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";

interface ExpertListing {
  id: string;
  type: "mentor" | "advisor";
  title: string;
  description: string;
  skills: string[];
  pricing: "free" | "paid";
  price?: string;
  availability: string;
  // Advisor-specific
  companyDetails?: string;
  interviewTips?: string;
  createdAt: string;
}

interface Booking {
  id: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  listingId: string;
  listingTitle: string;
  listingType: "mentor" | "advisor";
  message: string;
  status: "pending" | "accepted" | "completed";
  createdAt: string;
}

export default function ExpertDashboardPage() {
  const { user, loading } = useAuth(true);
  const [activeTab, setActiveTab] = useState<"overview" | "listings" | "students" | "add">("overview");
  const [listings, setListings] = useState<ExpertListing[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [addType, setAddType] = useState<"mentor" | "advisor">("mentor");

  const [newListing, setNewListing] = useState({
    title: "", description: "", skills: "", pricing: "free" as "free" | "paid",
    price: "", availability: "Weekdays Evening", companyDetails: "", interviewTips: "",
  });

  useEffect(() => {
    if (!user) return;
    const stored = localStorage.getItem(`alignx_expert_listings_${user.email}`);
    if (stored) setListings(JSON.parse(stored));
    const storedB = localStorage.getItem(`alignx_expert_bookings_${user.email}`);
    if (storedB) setBookings(JSON.parse(storedB));
  }, [user]);

  const saveListings = (updated: ExpertListing[]) => {
    setListings(updated);
    if (!user) return;
    localStorage.setItem(`alignx_expert_listings_${user.email}`, JSON.stringify(updated));
    // Update global lists
    const allMentors = JSON.parse(localStorage.getItem("alignx_all_mentors") || "[]");
    const allAdvisors = JSON.parse(localStorage.getItem("alignx_all_advisors") || "[]");
    const filteredM = allMentors.filter((m: { email: string }) => m.email !== user.email);
    const filteredA = allAdvisors.filter((a: { email: string }) => a.email !== user.email);

    updated.forEach(l => {
      const entry = {
        email: user.email, name: user.name, phone: user.phone || "",
        role: "industry_expert", company: user.company || "", designation: user.designation || "",
        industry: user.industry || "", experienceYears: user.experienceYears || "",
        listingId: l.id, title: l.title, description: l.description,
        skills: l.skills, pricing: l.pricing, price: l.price, availability: l.availability,
      };
      if (l.type === "mentor") filteredM.push(entry);
      else filteredA.push({ ...entry, companyDetails: l.companyDetails, interviewTips: l.interviewTips });
    });
    localStorage.setItem("alignx_all_mentors", JSON.stringify(filteredM));
    localStorage.setItem("alignx_all_advisors", JSON.stringify(filteredA));
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListing.title || !newListing.description) return;
    const listing: ExpertListing = {
      id: Date.now().toString(), type: addType,
      title: newListing.title, description: newListing.description,
      skills: newListing.skills.split(",").map(s => s.trim()).filter(Boolean),
      pricing: newListing.pricing, price: newListing.pricing === "paid" ? newListing.price : undefined,
      availability: newListing.availability, createdAt: new Date().toLocaleDateString(),
      ...(addType === "advisor" && { companyDetails: newListing.companyDetails, interviewTips: newListing.interviewTips }),
    };
    saveListings([...listings, listing]);
    setNewListing({ title: "", description: "", skills: "", pricing: "free", price: "", availability: "Weekdays Evening", companyDetails: "", interviewTips: "" });
    setActiveTab("listings");
  };

  const deleteListing = (id: string) => saveListings(listings.filter(l => l.id !== id));

  const updateBookingStatus = (id: string, status: "accepted" | "completed") => {
    const updated = bookings.map(b => b.id === id ? { ...b, status } : b);
    setBookings(updated);
    if (user) localStorage.setItem(`alignx_expert_bookings_${user.email}`, JSON.stringify(updated));
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--paper-bg)" }}>
      <div className="text-center"><div className="sketch-spinner mx-auto mb-4" />
        <p style={{ fontFamily: "var(--font-handwritten)", color: "var(--marker-purple)", fontSize: "1.3rem" }}>Loading expert dashboard...</p>
      </div>
    </div>
  );
  if (!user) return null;

  const mentorListings = listings.filter(l => l.type === "mentor");
  const advisorListings = listings.filter(l => l.type === "advisor");
  const TABS = [
    { id: "overview", label: "📊 Overview" },
    { id: "listings", label: "📋 My Listings" },
    { id: "students", label: "👥 Students" },
    { id: "add", label: "➕ Add Listing" },
  ] as const;

  return (
    <>
      <Navbar />
      <main className="pt-20 pb-20 min-h-screen">
        <div className="max-w-5xl mx-auto px-4">
          {/* Header */}
          <motion.div className="mb-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl sketch-border-purple" style={{ background: "rgba(139,107,181,0.15)" }}>💼</div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: "var(--font-heading)", color: "var(--ink-dark)" }}>Hey, {user.name}! 👋</h1>
                <p className="text-base" style={{ fontFamily: "var(--font-alt)", color: "var(--pencil-gray)" }}>
                  Industry Expert · {user.company} · {user.designation}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            {[
              { icon: "📚", value: mentorListings.length, label: "Mentor Courses", color: "var(--marker-green)" },
              { icon: "🏢", value: advisorListings.length, label: "Advisor Listings", color: "var(--marker-purple)" },
              { icon: "👥", value: bookings.length, label: "Total Students", color: "var(--marker-blue)" },
              { icon: "⏳", value: bookings.filter(b => b.status === "pending").length, label: "Pending", color: "var(--marker-orange)" },
            ].map(s => (
              <motion.div key={s.label} className="sketch-card text-center !py-5" whileHover={{ y: -3 }}>
                <p className="text-3xl mb-1">{s.icon}</p>
                <p className="text-3xl font-bold" style={{ fontFamily: "var(--font-handwritten)", color: s.color }}>{s.value}</p>
                <p className="text-xs" style={{ fontFamily: "var(--font-alt)", color: "var(--pencil-gray)" }}>{s.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Tabs */}
          <div className="flex gap-1 p-1 sketch-card !py-1 !px-1 mb-8 w-fit flex-wrap">
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className="px-4 py-2 transition-all text-sm"
                style={{ fontFamily: "var(--font-alt)", borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px",
                  background: activeTab === tab.id ? "var(--marker-purple)" : "transparent",
                  color: activeTab === tab.id ? "white" : "var(--ink-light)",
                  fontWeight: activeTab === tab.id ? "600" : "normal" }}>
                {tab.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* OVERVIEW */}
            {activeTab === "overview" && (
              <motion.div key="overview" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <div className="grid md:grid-cols-2 gap-5 mb-8">
                  <motion.button onClick={() => { setAddType("mentor"); setActiveTab("add"); }} className="sketch-card sketch-border-green w-full text-center !py-8" whileHover={{ y: -4 }}>
                    <p className="text-5xl mb-3">📚</p>
                    <p className="text-xl font-bold" style={{ fontFamily: "var(--font-heading)", color: "var(--marker-green)" }}>Add as Mentor</p>
                    <p className="text-sm" style={{ fontFamily: "var(--font-alt)", color: "var(--pencil-gray)" }}>Teach courses & share knowledge</p>
                  </motion.button>
                  <motion.button onClick={() => { setAddType("advisor"); setActiveTab("add"); }} className="sketch-card sketch-border-purple w-full text-center !py-8" whileHover={{ y: -4 }}>
                    <p className="text-5xl mb-3">🏢</p>
                    <p className="text-xl font-bold" style={{ fontFamily: "var(--font-heading)", color: "var(--marker-purple)" }}>Add as Advisor</p>
                    <p className="text-sm" style={{ fontFamily: "var(--font-alt)", color: "var(--pencil-gray)" }}>Share company culture & interview tips</p>
                  </motion.button>
                </div>
                {listings.length === 0 && (
                  <div className="sketch-card text-center py-16">
                    <p className="text-5xl mb-4">💼</p>
                    <h2 className="text-3xl mb-2" style={{ fontFamily: "var(--font-heading)", color: "var(--ink-dark)" }}>No listings yet!</h2>
                    <p className="text-lg mb-6" style={{ fontFamily: "var(--font-body)", color: "var(--ink-light)" }}>Add yourself as a Mentor or Company Advisor to start helping students.</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* LISTINGS */}
            {activeTab === "listings" && (
              <motion.div key="listings" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <h2 className="text-2xl mb-6" style={{ fontFamily: "var(--font-heading)", color: "var(--ink-dark)" }}>📋 Your Listings ({listings.length})</h2>
                {listings.length === 0 ? (
                  <div className="sketch-card text-center py-12">
                    <p className="text-4xl mb-3">📭</p>
                    <p className="text-xl" style={{ fontFamily: "var(--font-handwritten)", color: "var(--ink-light)" }}>No listings yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {listings.map((l, idx) => (
                      <motion.div key={l.id} className={`sketch-card ${l.type === "mentor" ? "sketch-border-green" : "sketch-border-purple"}`}
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
                        <div className="flex justify-between items-start flex-wrap gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                              <span className="text-xl">{l.type === "mentor" ? "📚" : "🏢"}</span>
                              <p className="text-xl font-bold" style={{ fontFamily: "var(--font-heading)", color: "var(--ink-dark)" }}>{l.title}</p>
                              <span className="sketch-tag !text-xs !py-0.5 !px-2" style={{
                                borderColor: l.type === "mentor" ? "var(--marker-green)" : "var(--marker-purple)",
                                color: l.type === "mentor" ? "var(--marker-green)" : "var(--marker-purple)",
                              }}>{l.type === "mentor" ? "Mentor" : "Advisor"}</span>
                              <span className="sketch-tag !text-xs !py-0.5 !px-2" style={{
                                borderColor: l.pricing === "free" ? "var(--marker-green)" : "var(--marker-orange)",
                                color: l.pricing === "free" ? "var(--marker-green)" : "var(--marker-orange)",
                              }}>{l.pricing === "free" ? "🆓 Free" : `💰 ₹${l.price}`}</span>
                            </div>
                            <p className="text-sm mb-2" style={{ fontFamily: "var(--font-body)", color: "var(--ink-medium)" }}>{l.description}</p>
                            {l.companyDetails && <p className="text-sm mb-1 italic" style={{ fontFamily: "var(--font-alt)", color: "var(--marker-purple)" }}>🏢 {l.companyDetails}</p>}
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {l.skills.map(s => <span key={s} className="sketch-tag !text-xs !py-0.5 !px-2">{s}</span>)}
                            </div>
                          </div>
                          <button onClick={() => deleteListing(l.id)} className="text-xl opacity-40 hover:opacity-80" style={{ color: "var(--marker-red)" }}>×</button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* STUDENTS */}
            {activeTab === "students" && (
              <motion.div key="students" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <h2 className="text-2xl mb-6" style={{ fontFamily: "var(--font-heading)", color: "var(--ink-dark)" }}>👥 Student Requests ({bookings.length})</h2>
                {bookings.length === 0 ? (
                  <div className="sketch-card text-center py-12">
                    <p className="text-4xl mb-3">📭</p>
                    <p className="text-xl" style={{ fontFamily: "var(--font-handwritten)", color: "var(--ink-light)" }}>No requests yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((b, idx) => (
                      <motion.div key={b.id} className="sketch-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                        style={{ borderColor: b.status === "pending" ? "var(--marker-orange)" : "var(--marker-green)" }}>
                        <div className="flex justify-between items-start flex-wrap gap-3">
                          <div>
                            <p className="text-lg font-bold" style={{ fontFamily: "var(--font-heading)" }}>👤 {b.studentName}</p>
                            <p className="text-sm" style={{ fontFamily: "var(--font-body)", color: "var(--ink-medium)" }}>{b.listingType === "mentor" ? "📚" : "🏢"} {b.listingTitle}</p>
                            <p className="text-sm" style={{ color: "var(--ink-medium)" }}>📧 {b.studentEmail} · 📱 {b.studentPhone}</p>
                            {b.message && <p className="text-sm mt-2 p-2 rounded-lg italic" style={{ background: "var(--highlight-blue)", color: "var(--ink-medium)" }}>💬 &quot;{b.message}&quot;</p>}
                          </div>
                          <div className="flex gap-2">
                            {b.status === "pending" && <button onClick={() => updateBookingStatus(b.id, "accepted")} className="sketch-btn !text-sm !py-1.5 !px-3" style={{ borderColor: "var(--marker-green)", color: "var(--marker-green)" }}>✅ Accept</button>}
                            {b.status === "accepted" && <button onClick={() => updateBookingStatus(b.id, "completed")} className="sketch-btn !text-sm !py-1.5 !px-3" style={{ borderColor: "var(--marker-blue)", color: "var(--marker-blue)" }}>🎉 Complete</button>}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* ADD LISTING */}
            {activeTab === "add" && (
              <motion.div key="add" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <h2 className="text-2xl mb-4" style={{ fontFamily: "var(--font-heading)", color: "var(--ink-dark)" }}>
                  ➕ Add as {addType === "mentor" ? "Mentor 📚" : "Company Advisor 🏢"}
                </h2>
                {/* Type toggle */}
                <div className="flex gap-3 mb-6">
                  {(["mentor", "advisor"] as const).map(t => (
                    <button key={t} onClick={() => setAddType(t)} className="sketch-tag !text-base cursor-pointer flex-1 text-center !py-3"
                      style={{ borderColor: addType === t ? (t === "mentor" ? "var(--marker-green)" : "var(--marker-purple)") : "var(--pencil-gray)",
                        color: addType === t ? (t === "mentor" ? "var(--marker-green)" : "var(--marker-purple)") : "var(--ink-light)",
                        background: addType === t ? (t === "mentor" ? "var(--highlight-green)" : "rgba(139,107,181,0.15)") : "transparent" }}>
                      {t === "mentor" ? "📚 As Mentor" : "🏢 As Advisor"}
                    </button>
                  ))}
                </div>

                <div className={`sketch-card ${addType === "mentor" ? "sketch-border-green" : "sketch-border-purple"}`}>
                  <form onSubmit={handleAdd} className="space-y-5">
                    <div>
                      <label className="block text-sm mb-1" style={{ fontFamily: "var(--font-alt)", color: "var(--ink-light)" }}>
                        {addType === "mentor" ? "Course Title 📖" : "Advisory Topic 🏢"}
                      </label>
                      <input type="text" placeholder={addType === "mentor" ? "e.g. System Design, ML..." : "e.g. Life at Google, Amazon Interview..."} value={newListing.title} onChange={e => setNewListing(p => ({ ...p, title: e.target.value }))} className="sketch-input w-full" required />
                    </div>
                    <div>
                      <label className="block text-sm mb-1" style={{ fontFamily: "var(--font-alt)", color: "var(--ink-light)" }}>Description 📝</label>
                      <textarea placeholder="What will you cover?" value={newListing.description} onChange={e => setNewListing(p => ({ ...p, description: e.target.value }))} className="sketch-textarea" required />
                    </div>

                    {addType === "advisor" && (
                      <>
                        <div>
                          <label className="block text-sm mb-1" style={{ fontFamily: "var(--font-alt)", color: "var(--ink-light)" }}>Company Culture Details 🏢</label>
                          <textarea placeholder="Work-life balance, team culture, growth..." value={newListing.companyDetails} onChange={e => setNewListing(p => ({ ...p, companyDetails: e.target.value }))} className="sketch-textarea" />
                        </div>
                        <div>
                          <label className="block text-sm mb-1" style={{ fontFamily: "var(--font-alt)", color: "var(--ink-light)" }}>Interview Tips 💡</label>
                          <textarea placeholder="Rounds, questions, preparation tips..." value={newListing.interviewTips} onChange={e => setNewListing(p => ({ ...p, interviewTips: e.target.value }))} className="sketch-textarea" />
                        </div>
                      </>
                    )}

                    <div>
                      <label className="block text-sm mb-1" style={{ fontFamily: "var(--font-alt)", color: "var(--ink-light)" }}>Skills / Topics (comma separated)</label>
                      <input type="text" placeholder="e.g. React, Node.js..." value={newListing.skills} onChange={e => setNewListing(p => ({ ...p, skills: e.target.value }))} className="sketch-input w-full" />
                    </div>

                    <div>
                      <label className="block text-sm mb-2" style={{ fontFamily: "var(--font-alt)", color: "var(--ink-light)" }}>Pricing 💰</label>
                      <div className="flex gap-3">
                        {(["free", "paid"] as const).map(p => (
                          <button key={p} type="button" onClick={() => setNewListing(prev => ({ ...prev, pricing: p }))} className="sketch-tag !text-base cursor-pointer flex-1 text-center !py-3"
                            style={{ borderColor: newListing.pricing === p ? (p === "free" ? "var(--marker-green)" : "var(--marker-orange)") : "var(--pencil-gray)",
                              color: newListing.pricing === p ? (p === "free" ? "var(--marker-green)" : "var(--marker-orange)") : "var(--ink-light)",
                              background: newListing.pricing === p ? (p === "free" ? "var(--highlight-green)" : "rgba(232,133,58,0.1)") : "transparent" }}>
                            {p === "free" ? "🆓 Free" : "💰 Paid"}
                          </button>
                        ))}
                      </div>
                    </div>
                    {newListing.pricing === "paid" && (
                      <div>
                        <label className="block text-sm mb-1" style={{ fontFamily: "var(--font-alt)", color: "var(--ink-light)" }}>Price (₹)</label>
                        <input type="text" placeholder="e.g. 500" value={newListing.price} onChange={e => setNewListing(p => ({ ...p, price: e.target.value }))} className="sketch-input w-full" />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm mb-1" style={{ fontFamily: "var(--font-alt)", color: "var(--ink-light)" }}>Availability 🕐</label>
                      <input type="text" placeholder="e.g. Weekends, Flexible..." value={newListing.availability} onChange={e => setNewListing(p => ({ ...p, availability: e.target.value }))} className="sketch-input w-full" />
                    </div>

                    <button type="submit" className="sketch-btn w-full !text-xl !py-3" style={{
                      background: addType === "mentor" ? "var(--marker-green)" : "var(--marker-purple)",
                      color: "white", borderColor: addType === "mentor" ? "#4a8a4d" : "#6b4f91",
                      boxShadow: `4px 4px 0px ${addType === "mentor" ? "#4a8a4d" : "#6b4f91"}`,
                    }}>
                      {addType === "mentor" ? "📚 Add Mentor Listing" : "🏢 Add Advisor Listing"}
                    </button>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </>
  );
}
