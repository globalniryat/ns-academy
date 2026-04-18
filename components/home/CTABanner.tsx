"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, RefreshCcw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import EnrollButton from "@/components/ui/EnrollButton";

export default function CTABanner() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      className="py-20 md:py-28 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #D4A843 0%, #E8B84B 50%, #F0C55C 100%)" }}
      ref={ref}
    >
      {/* Decorations */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-navy/10 rounded-full blur-3xl" />
      <div className="absolute inset-0 hero-grid-pattern opacity-10" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 md:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-navy/60 font-semibold text-sm uppercase tracking-widest mb-3">
            Start Today
          </p>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-navy mb-4 leading-tight">
            Ready to Crack CA Final SFM?
          </h2>

          <p className="text-navy/70 text-lg mb-8 max-w-xl mx-auto">
            Join CA Nikesh Shah&apos;s course and experience the difference that
            teaching logic — not just formulas — makes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <EnrollButton
              size="lg"
              variant="navy"
              className="gap-2"
              id="cta-enroll-now"
            >
              Enroll Now — ₹3,999
              <ArrowRight className="w-5 h-5" />
            </EnrollButton>
            <a
              href="https://youtu.be/psQaSIotMv4"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="lg"
                className="gap-2 bg-white/20 text-navy border-2 border-navy/20 hover:bg-white/30"
                id="cta-watch-free"
              >
                Watch Free Lecture First
              </Button>
            </a>
          </div>

          {/* Trust row */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-navy/70 text-sm">
            <span className="flex items-center gap-1.5">
              <RefreshCcw className="w-4 h-4" />
              100% Money-Back Guarantee
            </span>
            <span className="hidden sm:block w-1 h-1 bg-navy/30 rounded-full" />
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              No Questions Asked Refund
            </span>
            <span className="hidden sm:block w-1 h-1 bg-navy/30 rounded-full" />
            <span>Lifetime Access · Pay Once</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
