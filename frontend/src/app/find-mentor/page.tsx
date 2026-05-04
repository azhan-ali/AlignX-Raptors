"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";

interface MentorEntry {
  email: string; name: string; phone: string; role: string;
  college?: string; branch?: string; company?: string; designation?: string;
  courseId: string; courseTitle: string; courseDescription?: string;
  skills: string[]; pricing: "free" | "paid"; price?: string; availability: string;
}

export default function FindMentorPage() {
  const { user, loading } = useAuth(true);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<MentorEntry[]>([]);
  const [searched, setSearched] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState<MentorEntry | null>(null);
  const [bookingMsg, setBookingMsg] = useState("");
  const [booked, setBooked] = useState(false);

  const handleSearch = () => {
    if (!query.trim()) return;
    const allMentors: MentorEntry[] = JSON.parse(localStorage.getItem("alignx_all_mentors") || "[]");
    // AI-like matching: score by keyword overlap
    const queryWords = query.toLowerCase().split(/\s+/);
    const scored = allMentors
      .filter(m => m.email !== user?.email) // don't show self
      .map(m => {
        const text = `${m.courseTitle} ${m.courseDescription || ""} ${m.skills.join(" ")} ${m.college || ""} ${m.company || ""}`.toLowerCase();
        let score = 0;
        queryWords.forEach(w => { if (text.includes(w)) score += 10; });
        m.skills.forEach(s => { if (query.toLowerCase().includes(s.toLowerCase())) score += 20; });
        return { ...m, matchScore: score };
      })
      .filter(m => m.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore);
    setResults(scored);
    setSearched(true);
  };

  const handleBook = () => {
    if (!selectedMentor || !user) return;
    const booking = {
      id: Date.now().toString(), studentName: user.name, studentEmail: user.email,
      studentPhone: user.phone || "", courseId: selectedMentor.courseId,
      courseTitle: selectedMentor.courseTitle, listingType: "mentor" as const,
      listingId: selectedMentor.courseId, message: bookingMsg,
      status: "pending" as const, createdAt: new Date().toLocaleDateString(),
    };
    // Save to mentor's bookings
    const key = selectedMentor.role === "student_mentor"
      ? `alignx_mentor_bookings_${selectedMentor.email}`
      : `alignx_expert_bookings_${selectedMentor.email}`;
    const existing = JSON.parse(localStorage.getItem(key) || "[]");
    existing.push(booking);
    localStorage.setItem(key, JSON.stringify(existing));
    setBooked(true);
  };

  // Load sample mentors if none exist
  useEffect(() => {
    const existing = JSON.parse(localStorage.getItem("alignx_all_mentors") || "[]");
    if (existing.length === 0) {
      const samples = [
        { email: "rahul@demo.com", name: "Rahul Sharma", phone: "+91 98765 43210", role: "student_mentor", college: "IIT Delhi", branch: "CSE", courseId: "s1", courseTitle: "Data Structures & Algorithms", courseDescription: "Complete DSA from basics to advanced with practice problems", skills: ["Arrays", "Trees", "Graphs", "DP", "DSA"], pricing: "free" as const, price: "", availability: "Weekdays Evening" },
        { email: "priya@demo.com", name: "Priya Patel", phone: "+91 87654 32109", role: "student_mentor", college: "BITS Pilani", branch: "ECE", courseId: "s2", courseTitle: "Machine Learning Fundamentals", courseDescription: "ML basics, scikit-learn, neural networks intro", skills: ["Python", "ML", "TensorFlow", "Data Science"], pricing: "paid" as const, price: "200", availability: "Weekends" },
        { email: "amit@demo.com", name: "Amit Kumar", phone: "+91 76543 21098", role: "industry_expert", company: "Google", designation: "SDE-2", courseId: "e1", courseTitle: "System Design Masterclass", courseDescription: "Learn system design for interviews and real-world applications", skills: ["System Design", "Distributed Systems", "Backend"], pricing: "paid" as const, price: "500", availability: "Saturdays" },
        { email: "neha@demo.com", name: "Neha Singh", phone: "+91 65432 10987", role: "industry_expert", company: "Microsoft", designation: "PM", courseId: "e2", courseTitle: "Web Development with React", courseDescription: "Full-stack web development using React, Node.js", skills: ["React", "JavaScript", "Node.js", "Web Dev"], pricing: "free" as const, price: "", availability: "Flexible" },
      ];
      localStorage.setItem("alignx_all_mentors", JSON.stringify(samples));
    }
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center"><div className="sketch-spinner mx-auto" /></div>
  );

  return (
    <>
      <Navbar />
      <main className="pt-20 pb-20 min-h-screen">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div className="text-center mb-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl font-bold mb-3" style={{ fontFamily: "var(--font-heading)", color: "var(--ink-dark)" }}>
              👨‍🏫 AI <span style={{ color: "var(--marker-blue)" }}>Mentor</span> Match
            </h1>
            <p className="text-lg" style={{ fontFamily: "var(--font-body)", color: "var(--ink-light)" }}>
              Tell us what you want to learn — our AI will find the perfect mentor for you!
            </p>
          </motion.div>

          {/* Search */}
          <motion.div className="sketch-card sketch-border-blue mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <label className="block text-sm mb-1" style={{ fontFamily: "var(--font-alt)", color: "var(--ink-light)" }}>🔍 What do you want to learn?</label>
                <input type="text" placeholder="e.g. I want to learn DSA, React, Machine Learning..." value={query} onChange={e => setQuery(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSearch()} className="sketch-input w-full" />
              </div>
              <button onClick={handleSearch} className="sketch-btn sketch-btn-primary !text-base !py-2.5 !px-6">🎯 Find Mentors</button>
            </div>
          </motion.div>

          {/* Results */}
          <AnimatePresence mode="wait">
            {searched && results.length === 0 && (
              <motion.div key="no-results" className="sketch-card text-center py-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <p className="text-4xl mb-3">😔</p>
                <p className="text-xl" style={{ fontFamily: "var(--font-handwritten)", color: "var(--ink-light)" }}>No mentors found for &quot;{query}&quot;</p>
                <p className="text-sm mt-2" style={{ fontFamily: "var(--font-alt)", color: "var(--pencil-gray)" }}>Try different keywords or check back later!</p>
              </motion.div>
            )}

            {results.length > 0 && !selectedMentor && (
              <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="text-2xl mb-4" style={{ fontFamily: "var(--font-heading)", color: "var(--ink-dark)" }}>
                  🎯 {results.length} Mentor{results.length > 1 ? "s" : ""} Found
                </h2>
                <div className="grid md:grid-cols-2 gap-5">
                  {results.map((m, idx) => (
                    <motion.div key={m.courseId + m.email} className="sketch-card sketch-border-blue" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }} whileHover={{ y: -3 }}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl" style={{ border: "2px dashed var(--marker-blue)", background: "var(--highlight-blue)" }}>
                          {m.role === "student_mentor" ? "📚" : "💼"}
                        </div>
                        <div>
                          <p className="text-xl font-bold" style={{ fontFamily: "var(--font-handwritten)", color: "var(--ink-dark)" }}>{m.name}</p>
                          <p className="text-xs" style={{ fontFamily: "var(--font-alt)", color: "var(--pencil-gray)" }}>
                            {m.role === "student_mentor" ? `🎓 ${m.college} · ${m.branch}` : `💼 ${m.company} · ${m.designation}`}
                          </p>
                        </div>
                        <span className="ml-auto sketch-tag !text-xs !py-0.5 !px-2" style={{
                          borderColor: m.pricing === "free" ? "var(--marker-green)" : "var(--marker-orange)",
                          color: m.pricing === "free" ? "var(--marker-green)" : "var(--marker-orange)",
                        }}>
                          {m.pricing === "free" ? "🆓 Free" : `💰 ₹${m.price}`}
                        </span>
                      </div>
                      <p className="text-base font-bold mb-1" style={{ fontFamily: "var(--font-heading)", color: "var(--marker-blue)" }}>{m.courseTitle}</p>
                      {m.courseDescription && <p className="text-sm mb-2" style={{ fontFamily: "var(--font-body)", color: "var(--ink-medium)" }}>{m.courseDescription}</p>}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {m.skills.map(s => <span key={s} className="sketch-tag !text-xs !py-0.5 !px-2" style={{ borderColor: "var(--marker-blue)", color: "var(--marker-blue)" }}>{s}</span>)}
                      </div>
                      <p className="text-xs mb-3" style={{ fontFamily: "var(--font-alt)", color: "var(--pencil-gray)" }}>🕐 {m.availability}</p>
                      <button onClick={() => { setSelectedMentor(m); setBooked(false); setBookingMsg(""); }} className="sketch-btn w-full !text-base !py-2" style={{ borderColor: "var(--marker-blue)", color: "var(--marker-blue)", boxShadow: "3px 3px 0px var(--marker-blue)" }}>
                        📅 Book This Mentor
                      </button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Booking Modal */}
            {selectedMentor && (
              <motion.div key="booking" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <button onClick={() => setSelectedMentor(null)} className="mb-4 text-sm flex items-center gap-1 hover:opacity-70" style={{ fontFamily: "var(--font-alt)", color: "var(--marker-blue)" }}>← Back to results</button>

                {booked ? (
                  <motion.div className="sketch-card sketch-border-green text-center py-10" initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
                    <p className="text-5xl mb-3">🎉</p>
                    <h2 className="text-3xl mb-2" style={{ fontFamily: "var(--font-heading)", color: "var(--marker-green)" }}>Booking Sent!</h2>
                    <p className="text-base mb-4" style={{ fontFamily: "var(--font-body)", color: "var(--ink-medium)" }}>
                      Your request has been sent to <strong>{selectedMentor.name}</strong>. They&apos;ll review it soon!
                    </p>
                    <div className="sketch-card !py-4 !px-6 inline-block mb-4" style={{ borderColor: "var(--marker-blue)", background: "var(--highlight-blue)" }}>
                      <p className="text-sm" style={{ fontFamily: "var(--font-alt)", color: "var(--ink-dark)" }}>📱 Phone: <strong>{selectedMentor.phone}</strong></p>
                      <p className="text-sm" style={{ fontFamily: "var(--font-alt)", color: "var(--ink-dark)" }}>📧 Email: <strong>{selectedMentor.email}</strong></p>
                    </div>
                    <p className="text-sm" style={{ fontFamily: "var(--font-alt)", color: "var(--pencil-gray)" }}>You can also contact them directly!</p>
                  </motion.div>
                ) : (
                  <div className="sketch-card sketch-border-blue">
                    <h2 className="text-2xl mb-4" style={{ fontFamily: "var(--font-heading)", color: "var(--ink-dark)" }}>📅 Book {selectedMentor.name}</h2>
                    <div className="p-4 rounded-lg mb-4" style={{ background: "var(--highlight-blue)" }}>
                      <p className="font-bold" style={{ fontFamily: "var(--font-heading)", color: "var(--marker-blue)" }}>{selectedMentor.courseTitle}</p>
                      <p className="text-sm" style={{ fontFamily: "var(--font-alt)", color: "var(--ink-medium)" }}>
                        {selectedMentor.pricing === "free" ? "🆓 Free" : `💰 ₹${selectedMentor.price}/session`} · 🕐 {selectedMentor.availability}
                      </p>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm mb-1" style={{ fontFamily: "var(--font-alt)", color: "var(--ink-light)" }}>💬 Message to mentor (optional)</label>
                      <textarea placeholder="Hi! I'm interested in learning..." value={bookingMsg} onChange={e => setBookingMsg(e.target.value)} className="sketch-textarea" />
                    </div>
                    <button onClick={handleBook} className="sketch-btn sketch-btn-primary w-full !text-xl !py-3">📅 Confirm Booking</button>
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
