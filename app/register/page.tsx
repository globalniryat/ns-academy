"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, CheckCircle, AlertCircle, GraduationCap, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import GoogleAuthButton from "@/components/auth/GoogleAuthButton";

function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams?.get("redirect") || "/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          phone,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirect)}`,
      },
    });

    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    // If email confirmation is required, show success message
    if (data.user && !data.session) {
      setSuccess(true);
      return;
    }

    // Auto-confirmed (e.g., in dev with email confirmation disabled)
    router.push(redirect);
    router.refresh();
  };

  if (success) {
    return (
      <div className="min-h-screen bg-offwhite flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="font-heading text-2xl font-bold text-navy mb-2">Check your email</h2>
          <p className="text-muted text-sm mb-6">
            We&apos;ve sent a confirmation link to <strong className="text-bodytext">{email}</strong>.
            Click the link to activate your account.
          </p>
          <Link href="/login">
            <Button variant="default" className="w-full">
              Back to Login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-offwhite flex items-center justify-center px-4 py-16">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-10 h-10 bg-blue rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-navy">NS Academy</span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <h1 className="font-heading text-2xl font-bold text-navy mb-1">
            Create your account
          </h1>
          <p className="text-muted text-sm mb-6">
            Join 2,000+ CA students studying with logic, not memorization.
          </p>

          {/* Google OAuth — prominent */}
          <GoogleAuthButton redirectPath={redirect} label="Sign up with Google" />

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-muted">or create account with email</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-5 flex gap-3">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-600">{error}</p>
            </div>
          )}

          {/* Benefits */}
          <div className="grid grid-cols-1 gap-1.5 mb-5">
            {[
              "Free preview lectures before you pay",
              "Track progress across devices",
              "Certificate on course completion",
            ].map((b) => (
              <div key={b} className="flex items-center gap-2 text-xs text-bodytext">
                <CheckCircle className="w-3.5 h-3.5 text-teal flex-shrink-0" />
                {b}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                minLength={2}
              />
            </div>

            <div>
              <Label htmlFor="reg-email">Email address</Label>
              <Input
                id="reg-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="phone">
                Phone Number <span className="text-muted font-normal">(optional)</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="reg-password">Password</Label>
              <div className="relative">
                <Input
                  id="reg-password"
                  type={showPass ? "text" : "password"}
                  placeholder="Minimum 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                  minLength={8}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-bodytext"
                  onClick={() => setShowPass(!showPass)}
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="default"
              className="w-full h-11 text-base"
              loading={loading}
              loadingText="Creating account..."
              id="register-submit"
            >
              Create Account
            </Button>
          </form>

          <p className="text-center text-xs text-muted mt-4">
            By signing up, you agree to our{" "}
            <Link href="/terms" className="text-blue hover:underline">Terms</Link> and{" "}
            <Link href="/privacy" className="text-blue hover:underline">Privacy Policy</Link>
          </p>
        </div>

        <p className="text-center text-sm text-muted mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-blue font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}
