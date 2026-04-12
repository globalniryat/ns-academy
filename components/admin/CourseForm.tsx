"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";
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

export default function CourseForm({ courseId, initial = {}, onSuccess }: Props) {
  const [form, setForm] = useState<CourseFormData>({ ...DEFAULT, ...initial });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const isEdit = !!courseId;

  const set = (k: keyof CourseFormData, v: string) =>
    setForm((prev) => ({
      ...prev,
      [k]: v,
      ...(k === "title" && !isEdit ? { slug: slugify(v) } : {}),
    }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const payload = {
      ...form,
      price: parseInt(form.price) * 100, // rupees → paise
      originalPrice: parseInt(form.originalPrice) * 100,
      whatYoullLearn: [],
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
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue resize-none"
          />
        </div>

        {/* Level */}
        <div>
          <Label className="mb-1.5 block text-sm font-medium text-navy">Level *</Label>
          <select
            value={form.level}
            onChange={(e) => set("level", e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue"
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
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue"
          >
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>

        {/* Price (rupees) */}
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

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" variant="default" disabled={loading} className="gap-2 min-w-[140px]">
          {loading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
          ) : isEdit ? (
            "Save Changes"
          ) : (
            "Create Course"
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/courses")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
