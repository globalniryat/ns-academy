"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft, CheckCircle, PlayCircle, ChevronRight,
  Trophy, FileText, Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Lesson {
  id: string;
  title: string;
  description: string | null;
  videoUrl: string;
  duration: string | null;
  isFreePreview: boolean;
  sortOrder: number;
}

interface Section {
  id: string;
  title: string;
  sortOrder: number;
  lessons: Lesson[];
}

interface FlatLesson extends Lesson {
  sectionTitle: string;
  globalIdx: number;
}

interface Props {
  courseId: string;
  courseTitle: string;
  sections: Section[];
  enrollmentStatus: string;
  initialProgress: Record<string, boolean>;
}

// Extract YouTube video ID from any YouTube URL format or bare ID
function extractYoutubeId(url: string): string {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube-nocookie\.com\/embed\/|youtube\.com\/embed\/)([^&?/\s]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return url;
}

export default function CoursePlayerClient({
  courseId,
  courseTitle,
  sections,
  enrollmentStatus,
  initialProgress,
}: Props) {
  // Flatten all lessons for sequential navigation
  const allLessons: FlatLesson[] = [];
  let idx = 0;
  for (const section of sections) {
    for (const lesson of section.lessons) {
      allLessons.push({ ...lesson, sectionTitle: section.title, globalIdx: idx });
      idx++;
    }
  }

  const [activeLessonIdx, setActiveLessonIdx] = useState(0);
  const [progress, setProgress] = useState<Record<string, boolean>>(initialProgress);
  const [noteContent, setNoteContent] = useState("");
  const [noteLoading, setNoteLoading] = useState(false);
  const [markingComplete, setMarkingComplete] = useState(false);
  const [courseCompleted, setCourseCompleted] = useState(
    enrollmentStatus === "COMPLETED"
  );
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [certificateId, setCertificateId] = useState<string | null>(null);

  const activeLesson = allLessons[activeLessonIdx];
  const completedCount = allLessons.filter((l) => progress[l.id]).length;
  const progressPercent =
    allLessons.length > 0
      ? Math.round((completedCount / allLessons.length) * 100)
      : 0;

  // Load notes when active lesson changes
  useEffect(() => {
    if (!activeLesson) return;
    setNoteContent("");
    setNoteLoading(true);
    fetch(`/api/notes?lessonId=${activeLesson.id}`)
      .then((r) => r.json())
      .then((data) => {
        const note = data.data?.[0];
        setNoteContent(note?.content ?? "");
      })
      .catch(() => {})
      .finally(() => setNoteLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeLesson?.id]);

  // Debounced note auto-save
  const noteSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lessonIdRef = useRef<string>("");
   
  lessonIdRef.current = activeLesson?.id ?? "";

  const handleNoteChange = useCallback(
    (val: string) => {
      setNoteContent(val);
      if (noteSaveTimer.current) clearTimeout(noteSaveTimer.current);
      noteSaveTimer.current = setTimeout(async () => {
        const lid = lessonIdRef.current;
        if (!lid) return;
        try {
          await fetch("/api/notes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ lessonId: lid, courseId, content: val }),
          });
        } catch {}
      }, 1000);
    },
    [courseId]
  );

  // Mark lesson complete / incomplete
  const handleMarkComplete = useCallback(
    async (lessonId: string, completed: boolean) => {
      setMarkingComplete(true);
      try {
        const res = await fetch("/api/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lessonId,
            courseId,
            isCompleted: completed,
            watchedSeconds: 0,
          }),
        });
        const data = await res.json();
        if (data.success) {
          setProgress((prev) => ({ ...prev, [lessonId]: completed }));
          if (data.courseCompleted && !courseCompleted) {
            setCourseCompleted(true);
            setCertificateId(data.certificateId ?? null);
            setShowCompletionModal(true);
          }
        }
      } catch {}
      setMarkingComplete(false);
    },
    [courseId, courseCompleted]
  );

  const goToLesson = useCallback((newIdx: number) => {
    setActiveLessonIdx(newIdx);
  }, []);

  if (!activeLesson) {
    return (
      <div className="min-h-screen bg-navy pt-16 flex items-center justify-center">
        <div className="text-center px-4">
          <PlayCircle className="w-16 h-16 text-white/20 mx-auto mb-4" />
          <h2 className="font-heading text-xl font-bold text-white mb-2">No lessons yet</h2>
          <p className="text-white/50 text-sm mb-6">
            This course doesn&apos;t have any lessons added yet. Check back soon!
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-blue hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const videoId = extractYoutubeId(activeLesson.videoUrl);
  const videoEmbedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`;
  const isCurrentCompleted = !!progress[activeLesson.id];

  return (
    <div className="min-h-screen bg-navy pt-16">
      {/* Breadcrumb */}
      <div className="bg-navy/80 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center gap-2 text-sm text-white/60">
          <Link href="/dashboard" className="hover:text-white flex items-center gap-1 shrink-0">
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </Link>
          <ChevronRight className="w-4 h-4 shrink-0" />
          <span className="text-white/80 truncate">{courseTitle}</span>
          <ChevronRight className="w-4 h-4 shrink-0" />
          <span className="text-white/50 truncate">{activeLesson.sectionTitle}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Left column: video + controls + notes ── */}
          <div className="lg:col-span-2 space-y-4">
            {/* Video embed */}
            <div className="video-container rounded-xl overflow-hidden shadow-2xl">
              <iframe
                key={activeLesson.id}
                src={videoEmbedUrl}
                title={activeLesson.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Lesson info + controls */}
            <div className="bg-navy/50 border border-white/10 rounded-xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-white/50 text-xs uppercase tracking-wider mb-1">
                    {activeLesson.sectionTitle}
                  </p>
                  <h2 className="font-heading font-bold text-white text-lg leading-snug">
                    {activeLesson.title}
                  </h2>
                  <p className="text-white/40 text-sm mt-1">
                    Lesson {activeLessonIdx + 1} of {allLessons.length}
                  </p>
                </div>

                {/* Mark complete toggle */}
                <button
                  onClick={() => handleMarkComplete(activeLesson.id, !isCurrentCompleted)}
                  disabled={markingComplete}
                  className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${
                    isCurrentCompleted
                      ? "bg-teal/20 text-teal border border-teal/30 hover:bg-red-500/10 hover:text-red-400 hover:border-red-400/30"
                      : "bg-white/10 text-white/70 border border-white/20 hover:bg-teal/20 hover:text-teal hover:border-teal/30"
                  }`}
                  id="mark-complete-btn"
                >
                  <CheckCircle className="w-4 h-4" />
                  {isCurrentCompleted ? "Completed" : "Mark Complete"}
                </button>
              </div>

              {activeLesson.description && (
                <p className="text-white/60 text-sm mt-3 leading-relaxed">
                  {activeLesson.description}
                </p>
              )}

              {/* Prev / Next */}
              <div className="flex gap-3 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={activeLessonIdx === 0}
                  onClick={() => goToLesson(activeLessonIdx - 1)}
                  className="border-white/20 text-white/70 hover:bg-white/10 hover:text-white disabled:opacity-30"
                >
                  ← Previous
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  disabled={activeLessonIdx === allLessons.length - 1}
                  onClick={() => goToLesson(activeLessonIdx + 1)}
                  id="next-lesson"
                >
                  Next Lesson →
                </Button>
              </div>
            </div>

            {/* Personal notes */}
            <div className="bg-navy/50 border border-white/10 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 text-white/50" />
                <h3 className="font-heading font-semibold text-white text-sm">
                  My Notes — {activeLesson.title}
                </h3>
              </div>
              <textarea
                value={noteContent}
                onChange={(e) => handleNoteChange(e.target.value)}
                placeholder="Write your notes here… they're auto-saved."
                disabled={noteLoading}
                rows={5}
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white/80 text-sm placeholder-white/30 focus:outline-none focus:border-blue/50 resize-none disabled:opacity-50"
              />
              <p className="text-white/30 text-xs mt-1.5">Auto-saved · Visible only to you</p>
            </div>
          </div>

          {/* ── Right column: course content sidebar ── */}
          <div className="bg-navy/50 border border-white/10 rounded-xl overflow-hidden h-fit lg:sticky lg:top-20">
            {/* Sidebar header with progress */}
            <div className="p-4 border-b border-white/10">
              <h3 className="font-heading font-bold text-white text-sm">Course Content</h3>
              <div className="flex items-center justify-between mt-2">
                <p className="text-white/50 text-xs">
                  {completedCount} / {allLessons.length} completed
                </p>
                <p className="text-white/50 text-xs">{progressPercent}%</p>
              </div>
              <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Lesson list grouped by section */}
            <div className="overflow-y-auto max-h-[60vh]">
              {sections.map((section, sIdx) => {
                const offset = sections
                  .slice(0, sIdx)
                  .reduce((acc, s) => acc + s.lessons.length, 0);

                return (
                  <div key={section.id}>
                    {/* Section heading */}
                    <div className="px-4 py-2.5 bg-white/5 border-b border-white/5">
                      <p className="text-white/60 text-xs font-semibold uppercase tracking-wider">
                        {sIdx + 1}. {section.title}
                      </p>
                    </div>

                    {/* Lesson rows */}
                    {section.lessons.map((lesson, lIdx) => {
                      const globalIdx = offset + lIdx;
                      const isActive = globalIdx === activeLessonIdx;
                      const isCompleted = !!progress[lesson.id];

                      return (
                        <button
                          key={lesson.id}
                          onClick={() => goToLesson(globalIdx)}
                          className={`w-full text-left flex items-start gap-3 px-4 py-3 border-b border-white/5 transition-colors ${
                            isActive
                              ? "bg-blue/20 border-l-2 border-l-blue"
                              : "hover:bg-white/5"
                          }`}
                          id={`lesson-btn-${lesson.id}`}
                        >
                          <div className="shrink-0 mt-0.5">
                            {isCompleted ? (
                              <CheckCircle className="w-4 h-4 text-teal" />
                            ) : isActive ? (
                              <PlayCircle className="w-4 h-4 text-blue" />
                            ) : (
                              <div className="w-4 h-4 rounded-full border border-white/20" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-sm leading-tight line-clamp-2 ${
                                isActive
                                  ? "text-white font-medium"
                                  : isCompleted
                                  ? "text-white/60"
                                  : "text-white/50"
                              }`}
                            >
                              {lesson.title}
                            </p>
                            {lesson.duration && (
                              <p className="text-white/30 text-xs mt-0.5">{lesson.duration}</p>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Course completion celebration modal */}
      {showCompletionModal && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4"
          onClick={() => setShowCompletionModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-10 h-10 text-gold" />
            </div>
            <h2 className="font-heading text-2xl font-bold text-navy mb-2">
              Congratulations!
            </h2>
            <p className="text-muted text-sm mb-1">
              You&apos;ve completed
            </p>
            <p className="font-semibold text-navy mb-6">{courseTitle}</p>
            <div className="flex flex-col gap-3">
              {certificateId && (
                <Link href={`/api/certificates/${certificateId}/download`}>
                  <Button variant="default" className="w-full gap-2">
                    <Award className="w-4 h-4" />
                    Download Certificate
                  </Button>
                </Link>
              )}
              <Link href="/dashboard">
                <Button variant="outline" className="w-full">
                  Go to Dashboard
                </Button>
              </Link>
              <button
                onClick={() => setShowCompletionModal(false)}
                className="text-sm text-muted hover:text-bodytext transition-colors py-1"
              >
                Continue Reviewing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
