"use client";

import React, { useState, use, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle,
  ShieldCheck,
  Lock,
  CreditCard,
  Smartphone,
  Building2,
  ChevronRight,
  Loader2,
  GraduationCap,
  Clock,
  PlayCircle,
  Infinity as InfinityIcon,
  Copy,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";
import { courses } from "@/lib/courses";
import { cn } from "@/lib/utils";

interface Props {
  params: Promise<{ courseId: string }>;
}

type PaymentMethod = "upi" | "card" | "netbanking";
type ProcessingState = "idle" | "processing" | "success";

const BANKS = [
  { id: "sbi", name: "SBI", color: "#2563EB" },
  { id: "hdfc", name: "HDFC Bank", color: "#004C8F" },
  { id: "icici", name: "ICICI Bank", color: "#F7941D" },
  { id: "axis", name: "Axis Bank", color: "#97144D" },
  { id: "kotak", name: "Kotak Bank", color: "#E31837" },
  { id: "pnb", name: "Punjab National", color: "#007B3E" },
  { id: "bob", name: "Bank of Baroda", color: "#F58220" },
  { id: "union", name: "Union Bank", color: "#003087" },
];

const UPI_ID = "caportal@ybl";

export default function CheckoutPage({ params }: Props) {
  const { courseId } = use(params);
  const { user, isLoggedIn, isLoading, enrollCourse } = useAuth();
  const router = useRouter();

  const course = courses.find((c) => c.id === courseId);

  // Redirect to login if not logged in (wait for hydration)
  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.replace(`/login?redirect=/checkout/${courseId}`);
    }
  }, [isLoading, isLoggedIn, courseId, router]);

  // Redirect to dashboard if already enrolled
  useEffect(() => {
    if (!isLoading && isLoggedIn && user?.enrolled.includes(courseId)) {
      router.replace(`/dashboard/${courseId}`);
    }
  }, [isLoading, isLoggedIn, user, courseId, router]);

  const [method, setMethod] = useState<PaymentMethod>("upi");
  const [upiId, setUpiId] = useState("");
  const [processing, setProcessing] = useState<ProcessingState>("idle");
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Card fields
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-offwhite">
        <Loader2 className="w-8 h-8 animate-spin text-blue" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-offwhite pt-24 flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-navy mb-2">Course Not Found</h2>
          <Link href="/courses">
            <Button>Browse Courses</Button>
          </Link>
        </div>
      </div>
    );
  }

  const discount = Math.round(
    ((course.originalPrice - course.price) / course.originalPrice) * 100
  );
  const gst = Math.round(course.price * 0.18);
  const total = course.price; // price shown is inclusive of GST for simplicity

  const formatCard = (val: string) =>
    val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

  const formatExpiry = (val: string) => {
    const clean = val.replace(/\D/g, "").slice(0, 4);
    return clean.length > 2 ? `${clean.slice(0, 2)}/${clean.slice(2)}` : clean;
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(UPI_ID);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const canPay = (): boolean => {
    if (method === "upi") return upiId.includes("@") || true; // allow QR scan pay too
    if (method === "card")
      return (
        cardNumber.replace(/ /g, "").length >= 16 &&
        cardName.length > 2 &&
        expiry.length === 5 &&
        cvv.length >= 3
      );
    if (method === "netbanking") return !!selectedBank;
    return false;
  };

  const handlePay = async () => {
    setProcessing("processing");
    // Simulate payment gateway processing
    await new Promise((r) => setTimeout(r, 2500));
    enrollCourse(course.id);
    setProcessing("success");
    await new Promise((r) => setTimeout(r, 1200));
    router.push(`/payment-success?course=${course.id}&title=${encodeURIComponent(course.title)}`);
  };

  // ── Processing overlay ──────────────────────────────────────────────────────
  if (processing === "processing") {
    return (
      <div className="min-h-screen bg-navy flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Loader2 className="w-10 h-10 text-white animate-spin" />
          </div>
          <h2 className="font-heading text-2xl font-bold text-white mb-2">
            Processing Payment…
          </h2>
          <p className="text-white/60">Please don't close this window.</p>
          <div className="flex items-center gap-2 mt-6 justify-center text-white/40 text-sm">
            <ShieldCheck className="w-4 h-4" />
            Secured by 256-bit SSL encryption
          </div>
        </div>
      </div>
    );
  }

  // ── Main checkout UI ────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-offwhite pt-16">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-30">
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between">
          <Link
            href={`/courses/${course.slug}`}
            className="flex items-center gap-1.5 text-sm text-muted hover:text-blue transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to course
          </Link>
          <div className="flex items-center gap-1.5 text-sm text-muted">
            <Lock className="w-3.5 h-3.5" />
            Secure Checkout
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Page title */}
        <div className="mb-8">
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-navy">
            Complete Your Enrollment
          </h1>
          <p className="text-muted text-sm mt-1">
            One-time payment — lifetime access. No subscriptions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {/* ── Left: Payment Form (3/5) ────────────────────────────────── */}
          <div className="lg:col-span-3 space-y-5">
            {/* Method tabs */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex border-b border-gray-100">
                {(
                  [
                    { id: "upi", icon: Smartphone, label: "UPI" },
                    { id: "card", icon: CreditCard, label: "Card" },
                    { id: "netbanking", icon: Building2, label: "Net Banking" },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setMethod(tab.id)}
                    id={`pay-tab-${tab.id}`}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-all border-b-2",
                      method === tab.id
                        ? "text-blue border-blue bg-blue/5"
                        : "text-muted border-transparent hover:text-bodytext hover:bg-offwhite"
                    )}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {/* ── UPI ──────────────────────────────────────────────── */}
                {method === "upi" && (
                  <div className="space-y-5">
                    <div className="flex flex-col sm:flex-row gap-6 items-start">
                      {/* QR Code */}
                      <div className="flex-shrink-0">
                        <div className="bg-white rounded-2xl border-2 border-gray-100 p-4 shadow-sm w-fit mx-auto sm:mx-0">
                          <Image
                            src="/upi-qr.png"
                            alt="UPI QR Code — Scan to pay"
                            width={160}
                            height={160}
                            className="rounded-lg"
                          />
                          <p className="text-center text-xs text-muted mt-2">
                            Scan with any UPI app
                          </p>
                        </div>
                      </div>

                      {/* OR divider + UPI ID input */}
                      <div className="flex-1 w-full">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="flex-1 h-px bg-gray-200" />
                          <span className="text-xs text-muted font-medium">OR</span>
                          <div className="flex-1 h-px bg-gray-200" />
                        </div>

                        <div className="mb-4">
                          <Label htmlFor="upi-id" className="text-sm font-medium text-navy mb-1.5 block">
                            Pay to UPI ID
                          </Label>
                          <div className="flex items-center gap-2 bg-offwhite rounded-xl border border-gray-200 px-3 py-2.5">
                            <input
                              readOnly
                              value={UPI_ID}
                              className="flex-1 bg-transparent text-sm font-mono text-navy outline-none"
                            />
                            <button
                              onClick={handleCopyUpi}
                              className="text-blue hover:text-blue/80 transition-colors"
                              title="Copy UPI ID"
                            >
                              {copied ? (
                                <Check className="w-4 h-4 text-green-500" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                          <p className="text-xs text-muted mt-1">
                            Copy this UPI ID and pay from any UPI app
                          </p>
                        </div>

                        <Label htmlFor="upi-input" className="text-sm font-medium text-navy mb-1.5 block">
                          Enter your UPI ID (optional)
                        </Label>
                        <Input
                          id="upi-input"
                          placeholder="yourname@upi"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          className="font-mono"
                        />
                        <p className="text-xs text-muted mt-1.5">
                          e.g. yourname@okicici · yourname@ybl · yourname@paytm
                        </p>
                      </div>
                    </div>

                    {/* UPI App shortcuts */}
                    <div>
                      <p className="text-xs text-muted font-medium mb-3 uppercase tracking-wider">
                        Accepted apps
                      </p>
                      <div className="flex items-center gap-4 flex-wrap">
                        {[
                          { name: "PhonePe", bg: "bg-purple-100", text: "text-purple-700" },
                          { name: "GPay", bg: "bg-blue-50", text: "text-blue" },
                          { name: "Paytm", bg: "bg-sky-100", text: "text-sky-700" },
                          { name: "BHIM", bg: "bg-green-50", text: "text-green-700" },
                          { name: "Amazon Pay", bg: "bg-orange-50", text: "text-orange-600" },
                        ].map((app) => (
                          <span
                            key={app.name}
                            className={`${app.bg} ${app.text} text-xs font-semibold px-3 py-1.5 rounded-full`}
                          >
                            {app.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Card ──────────────────────────────────────────────── */}
                {method === "card" && (
                  <div className="space-y-4">
                    {/* Card number */}
                    <div>
                      <Label htmlFor="card-number" className="mb-1.5 block text-sm font-medium text-navy">
                        Card Number
                      </Label>
                      <div className="relative">
                        <Input
                          id="card-number"
                          placeholder="0000 0000 0000 0000"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(formatCard(e.target.value))}
                          className="font-mono pr-12"
                          maxLength={19}
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                          <div className="w-6 h-4 bg-red-500 rounded-sm opacity-80" />
                          <div className="w-6 h-4 bg-yellow-400 rounded-sm opacity-80 -ml-3" />
                        </div>
                      </div>
                    </div>

                    {/* Card holder */}
                    <div>
                      <Label htmlFor="card-name" className="mb-1.5 block text-sm font-medium text-navy">
                        Name on Card
                      </Label>
                      <Input
                        id="card-name"
                        placeholder="As printed on card"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value.toUpperCase())}
                        className="uppercase tracking-wider"
                      />
                    </div>

                    {/* Expiry + CVV */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="card-expiry" className="mb-1.5 block text-sm font-medium text-navy">
                          Expiry Date
                        </Label>
                        <Input
                          id="card-expiry"
                          placeholder="MM/YY"
                          value={expiry}
                          onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                          className="font-mono"
                          maxLength={5}
                        />
                      </div>
                      <div>
                        <Label htmlFor="card-cvv" className="mb-1.5 block text-sm font-medium text-navy">
                          CVV
                        </Label>
                        <Input
                          id="card-cvv"
                          placeholder="• • •"
                          type="password"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                          className="font-mono"
                          maxLength={4}
                        />
                      </div>
                    </div>

                    <p className="text-xs text-muted flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-teal" />
                      Your card details are encrypted and never stored.
                    </p>
                  </div>
                )}

                {/* ── Net Banking ───────────────────────────────────────── */}
                {method === "netbanking" && (
                  <div>
                    <p className="text-sm font-medium text-navy mb-4">Select your bank</p>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {BANKS.map((bank) => (
                        <button
                          key={bank.id}
                          onClick={() => setSelectedBank(bank.id)}
                          id={`bank-${bank.id}`}
                          className={cn(
                            "flex items-center gap-3 p-3.5 rounded-xl border-2 text-left transition-all",
                            selectedBank === bank.id
                              ? "border-blue bg-blue/5 shadow-sm"
                              : "border-gray-100 hover:border-gray-200 bg-white"
                          )}
                        >
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                            style={{ background: bank.color }}
                          >
                            {bank.name.substring(0, 2).toUpperCase()}
                          </div>
                          <span className="text-sm font-medium text-bodytext leading-tight">
                            {bank.name}
                          </span>
                          {selectedBank === bank.id && (
                            <CheckCircle className="w-4 h-4 text-blue ml-auto flex-shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                    {selectedBank && (
                      <div className="bg-blue/5 border border-blue/20 rounded-xl p-3 text-sm text-blue/80 flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        You'll be redirected to{" "}
                        <strong>{BANKS.find((b) => b.id === selectedBank)?.name}</strong>{" "}
                        secure portal to complete payment.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Pay button */}
            <Button
              variant="default"
              className="w-full h-14 text-base font-semibold rounded-xl gap-2 shadow-lg shadow-blue/20"
              id="pay-now-btn"
              onClick={handlePay}
            >
              <Lock className="w-4 h-4" />
              Pay ₹{total.toLocaleString()} — Get Instant Access
            </Button>

            {/* Trust signals */}
            <div className="flex flex-wrap items-center justify-center gap-5 text-xs text-muted">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-teal" />
                256-bit SSL Encrypted
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-teal" />
                30-day Money-back Guarantee
              </span>
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-teal" />
                Secure Payment
              </span>
            </div>
          </div>

          {/* ── Right: Order Summary (2/5) ──────────────────────────────── */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden sticky top-32">
              {/* Course thumbnail strip */}
              <div
                className="h-2 w-full"
                style={{ background: course.color }}
              />

              <div className="p-6">
                <p className="text-xs text-muted font-semibold uppercase tracking-wider mb-1">
                  Order Summary
                </p>
                <h3 className="font-heading font-bold text-navy text-base leading-snug mb-4">
                  {course.title}
                </h3>

                {/* Course stats */}
                <div className="space-y-2 mb-5">
                  {[
                    { icon: PlayCircle, label: `${course.videoCount} video lessons` },
                    { icon: Clock, label: `${course.duration} total content` },
                    { icon: InfinityIcon, label: "Lifetime access" },
                    { icon: GraduationCap, label: "Certificate of completion" },
                    { icon: Smartphone, label: "Mobile & desktop access" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center gap-2.5 text-sm text-bodytext"
                    >
                      <item.icon className="w-4 h-4 text-teal flex-shrink-0" />
                      {item.label}
                    </div>
                  ))}
                </div>

                {/* Price breakdown */}
                <div className="border-t border-gray-100 pt-4 space-y-2.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted">Original price</span>
                    <span className="line-through text-muted">
                      ₹{course.originalPrice.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-green-600 font-medium">
                      Discount ({discount}% OFF)
                    </span>
                    <span className="text-green-600 font-medium">
                      −₹{(course.originalPrice - course.price).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted">
                    <span>GST (18%)</span>
                    <span>Inclusive</span>
                  </div>
                  <div className="flex items-center justify-between font-bold text-navy text-lg border-t border-gray-100 pt-3">
                    <span>Total</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                </div>

                {/* Guarantee badge */}
                <div className="mt-5 bg-green-50 border border-green-100 rounded-xl p-3 flex items-start gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-green-800">
                      30-Day Money-Back Guarantee
                    </p>
                    <p className="text-xs text-green-700 mt-0.5">
                      Not satisfied? Full refund within 30 days, no questions asked.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
