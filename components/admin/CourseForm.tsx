"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, X, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CourseFormData {
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  level: string;
  status: string;
  price: string;
  originalPrice: string;
  duration: string;
  color: string;
  instructor: string;
  metaTitle: string;
  metaDescription: string;
  freePreviewUrl: string;
  thumbnailUrl: string;
}

interface Props {
  courseId?: string;
  initial?: Partial<CourseFormData>;
  initialWhatYoullLearn?: string[];
  onSuccess?: () => void;
}

const DEFAULT: CourseFormData = {
  title: "",
  slug: "",
  shortDescription: "",
  description: "",
  level: "FOUNDATION",
  status: "DRAFT",
  price: "",
  originalPrice: "",
  duration: "",
  color: "#16a34a",
  instructor: "CA Nikesh Shah",
  metaTitle: "",
  metaDescription: "",
  freePreviewUrl: "",
  thumbnailUrl: "",
};

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function CourseForm({ courseId, initial = {}, initialWhatYoullLearn = [], onSuccess }: Props) {
  const [form, setForm] = useState<CourseFormData>({ ...DEFAULT, ...initial });
  const [whatYoullLearn, setWhatYoullLearn] = useState<string[]>(
    initialWhatYoullLearn.length > 0 ? initialWhatYoullLearn : [""]
  );
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const isEdit = !!courseId;

  const set = (k: keyof CourseFormData, v: string) =>
    setForm((prev) => ({
      ...prev,
      [k]: v,
      ...(k === "title" && !isEdit ? { slug: slugify(v) } : {}),
    }));

  const addLearningPoint = () => setWhatYoullLearn((p) => [...p, ""]);
  const updateLearningPoint = (i: number, v: string) =>
    setWhatYoullLearn((p) => p.map((x, idx) => (idx === i ? v : x)));
  const removeLearningPoint = (i: number) =>
    setWhatYoullLearn((p) => p.filter((_, idx) => idx !== i));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const filtered = whatYoullLearn.filter((s) => s.trim().length > 0);
    if (filtered.length === 0) {
      setError("Add at least one learning outcome.");
      return;
    }

    setLoading(true);
    const payload = {
      ...form,
      price: parseInt(form.price) * 100,
      originalPrice: parseInt(form.originalPrice) * 100,
      whatYoullLearn: filtered,
    };

    const url = isEdit ? `/api/admin/courses/${courseId}` : "/api/admin/courses";
    const method = isEdit ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setLoading(false);

    if (!data.success) {
      setError(data.error || "Failed to save course.");
      return;
    }

    if (onSuccess) {
      onSuccess();
    } else {
      router.push("/admin/courses");
      router.refresh();
    }
  };

  const handleDelete = async () => {
    if (!courseId) return;
    if (!confirm("Permanently delete this course? This will also delete all sections, lessons, and enrollments.")) return;
    setDeleting(true);
    const res = await fetch(`/api/admin/courses/${courseId}`, { method: "DELETE" });
    const data = await res.json();
    setDeleting(false);
    if (data.success) {
      router.push("/admin/courses");
      router.refresh();
    } else {
      setError("Failed to delete course.");
    }
  };

  const fieldClass = "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Title */}
        <div className="md:col-span-2">
          <Label className="mb-1.5 block text-sm font-medium text-navy">Course Title *</Label>
          <Input
            required
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="e.g. CA Final SFM — Complete Course"
          />
        </div>

        {/* Slug */}
        <div>
          <Label className="mb-1.5 block text-sm font-medium text-navy">Slug *</Label>
          <Input
            required
            value={form.slug}
            onChange={(e) => set("slug", slugify(e.target.value))}
            placeholder="ca-final-sfm"
            className="font-mono text-sm"
          />
        </div>

        {/* Duration */}
        <div>
          <Label className="mb-1.5 block text-sm font-medium text-navy">Duration *</Label>
          <Input
            required
            value={form.duration}
            onChange={(e) => set("duration", e.target.value)}
            placeholder="e.g. 120+ hours"
          />
        </div>

        {/* Short description */}
        <div className="md:col-span-2">
          <Label className="mb-1.5 block text-sm font-medium text-navy">Short Description *</Label>
          <Input
            required
            value={form.shortDescription}
            onChange={(e) => set("shortDescription", e.target.value)}
            placeholder="One-line description shown on course cards"
          />
        </div>

        {/* Full description */}
        <div className="md:col-span-2">
          <Label className="mb-1.5 block text-sm font-medium text-navy">Full Description *</Label>
          <textarea
            required
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            rows={5}
            placeholder="Detailed course description (markdown supported)"
            className={`${fieldClass} resize-none`}
          />
        </div>

        {/* What You'll Learn */}
        <div className="md:col-span-2">
          <Label className="mb-1.5 block text-sm font-medium text-navy">What You&apos;ll Learn *</Label>
          <p className="text-xs text-muted mb-2">Add key learning outcomes shown on the course page.</p>
          <div className="space-y-2">
            {whatYoullLearn.map((point, i) => (
              <div key={i} className="flex items-center gap-2">
                <Input
                  value={point}
                  onChange={(e) => updateLearningPoint(i, e.target.value)}
                  placeholder={`e.g. Master SFM concepts and applications`}
                  className="flex-1"
                />
                {whatYoullLearn.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeLearningPoint(i)}
                    className="p-2 text-muted hover:text-red-500 transition-colors shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addLearningPoint}
            className="mt-2 flex items-center gap-1.5 text-sm text-blue hover:text-blue/80 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add outcome
          </button>
        </div>

        {/* Level */}
        <div>
          <Label className="mb-1.5 block text-sm font-medium text-navy">Level *</Label>
          <select
            value={form.level}
            onChange={(e) => set("level", e.target.value)}
            className={fieldClass}
          >
            <option value="FOUNDATION">Foundation</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="FINAL">Final</option>
          </select>
        </div>

        {/* Status */}
        <div>
          <Label className="mb-1.5 block text-sm font-medium text-navy">Status *</Label>
          <select
            value={form.status}
            onChange={(e) => set("status", e.target.value)}
            className={fieldClass}
          >
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>

        {/* Price */}
        <div>
          <Label className="mb-1.5 block text-sm font-medium text-navy">Price (₹) *</Label>
          <Input
            required
            type="number"
            min="1"
            value={form.price}
            onChange={(e) => set("price", e.target.value)}
            placeholder="e.g. 4999"
          />
          <p className="text-xs text-muted mt-1">Enter in rupees — stored as paise.</p>
        </div>

        {/* Original price */}
        <div>
          <Label className="mb-1.5 block text-sm font-medium text-navy">Original Price (₹) *</Label>
          <Input
            required
            type="number"
            min="1"
            value={form.originalPrice}
            onChange={(e) => set("originalPrice", e.target.value)}
            placeholder="e.g. 9999"
          />
        </div>

        {/* Color */}
        <div>
          <Label className="mb-1.5 block text-sm font-medium text-navy">Accent Color</Label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={form.color}
              onChange={(e) => set("color", e.target.value)}
              className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer"
            />
            <Input
              value={form.color}
              onChange={(e) => set("color", e.target.value)}
              className="font-mono text-sm"
              placeholder="#16a34a"
            />
          </div>
        </div>

        {/* Instructor */}
        <div>
          <Label className="mb-1.5 block text-sm font-medium text-navy">Instructor</Label>
          <Input
            value={form.instructor}
            onChange={(e) => set("instructor", e.target.value)}
            placeholder="CA Nikesh Shah"
          />
        </div>

        {/* Thumbnail URL */}
        <div className="md:col-span-2">
          <Label className="mb-1.5 block text-sm font-medium text-navy">Thumbnail URL</Label>
          <Input
            value={form.thumbnailUrl}
            onChange={(e) => set("thumbnailUrl", e.target.value)}
            placeholder="https://..."
          />
        </div>

        {/* Free preview URL */}
        <div className="md:col-span-2">
          <Label className="mb-1.5 block text-sm font-medium text-navy">Free Preview Video URL</Label>
          <Input
            value={form.freePreviewUrl}
            onChange={(e) => set("freePreviewUrl", e.target.value)}
            placeholder="https://youtube.com/watch?v=..."
          />
        </div>

        {/* SEO */}
        <div>
          <Label className="mb-1.5 block text-sm font-medium text-navy">Meta Title</Label>
          <Input
            value={form.metaTitle}
            onChange={(e) => set("metaTitle", e.target.value)}
            placeholder="Optional SEO title"
          />
        </div>
        <div>
          <Label className="mb-1.5 block text-sm font-medium text-navy">Meta Description</Label>
          <Input
            value={form.metaDescription}
            onChange={(e) => set("metaDescription", e.target.value)}
            placeholder="Optional SEO description"
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <div className="flex items-center gap-3">
          <Button
            type="submit"
            variant="default"
            loading={loading}
            loadingText="Saving…"
            disabled={loading || deleting}
            className="gap-2 min-w-[140px]"
          >
            {isEdit ? "Save Changes" : "Create Course"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/courses")}
            disabled={loading || deleting}
          >
            Cancel
          </Button>
        </div>
        {isEdit && (
          <Button
            type="button"
            variant="outline"
            onClick={handleDelete}
            loading={deleting}
            loadingText="Deleting…"
            disabled={loading || deleting}
            className="gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
          >
            <Trash2 className="w-4 h-4" />
            Delete Course
          </Button>
        )}
      </div>
    </form>
  );
}
