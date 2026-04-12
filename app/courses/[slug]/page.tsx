"use client";

import React, { useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Star,
  Clock,
  PlayCircle,
  Users,
  CheckCircle,
  Lock,
  ChevronDown,
  GraduationCap,
  ShieldCheck,
  Smartphone,
  Infinity,
  ArrowLeft,
} from "lucide-react";
import { getCourseBySlug } from "@/lib/courses";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

type LevelVariant = "foundation" | "intermediate" | "final";

const levelVariantMap: Record<string, LevelVariant> = {
  Foundation: "foundation",
  Intermediate: "intermediate",
  Final: "final",
};

interface Props {
  params: Promise<{ slug: string }>;
}

const whatYouLearn = [
  "Core exam concepts with visual explanations",
  "Solved examples from past ICAI papers",
  "Strategic approach to maximize marks",
  "Chapter-wise practice questions",
  "Revision notes and summary sheets",
  "Time management techniques for exams",
];

const includes = [
  { icon: Infinity, label: "Lifetime access" },
  { icon: PlayCircle, label: "HD video lectures" },
  { icon: Smartphone, label: "Mobile accessible" },
  { icon: ShieldCheck, label: "Certificate of completion" },
  { icon: GraduationCap, label: "Expert instructor" },
];

export default function CourseDetailPage({ params }: Props) {
  const { slug } = use(params);
  const course = getCourseBySlug(slug);
  const [openSection, setOpenSection] = useState<number | null>(0);
  const [showEnrollBar] = useState(true);
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  if (!course) {
    return (
      <div className="min-h-screen bg-offwhite pt-24 flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-navy mb-2">Course Not Found</h2>
          <p className="text-muted mb-6">This course doesn&apos;t exist.</p>
          <Link href="/courses">
            <Button>Browse All Courses</Button>
          </Link>
        </div>
      </div>
    );
  }

  const levelVariant = levelVariantMap[course.level] || "foundation";
  const discount = Math.round(
    ((course.originalPrice - course.price) / course.originalPrice) * 100
  );

  const handleEnroll = () => {
    if (!isLoggedIn) {
      router.push(`/login?redirect=/checkout/${course.id}`);
    } else {
      router.push(`/checkout/${course.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-offwhite pt-16">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center gap-2 text-sm text-muted">
          <Link href="/courses" className="hover:text-blue flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" />
            Courses
          </Link>
          <span>/</span>
          <span className="text-bodytext font-medium line-clamp-1">{course.title}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* === LEFT COLUMN === */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course Info Header */}
            <div>
              <Badge variant={levelVariant} className="mb-3">
                {course.level}
              </Badge>
              <h1 className="font-heading text-3xl md:text-4xl font-bold text-navy mb-4 leading-tight">
                {course.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="font-semibold text-bodytext">{course.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {course.enrollments.toLocaleString()} students
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {course.duration}
                </div>
                <div className="flex items-center gap-1">
                  <PlayCircle className="w-4 h-4" />
                  {course.videoCount} videos
                </div>
              </div>
              <p className="text-bodytext leading-relaxed">{course.description}</p>
              <p className="text-muted text-sm mt-2">
                Instructor: <span className="text-blue font-medium">{course.instructor}</span>
              </p>
            </div>

            {/* What You'll Learn */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="font-bold text-navy text-xl mb-5">What You&apos;ll Learn</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {whatYouLearn.map((item) => (
                  <div key={item} className="flex items-start gap-3 text-sm text-bodytext">
                    <CheckCircle className="w-4 h-4 text-teal flex-shrink-0 mt-0.5" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Curriculum */}
            <div>
              <h2 className="font-bold text-navy text-xl mb-5">Course Curriculum</h2>
              <div className="space-y-3">
                {course.curriculum.map((section, sIdx) => (
                  <div
                    key={sIdx}
                    className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
                  >
                    <button
                      onClick={() =>
                        setOpenSection(openSection === sIdx ? null : sIdx)
                      }
                      className="w-full flex items-center justify-between p-5 text-left hover:bg-offwhite transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 bg-blue/10 rounded-lg flex items-center justify-center text-blue text-xs font-bold flex-shrink-0">
                          {sIdx + 1}
                        </span>
                        <div>
                          <p className="font-semibold text-navy text-sm">
                            {section.title}
                          </p>
                          <p className="text-xs text-muted">
                            {section.lessons.length} lessons
                          </p>
                        </div>
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 text-muted transition-transform ${
                          openSection === sIdx ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {openSection === sIdx && (
                      <div className="border-t border-gray-100">
                        {section.lessons.map((lesson, lIdx) => {
                          const isFree = lesson.isFreePreview;
                          const lessonVideoUrl = `https://www.youtube-nocookie.com/embed/${lesson.videoId}`;

                          return (
                            <div
                              key={lIdx}
                              className="flex items-center gap-3 px-5 py-3.5 hover:bg-offwhite border-b border-gray-50 last:border-0 transition-colors"
                            >
                              <div className="flex-shrink-0">
                                {isFree ? (
                                  <PlayCircle className="w-4 h-4 text-green-500" />
                                ) : (
                                  <Lock className="w-4 h-4 text-muted" />
                                )}
                              </div>
                              <span
                                className={`text-sm flex-1 ${
                                  isFree ? "text-bodytext" : "text-muted"
                                }`}
                              >
                                {lesson.title}
                              </span>
                              {isFree && (
                                <a
                                  href={lessonVideoUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-green-600 font-semibold bg-green-50 px-2.5 py-1 rounded-full hover:bg-green-100 transition-colors"
                                >
                                  Free Preview
                                </a>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Instructor */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="font-bold text-navy text-xl mb-5">About the Instructor</h2>
              <div className="flex items-start gap-5">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0"
                  style={{ background: course.color }}
                >
                  CA
                </div>
                <div>
                  <h3 className="font-bold text-navy mb-1">{course.instructor}</h3>
                  <p className="text-muted text-sm mb-3">
                    Chartered Accountant | 10+ years teaching experience
                  </p>
                  <p className="text-bodytext text-sm leading-relaxed">
                    CA Instructor is a practicing Chartered Accountant with over 10 years
                    of experience in CA coaching. Known for breaking down complex
                    financial concepts into clear, exam-focused explanations. Students
                    consistently achieve top marks across all CA levels.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* === RIGHT STICKY CARD === */}
          <div className="hidden lg:block">
            <div className="sticky top-24 bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden">
              {/* Video preview */}
              <div className="video-container" style={{ borderRadius: 0 }}>
                <iframe
                  src={`${course.freePreviewUrl}?rel=0&modestbranding=1`}
                  title="Free Preview"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              <div className="p-6">
                {/* Price */}
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-3xl font-bold text-navy">
                    ₹{course.price.toLocaleString()}
                  </span>
                  <span className="text-muted line-through text-lg">
                    ₹{course.originalPrice.toLocaleString()}
                  </span>
                  <span className="text-green-600 text-sm font-semibold">
                    {discount}% off
                  </span>
                </div>

                <p className="text-xs font-medium text-amber-600 flex items-center gap-1 mb-4">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse flex-shrink-0" />
                  Limited time offer
                </p>

                <Button
                  variant="default"
                  className="w-full mb-3 text-base h-12"
                  id="course-enroll-btn"
                  onClick={handleEnroll}
                >
                  Enroll Now
                </Button>

                <p className="text-center text-muted text-xs mb-5">
                  ✅ 30-day money-back guarantee
                </p>

                <div className="border-t border-gray-100 pt-4">
                  <p className="text-navy font-semibold text-sm mb-3">
                    This course includes:
                  </p>
                  <div className="space-y-2.5">
                    {includes.map((item) => (
                      <div key={item.label} className="flex items-center gap-3 text-sm text-bodytext">
                        <item.icon className="w-4 h-4 text-teal flex-shrink-0" />
                        {item.label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky bottom bar */}
      {showEnrollBar && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-2xl px-4 py-4 flex items-center gap-4">
          <div>
            <div className="text-xl font-bold text-navy">
              ₹{course.price.toLocaleString()}
            </div>
            <div className="text-xs text-muted line-through">
              ₹{course.originalPrice.toLocaleString()}
            </div>
          </div>
          <Button
            variant="default"
            className="flex-1 h-12"
            id="course-enroll-mobile"
            onClick={handleEnroll}
          >
            Enroll Now
          </Button>
        </div>
      )}
    </div>
  );
}
