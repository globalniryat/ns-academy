"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { Shield, Lightbulb, Wallet, Clock, RefreshCcw, Heart } from "lucide-react";

const features = [
  {
    icon: Lightbulb,
    title: "Logic-First Teaching",
    description:
      "Every concept is explained from first principles. You'll understand why formulas exist — not just how to use them. Rote memorization is the enemy.",
    color: "text-gold",
    bg: "bg-gold/10",
  },
  {
    icon: RefreshCcw,
    title: "100% Money-Back Guarantee",
    description:
      "If you don't find value in the course, we'll refund every rupee — no questions asked, no forms to fill. Your satisfaction is our guarantee.",
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    icon: Shield,
    title: "Secure & DRM-Protected",
    description:
      "Your paid content is 100% secure with enterprise-grade DRM protection. No downloads, no piracy — your investment is protected.",
    color: "text-blue",
    bg: "bg-blue/10",
  },
  {
    icon: Heart,
    title: "Zero Prior Knowledge Needed",
    description:
      "The course is designed from the ground up to work even if you have never studied finance before. Everyone starts somewhere.",
    color: "text-red-500",
    bg: "bg-red-50",
  },
  {
    icon: Wallet,
    title: "UPI & Card Payments",
    description:
      "Pay your way — UPI, Paytm, cards all accepted. One-time payment, instant access. No subscriptions ever.",
    color: "text-teal",
    bg: "bg-teal/10",
  },
  {
    icon: Clock,
    title: "Lifetime Access",
    description:
      "Lifetime access to all course materials. Revise before each attempt. No deadlines, no expiry, no extra charges.",
    color: "text-navy",
    bg: "bg-navy/10",
  },
];

export default function WhyUs() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-20 md:py-28 bg-white" ref={ref} id="about">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-blue font-semibold text-sm uppercase tracking-widest mb-3">
            Why Choose This Course
          </p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy mb-4">
            Built Different for CA Final Students
          </h2>
          <p className="text-muted max-w-xl mx-auto">
            Everything designed around how real CA students need to understand, 
            retain, and apply concepts under exam pressure.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className="flex gap-5 p-6 rounded-2xl border border-gray-100 hover:border-blue/20 hover:shadow-md transition-all duration-300 group"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.08, duration: 0.5 }}
            >
              <div
                className={`w-12 h-12 ${f.bg} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}
              >
                <f.icon className={`w-6 h-6 ${f.color}`} />
              </div>
              <div>
                <h3 className="font-bold text-navy mb-2">{f.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{f.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Money-back guarantee banner */}
        <motion.div
          className="mt-12 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-6 text-center md:text-left"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center flex-shrink-0">
            <RefreshCcw className="w-8 h-8 text-green-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-heading text-xl font-bold text-green-900 mb-1">
              100% Money-Back Guarantee — No Questions Asked
            </h3>
            <p className="text-green-800/80 text-sm leading-relaxed">
              We&apos;re so confident in the quality of CA Nikesh Shah&apos;s teaching that we offer a
              complete, hassle-free refund if you don&apos;t find the course valuable. No forms, no
              follow-ups, just your money back. Your trust means everything to us.
            </p>
          </div>
          <div className="flex-shrink-0">
            <Link href="/login">
              <div className="bg-green-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl cursor-pointer hover:bg-green-700 transition-colors">
                Risk-Free Enrollment
              </div>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
