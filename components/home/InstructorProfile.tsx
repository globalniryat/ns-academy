"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import {
  GraduationCap,
  Lightbulb,
  Users,
  Award,
  CheckCircle,
  ShieldCheck,
  BookOpen,
  Star,
} from "lucide-react";

const philosophyPoints = [
  {
    icon: Lightbulb,
    title: "Logic-First Teaching",
    description:
      "Every concept is broken down into its simplest logical form — no rote memorization, ever. You understand the 'why' before the 'how'.",
    color: "text-gold",
    bg: "bg-gold/10",
  },
  {
    icon: Users,
    title: "Zero Prior Knowledge Required",
    description:
      "Whether you have a commerce background or are completely new to accounting, the course is designed to bring you up to speed from scratch.",
    color: "text-teal",
    bg: "bg-teal/10",
  },
  {
    icon: BookOpen,
    title: "Exam-Confident, Not Just Exam-Ready",
    description:
      "The goal isn't just to pass — it's for you to walk into the exam hall confident, knowing you truly understand the subject.",
    color: "text-blue",
    bg: "bg-blue/10",
  },
];

const credentials = [
  "Chartered Accountant (ICAI)",
  "10+ Years Teaching Experience",
  "Mentored 2,000+ CA Students",
  "Former Faculty, Symbiosis College Pune",
];

export default function InstructorProfile() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      className="py-20 md:py-28 bg-white relative overflow-hidden"
      ref={ref}
      id="about-instructor"
    >
      {/* Subtle background decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue/3 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal/4 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-blue font-semibold text-sm uppercase tracking-widest mb-3">
            Your Educator
          </p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy mb-4">
            Meet CA Nikesh Shah
          </h2>
          <p className="text-muted max-w-xl mx-auto">
            A Chartered Accountant who believes every student can crack the CA
            exam — if taught the right way.
          </p>
        </motion.div>

        {/* Profile layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-20">
          {/* Left — Photo + credentials card */}
          <motion.div
            className="flex flex-col items-center lg:items-start gap-6"
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="relative">
              {/* Glow behind photo */}
              <div className="absolute -inset-4 bg-gradient-to-br from-blue/20 to-teal/20 rounded-3xl blur-2xl" />
              {/* Photo frame */}
              <div className="relative w-72 h-80 rounded-3xl overflow-hidden shadow-2xl border-4 border-white ring-1 ring-navy/10">
                <Image
                  src="/nikesh-shah.png"
                  alt="CA Nikesh Shah — CA Final Educator"
                  fill
                  className="object-cover object-top"
                  priority
                />
              </div>

              {/* Floating credential badge */}
              <motion.div
                className="absolute -bottom-5 -right-5 bg-navy text-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.5, duration: 0.4 }}
              >
                <div className="w-10 h-10 bg-gold/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <p className="text-sm font-bold">CA (ICAI Qualified)</p>
                  <p className="text-xs text-white/60">10+ Years Teaching</p>
                </div>
              </motion.div>

              {/* Floating rating badge */}
              <motion.div
                className="absolute -top-4 -left-4 bg-white rounded-xl shadow-lg px-3 py-2 flex items-center gap-2 border border-gray-100"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.6, duration: 0.4 }}
              >
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-sm font-bold text-navy">4.9/5</span>
                <span className="text-xs text-muted">Student Rating</span>
              </motion.div>
            </div>

            {/* Credentials list */}
            <div className="w-full max-w-sm lg:max-w-none mt-8 bg-offwhite rounded-2xl p-6 border border-gray-100">
              <p className="text-xs font-semibold text-muted uppercase tracking-widest mb-4">
                Credentials &amp; Experience
              </p>
              <ul className="flex flex-col gap-3">
                {credentials.map((c) => (
                  <li key={c} className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-teal flex-shrink-0" />
                    <span className="text-sm font-medium text-bodytext">{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Right — Bio + Quote */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Name & title */}
            <div className="mb-6">
              <h3 className="font-display text-4xl md:text-5xl font-bold text-navy mb-2 leading-tight">
                Nikesh Shah
              </h3>
              <p className="text-blue font-semibold text-lg">
                Chartered Accountant &amp; CA Educator
              </p>
            </div>

            {/* Bio */}
            <div className="space-y-4 text-bodytext text-base leading-relaxed mb-8">
              <p>
                CA Nikesh Shah is a Chartered Accountant with a passion for making
                the toughest CA subjects approachable. After years of teaching at
                Symbiosis College, Pune, he identified one root cause of student
                failure:{" "}
                <strong className="text-navy">
                  teaching through memorization instead of understanding
                </strong>
                .
              </p>
              <p>
                His courses are built around a single principle — if a student
                truly understands the logic behind a concept, they can answer any
                exam question, even one they&apos;ve never seen before.{" "}
                <strong className="text-navy">
                  No formula-cramming. No shortcut tricks. Just deep, confident
                  understanding.
                </strong>
              </p>
              <p>
                His students have consistently cleared CA exams on their first
                attempt — including those who had zero prior accounting knowledge
                before joining his course.
              </p>
            </div>

            {/* Quote block */}
            <div className="relative bg-navy rounded-2xl p-6 mb-8">
              <div className="text-gold text-5xl font-serif leading-none mb-3 select-none">
                &ldquo;
              </div>
              <p className="text-white/90 text-lg leading-relaxed italic font-medium">
                My goal is simple — even if you have never opened an accounting
                book in your life, you should be able to sit in the CA Final exam
                with confidence after taking this course.
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="w-8 h-0.5 bg-gold" />
                <span className="text-gold text-sm font-semibold">
                  CA Nikesh Shah
                </span>
              </div>
            </div>

            {/* Award badge row */}
            <div className="flex flex-wrap gap-3">
              {[
                { icon: Award, label: "Top-Rated Educator" },
                { icon: GraduationCap, label: "CA Final Expert" },
                { icon: ShieldCheck, label: "100% Money-Back" },
              ].map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-2 bg-blue/5 border border-blue/15 text-navy text-sm font-medium px-4 py-2 rounded-full"
                >
                  <Icon className="w-4 h-4 text-blue" />
                  {label}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Teaching Philosophy Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="text-center mb-10">
            <p className="text-teal font-semibold text-sm uppercase tracking-widest mb-2">
              Teaching Philosophy
            </p>
            <h3 className="font-heading text-2xl md:text-3xl font-bold text-navy">
              Why Students Learn Better with Nikesh
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {philosophyPoints.map((p, i) => (
              <motion.div
                key={p.title}
                className="relative flex flex-col gap-4 p-7 rounded-2xl border border-gray-100 hover:border-blue/20 hover:shadow-lg transition-all duration-300 group bg-white"
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.35 + i * 0.12, duration: 0.5 }}
              >
                <div
                  className={`w-12 h-12 ${p.bg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}
                >
                  <p.icon className={`w-6 h-6 ${p.color}`} />
                </div>
                <div>
                  <h4 className="font-bold text-navy mb-2 text-base">{p.title}</h4>
                  <p className="text-muted text-sm leading-relaxed">{p.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
