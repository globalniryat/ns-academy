"use client";

import React, { useState } from "react";
import Link from "next/link";
import { GraduationCap, Mail, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setLoading(false);

    if (resetError) {
      setError(resetError.message);
      return;
    }

    setSent(true);
  };

  return (
    <div className="min-h-screen bg-offwhite flex items-center justify-center px-4 py-16">
      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-10 h-10 bg-blue rounded-xl flex items-center justify-center shadow-md">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-navy">NS Academy</span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          {sent ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="font-heading text-2xl font-bold text-navy mb-2">Email sent!</h2>
              <p className="text-muted text-sm mb-6">
                Check <strong className="text-bodytext">{email}</strong> for a password reset link.
              </p>
              <Link href="/login">
                <Button variant="default" className="w-full">Back to Login</Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-blue" />
                </div>
                <div>
                  <h1 className="font-heading text-xl font-bold text-navy">Reset your password</h1>
                  <p className="text-muted text-xs">We&apos;ll send a reset link to your email</p>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-5 flex gap-3">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-red-600">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" variant="default" className="w-full h-11"
                  loading={loading} loadingText="Sending...">
                  Send Reset Link
                </Button>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-sm text-muted mt-6">
          Remember your password?{" "}
          <Link href="/login" className="text-blue font-semibold hover:underline">Back to login</Link>
        </p>
      </div>
    </div>
  );
}
