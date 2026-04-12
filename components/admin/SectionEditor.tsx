"use client";

import React, { useState } from "react";
import { Plus, Trash2, ChevronDown, ChevronRight, Loader2, Edit2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Lesson {
  id: string;
  title: string;
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

interface Props {
  courseId: string;
  initialSections: Section[];
}

export default function SectionEditor({ courseId, initialSections }: Props) {
  const [sections, setSections] = useState<Section[]>(initialSections);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  // Inline editing state
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editingSectionTitle, setEditingSectionTitle] = useState("");
  const [addingLessonToSection, setAddingLessonToSection] = useState<string | null>(null);
  const [newLesson, setNewLesson] = useState({ title: "", videoUrl: "", duration: "", isFreePreview: false });

  const setLoad = (key: string, val: boolean) =>
    setLoading((prev) => ({ ...prev, [key]: val }));

  // --- Section actions ---

  const addSection = async () => {
    setLoad("addSection", true);
    const res = await fetch("/api/admin/sections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        courseId,
        title: `Section ${sections.length + 1}`,
        sortOrder: sections.length,
      }),
    });
    const data = await res.json();
    setLoad("addSection", false);
    if (data.success) {
      setSections((prev) => [...prev, { ...data.data, lessons: [] }]);
      setEditingSectionId(data.data.id);
      setEditingSectionTitle(data.data.title);
      setExpanded((prev) => ({ ...prev, [data.data.id]: true }));
    }
  };

  const saveSection = async (id: string) => {
    setLoad(id, true);
    await fetch(`/api/admin/sections/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editingSectionTitle }),
    });
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, title: editingSectionTitle } : s))
    );
    setEditingSectionId(null);
    setLoad(id, false);
  };

  const deleteSection = async (id: string) => {
    if (!confirm("Delete this section and all its lessons?")) return;
    setLoad(id, true);
    await fetch(`/api/admin/sections/${id}`, { method: "DELETE" });
    setSections((prev) => prev.filter((s) => s.id !== id));
    setLoad(id, false);
  };

  // --- Lesson actions ---

  const addLesson = async (sectionId: string) => {
    if (!newLesson.title || !newLesson.videoUrl) return;
    setLoad(`lesson-${sectionId}`, true);

    const section = sections.find((s) => s.id === sectionId)!;
    const res = await fetch("/api/admin/lessons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sectionId,
        title: newLesson.title,
        videoUrl: newLesson.videoUrl,
        duration: newLesson.duration || undefined,
        isFreePreview: newLesson.isFreePreview,
        sortOrder: section.lessons.length,
      }),
    });
    const data = await res.json();
    setLoad(`lesson-${sectionId}`, false);

    if (data.success) {
      setSections((prev) =>
        prev.map((s) =>
          s.id === sectionId ? { ...s, lessons: [...s.lessons, data.data] } : s
        )
      );
      setNewLesson({ title: "", videoUrl: "", duration: "", isFreePreview: false });
      setAddingLessonToSection(null);
    }
  };

  const deleteLesson = async (sectionId: string, lessonId: string) => {
    if (!confirm("Delete this lesson?")) return;
    setLoad(`del-lesson-${lessonId}`, true);
    await fetch(`/api/admin/lessons/${lessonId}`, { method: "DELETE" });
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? { ...s, lessons: s.lessons.filter((l) => l.id !== lessonId) }
          : s
      )
    );
    setLoad(`del-lesson-${lessonId}`, false);
  };

  return (
    <div className="space-y-3">
      {sections.map((section, idx) => (
        <div key={section.id} className="border border-gray-100 rounded-xl overflow-hidden bg-white shadow-sm">
          {/* Section header */}
          <div className="flex items-center gap-2 px-4 py-3 bg-gray-50">
            <button
              type="button"
              onClick={() => setExpanded((p) => ({ ...p, [section.id]: !p[section.id] }))}
              className="text-muted hover:text-navy transition-colors"
            >
              {expanded[section.id] ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>

            {editingSectionId === section.id ? (
              <>
                <Input
                  value={editingSectionTitle}
                  onChange={(e) => setEditingSectionTitle(e.target.value)}
                  className="h-8 text-sm font-medium flex-1 min-w-0"
                  autoFocus
                  onKeyDown={(e) => e.key === "Enter" && saveSection(section.id)}
                />
                <button
                  type="button"
                  onClick={() => saveSection(section.id)}
                  disabled={loading[section.id]}
                  className="p-1 text-teal hover:text-teal/80"
                >
                  {loading[section.id] ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingSectionId(null)}
                  className="p-1 text-muted hover:text-bodytext"
                >
                  <X className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <span className="flex-1 text-sm font-semibold text-navy min-w-0 truncate">
                  {idx + 1}. {section.title}
                  <span className="text-muted font-normal ml-2">
                    ({section.lessons.length} lessons)
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setEditingSectionId(section.id);
                    setEditingSectionTitle(section.title);
                  }}
                  className="p-1 text-muted hover:text-blue transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => deleteSection(section.id)}
                  disabled={loading[section.id]}
                  className="p-1 text-muted hover:text-red-500 transition-colors"
                >
                  {loading[section.id] ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                </button>
              </>
            )}
          </div>

          {/* Lessons */}
          {expanded[section.id] && (
            <div className="divide-y divide-gray-50">
              {section.lessons.map((lesson, lIdx) => (
                <div key={lesson.id} className="flex items-center gap-3 px-4 py-2.5">
                  <span className="text-xs text-muted w-5 shrink-0">{lIdx + 1}.</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-bodytext line-clamp-1">{lesson.title}</p>
                    {lesson.duration && (
                      <p className="text-xs text-muted">{lesson.duration}</p>
                    )}
                  </div>
                  {lesson.isFreePreview && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full shrink-0">
                      Free
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => deleteLesson(section.id, lesson.id)}
                    disabled={loading[`del-lesson-${lesson.id}`]}
                    className="p-1 text-muted hover:text-red-500 transition-colors shrink-0"
                  >
                    {loading[`del-lesson-${lesson.id}`] ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              ))}

              {/* Add lesson form */}
              {addingLessonToSection === section.id ? (
                <div className="px-4 py-3 bg-blue/5 space-y-2">
                  <Input
                    placeholder="Lesson title *"
                    value={newLesson.title}
                    onChange={(e) => setNewLesson((p) => ({ ...p, title: e.target.value }))}
                    className="text-sm h-9"
                    autoFocus
                  />
                  <Input
                    placeholder="YouTube URL or video URL *"
                    value={newLesson.videoUrl}
                    onChange={(e) => setNewLesson((p) => ({ ...p, videoUrl: e.target.value }))}
                    className="text-sm h-9 font-mono"
                  />
                  <div className="flex items-center gap-3">
                    <Input
                      placeholder="Duration (e.g. 45 min)"
                      value={newLesson.duration}
                      onChange={(e) => setNewLesson((p) => ({ ...p, duration: e.target.value }))}
                      className="text-sm h-9 flex-1"
                    />
                    <label className="flex items-center gap-1.5 text-sm text-muted shrink-0 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newLesson.isFreePreview}
                        onChange={(e) => setNewLesson((p) => ({ ...p, isFreePreview: e.target.checked }))}
                        className="rounded"
                      />
                      Free preview
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="default"
                      size="sm"
                      onClick={() => addLesson(section.id)}
                      disabled={loading[`lesson-${section.id}`]}
                      className="gap-1.5"
                    >
                      {loading[`lesson-${section.id}`] ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : null}
                      Add Lesson
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setAddingLessonToSection(null);
                        setNewLesson({ title: "", videoUrl: "", duration: "", isFreePreview: false });
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="px-4 py-2">
                  <button
                    type="button"
                    onClick={() => {
                      setAddingLessonToSection(section.id);
                      setNewLesson({ title: "", videoUrl: "", duration: "", isFreePreview: false });
                    }}
                    className="flex items-center gap-1.5 text-sm text-blue hover:text-blue/80 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Lesson
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      {/* Add section button */}
      <Button
        type="button"
        variant="outline"
        onClick={addSection}
        disabled={loading["addSection"]}
        className="gap-2 w-full"
      >
        {loading["addSection"] ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Plus className="w-4 h-4" />
        )}
        Add Section
      </Button>
    </div>
  );
}
