"use client";

import React, { useState } from "react";
import { courses } from "@/lib/courses";
import CourseCard from "@/components/courses/CourseCard";
import { BookOpen } from "lucide-react";

const levels = ["All", "Foundation", "Intermediate", "Final"] as const;
type Level = (typeof levels)[number];

export default function CoursesPage() {
  const [activeLevel, setActiveLevel] = useState<Level>("All");

  const filtered =
    activeLevel === "All"
      ? courses
      : courses.filter((c) => c.level === activeLevel);

  return (
    <div className="min-h-screen bg-offwhite">
      {/* Hero */}
      <div className="bg-navy pt-28 pb-20 md:pt-36 md:pb-24 relative overflow-hidden">
        <div className="absolute inset-0 hero-grid-pattern opacity-30" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue/10 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white/80 px-4 py-2 rounded-full text-sm mb-6">
            <BookOpen className="w-4 h-4" />
            {courses.length} courses available
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">
            All Courses
          </h1>
          <p className="text-slate-300 text-lg max-w-xl mx-auto">
            Browse expert-led CA coaching courses. Watch free preview lectures —
            enroll only when you&apos;re ready.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        {/* Filter Tabs */}
        <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-2">
          {levels.map((level) => (
            <button
              key={level}
              onClick={() => setActiveLevel(level)}
              id={`filter-${level.toLowerCase()}`}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200
                ${
                  activeLevel === level
                    ? "bg-blue text-white shadow-md"
                    : "bg-white text-bodytext border border-gray-200 hover:border-blue/50 hover:text-blue"
                }`}
            >
              {level}
              {level !== "All" && (
                <span className="ml-2 text-xs opacity-70">
                  ({courses.filter((c) => c.level === level).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted text-lg">No courses found for this level.</p>
          </div>
        )}
      </div>
    </div>
  );
}
