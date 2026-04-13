"use client";

import React, { useState } from "react";
import { Plus, Trash2, ChevronDown, ChevronRight, Edit2, Check, X, Video } from "lucide-react";
import { Button, ButtonSpinner } from "@/components/ui/button";
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

const emptyLesson = { title: "", videoUrl: "", duration: "", isFreePreview: false };

export default function SectionEditor({ courseId, initialSections }: Props) {
  const [sections, setSections] = useState<Section[]>(initialSections);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  // Section editing
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editingSectionTitle, setEditingSectionTitle] = useState("");

  // Lesson adding
  const [addingLessonToSection, setAddingLessonToSection] = useState<string | null>(null);
  const [newLesson, setNewLesson] = useState(emptyLesson);

  // Lesson editing
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [editingLesson, setEditingLesson] = useState(emptyLesson);

  const setLoad = (key: string, val: boolean) =>
    setLoading((prev) => ({ ...prev, [key]: val }));

  // ── Section actions ────────────────────────────────────────

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

  // ── Lesson actions ─────────────────────────────────────────

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
      setNewLesson(emptyLesson);
      setAddingLessonToSection(null);
    }
  };

  const startEditLesson = (lesson: Lesson) => {
    setEditingLessonId(lesson.id);
    setEditingLesson({
      title: lesson.title,
      videoUrl: lesson.videoUrl,
      duration: lesson.duration ?? "",
      isFreePreview: lesson.isFreePreview,
    });
    // Close add form if open
    setAddingLessonToSection(null);
  };

  const saveLesson = async (sectionId: string, lessonId: string) => {
    if (!editingLesson.title || !editingLesson.videoUrl) return;
    setLoad(`edit-lesson-${lessonId}`, true);
    const res = await fetch(`/api/admin/lessons/${lessonId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: editingLesson.title,
        videoUrl: editingLesson.videoUrl,
        duration: editingLesson.duration || undefined,
        isFreePreview: editingLesson.isFreePreview,
      }),
    });
    const data = await res.json();
    setLoad(`edit-lesson-${lessonId}`, false);
    if (data.success) {
      setSections((prev) =>
        prev.map((s) =>
          s.id === sectionId
            ? {
                ...s,
                lessons: s.lessons.map((l) =>
                  l.id === lessonId ? { ...l, ...data.data } : l
                ),
              }
            : s
        )
      );
      setEditingLessonId(null);
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
          <div className="flex items-center gap-2 px-4 py-3 bg-gray-50/80 border-b border-gray-100">
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
                  className="p-1 text-green-600 hover:text-green-700"
                >
                  {loading[section.id] ? <ButtonSpinner className="w-4 h-4" /> : <Check className="w-4 h-4" />}
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
                  <span className="text-muted font-normal ml-2 text-xs">
                    {section.lessons.length} lesson{section.lessons.length !== 1 ? "s" : ""}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setEditingSectionId(section.id);
                    setEditingSectionTitle(section.title);
                  }}
                  className="p-1.5 text-muted hover:text-blue transition-colors rounded-lg hover:bg-blue/10"
                  title="Rename section"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => deleteSection(section.id)}
                  disabled={loading[section.id]}
                  className="p-1.5 text-muted hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                  title="Delete section"
                >
                  {loading[section.id] ? (
                    <ButtonSpinner className="w-3.5 h-3.5" />
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
                <div key={lesson.id}>
                  {editingLessonId === lesson.id ? (
                    /* ── Inline lesson edit form ── */
                    <div className="px-4 py-3 bg-amber-50/60 space-y-2 border-l-2 border-amber-400">
                      <Input
                        value={editingLesson.title}
                        onChange={(e) => setEditingLesson((p) => ({ ...p, title: e.target.value }))}
                        placeholder="Lesson title *"
                        className="text-sm h-9"
                        autoFocus
                      />
                      <Input
                        value={editingLesson.videoUrl}
                        onChange={(e) => setEditingLesson((p) => ({ ...p, videoUrl: e.target.value }))}
                        placeholder="YouTube URL or video URL *"
                        className="text-sm h-9 font-mono"
                      />
                      <div className="flex items-center gap-3">
                        <Input
                          value={editingLesson.duration}
                          onChange={(e) => setEditingLesson((p) => ({ ...p, duration: e.target.value }))}
                          placeholder="Duration (e.g. 45 min)"
                          className="text-sm h-9 flex-1"
                        />
                        <label className="flex items-center gap-1.5 text-sm text-muted shrink-0 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editingLesson.isFreePreview}
                            onChange={(e) => setEditingLesson((p) => ({ ...p, isFreePreview: e.target.checked }))}
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
                          onClick={() => saveLesson(section.id, lesson.id)}
                          loading={loading[`edit-lesson-${lesson.id}`]}
                          loadingText="Saving…"
                          disabled={loading[`edit-lesson-${lesson.id}`]}
                          className="gap-1.5"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Save
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingLessonId(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    /* ── Lesson row ── */
                    <div className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50/50 group transition-colors">
                      <span className="text-xs text-muted w-5 shrink-0 font-mono">{lIdx + 1}.</span>
                      <Video className="w-3.5 h-3.5 text-muted shrink-0" />
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
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        <button
                          type="button"
                          onClick={() => startEditLesson(lesson)}
                          className="p-1.5 text-muted hover:text-blue transition-colors rounded-lg hover:bg-blue/10"
                          title="Edit lesson"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteLesson(section.id, lesson.id)}
                          disabled={loading[`del-lesson-${lesson.id}`]}
                          className="p-1.5 text-muted hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                          title="Delete lesson"
                        >
                          {loading[`del-lesson-${lesson.id}`] ? (
                            <ButtonSpinner className="w-3.5 h-3.5" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Add lesson form */}
              {addingLessonToSection === section.id ? (
                <div className="px-4 py-3 bg-blue/5 space-y-2 border-l-2 border-blue">
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
                      loading={loading[`lesson-${section.id}`]}
                      loadingText="Adding…"
                      disabled={loading[`lesson-${section.id}`]}
                      className="gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Lesson
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setAddingLessonToSection(null);
                        setNewLesson(emptyLesson);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="px-4 py-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setAddingLessonToSection(section.id);
                      setEditingLessonId(null);
                      setNewLesson(emptyLesson);
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
        loading={loading["addSection"]}
        loadingText="Adding section…"
        disabled={loading["addSection"]}
        className="gap-2 w-full border-dashed"
      >
        <Plus className="w-4 h-4" />
        Add Section
      </Button>
    </div>
  );
}
