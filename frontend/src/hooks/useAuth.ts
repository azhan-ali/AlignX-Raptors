"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export type UserRole = "user" | "student_mentor" | "industry_expert";

export interface User {
  name: string;
  email: string;
  year?: string;
  role: UserRole;
  // Student Mentor fields
  college?: string;
  branch?: string;
  semester?: string;
  studentSkills?: string[];
  studentId?: string;
  // Industry Expert fields
  company?: string;
  designation?: string;
  experienceYears?: string;
  industry?: string;
  linkedIn?: string;
  phone?: string;
}

export function useAuth(redirectIfUnauthenticated = true) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("alignx_user");
    if (stored) {
      const parsed = JSON.parse(stored);
      // Backwards compatibility: default to "user" role if missing
      if (!parsed.role) parsed.role = "user";
      setUser(parsed);
    } else if (redirectIfUnauthenticated) {
      router.replace("/auth?mode=login&next=" + encodeURIComponent(window.location.pathname));
    }
    setLoading(false);
  }, [router, redirectIfUnauthenticated]);

  const logout = () => {
    localStorage.removeItem("alignx_user");
    setUser(null);
    router.push("/");
  };

  const getDashboardPath = () => {
    if (!user) return "/dashboard";
    switch (user.role) {
      case "student_mentor": return "/mentor-dashboard";
      case "industry_expert": return "/expert-dashboard";
      default: return "/dashboard";
    }
  };

  return { user, loading, logout, getDashboardPath };
}
