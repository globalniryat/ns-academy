"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only redirect once we know the hydration state (isLoading = false)
    if (!isLoading && !isLoggedIn) {
      router.replace("/login?redirect=" + encodeURIComponent(window.location.pathname));
    }
  }, [isLoading, isLoggedIn, router]);

  // While hydrating from localStorage, show a spinner — NOT a redirect
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-offwhite">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-blue border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{ borderWidth: "3px" }} />
          <p className="text-muted text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  // Not logged in after hydration → redirect already triggered above
  if (!isLoggedIn) return null;

  return <>{children}</>;
}
