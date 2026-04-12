"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle,
  Lock,
  PlayCircle,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AuthGuard from "@/components/auth/AuthGuard";
import { useAuth } from "@/lib/auth";
import { courses, type Lesson } from "@/lib/courses";

interface Props {
  params: Promise<{ courseId: string }>;
}

// Flattened lesson type used inside the video player
interface FlatLesson {
  title: string;
  sectionTitle: string;
  isFreePreview: boolean;
  videoId: string;
}

function VideoPlayerInner({ params }: Props) {
  const { courseId } = use(params);
  const { user } = useAuth();
  const router = useRouter();
  const course = courses.find((c) => c.id === courseId);
  const [activeLessonIdx, setActiveLessonIdx] = useState(0);
  const [showUnlockPrompt, setShowUnlockPrompt] = useState(false);

  if (!course) {
    return (
      <div className="min-h-screen bg-offwhite pt-24 flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-navy mb-2">Course Not Found</h2>
          <p className="text-muted mb-6">This course doesn&apos;t exist.</p>
          <Link href="/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isEnrolled = user?.enrolled.includes(course.id);

  if (!isEnrolled) {
    return (
      <div className="min-h-screen bg-offwhite pt-24 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-navy mb-2">Not Enrolled</h2>
          <p className="text-muted mb-6">
            You haven&apos;t enrolled in{" "}
            <span className="font-semibold text-bodytext">{course.title}</span>. Enroll
            to get full access.
          </p>
          <div className="flex flex-col gap-3">
            <Link href={`/courses/${course.slug}`}>
              <Button variant="default" className="w-full" id="not-enrolled-enroll">
                Enroll Now — ₹{course.price.toLocaleString()}
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" className="w-full">
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Flatten all lessons with their section context and per-lesson videoId
  const allLessons: FlatLesson[] = [];
  course.curriculum.forEach((section) => {
    section.lessons.forEach((lesson: Lesson) => {
      allLessons.push({
        title: lesson.title,
        sectionTitle: section.title,
        isFreePreview: !!lesson.isFreePreview,
        videoId: lesson.videoId,
      });
    });
  });

  const activeLesson = allLessons[activeLessonIdx];
  // Only show the video embed if this lesson is the free preview OR user is enrolled
  const canWatchLesson = isEnrolled || activeLesson.isFreePreview;
  // Per-lesson video embed URL
  const activeVideoUrl = `https://www.youtube-nocookie.com/embed/${activeLesson.videoId}?rel=0&modestbranding=1`;

  return (
    <div className="min-h-screen bg-navy pt-16">
      {/* Breadcrumb */}
      <div className="bg-navy/80 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center gap-2 text-sm text-white/60">
          <Link href="/dashboard" className="hover:text-white flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-white/80 line-clamp-1">{course.title}</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-white/50 line-clamp-1">{activeLesson.sectionTitle}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Video Player ───────────────────────────────────────── */}
          <div className="lg:col-span-2">
            {/* Video embed — switches per lesson */}
            <div className="video-container mb-4 rounded-xl overflow-hidden shadow-2xl relative">
              {canWatchLesson ? (
                <iframe
                  key={activeVideoUrl} // force re-render when URL changes
                  src={activeVideoUrl}
                  title={activeLesson.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                // Locked lesson overlay — shown when user hasn't paid
                <div className="absolute inset-0 bg-navy flex flex-col items-center justify-center text-center px-6">
                  <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-4">
                    <Lock className="w-8 h-8 text-white/60" />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-white mb-2">
                    This lesson is locked
                  </h3>
                  <p className="text-white/60 text-sm mb-5 max-w-xs">
                    Enroll in the course to unlock all {allLessons.length} lessons with lifetime access.
                  </p>
                  <button
                    onClick={() => setShowUnlockPrompt(true)}
                    className="bg-blue text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue/90 transition-colors"
                    id="locked-lesson-unlock"
                  >
                    Unlock Course — ₹{course.price.toLocaleString()}
                  </button>
                </div>
              )}
            </div>

            {/* Lesson info bar */}
            <div className="bg-navy/50 border border-white/10 rounded-xl p-5">
              <p className="text-white/50 text-xs uppercase tracking-wider mb-1">
                {activeLesson.sectionTitle}
              </p>
              <h2 className="font-heading font-bold text-white text-lg leading-snug">
                {activeLesson.title}
              </h2>
              <p className="text-white/40 text-sm mt-1">
                Lesson {activeLessonIdx + 1} of {allLessons.length}
              </p>

              <div className="flex gap-3 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={activeLessonIdx === 0}
                  onClick={() => setActiveLessonIdx((i) => Math.max(0, i - 1))}
                  className="border-white/20 text-white/70 hover:bg-white/10 hover:text-white disabled:opacity-30"
                >
                  Previous
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  disabled={activeLessonIdx === allLessons.length - 1}
                  onClick={() => {
                    const nextIdx = activeLessonIdx + 1;
                    const nextLesson = allLessons[nextIdx];
                    // Block advancing to a paid lesson if not enrolled
                    if (!isEnrolled && nextLesson && !nextLesson.isFreePreview) {
                      setShowUnlockPrompt(true);
                    } else {
                      setActiveLessonIdx((i) => Math.min(allLessons.length - 1, i + 1));
                    }
                  }}
                  id="next-lesson"
                >
                  Next Lesson →
                </Button>
              </div>
            </div>
          </div>

          {/* ── Lesson List / Sidebar ───────────────────────────────── */}
          <div className="bg-navy/50 border border-white/10 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-white/10">
              <h3 className="font-heading font-bold text-white">Course Content</h3>
              <p className="text-white/50 text-xs mt-1">
                {activeLessonIdx + 1} / {allLessons.length} lessons
              </p>
              {/* Progress bar */}
              <div className="mt-3 progress-bar bg-white/10">
                <div
                  className="progress-fill"
                  style={{
                    width: `${((activeLessonIdx + 1) / allLessons.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            <div className="overflow-y-auto max-h-[60vh]">
              {course.curriculum.map((section, sIdx) => (
                <div key={sIdx}>
                  {/* Section header */}
                  <div className="px-4 py-2.5 bg-white/5 border-b border-white/5">
                    <p className="text-white/60 text-xs font-semibold uppercase tracking-wider">
                      {sIdx + 1}. {section.title}
                    </p>
                  </div>

                  {/* Lesson rows */}
                  {section.lessons.map((lesson: Lesson, lIdx: number) => {
                    const globalIdx =
                      course.curriculum
                        .slice(0, sIdx)
                        .reduce((acc, s) => acc + s.lessons.length, 0) + lIdx;
                    const isActive = globalIdx === activeLessonIdx;
                    const isCompleted = globalIdx < activeLessonIdx;

                    return (
                      <button
                        key={lIdx}
                        onClick={() => {
                          if (globalIdx <= activeLessonIdx + 1) {
                            setActiveLessonIdx(globalIdx);
                          } else {
                            setShowUnlockPrompt(true);
                          }
                        }}
                        className={`w-full text-left flex items-start gap-3 px-4 py-3 border-b border-white/5 transition-colors
                          ${
                            isActive
                              ? "bg-blue/20 border-l-2 border-l-blue"
                              : "hover:bg-white/5"
                          }`}
                        id={`lesson-${globalIdx}`}
                      >
                        <div className="flex-shrink-0 mt-0.5">
                          {isCompleted ? (
                            <CheckCircle className="w-4 h-4 text-teal" />
                          ) : isActive ? (
                            <PlayCircle className="w-4 h-4 text-blue" />
                          ) : (
                            <Lock className="w-4 h-4 text-white/30" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm leading-tight line-clamp-2 ${
                              isActive
                                ? "text-white font-medium"
                                : isCompleted
                                ? "text-white/70"
                                : "text-white/50"
                            }`}
                          >
                            {lesson.title}
                          </p>
                          {lesson.isFreePreview && (
                            <span className="text-xs text-emerald-400 mt-0.5 block">
                              Free Preview
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Unlock course overlay */}
      {showUnlockPrompt && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4"
          onClick={() => setShowUnlockPrompt(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-14 h-14 bg-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <Lock className="w-7 h-7 text-gold" />
            </div>
            <h3 className="font-heading text-xl font-bold text-navy mb-2">
              Unlock Full Course
            </h3>
            <p className="text-muted text-sm mb-6 leading-relaxed">
              You&apos;re watching the free preview. Enroll to unlock all{" "}
              <strong className="text-navy">{allLessons.length} lessons</strong> with lifetime access.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => router.push(`/checkout/${courseId}`)}
                className="w-full h-12 bg-blue text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-blue/90 transition-colors"
                id="unlock-course-btn"
              >
                Enroll Now — ₹{course?.price.toLocaleString()}
              </button>
              <button
                onClick={() => setShowUnlockPrompt(false)}
                className="w-full text-sm text-muted hover:text-bodytext transition-colors py-2"
              >
                Continue with free preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function VideoPlayerPage({ params }: Props) {
  return (
    <AuthGuard>
      <VideoPlayerInner params={params} />
    </AuthGuard>
  );
}
