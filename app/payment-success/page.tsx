"use client";

import React, { useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle, PlayCircle, LayoutDashboard, ArrowRight, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const courseId = searchParams?.get("course") || "";
  const courseTitle = searchParams?.get("title")
    ? decodeURIComponent(searchParams.get("title")!)
    : "Your Course";

  // Confetti-like animation using CSS
  useEffect(() => {
    document.title = "Payment Successful — CA Portal";
  }, []);

  return (
    <div className="min-h-screen bg-offwhite flex items-center justify-center px-4 py-16 pt-24">
      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-green-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-teal/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <motion.div
          className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 md:p-10 text-center"
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {/* Success icon */}
          <motion.div
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <CheckCircle className="w-10 h-10 text-green-600" />
          </motion.div>

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <h1 className="font-heading text-2xl md:text-3xl font-bold text-navy mb-2">
              Payment Successful!
            </h1>
            <p className="text-muted text-sm mb-6">
              You now have <strong className="text-navy">lifetime access</strong> to
            </p>

            {/* Course name pill */}
            <div className="bg-navy/5 border border-navy/10 rounded-xl px-4 py-3 mb-6 flex items-center gap-3 text-left">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-blue text-white"
              >
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-navy text-sm leading-tight">{courseTitle}</p>
                <p className="text-xs text-muted mt-0.5">Full course access unlocked</p>
              </div>
            </div>

            {/* What's included */}
            <div className="bg-green-50 border border-green-100 rounded-xl p-4 mb-7 text-left space-y-2">
              {[
                "All video lessons unlocked immediately",
                "Study materials & PDF notes",
                "Mobile & desktop access",
                "Certificate of completion",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2.5 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span className="text-green-800">{item}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-3">
              <Link href={courseId ? `/dashboard/${courseId}` : "/dashboard"} className="block">
                <Button
                  variant="default"
                  className="w-full h-12 gap-2 text-base"
                  id="start-learning-btn"
                >
                  <PlayCircle className="w-5 h-5" />
                  Start Learning Now
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/dashboard" className="block">
                <Button variant="outline" className="w-full gap-2" id="go-dashboard-btn">
                  <LayoutDashboard className="w-4 h-4" />
                  Go to Dashboard
                </Button>
              </Link>
            </div>

            {/* Transaction note */}
            <p className="text-xs text-muted mt-6">
              A receipt has been sent to your registered email address.{" "}
              <Link href="/refund" className="text-blue hover:underline">
                Refund policy
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-offwhite">
          <div className="w-8 h-8 border-2 border-blue border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
