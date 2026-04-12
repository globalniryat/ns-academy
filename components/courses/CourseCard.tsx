"use client";

import React from "react";
import Link from "next/link";
import { Star, Clock, PlayCircle, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Course } from "@/lib/courses";
import { cn } from "@/lib/utils";

type LevelVariant = "foundation" | "intermediate" | "final";

const levelVariantMap: Record<string, LevelVariant> = {
  Foundation: "foundation",
  Intermediate: "intermediate",
  Final: "final",
};

// Level-specific gradient backgrounds for Final course fix
const levelGradients: Record<string, string> = {
  Foundation: "",
  Intermediate: "",
  Final: "linear-gradient(135deg, #1A2744 0%, #2B4A9A 100%)",
};

interface CourseCardProps {
  course: Course;
  showEnrollButton?: boolean;
}

export default function CourseCard({ course, showEnrollButton = true }: CourseCardProps) {
  const discount = Math.round(
    ((course.originalPrice - course.price) / course.originalPrice) * 100
  );
  const levelVariant = levelVariantMap[course.level] || "foundation";
  const gradientBg =
    levelGradients[course.level] ||
    `linear-gradient(135deg, ${course.color}dd, ${course.color}88)`;

  return (
    <Card className="card-hover overflow-hidden group h-full flex flex-col">
      {/* Thumbnail */}
      <div
        className="relative h-48 flex items-center justify-center overflow-hidden"
        style={{ background: gradientBg }}
      >
        <div className="absolute inset-0 hero-grid-pattern opacity-30" />

        <div className="relative z-10 text-center px-4">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
            <PlayCircle className="w-8 h-8 text-white" />
          </div>
          <p className="text-white/90 text-sm font-medium leading-tight">{course.title}</p>
        </div>

        {/* Discount Badge — gold on navy, professional */}
        <div
          className="absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full tracking-wide shadow-sm"
          style={{ background: "#D4A843", color: "#1A2744" }}
        >
          {discount}% OFF
        </div>

        {/* Free Preview — refined emerald style */}
        <div className="absolute bottom-3 left-3 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
          Free Preview
        </div>
      </div>

      <CardContent className="flex flex-col flex-1 p-5">
        {/* Level + Rating */}
        <div className="flex items-center justify-between mb-3">
          <Badge variant={levelVariant}>{course.level}</Badge>
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-semibold text-bodytext">{course.rating}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-heading font-bold text-navy text-base leading-tight mb-1.5 line-clamp-2">
          {course.title}
        </h3>

        <p className="text-muted text-xs mb-3">by {course.instructor}</p>

        {/* Stats */}
        <div className={cn("flex items-center gap-4 mb-4 text-xs text-muted")}>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {course.duration}
          </span>
          <span className="flex items-center gap-1">
            <PlayCircle className="w-3.5 h-3.5" />
            {course.videoCount} videos
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            {course.enrollments.toLocaleString()}
          </span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-4 mt-auto">
          <span className="text-2xl font-bold text-navy">
            ₹{course.price.toLocaleString()}
          </span>
          <span className="text-sm text-muted line-through">
            ₹{course.originalPrice.toLocaleString()}
          </span>
        </div>

        {/* CTA */}
        {showEnrollButton && (
          <Link href={`/courses/${course.slug}`} className="block">
            <Button variant="default" className="w-full" id={`enroll-${course.slug}`}>
              Enroll Now
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
