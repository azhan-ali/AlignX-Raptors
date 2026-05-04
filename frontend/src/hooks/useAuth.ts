"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  name: string;
  email: string;
  year?: string;
}

export function useAuth(redirectIfUnauthenticated = true) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("alignx_user");
    if (stored) {
      setUser(JSON.parse(stored));
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

  return { user, loading, logout };
}
