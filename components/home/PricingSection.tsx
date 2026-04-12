"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { Check, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Starter",
    price: "₹999",
    description: "Perfect to start with one subject",
    features: [
      "Access to 1 subject",
      "24+ video lectures",
      "Study materials PDF",
      "Email support",
      "6 months access",
    ],
    cta: "Get Started",
    variant: "outline" as const,
    popular: false,
  },
  {
    name: "Full Level",
    price: "₹2,999",
    description: "Complete Foundation / Inter / Final coverage",
    features: [
      "All subjects in one level",
      "100+ video lectures",
      "Practice questions",
      "Priority support",
      "Lifetime access",
      "Progress tracking",
    ],
    cta: "Most Popular — Enroll",
    variant: "default" as const,
    popular: true,
  },
  {
    name: "Premium",
    price: "₹7,999",
    description: "All 3 levels + mentorship",
    features: [
      "Foundation + Inter + Final",
      "200+ video lectures",
      "1-on-1 mentorship session",
      "Mock test access",
      "Lifetime access",
      "Certificate of completion",
    ],
    cta: "Go Premium",
    variant: "navy" as const,
    popular: false,
  },
];

export default function PricingSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-20 md:py-28 bg-offwhite" ref={ref} id="pricing">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-blue font-semibold text-sm uppercase tracking-widest mb-3">
            Pricing
          </p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-muted max-w-xl mx-auto">
            No subscriptions, no hidden fees. Pay once, access forever.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl p-8 bg-white shadow-md border-2 transition-all duration-300
                ${plan.popular ? "border-gold shadow-xl scale-105" : "border-gray-100 hover:border-blue/30 hover:shadow-lg"}`}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="bg-gold text-navy text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-1 shadow-md">
                    <Star className="w-3 h-3 fill-navy" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className={`w-5 h-5 ${plan.popular ? "text-gold" : "text-blue"}`} />
                  <h3 className="font-bold text-navy text-lg">{plan.name}</h3>
                </div>
                <div className="text-4xl font-bold text-navy mb-2">{plan.price}</div>
                <p className="text-muted text-sm">{plan.description}</p>
              </div>

              <ul className="flex flex-col gap-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-bodytext">
                    <Check className="w-4 h-4 text-teal flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link href="/register">
                <Button
                  variant={plan.variant}
                  className="w-full"
                  id={`pricing-${plan.name.toLowerCase().replace(/\s/g, "-")}`}
                >
                  {plan.cta}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
