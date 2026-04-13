"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  PlayCircle,
  CheckCircle,
  Clock,
  Video,
  ArrowRight,
  Flame,
  Star,
  BookOpen,
  TrendingUp,
  RefreshCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const courseHighlights = [
  "35+ hours of structured video lectures",
  "No prior knowledge of the subject required",
  "Logic-first teaching — concepts explained, not memorized",
  "Covers full CA Final exam syllabus exhaustively",
  "Downloadable study notes & quick-revision sheets",
  "Lifetime access — study at your own pace",
  "Mobile-friendly — watch from anywhere",
  "Direct access to CA Nikesh Shah for doubt resolution",
];

const forWhom = [
  {
    icon: BookOpen,
    title: "Complete Beginners",
    desc: "No accounting background? No problem. The course starts from absolute zero.",
  },
  {
    icon: TrendingUp,
    title: "Repeaters & Re-Attempters",
    desc: "Failed before? Our logic-based approach rebuilds your foundation the right way.",
  },
  {
    icon: Star,
    title: "First-Time Aspirants",
    desc: "Clear on your very first attempt with a structured, exam-focused curriculum.",
  },
];

export default function FeaturedCourse() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      className="py-20 md:py-28 bg-offwhite relative overflow-hidden"
      ref={ref}
      id="featured-course"
    >
      {/* Background blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-teal/6 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 text-sm font-semibold px-4 py-2 rounded-full mb-4">
            <Flame className="w-4 h-4" />
            Now Launching
          </div>
          <p className="text-blue font-semibold text-sm uppercase tracking-widest mb-3">
            Featured Course
          </p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy mb-4">
            CA Final — Strategic Financial Management
          </h2>
          <p className="text-muted max-w-2xl mx-auto text-base">
            The most comprehensive, logic-first SFM course for CA Final — designed by CA Nikesh Shah
            to take any student from zero to exam-confident, regardless of their background.
          </p>
        </motion.div>

        {/* Main course card */}
        <motion.div
          className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 lg:items-start">
            {/* Left — course info */}
            <div className="p-8 md:p-12 flex flex-col justify-between">
              {/* Course meta */}
              <div>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="bg-navy text-white text-xs font-semibold px-3 py-1 rounded-full">
                    CA Final
                  </span>
                  <span className="bg-teal/10 text-teal text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                    <Video className="w-3 h-3" /> 45 Lectures
                  </span>
                  <span className="bg-blue/10 text-blue text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                    <Clock className="w-3 h-3" /> 35 Hours
                  </span>
                </div>

                <h3 className="font-display text-2xl md:text-3xl font-bold text-navy mb-3 leading-tight">
                  Strategic Financial Management
                  <span className="block text-blue text-xl mt-1">
                    by CA Nikesh Shah
                  </span>
                </h3>

                <p className="text-bodytext text-sm leading-relaxed mb-8">
                  Master Portfolio Theory, Derivatives, Mergers &amp; Acquisitions,
                  and International Finance with deep logical understanding. Every
                  concept taught from first principles — so you can tackle any exam
                  question with confidence.
                </p>

                {/* Highlights */}
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-8">
                  {courseHighlights.map((h) => (
                    <li key={h} className="flex items-start gap-2 text-sm text-bodytext">
                      <CheckCircle className="w-4 h-4 text-teal flex-shrink-0 mt-0.5" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pricing & CTA */}
              <div>
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-4xl font-bold text-navy">₹3,999</span>
                  <span className="text-lg text-muted line-through">₹8,000</span>
                  <span className="bg-teal/10 text-teal text-sm font-bold px-2 py-0.5 rounded-lg">
                    50% OFF
                  </span>
                </div>
                <p className="text-muted text-xs mb-6">
                  One-time payment · No subscription · Lifetime access
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/checkout/course_sfm_001">
                    <Button
                      size="lg"
                      className="gap-2 w-full sm:w-auto"
                      id="featured-course-enroll"
                    >
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
                      className="gap-2 w-full sm:w-auto"
                      id="featured-course-preview"
                    >
                      <PlayCircle className="w-5 h-5" />
                      Watch Free Lecture
                    </Button>
                  </a>
                </div>

                {/* Money-back guarantee */}
                <div className="mt-6 flex items-start gap-3 bg-green-50 border border-green-200 rounded-xl p-4">
                  <RefreshCcw className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-green-800">
                      100% Money-Back Guarantee
                    </p>
                    <p className="text-xs text-green-700 leading-relaxed">
                      If you don&apos;t find value in the course, we&apos;ll refund you in
                      full — no questions asked, no forms to fill. Your trust is our
                      priority.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right — video preview */}
            <div className="relative bg-navy flex flex-col">
              {/* Video embed */}
              <div className="flex-1 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-navy via-[#1e3a6e] to-[#0f2240]" />
                <div className="relative z-10 p-8 md:p-10 flex flex-col h-full">
                  <div className="mb-6">
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                      <PlayCircle className="w-3.5 h-3.5 text-teal" />
                      Free Preview Lecture
                    </div>
                  </div>

                  <div className="flex-1 rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                    <div className="aspect-video">
                      <iframe
                        src="https://www.youtube-nocookie.com/embed/psQaSIotMv4?rel=0&modestbranding=1"
                        title="CA Final SFM Free Preview — Nikesh Shah"
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>

                  {/* Stats row */}
                  <div className="mt-6 grid grid-cols-3 gap-4">
                    {[
                      { value: "4.9★", label: "Rating" },
                      { value: "560+", label: "Students" },
                      { value: "45", label: "Lectures" },
                    ].map(({ value, label }) => (
                      <div key={label} className="text-center">
                        <p className="text-white font-bold text-lg">{value}</p>
                        <p className="text-white/50 text-xs">{label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Who is this for */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.25 }}
        >
          <h3 className="text-center font-heading text-2xl font-bold text-navy mb-8">
            Who Is This Course For?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {forWhom.map((item, i) => (
              <motion.div
                key={item.title}
                className="flex flex-col items-center text-center gap-4 bg-white rounded-2xl p-7 border border-gray-100 hover:border-blue/20 hover:shadow-md transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
              >
                <div className="w-12 h-12 bg-blue/10 rounded-xl flex items-center justify-center">
                  <item.icon className="w-6 h-6 text-blue" />
                </div>
                <div>
                  <h4 className="font-bold text-navy mb-2">{item.title}</h4>
                  <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
