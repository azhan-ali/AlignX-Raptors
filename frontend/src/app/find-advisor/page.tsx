"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";

interface AdvisorEntry {
  email: string; name: string; phone: string; role: string;
  company: string; designation: string; industry: string; experienceYears: string;
  listingId: string; title: string; description: string;
  companyDetails?: string; interviewTips?: string;
  skills: string[]; pricing: "free" | "paid"; price?: string; availability: string;
}

export default function FindAdvisorPage() {
  const { user, loading } = useAuth(true);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<AdvisorEntry[]>([]);
  const [searched, setSearched] = useState(false);
  const [selectedAdvisor, setSelectedAdvisor] = useState<AdvisorEntry | null>(null);
  const [bookingMsg, setBookingMsg] = useState("");
  const [booked, setBooked] = useState(false);

  // Seed sample advisors
  useEffect(() => {
    const existing = JSON.parse(localStorage.getItem("alignx_all_advisors") || "[]");
    if (existing.length === 0) {
      const samples: AdvisorEntry[] = [
        { email: "vikram@demo.com", name: "Vikram Rao", phone: "+91 99887 76655", role: "industry_expert", company: "Google", designation: "Senior SDE", industry: "IT / Software", experienceYears: "5-10 years", listingId: "a1", title: "Life at Google — Engineering Culture", description: "Learn about Google's engineering culture, interview process, and growth opportunities", companyDetails: "Open culture, 20% projects, great WLB, free food, amazing perks. Team-driven development with code reviews.", interviewTips: "5 rounds: 2 coding, 1 system design, 1 behavioral, 1 Googleyness. Prepare on LeetCode medium-hard.", skills: ["Google", "SDE", "Interview Prep"], pricing: "free", availability: "Weekends" },
        { email: "sneha@demo.com", name: "Sneha Gupta", phone: "+91 88776 65544", role: "industry_expert", company: "Amazon", designation: "SDE-1", industry: "IT / Software", experienceYears: "1-3 years", listingId: "a2", title: "Amazon Interview & Culture Guide", description: "Everything about Amazon's LP-based interviews and Day 1 culture", companyDetails: "Fast-paced, ownership-driven, LP matters a lot. PIP culture exists but growth is rapid for performers.", interviewTips: "Focus on Leadership Principles. STAR method for behavioral. 3 coding rounds + 1 bar raiser.", skills: ["Amazon", "Leadership Principles", "Interview"], pricing: "paid", price: "300", availability: "Flexible" },
        { email: "karan@demo.com", name: "Karan Mehta", phone: "+91 77665 54433", role: "industry_expert", company: "Microsoft", designation: "PM Lead", industry: "IT / Software", experienceYears: "3-5 years", listingId: "a3", title: "Microsoft — PM & Engineering Culture", description: "Product management culture at Microsoft, growth path, and interview prep", companyDetails: "Great WLB, strong engineering culture, emphasis on growth mindset. Satya era has been transformative.", interviewTips: "PM: Case study + product sense + analytical. SDE: 4 coding rounds. Focus on communication.", skills: ["Microsoft", "Product Management", "Culture"], pricing: "free", availability: "Saturday Mornings" },
      ];
      localStorage.setItem("alignx_all_advisors", JSON.stringify(samples));
    }
  }, []);

  const handleSearch = () => {
    if (!query.trim()) return;
    const allAdvisors: AdvisorEntry[] = JSON.parse(localStorage.getItem("alignx_all_advisors") || "[]");
    const queryWords = query.toLowerCase().split(/\s+/);
    const scored = allAdvisors
      .filter(a => a.email !== user?.email)
      .map(a => {
        const text = `${a.title} ${a.description} ${a.companyDetails || ""} ${a.company} ${a.industry} ${a.skills.join(" ")}`.toLowerCase();
        let score = 0;
        queryWords.forEach(w => { if (text.includes(w)) score += 10; });
        return { ...a, matchScore: score };
      })
      .filter(a => a.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore);
    setResults(scored);
    setSearched(true);
  };

  const handleBook = () => {
    if (!selectedAdvisor || !user) return;
    const booking = {
      id: Date.now().toString(), studentName: user.name, studentEmail: user.email,
      studentPhone: user.phone || "", listingId: selectedAdvisor.listingId,
      listingTitle: selectedAdvisor.title, listingType: "advisor" as const,
      courseId: selectedAdvisor.listingId, courseTitle: selectedAdvisor.title,
      message: bookingMsg, status: "pending" as const, createdAt: new Date().toLocaleDateString(),
    };
    const key = `alignx_expert_bookings_${selectedAdvisor.email}`;
    const existing = JSON.parse(localStorage.getItem(key) || "[]");
    existing.push(booking);
    localStorage.setItem(key, JSON.stringify(existing));
    setBooked(true);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="sketch-spinner mx-auto" /></div>;

  return (
    <>
      <Navbar />
      <main className="pt-20 pb-20 min-h-screen">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div className="text-center mb-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl font-bold mb-3" style={{ fontFamily: "var(--font-heading)", color: "var(--ink-dark)" }}>
              🏢 Company <span style={{ color: "var(--marker-purple)" }}>Culture</span> Advisor
            </h1>
            <p className="text-lg" style={{ fontFamily: "var(--font-body)", color: "var(--ink-light)" }}>
              Curious about a company? Find someone who works there and get real insights!
            </p>
          </motion.div>

          {/* Search */}
          <motion.div className="sketch-card sketch-border-purple mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <label className="block text-sm mb-1" style={{ fontFamily: "var(--font-alt)", color: "var(--ink-light)" }}>🔍 Which company or industry interests you?</label>
                <input type="text" placeholder="e.g. Google culture, Amazon interview tips, Microsoft PM..." value={query} onChange={e => setQuery(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSearch()} className="sketch-input w-full" />
              </div>
              <button onClick={handleSearch} className="sketch-btn !text-base !py-2.5 !px-6" style={{ background: "var(--marker-purple)", color: "white", borderColor: "#6b4f91", boxShadow: "4px 4px 0px #6b4f91" }}>
                🏢 Find Advisors
              </button>
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            {searched && results.length === 0 && (
              <motion.div key="no-results" className="sketch-card text-center py-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <p className="text-4xl mb-3">😔</p>
                <p className="text-xl" style={{ fontFamily: "var(--font-handwritten)", color: "var(--ink-light)" }}>No advisors found for &quot;{query}&quot;</p>
                <p className="text-sm mt-2" style={{ fontFamily: "var(--font-alt)", color: "var(--pencil-gray)" }}>Try searching for a different company!</p>
              </motion.div>
            )}

            {results.length > 0 && !selectedAdvisor && (
              <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="text-2xl mb-4" style={{ fontFamily: "var(--font-heading)", color: "var(--ink-dark)" }}>🏢 {results.length} Advisor{results.length > 1 ? "s" : ""} Found</h2>
                <div className="space-y-5">
                  {results.map((a, idx) => (
                    <motion.div key={a.listingId} className="sketch-card sketch-border-purple" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl" style={{ border: "2px dashed var(--marker-purple)", background: "rgba(139,107,181,0.1)" }}>💼</div>
                        <div>
                          <p className="text-xl font-bold" style={{ fontFamily: "var(--font-handwritten)", color: "var(--ink-dark)" }}>{a.name}</p>
                          <p className="text-xs" style={{ fontFamily: "var(--font-alt)", color: "var(--pencil-gray)" }}>💼 {a.company} · {a.designation} · {a.experienceYears}</p>
                        </div>
                        <span className="ml-auto sketch-tag !text-xs !py-0.5 !px-2" style={{ borderColor: a.pricing === "free" ? "var(--marker-green)" : "var(--marker-orange)", color: a.pricing === "free" ? "var(--marker-green)" : "var(--marker-orange)" }}>
                          {a.pricing === "free" ? "🆓 Free" : `💰 ₹${a.price}`}
                        </span>
                      </div>
                      <p className="text-lg font-bold mb-1" style={{ fontFamily: "var(--font-heading)", color: "var(--marker-purple)" }}>{a.title}</p>
                      <p className="text-sm mb-3" style={{ fontFamily: "var(--font-body)", color: "var(--ink-medium)" }}>{a.description}</p>

                      {a.companyDetails && (
                        <div className="p-3 rounded-lg mb-3" style={{ background: "rgba(139,107,181,0.06)", border: "1.5px dashed var(--marker-purple)" }}>
                          <p className="text-sm font-bold mb-1" style={{ fontFamily: "var(--font-alt)", color: "var(--marker-purple)" }}>🏢 Company Culture:</p>
                          <p className="text-sm" style={{ fontFamily: "var(--font-body)", color: "var(--ink-medium)" }}>{a.companyDetails}</p>
                        </div>
                      )}
                      {a.interviewTips && (
                        <div className="p-3 rounded-lg mb-3" style={{ background: "var(--highlight-blue)", border: "1.5px dashed var(--marker-blue)" }}>
                          <p className="text-sm font-bold mb-1" style={{ fontFamily: "var(--font-alt)", color: "var(--marker-blue)" }}>💡 Interview Tips:</p>
                          <p className="text-sm" style={{ fontFamily: "var(--font-body)", color: "var(--ink-medium)" }}>{a.interviewTips}</p>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {a.skills.map(s => <span key={s} className="sketch-tag !text-xs !py-0.5 !px-2" style={{ borderColor: "var(--marker-purple)", color: "var(--marker-purple)" }}>{s}</span>)}
                      </div>
                      <button onClick={() => { setSelectedAdvisor(a); setBooked(false); setBookingMsg(""); }} className="sketch-btn w-full !text-base !py-2" style={{ borderColor: "var(--marker-purple)", color: "var(--marker-purple)", boxShadow: "3px 3px 0px var(--marker-purple)" }}>
                        📅 Book This Advisor
                      </button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Booking */}
            {selectedAdvisor && (
              <motion.div key="booking" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <button onClick={() => setSelectedAdvisor(null)} className="mb-4 text-sm flex items-center gap-1 hover:opacity-70" style={{ fontFamily: "var(--font-alt)", color: "var(--marker-purple)" }}>← Back to results</button>

                {booked ? (
                  <motion.div className="sketch-card sketch-border-green text-center py-10" initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
                    <p className="text-5xl mb-3">🎉</p>
                    <h2 className="text-3xl mb-2" style={{ fontFamily: "var(--font-heading)", color: "var(--marker-green)" }}>Booking Sent!</h2>
                    <p className="text-base mb-4" style={{ fontFamily: "var(--font-body)", color: "var(--ink-medium)" }}>
                      Your request has been sent to <strong>{selectedAdvisor.name}</strong> ({selectedAdvisor.company}).
                    </p>
                    <div className="sketch-card !py-4 !px-6 inline-block mb-4" style={{ borderColor: "var(--marker-purple)", background: "rgba(139,107,181,0.08)" }}>
                      <p className="text-sm" style={{ fontFamily: "var(--font-alt)", color: "var(--ink-dark)" }}>📱 Phone: <strong>{selectedAdvisor.phone}</strong></p>
                      <p className="text-sm" style={{ fontFamily: "var(--font-alt)", color: "var(--ink-dark)" }}>📧 Email: <strong>{selectedAdvisor.email}</strong></p>
                    </div>
                    <p className="text-sm" style={{ fontFamily: "var(--font-alt)", color: "var(--pencil-gray)" }}>Contact them directly for faster response!</p>
                  </motion.div>
                ) : (
                  <div className="sketch-card sketch-border-purple">
                    <h2 className="text-2xl mb-4" style={{ fontFamily: "var(--font-heading)", color: "var(--ink-dark)" }}>📅 Book {selectedAdvisor.name}</h2>
                    <div className="p-4 rounded-lg mb-4" style={{ background: "rgba(139,107,181,0.06)" }}>
                      <p className="font-bold" style={{ fontFamily: "var(--font-heading)", color: "var(--marker-purple)" }}>{selectedAdvisor.title}</p>
                      <p className="text-sm" style={{ fontFamily: "var(--font-alt)", color: "var(--ink-medium)" }}>
                        💼 {selectedAdvisor.company} · {selectedAdvisor.pricing === "free" ? "🆓 Free" : `💰 ₹${selectedAdvisor.price}`} · 🕐 {selectedAdvisor.availability}
                      </p>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm mb-1" style={{ fontFamily: "var(--font-alt)", color: "var(--ink-light)" }}>💬 What would you like to know?</label>
                      <textarea placeholder="Hi! I want to know about..." value={bookingMsg} onChange={e => setBookingMsg(e.target.value)} className="sketch-textarea" />
                    </div>
                    <button onClick={handleBook} className="sketch-btn w-full !text-xl !py-3" style={{ background: "var(--marker-purple)", color: "white", borderColor: "#6b4f91", boxShadow: "4px 4px 0px #6b4f91" }}>
                      📅 Confirm Booking
                    </button>
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
