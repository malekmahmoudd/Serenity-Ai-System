"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { useRouter } from "next/navigation";
import { debugSession } from "@/lib/debug";

interface User {
  _id: string;
  name: string;
  email: string;
}

interface SessionContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const routerRef = useRef(router);
  const checkInFlightRef = useRef(false);

  useEffect(() => {
    routerRef.current = router;
  }, [router]);

  const checkSession = useCallback(async () => {
    if (checkInFlightRef.current) {
      debugSession("checkSession: skipped (request already in flight)");
      return;
    }
    checkInFlightRef.current = true;
    debugSession("checkSession: start");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setUser(null);
        debugSession("checkSession: no token");
        return;
      }

      debugSession("checkSession: GET /api/auth/me");
      const response = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      debugSession("checkSession: /api/auth/me status", response.status);

      if (response.ok) {
        const data = await response.json();
        const userData = data.user as User & { password?: string };
        setUser({
          _id: userData._id,
          name: userData.name,
          email: userData.email,
        });
        debugSession("checkSession: user loaded");
      } else {
        setUser(null);
        localStorage.removeItem("token");
        debugSession("checkSession: unauthorized, token cleared");
      }
    } catch (error) {
      console.error("SessionContext: Error checking session:", error);
      setUser(null);
      localStorage.removeItem("token");
    } finally {
      checkInFlightRef.current = false;
      setLoading(false);
      debugSession("checkSession: end");
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      setUser(null);
      routerRef.current.push("/");
    }
  }, []);

  useEffect(() => {
    debugSession("SessionProvider: mount → initial checkSession");
    void checkSession();
  }, [checkSession]);

  const value = useMemo<SessionContextType>(
    () => ({
      user,
      loading,
      isAuthenticated: !!user,
      logout,
      checkSession,
    }),
    [user, loading, logout, checkSession]
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
