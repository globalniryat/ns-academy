"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import CourseCard, { CourseCardData } from "@/components/courses/CourseCard";
import { BookOpen, Users, Clock, Star, GraduationCap } from "lucide-react";

const levels = ["All", "Foundation", "Intermediate", "Final"] as const;
type Level = (typeof levels)[number];

interface Props {
  courses: CourseCardData[];
}

const stats = [
  { icon: Users,        value: "560+",  label: "Students Enrolled" },
  { icon: Clock,        value: "35+",   label: "Hours of Content"  },
  { icon: Star,         value: "4.9★",  label: "Average Rating"    },
  { icon: GraduationCap,value: "45",    label: "Video Lectures"    },
];

export default function CoursesClient({ courses }: Props) {
  const [activeLevel, setActiveLevel] = useState<Level>("All");

  const levelMap: Record<string, string> = {
    Foundation: "FOUNDATION",
    Intermediate: "INTERMEDIATE",
    Final: "FINAL",
  };

  const filtered =
    activeLevel === "All"
      ? courses
      : courses.filter((c) => c.level === levelMap[activeLevel]);

  return (
    <>
      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="relative bg-navy pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-teal/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 hero-grid-pattern opacity-20 pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 text-center">
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-medium px-5 py-2 rounded-full mb-6"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <BookOpen className="w-4 h-4 text-gold" />
            {courses.length} course{courses.length !== 1 ? "s" : ""} available · CA Final Preparation
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight mb-5"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Courses Built to{" "}
            <span className="gradient-text">Clear the Exam</span>
          </motion.h1>

          <motion.p
            className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-12"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Logic-first teaching by CA Nikesh Shah. Watch free preview lectures
            and enroll only when you&apos;re ready — no pressure.
          </motion.p>

          {/* Stats row */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {stats.map(({ icon: Icon, value, label }) => (
              <div
                key={label}
                className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl px-4 py-4 flex flex-col items-center gap-1"
              >
                <Icon className="w-5 h-5 text-gold mb-1" />
                <p className="text-white font-bold text-xl leading-none">{value}</p>
                <p className="text-white/60 text-xs">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-offwhite to-transparent pointer-events-none" />
      </section>

      {/* ── Course Listing ─────────────────────────────────── */}
      <section className="bg-offwhite min-h-screen">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">

          {/* Filter bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
            <div>
              <p className="text-navy font-bold text-xl">
                {activeLevel === "All" ? "All Courses" : `${activeLevel} Level`}
              </p>
              <p className="text-muted text-sm mt-0.5">
                {filtered.length} course{filtered.length !== 1 ? "s" : ""} found
              </p>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {levels.map((level) => {
                const count =
                  level === "All"
                    ? courses.length
                    : courses.filter((c) => c.level === levelMap[level]).length;
                return (
                  <button
                    key={level}
                    onClick={() => setActiveLevel(level)}
                    id={`filter-${level.toLowerCase()}`}
                    className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 flex items-center gap-1.5
                      ${
                        activeLevel === level
                          ? "bg-blue text-white shadow-md shadow-blue/30"
                          : "bg-white text-bodytext border border-gray-200 hover:border-blue/40 hover:text-blue"
                      }`}
                  >
                    {level}
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                        activeLevel === level
                          ? "bg-white/20 text-white"
                          : "bg-gray-100 text-muted"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Grid */}
          {filtered.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.08 } },
              }}
            >
              {filtered.map((course) => (
                <motion.div
                  key={course.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show:   { opacity: 1, y: 0, transition: { duration: 0.45 } },
                  }}
                >
                  <CourseCard course={course} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-24">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-muted" />
              </div>
              <p className="text-navy font-bold text-lg mb-1">No courses yet</p>
              <p className="text-muted text-sm">Check back soon — more courses are being added.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
