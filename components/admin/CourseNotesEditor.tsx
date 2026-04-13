"use client";

import React, { useState } from "react";
import { Plus, Trash2, FileText, ExternalLink, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CourseNote {
  id: string;
  title: string;
  fileUrl: string;
  sortOrder: number;
  createdAt: string;
}

interface Props {
  courseId: string;
  initialNotes: CourseNote[];
}

export default function CourseNotesEditor({ courseId, initialNotes }: Props) {
  const [notes, setNotes] = useState<CourseNote[]>(initialNotes);
  const [form, setForm] = useState({ title: "", fileUrl: "" });
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.fileUrl.trim()) {
      setError("Title and URL are required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/courses/${courseId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setNotes((p) => [...p, data.data]);
        setForm({ title: "", fileUrl: "" });
      } else {
        setError(data.error || "Failed to add material.");
      }
    } catch {
      setError("Network error — please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this material?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/course-notes/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setNotes((p) => p.filter((n) => n.id !== id));
      } else {
        setError("Failed to delete material.");
      }
    } catch {
      setError("Network error — please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-5">
      {error && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      {/* Add form */}
      <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Label className="mb-1.5 block text-xs font-medium text-muted uppercase tracking-wider">Title</Label>
          <Input
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            placeholder="e.g. Chapter 1 Notes PDF"
            className="h-9 text-sm"
          />
        </div>
        <div className="flex-1">
          <Label className="mb-1.5 block text-xs font-medium text-muted uppercase tracking-wider">URL</Label>
          <Input
            value={form.fileUrl}
            onChange={(e) => setForm((p) => ({ ...p, fileUrl: e.target.value }))}
            placeholder="https://drive.google.com/..."
            className="h-9 text-sm font-mono"
          />
        </div>
        <div className="flex items-end">
          <Button
            type="submit"
            variant="default"
            size="sm"
            loading={saving}
            loadingText="Adding…"
            disabled={saving}
            className="gap-1.5 h-9"
          >
            <Plus className="w-3.5 h-3.5" />
            Add
          </Button>
        </div>
      </form>

      {/* Materials list */}
      {notes.length === 0 ? (
        <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-xl">
          <FileText className="w-8 h-8 mx-auto text-muted opacity-40 mb-2" />
          <p className="text-sm text-muted">No materials yet. Add a PDF, doc, or resource link above.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notes.map((note) => (
            <div key={note.id} className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 group">
              <FileText className="w-4 h-4 text-muted shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-navy line-clamp-1">{note.title}</p>
                <a
                  href={note.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue hover:underline flex items-center gap-1 mt-0.5 line-clamp-1"
                >
                  <ExternalLink className="w-3 h-3 shrink-0" />
                  {note.fileUrl}
                </a>
              </div>
              <span className="text-xs text-muted shrink-0">
                {new Date(note.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(note.id)}
                loading={deletingId === note.id}
                disabled={deletingId === note.id}
                className="opacity-0 group-hover:opacity-100 w-7 h-7 text-muted hover:text-red-500 hover:bg-red-50 shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
