"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface User { name: string; email: string; year?: string; }

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("alignx_user");
    if (stored) setUser(JSON.parse(stored));
  }, [pathname]);

  const logout = () => { localStorage.removeItem("alignx_user"); setUser(null); };

  const navLinks = [
    { href: "/", label: "🏠 Home" },
    { href: "/opportunities", label: "🎯 Opportunities" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-3" style={{ background: "rgba(250, 246, 240, 0.9)", backdropFilter: "blur(12px)", borderBottom: "2px dashed var(--paper-lines)" }}>
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <span className="text-2xl">✏️</span>
          <span className="text-2xl font-bold" style={{ fontFamily: "var(--font-heading)", color: "var(--ink-dark)" }}>
            Align<span style={{ color: "var(--marker-blue)" }}>X</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="px-4 py-1.5 transition-all" style={{ fontFamily: "var(--font-alt)", fontSize: "1rem", color: pathname === link.href ? "var(--marker-blue)" : "var(--ink-medium)", borderBottom: pathname === link.href ? "2.5px solid var(--marker-blue)" : "2.5px solid transparent" }}>
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 sketch-border-light" style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}>
                <span className="text-xl">🎓</span>
                <span style={{ fontFamily: "var(--font-handwritten)", fontSize: "1.1rem", color: "var(--ink-dark)" }}>{user.name}</span>
              </div>
              <button onClick={logout} className="sketch-btn !py-1.5 !px-4 !text-sm" style={{ boxShadow: "2px 2px 0px var(--ink-dark)" }}>Logout</button>
            </div>
          ) : (
            <>
              <Link href="/auth?mode=login" className="sketch-btn !py-1.5 !px-4 !text-base" style={{ boxShadow: "2px 2px 0px var(--ink-dark)" }}>Login</Link>
              <Link href="/auth?mode=signup" className="sketch-btn sketch-btn-primary !py-1.5 !px-4 !text-base">Sign Up ✨</Link>
            </>
          )}
        </div>

        <button className="md:hidden text-2xl" onClick={() => setMenuOpen(!menuOpen)} style={{ color: "var(--ink-dark)" }}>{menuOpen ? "✕" : "☰"}</button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div className="md:hidden px-4 pb-4 pt-2 mt-2 space-y-2" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ borderTop: "1.5px dashed var(--paper-lines)" }}>
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className="block py-2" style={{ fontFamily: "var(--font-alt)", color: pathname === link.href ? "var(--marker-blue)" : "var(--ink-medium)" }}>{link.label}</Link>
            ))}
            {user ? (
              <button onClick={logout} className="sketch-btn w-full !text-sm !py-1.5">Logout</button>
            ) : (
              <div className="flex gap-2 pt-1">
                <Link href="/auth?mode=login" onClick={() => setMenuOpen(false)} className="sketch-btn !text-sm !py-1.5 !px-3">Login</Link>
                <Link href="/auth?mode=signup" onClick={() => setMenuOpen(false)} className="sketch-btn sketch-btn-primary !text-sm !py-1.5 !px-3">Sign Up</Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
