"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { PlayCircle, UserPlus, CreditCard, Infinity, ArrowRight } from "lucide-react";

const steps = [
  {
    number: 1,
    icon: PlayCircle,
    title: "Watch Free Lectures",
    description: "Explore free CA lectures on YouTube before committing to a course.",
    color: "#2563EB",
    bg: "bg-blue-50",
  },
  {
    number: 2,
    icon: UserPlus,
    title: "Create Free Account",
    description: "Sign up in 30 seconds — no credit card needed to get started.",
    color: "#0D9488",
    bg: "bg-teal-50",
  },
  {
    number: 3,
    icon: CreditCard,
    title: "Enroll & Pay",
    description: "One-time UPI or card payment. No subscriptions, ever.",
    color: "#D4A843",
    bg: "bg-yellow-50",
  },
  {
    number: 4,
    icon: Infinity,
    title: "Access Forever",
    description: "Instant lifetime access to all course videos and study materials.",
    color: "#1A2744",
    bg: "bg-slate-100",
  },
];

export default function HowItWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-20 md:py-28 bg-offwhite" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
        >
          <p className="text-blue font-semibold text-sm uppercase tracking-widest mb-3">
            Simple Process
          </p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy mb-4">
            How It Works
          </h2>
          <p className="text-muted max-w-xl mx-auto">
            From free lecture to full course access in 4 simple steps
          </p>
        </motion.div>

        {/* Steps */}
        <div className="flex flex-col lg:flex-row items-start justify-between gap-8 lg:gap-4">
          {steps.map((step, i) => (
            <React.Fragment key={step.number}>
              <motion.div
                className="flex-1 text-center"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                {/* Icon circle */}
                <div className="relative mx-auto mb-5 w-fit">
                  <div
                    className={`w-16 h-16 ${step.bg} rounded-2xl flex items-center justify-center mx-auto shadow-sm border border-white`}
                  >
                    <step.icon className="w-8 h-8" style={{ color: step.color }} />
                  </div>
                  <div
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-md"
                    style={{ background: step.color }}
                  >
                    {step.number}
                  </div>
                </div>

                <h3 className="font-heading font-bold text-navy mb-2 text-base">
                  {step.title}
                </h3>
                <p className="text-muted text-sm leading-relaxed px-2">
                  {step.description}
                </p>
              </motion.div>

              {/* Arrow */}
              {i < steps.length - 1 && (
                <div className="hidden lg:flex items-center justify-center px-2 mt-8">
                  <ArrowRight className="w-5 h-5 text-muted/40" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
