"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError("Invalid email or password.");
      setLoading(false);
      return;
    }

    // Verify the user is an ADMIN
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError("Authentication failed.");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/admin/stats", { method: "GET" });
    if (res.status === 403 || res.status === 401) {
      await supabase.auth.signOut();
      setError("Access denied. This account does not have admin privileges.");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-blue" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-white">NS Academy</h1>
          <p className="text-white/60 text-sm mt-1">Admin Panel</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="font-heading font-bold text-navy text-lg mb-6">Sign in to continue</h2>

          {error && (
            <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl p-3 mb-5 text-sm text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email" className="mb-1.5 block text-sm font-medium text-navy">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@nsacademy.com"
              />
            </div>

            <div>
              <Label htmlFor="password" className="mb-1.5 block text-sm font-medium text-navy">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              variant="default"
              className="w-full h-11 font-semibold gap-2"
              loading={loading}
              loadingText="Signing in…"
              id="admin-login-btn"
            >
              Sign In
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
