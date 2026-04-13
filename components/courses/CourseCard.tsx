"use client";

import React from "react";
import Link from "next/link";
import { Star, Clock, PlayCircle, Users, CheckCircle, ArrowRight } from "lucide-react";

function getYouTubeId(url: string | null): string | null {
  if (!url) return null;
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([^&?/\s]{11})/);
  return m ? m[1] : null;
}

export interface CourseCardData {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  level: "FOUNDATION" | "INTERMEDIATE" | "FINAL";
  price: number;
  originalPrice: number;
  duration: string;
  thumbnailUrl: string | null;
  freePreviewUrl: string | null;
  color: string;
  instructor: string;
  rating: number;
  totalRatings: number;
  _count?: { sections: number; enrollments: number };
}

const levelLabel: Record<string, string> = {
  FOUNDATION:   "Foundation",
  INTERMEDIATE: "Intermediate",
  FINAL:        "Final",
};

const levelColor: Record<string, string> = {
  FOUNDATION:   "bg-blue/10 text-blue border-blue/20",
  INTERMEDIATE: "bg-teal/10 text-teal border-teal/20",
  FINAL:        "bg-gold/10 text-gold border-gold/20",
};

const highlights = [
  "Logic-first teaching approach",
  "Lifetime access · Pay once",
  "100% Money-back guarantee",
];

interface CourseCardProps {
  course: CourseCardData;
  showEnrollButton?: boolean;
}

export default function CourseCard({ course, showEnrollButton = true }: CourseCardProps) {
  const priceRs         = Math.round(course.price / 100);
  const originalPriceRs = Math.round(course.originalPrice / 100);
  const discount        = Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100);
  const ytId            = getYouTubeId(course.freePreviewUrl);
  const thumbnailSrc    = course.thumbnailUrl
    ?? (ytId ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg` : null);

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 hover:border-blue/20 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full">

      {/* ── Thumbnail ─────────────────────────────────── */}
      <div
        className="relative h-52 overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${course.color}f0, ${course.color}99)` }}
      >
        {/* YouTube / custom thumbnail image */}
        {thumbnailSrc && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbnailSrc}
            alt={course.title}
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
              // fallback to sd quality if hq fails
              const img = e.currentTarget;
              if (ytId && !img.src.includes("sddefault")) {
                img.src = `https://img.youtube.com/vi/${ytId}/sddefault.jpg`;
              } else {
                img.style.display = "none";
              }
            }}
          />
        )}

        {/* Dark overlay so text/buttons are always readable */}
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
        <div className="absolute inset-0 hero-grid-pattern opacity-10" />

        {/* Clickable play button */}
        {course.freePreviewUrl ? (
          <a
            href={course.freePreviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 px-6 text-center"
            aria-label="Watch free preview"
          >
            <div className="w-16 h-16 bg-white/25 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/60 group-hover:scale-110 group-hover:bg-white/40 transition-all duration-300 shadow-xl">
              <PlayCircle className="w-9 h-9 text-white drop-shadow-lg" />
            </div>
            <p className="text-white font-bold text-sm leading-snug line-clamp-2 drop-shadow max-w-[200px]">
              {course.title}
            </p>
          </a>
        ) : (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 px-6 text-center">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 shadow-lg">
              <PlayCircle className="w-9 h-9 text-white/70" />
            </div>
            <p className="text-white font-bold text-sm leading-snug line-clamp-2 drop-shadow max-w-[200px]">
              {course.title}
            </p>
          </div>
        )}

        {/* Discount badge */}
        {discount > 0 && (
          <div className="absolute top-3 right-3 z-20 bg-gold text-navy text-xs font-extrabold px-2.5 py-1 rounded-full shadow-md tracking-wide">
            {discount}% OFF
          </div>
        )}

        {/* Free Preview badge */}
        {course.freePreviewUrl && (
          <div className="absolute bottom-3 left-3 z-20 bg-white/90 backdrop-blur-sm text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm border border-emerald-100">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Free Preview
          </div>
        )}
      </div>

      {/* ── Card Body ─────────────────────────────────── */}
      <div className="flex flex-col flex-1 p-6">

        {/* Level + Rating row */}
        <div className="flex items-center justify-between mb-3">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${levelColor[course.level] ?? "bg-gray-100 text-muted border-gray-200"}`}>
            {levelLabel[course.level]}
          </span>
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-bold text-navy">{course.rating.toFixed(1)}</span>
            {course.totalRatings > 0 && (
              <span className="text-xs text-muted">({course.totalRatings})</span>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="font-heading font-bold text-navy text-lg leading-snug mb-1 line-clamp-2">
          {course.title}
        </h3>
        <p className="text-muted text-xs mb-4">by {course.instructor}</p>

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-muted mb-4">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-blue" />
            {course.duration}
          </span>
          {course._count && (
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-blue" />
              {course._count.enrollments > 0
                ? `${course._count.enrollments.toLocaleString()} students`
                : "New course"}
            </span>
          )}
        </div>

        {/* Highlights */}
        <ul className="space-y-1.5 mb-5">
          {highlights.map((h) => (
            <li key={h} className="flex items-center gap-2 text-xs text-bodytext">
              <CheckCircle className="w-3.5 h-3.5 text-teal flex-shrink-0" />
              {h}
            </li>
          ))}
        </ul>

        {/* Price + CTA */}
        <div className="mt-auto pt-4 border-t border-gray-100">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-2xl font-extrabold text-navy">
              ₹{priceRs.toLocaleString()}
            </span>
            {originalPriceRs > priceRs && (
              <span className="text-sm text-muted line-through">
                ₹{originalPriceRs.toLocaleString()}
              </span>
            )}
          </div>

          {showEnrollButton && (
            <Link href={`/courses/${course.slug}`} className="block">
              <button
                id={`enroll-${course.slug}`}
                className="w-full flex items-center justify-center gap-2 bg-blue text-white text-sm font-bold py-3 rounded-xl hover:bg-blue/90 hover:shadow-md transition-all duration-200 cursor-pointer group/btn"
              >
                View Course
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
