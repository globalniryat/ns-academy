"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, CheckCircle, ShieldCheck, Lock,
  Clock, PlayCircle, Infinity as InfinityIcon,
  GraduationCap, Smartphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  courseId: string;
  courseTitle: string;
  courseSlug: string;
  courseColor: string;
  price: number;        // paise
  originalPrice: number; // paise
  duration: string;
  lessonCount: number;
  userName: string;
  userEmail: string;
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function CheckoutClient({
  courseId, courseTitle, courseSlug, courseColor,
  price, originalPrice, duration, lessonCount,
  userName, userEmail,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const priceInRupees = Math.round(price / 100);
  const originalPriceInRupees = Math.round(originalPrice / 100);
  const discountPercent = Math.round(((originalPrice - price) / originalPrice) * 100);
  const savingsInRupees = originalPriceInRupees - priceInRupees;

  const handlePay = async () => {
    setError("");
    setLoading(true);

    try {
      // Step 1: Create order on server
      const orderRes = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      });
      const orderData = await orderRes.json();

      if (!orderData.success) {
        setError(orderData.error || "Failed to create order. Please try again.");
        setLoading(false);
        return;
      }

      // Step 2: Load Razorpay script
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        setError("Failed to load payment gateway. Please check your internet connection.");
        setLoading(false);
        return;
      }

      // Step 3: Open Razorpay checkout modal
      const { orderId, amount, currency, keyId } = orderData.data;

      const options = {
        key: keyId,
        amount,
        currency,
        name: "NS Academy",
        description: courseTitle,
        order_id: orderId,
        prefill: { name: userName, email: userEmail },
        theme: { color: "#16a34a" },
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          // Step 4: Verify payment on server
          try {
            const verifyRes = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                courseId,
              }),
            });
            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              router.push(
                `/payment-success?course=${courseId}&title=${encodeURIComponent(courseTitle)}`
              );
            } else {
              setError("Payment verification failed. Please contact support.");
              setLoading(false);
            }
          } catch {
            setError("Payment verification failed. Please contact support.");
            setLoading(false);
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (response: { error: { description: string } }) => {
        setError(response.error?.description || "Payment failed. Please try again.");
        setLoading(false);
      });
      rzp.open();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-offwhite pt-16">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-30">
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between">
          <Link
            href={`/courses/${courseSlug}`}
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
        <div className="mb-8">
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-navy">
            Complete Your Enrollment
          </h1>
          <p className="text-muted text-sm mt-1">
            One-time payment — lifetime access. No subscriptions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {/* ── Left: Payment panel (3/5) ── */}
          <div className="lg:col-span-3 space-y-5">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
              <div>
                <h2 className="font-heading font-bold text-navy text-lg mb-1">
                  {courseTitle}
                </h2>
                <p className="text-muted text-sm">
                  Lifetime access to all lessons, notes, and certificate.
                </p>
              </div>

              {/* What's included */}
              <div className="space-y-2.5">
                {[
                  { icon: PlayCircle, label: `${lessonCount} video lessons` },
                  { icon: Clock, label: `${duration} total content` },
                  { icon: InfinityIcon, label: "Lifetime access" },
                  { icon: GraduationCap, label: "Certificate of completion" },
                  { icon: Smartphone, label: "Mobile & desktop access" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-2.5 text-sm text-bodytext"
                  >
                    <item.icon className="w-4 h-4 text-teal shrink-0" />
                    {item.label}
                  </div>
                ))}
              </div>

              {/* Error message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {/* Pay button — opens Razorpay modal */}
              <Button
                variant="default"
                className="w-full h-14 text-base font-semibold rounded-xl gap-2 shadow-lg shadow-blue/20"
                onClick={handlePay}
                loading={loading}
                loadingText="Please wait…"
                id="pay-now-btn"
              >
                <Lock className="w-4 h-4" />
                Pay ₹{priceInRupees.toLocaleString("en-IN")} — Get Instant Access
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
                  Powered by Razorpay
                </span>
              </div>
            </div>
          </div>

          {/* ── Right: Order Summary (2/5) ── */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden sticky top-32">
              <div className="h-2 w-full" style={{ background: courseColor }} />

              <div className="p-6">
                <p className="text-xs text-muted font-semibold uppercase tracking-wider mb-1">
                  Order Summary
                </p>
                <h3 className="font-heading font-bold text-navy text-base leading-snug mb-5">
                  {courseTitle}
                </h3>

                {/* Price breakdown */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted">Original price</span>
                    <span className="line-through text-muted">
                      ₹{originalPriceInRupees.toLocaleString("en-IN")}
                    </span>
                  </div>
                  {discountPercent > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-green-600 font-medium">
                        Discount ({discountPercent}% OFF)
                      </span>
                      <span className="text-green-600 font-medium">
                        −₹{savingsInRupees.toLocaleString("en-IN")}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm text-muted">
                    <span>GST (18%)</span>
                    <span>Inclusive</span>
                  </div>
                  <div className="flex items-center justify-between font-bold text-navy text-lg border-t border-gray-100 pt-3">
                    <span>Total</span>
                    <span>₹{priceInRupees.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                {/* Guarantee badge */}
                <div className="mt-5 bg-green-50 border border-green-100 rounded-xl p-3 flex items-start gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
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
