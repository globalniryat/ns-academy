"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export interface User {
  name: string;
  email: string;
  enrolled: string[]; // courseIds the user has PAID for
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean; // true while reading localStorage on mount
  login: (email: string, password: string) => boolean;
  logout: () => void;
  enrollCourse: (courseId: string) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoggedIn: false,
  isLoading: true,
  login: () => false,
  logout: () => {},
  enrollCourse: () => {},
});

// ── Demo credentials ────────────────────────────────────────────────────────
// NOTE: The demo user starts with NO courses enrolled.
// Enrollment only happens after a successful payment on /checkout/[courseId].
// This mirrors real production behaviour where access is payment-gated.
const DEMO_CREDENTIALS = {
  email: "student@demo.com",
  password: "demo123",
  // Base profile — enrolled[] is intentionally empty until payment
  baseUser: {
    name: "Demo Student",
    email: "student@demo.com",
  },
};

const STORAGE_KEY = "ca_portal_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      // ignore parse errors — corrupted storage, start fresh
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    if (
      email.toLowerCase().trim() === DEMO_CREDENTIALS.email &&
      password === DEMO_CREDENTIALS.password
    ) {
      // Check if this user already has a saved session (with prior enrollments).
      // If so, restore it — don't overwrite paid enrollments on re-login.
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed: User = JSON.parse(stored);
          // Only restore if it's the same user (email match)
          if (parsed.email === DEMO_CREDENTIALS.email) {
            setUser(parsed);
            return true;
          }
        }
      } catch {
        // fall through to fresh login
      }

      // Fresh login — start with zero enrollments
      const freshUser: User = {
        ...DEMO_CREDENTIALS.baseUser,
        enrolled: [],
      };
      setUser(freshUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(freshUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  // Called ONLY from the checkout page after payment confirmation
  const enrollCourse = (courseId: string) => {
    if (!user) return;
    if (user.enrolled.includes(courseId)) return; // already enrolled, no-op

    const updated: User = {
      ...user,
      enrolled: [...user.enrolled, courseId],
    };
    setUser(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoggedIn: !!user, isLoading, login, logout, enrollCourse }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
