"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { GraduationCap, Play, ArrowRight, CheckCircle, RefreshCcw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const benefits = [
  "Logic-first teaching — understand, don't memorize",
  "Zero prior knowledge required to start",
  "Full CA Final SFM syllabus covered",
  "Watch free lectures before enrolling",
];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen bg-navy overflow-hidden flex items-end md:items-center pt-24 pb-16 md:pt-32 md:pb-24">
      {/* Gradient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-teal/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 hero-grid-pattern" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* Left — Text */}
          <motion.div
            className="text-center md:text-left"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          >
            {/* Trust badge */}
            <motion.div
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm px-4 py-2 rounded-full mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, duration: 0.4 }}
            >
              <GraduationCap className="w-4 h-4 text-gold flex-shrink-0" />
              <span>
                Taught by <strong className="text-white">CA Nikesh Shah</strong> · CA Final Expert
              </span>
            </motion.div>

            {/* Headline */}
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight mb-5">
              Understand CA Final{" "}
              <span className="gradient-text">SFM — Not Just</span>{" "}
              Memorize It
            </h1>

            <p className="text-slate-200 text-lg md:text-xl leading-relaxed mb-6 max-w-lg mx-auto md:mx-0">
              CA Nikesh Shah&apos;s logic-first approach to Strategic Financial Management
              — built for students with <strong className="text-white">zero prior knowledge</strong>.
              Walk into the exam room confident.
            </p>

            {/* Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6 max-w-lg mx-auto md:mx-0">
              {benefits.map((b) => (
                <div key={b} className="flex items-center gap-2 text-sm text-white/80">
                  <CheckCircle className="w-4 h-4 text-teal flex-shrink-0" />
                  {b}
                </div>
              ))}
            </div>

            {/* Money-back trust note */}
            <motion.div
              className="inline-flex items-center gap-2 bg-green-900/30 border border-green-400/20 text-green-300 text-xs font-semibold px-4 py-2 rounded-full mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              <RefreshCcw className="w-3.5 h-3.5" />
              100% Money-Back Guarantee · No Questions Asked
            </motion.div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link href="/checkout/course_sfm_001">
                <Button size="lg" variant="default" className="gap-2" id="hero-enroll-now">
                  Enroll Now
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <a
                href="https://youtu.be/psQaSIotMv4"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 border-white/30 text-white hover:bg-white/10 hover:border-white/60"
                  id="hero-watch-free"
                >
                  <Play className="w-5 h-5" />
                  Watch Free Lecture
                </Button>
              </a>
            </div>
          </motion.div>

          {/* Right — Instructor photo + video */}
          <motion.div
            className="order-last md:order-none"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: 0.2, ease: "easeOut" }}
          >
            <div className="relative">
              {/* Glow */}
              <div className="absolute -inset-4 bg-blue/20 blur-2xl rounded-2xl pointer-events-none" />

              {/* Instructor photo */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-[#111827]">
                <div className="relative h-80 w-full">
                  <Image
                    src="/nikesh-shah.png"
                    alt="CA Nikesh Shah — CA Final SFM Educator"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover object-top"
                    priority
                  />
                  {/* Gradient overlay at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#111827] to-transparent" />
                  {/* Name overlay */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-white font-bold text-lg font-display">CA Nikesh Shah</p>
                    <p className="text-white/70 text-sm">CA Final · SFM Expert · 10+ Years Teaching</p>
                  </div>
                </div>

                {/* Video preview below photo */}
                <div className="border-t border-white/10">
                  <div className="p-2">
                    <div className="aspect-video rounded-lg overflow-hidden">
                      <iframe
                        src="https://www.youtube-nocookie.com/embed/psQaSIotMv4?rel=0&modestbranding=1"
                        title="CA Final SFM Free Preview — Nikesh Shah"
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                </div>

                {/* Free Preview label */}
                <div className="absolute top-3 right-3 bg-teal text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-md">
                  Free Preview
                </div>
              </div>

              {/* Floating guarantee badge */}
              <motion.div
                className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-xl p-3 flex items-center gap-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
              >
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-navy">Money-Back</p>
                  <p className="text-xs text-muted">No questions asked</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Fade to page bg */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-offwhite to-transparent pointer-events-none" />
    </section>
  );
}
