"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";

interface MentorCourse {
  id: string;
  title: string;
  description: string;
  skills: string[];
  pricing: "free" | "paid";
  price?: string;
  availability: string;
  createdAt: string;
}

interface Booking {
  id: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  courseId: string;
  courseTitle: string;
  message: string;
  status: "pending" | "accepted" | "completed";
  createdAt: string;
}

export default function MentorDashboardPage() {
  const { user, loading } = useAuth(true);
  const [activeTab, setActiveTab] = useState<"overview" | "courses" | "students" | "add">("overview");
  const [courses, setCourses] = useState<MentorCourse[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  // Add course form
  const [newCourse, setNewCourse] = useState({
    title: "", description: "", skills: "", pricing: "free" as "free" | "paid", price: "", availability: "Weekdays Evening",
  });

  useEffect(() => {
    if (!user) return;
    const storedCourses = localStorage.getItem(`alignx_mentor_courses_${user.email}`);
    if (storedCourses) setCourses(JSON.parse(storedCourses));
    const storedBookings = localStorage.getItem(`alignx_mentor_bookings_${user.email}`);
    if (storedBookings) setBookings(JSON.parse(storedBookings));
  }, [user]);

  const saveCourses = (updated: MentorCourse[]) => {
    setCourses(updated);
    if (user) localStorage.setItem(`alignx_mentor_courses_${user.email}`, JSON.stringify(updated));
    // Also update global mentors list
    updateGlobalMentorList(updated);
  };

  const updateGlobalMentorList = (updatedCourses: MentorCourse[]) => {
    if (!user) return;
    const allMentors = JSON.parse(localStorage.getItem("alignx_all_mentors") || "[]");
    // Remove existing entries for this user
    const filtered = allMentors.filter((m: { email: string }) => m.email !== user.email);
    // Add updated entries
    updatedCourses.forEach(course => {
      filtered.push({
        email: user.email,
        name: user.name,
        phone: user.phone || "",
        role: "student_mentor",
        college: user.college || "",
        branch: user.branch || "",
        courseId: course.id,
        courseTitle: course.title,
        courseDescription: course.description,
        skills: course.skills,
        pricing: course.pricing,
        price: course.price,
        availability: course.availability,
      });
    });
    localStorage.setItem("alignx_all_mentors", JSON.stringify(filtered));
  };

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourse.title || !newCourse.description) return;

    const course: MentorCourse = {
      id: Date.now().toString(),
      title: newCourse.title,
      description: newCourse.description,
      skills: newCourse.skills.split(",").map(s => s.trim()).filter(Boolean),
      pricing: newCourse.pricing,
      price: newCourse.pricing === "paid" ? newCourse.price : undefined,
      availability: newCourse.availability,
      createdAt: new Date().toLocaleDateString(),
    };

    saveCourses([...courses, course]);
    setNewCourse({ title: "", description: "", skills: "", pricing: "free", price: "", availability: "Weekdays Evening" });
    setActiveTab("courses");
  };

  const deleteCourse = (id: string) => {
    saveCourses(courses.filter(c => c.id !== id));
  };

  const updateBookingStatus = (id: string, status: "accepted" | "completed") => {
    const updated = bookings.map(b => b.id === id ? { ...b, status } : b);
    setBookings(updated);
    if (user) localStorage.setItem(`alignx_mentor_bookings_${user.email}`, JSON.stringify(updated));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--paper-bg)" }}>
        <div className="text-center">
          <div className="sketch-spinner mx-auto mb-4" />
          <p style={{ fontFamily: "var(--font-handwritten)", color: "var(--marker-green)", fontSize: "1.3rem" }}>Loading mentor dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const TABS = [
    { id: "overview", label: "📊 Overview" },
    { id: "courses", label: "📚 My Courses" },
    { id: "students", label: "👥 Students" },
    { id: "add", label: "➕ Add Course" },
  ] as const;

  return (
    <>
      <Navbar />
      <main className="pt-20 pb-20 min-h-screen">
        <div className="max-w-5xl mx-auto px-4">

          {/* Header */}
          <motion.div className="mb-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl sketch-border-green" style={{ background: "var(--highlight-green)" }}>
                📚
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: "var(--font-heading)", color: "var(--ink-dark)" }}>
                  Hey, {user.name}! 👋
                </h1>
                <p className="text-base" style={{ fontFamily: "var(--font-alt)", color: "var(--pencil-gray)" }}>
                  Student Mentor · {user.college} · {user.branch}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            {[
              { icon: "📚", value: courses.length, label: "Courses Listed", color: "var(--marker-green)" },
              { icon: "👥", value: bookings.length, label: "Total Students", color: "var(--marker-blue)" },
              { icon: "⏳", value: bookings.filter(b => b.status === "pending").length, label: "Pending", color: "var(--marker-orange)" },
              { icon: "✅", value: bookings.filter(b => b.status === "completed").length, label: "Completed", color: "var(--marker-purple)" },
            ].map((s) => (
              <motion.div key={s.label} className="sketch-card text-center !py-5" whileHover={{ y: -3 }}>
                <p className="text-3xl mb-1">{s.icon}</p>
                <p className="text-3xl font-bold" style={{ fontFamily: "var(--font-handwritten)", color: s.color }}>{s.value}</p>
                <p className="text-xs" style={{ fontFamily: "var(--font-alt)", color: "var(--pencil-gray)" }}>{s.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Tabs */}
          <div className="flex gap-1 p-1 sketch-card !py-1 !px-1 mb-8 w-fit flex-wrap">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="px-4 py-2 transition-all text-sm"
                style={{
                  fontFamily: "var(--font-alt)",
                  borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px",
                  background: activeTab === tab.id ? "var(--marker-green)" : "transparent",
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

            {/* OVERVIEW */}
            {activeTab === "overview" && (
              <motion.div key="overview" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <div className="grid md:grid-cols-3 gap-5 mb-8">
                  {[
                    { icon: "➕", title: "Add New Course", desc: "List a subject you can teach", onClick: () => setActiveTab("add"), color: "var(--marker-green)", border: "sketch-border-green" },
                    { icon: "📚", title: "View Courses", desc: "See your listed courses", onClick: () => setActiveTab("courses"), color: "var(--marker-blue)", border: "sketch-border-blue" },
                    { icon: "👥", title: "Student Requests", desc: "Review booking requests", onClick: () => setActiveTab("students"), color: "var(--marker-orange)", border: "sketch-border-orange" },
                  ].map((card) => (
                    <motion.button key={card.title} onClick={card.onClick} className={`sketch-card ${card.border} w-full text-center !py-6`} whileHover={{ y: -4 }}>
                      <p className="text-4xl mb-2">{card.icon}</p>
                      <p className="text-xl font-bold" style={{ fontFamily: "var(--font-heading)", color: card.color }}>{card.title}</p>
                      <p className="text-sm" style={{ fontFamily: "var(--font-alt)", color: "var(--pencil-gray)" }}>{card.desc}</p>
                    </motion.button>
                  ))}
                </div>

                {courses.length === 0 && (
                  <div className="sketch-card text-center py-16">
                    <p className="text-5xl mb-4">📚</p>
                    <h2 className="text-3xl mb-2" style={{ fontFamily: "var(--font-heading)", color: "var(--ink-dark)" }}>
                      No courses listed yet!
                    </h2>
                    <p className="text-lg mb-6" style={{ fontFamily: "var(--font-body)", color: "var(--ink-light)" }}>
                      Start helping others by listing what you can teach.
                    </p>
                    <button onClick={() => setActiveTab("add")} className="sketch-btn sketch-btn-primary !text-xl !py-4 !px-10" style={{ background: "var(--marker-green)", borderColor: "#4a8a4d" }}>
                      ➕ Add Your First Course
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {/* COURSES */}
            {activeTab === "courses" && (
              <motion.div key="courses" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <h2 className="text-2xl mb-6" style={{ fontFamily: "var(--font-heading)", color: "var(--ink-dark)" }}>
                  📚 Your Listed Courses <span className="text-lg" style={{ color: "var(--pencil-gray)" }}>({courses.length})</span>
                </h2>

                {courses.length === 0 ? (
                  <div className="sketch-card text-center py-12">
                    <p className="text-4xl mb-3">📭</p>
                    <p className="text-xl" style={{ fontFamily: "var(--font-handwritten)", color: "var(--ink-light)" }}>No courses yet.</p>
                    <button onClick={() => setActiveTab("add")} className="sketch-btn mt-4 !text-sm" style={{ borderColor: "var(--marker-green)", color: "var(--marker-green)" }}>
                      ➕ Add Course
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {courses.map((course, idx) => (
                      <motion.div
                        key={course.id}
                        className="sketch-card sketch-border-green"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        <div className="flex justify-between items-start flex-wrap gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <p className="text-xl font-bold" style={{ fontFamily: "var(--font-heading)", color: "var(--ink-dark)" }}>
                                {course.title}
                              </p>
                              <span
                                className="sketch-tag !text-xs !py-0.5 !px-3"
                                style={{
                                  borderColor: course.pricing === "free" ? "var(--marker-green)" : "var(--marker-orange)",
                                  color: course.pricing === "free" ? "var(--marker-green)" : "var(--marker-orange)",
                                  background: course.pricing === "free" ? "var(--highlight-green)" : "rgba(232,133,58,0.1)",
                                }}
                              >
                                {course.pricing === "free" ? "🆓 Free" : `💰 ₹${course.price}`}
                              </span>
                            </div>
                            <p className="text-sm mb-2" style={{ fontFamily: "var(--font-body)", color: "var(--ink-medium)" }}>
                              {course.description}
                            </p>
                            <div className="flex flex-wrap gap-1.5 mb-2">
                              {course.skills.map(s => (
                                <span key={s} className="sketch-tag !text-xs !py-0.5 !px-2" style={{ borderColor: "var(--marker-green)", color: "var(--marker-green)" }}>{s}</span>
                              ))}
                            </div>
                            <p className="text-xs" style={{ fontFamily: "var(--font-alt)", color: "var(--pencil-gray)" }}>
                              🕐 {course.availability} · Added {course.createdAt}
                            </p>
                          </div>
                          <button onClick={() => deleteCourse(course.id)} className="text-xl opacity-40 hover:opacity-80 transition-opacity" style={{ color: "var(--marker-red)" }} title="Delete">
                            ×
                          </button>
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
                <h2 className="text-2xl mb-6" style={{ fontFamily: "var(--font-heading)", color: "var(--ink-dark)" }}>
                  👥 Student Requests <span className="text-lg" style={{ color: "var(--pencil-gray)" }}>({bookings.length})</span>
                </h2>

                {bookings.length === 0 ? (
                  <div className="sketch-card text-center py-12">
                    <p className="text-4xl mb-3">📭</p>
                    <p className="text-xl" style={{ fontFamily: "var(--font-handwritten)", color: "var(--ink-light)" }}>No student requests yet.</p>
                    <p className="text-sm mt-2" style={{ fontFamily: "var(--font-alt)", color: "var(--pencil-gray)" }}>
                      Once students book your courses, they&apos;ll appear here!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking, idx) => (
                      <motion.div
                        key={booking.id}
                        className="sketch-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        style={{ borderColor: booking.status === "pending" ? "var(--marker-orange)" : booking.status === "accepted" ? "var(--marker-blue)" : "var(--marker-green)" }}
                      >
                        <div className="flex justify-between items-start flex-wrap gap-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-lg font-bold" style={{ fontFamily: "var(--font-heading)", color: "var(--ink-dark)" }}>
                                👤 {booking.studentName}
                              </p>
                              <span className="sketch-tag !text-xs !py-0.5 !px-2" style={{
                                borderColor: booking.status === "pending" ? "var(--marker-orange)" : booking.status === "accepted" ? "var(--marker-blue)" : "var(--marker-green)",
                                color: booking.status === "pending" ? "var(--marker-orange)" : booking.status === "accepted" ? "var(--marker-blue)" : "var(--marker-green)",
                              }}>
                                {booking.status === "pending" ? "⏳ Pending" : booking.status === "accepted" ? "✅ Accepted" : "🎉 Completed"}
                              </span>
                            </div>
                            <p className="text-sm" style={{ fontFamily: "var(--font-body)", color: "var(--ink-medium)" }}>
                              📚 {booking.courseTitle}
                            </p>
                            <p className="text-sm" style={{ fontFamily: "var(--font-body)", color: "var(--ink-medium)" }}>
                              📧 {booking.studentEmail} · 📱 {booking.studentPhone}
                            </p>
                            {booking.message && (
                              <p className="text-sm mt-2 p-2 rounded-lg italic" style={{ background: "var(--highlight-blue)", fontFamily: "var(--font-alt)", color: "var(--ink-medium)" }}>
                                💬 &quot;{booking.message}&quot;
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            {booking.status === "pending" && (
                              <button onClick={() => updateBookingStatus(booking.id, "accepted")} className="sketch-btn !text-sm !py-1.5 !px-3" style={{ borderColor: "var(--marker-green)", color: "var(--marker-green)", boxShadow: "2px 2px 0px var(--marker-green)" }}>
                                ✅ Accept
                              </button>
                            )}
                            {booking.status === "accepted" && (
                              <button onClick={() => updateBookingStatus(booking.id, "completed")} className="sketch-btn !text-sm !py-1.5 !px-3" style={{ borderColor: "var(--marker-blue)", color: "var(--marker-blue)", boxShadow: "2px 2px 0px var(--marker-blue)" }}>
                                🎉 Complete
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* ADD COURSE */}
            {activeTab === "add" && (
              <motion.div key="add" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <h2 className="text-2xl mb-6" style={{ fontFamily: "var(--font-heading)", color: "var(--ink-dark)" }}>
                  ➕ Add Yourself as a Mentor
                </h2>

                <div className="sketch-card sketch-border-green">
                  <form onSubmit={handleAddCourse} className="space-y-5">
                    <div>
                      <label className="block text-sm mb-1" style={{ fontFamily: "var(--font-alt)", color: "var(--ink-light)" }}>Course / Subject Title 📖</label>
                      <input type="text" placeholder="e.g. Data Structures & Algorithms, Web Dev with React..." value={newCourse.title} onChange={(e) => setNewCourse(p => ({ ...p, title: e.target.value }))} className="sketch-input w-full" required />
                    </div>

                    <div>
                      <label className="block text-sm mb-1" style={{ fontFamily: "var(--font-alt)", color: "var(--ink-light)" }}>Description 📝</label>
                      <textarea placeholder="What will you teach? Who is it for? Any prerequisites?" value={newCourse.description} onChange={(e) => setNewCourse(p => ({ ...p, description: e.target.value }))} className="sketch-textarea" required />
                    </div>

                    <div>
                      <label className="block text-sm mb-1" style={{ fontFamily: "var(--font-alt)", color: "var(--ink-light)" }}>Skills Covered (comma separated) 💡</label>
                      <input type="text" placeholder="e.g. Arrays, Linked Lists, Trees, Graphs..." value={newCourse.skills} onChange={(e) => setNewCourse(p => ({ ...p, skills: e.target.value }))} className="sketch-input w-full" />
                    </div>

                    <div>
                      <label className="block text-sm mb-2" style={{ fontFamily: "var(--font-alt)", color: "var(--ink-light)" }}>Pricing 💰</label>
                      <div className="flex gap-3">
                        {(["free", "paid"] as const).map(p => (
                          <button key={p} type="button" onClick={() => setNewCourse(prev => ({ ...prev, pricing: p }))}
                            className="sketch-tag !text-base cursor-pointer flex-1 text-center !py-3"
                            style={{
                              borderColor: newCourse.pricing === p ? (p === "free" ? "var(--marker-green)" : "var(--marker-orange)") : "var(--pencil-gray)",
                              color: newCourse.pricing === p ? (p === "free" ? "var(--marker-green)" : "var(--marker-orange)") : "var(--ink-light)",
                              background: newCourse.pricing === p ? (p === "free" ? "var(--highlight-green)" : "rgba(232,133,58,0.1)") : "transparent",
                            }}
                          >
                            {p === "free" ? "🆓 Free" : "💰 Paid"}
                          </button>
                        ))}
                      </div>
                    </div>

                    {newCourse.pricing === "paid" && (
                      <div>
                        <label className="block text-sm mb-1" style={{ fontFamily: "var(--font-alt)", color: "var(--ink-light)" }}>Price (₹ per session) 💵</label>
                        <input type="text" placeholder="e.g. 200, 500..." value={newCourse.price} onChange={(e) => setNewCourse(p => ({ ...p, price: e.target.value }))} className="sketch-input w-full" />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm mb-1" style={{ fontFamily: "var(--font-alt)", color: "var(--ink-light)" }}>Availability 🕐</label>
                      <input type="text" placeholder="e.g. Weekdays Evening, Weekends, Flexible..." value={newCourse.availability} onChange={(e) => setNewCourse(p => ({ ...p, availability: e.target.value }))} className="sketch-input w-full" />
                    </div>

                    <button type="submit" className="sketch-btn w-full !text-xl !py-3" style={{ background: "var(--marker-green)", color: "white", borderColor: "#4a8a4d", boxShadow: "4px 4px 0px #4a8a4d" }}>
                      📚 Add Course & Go Live
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
