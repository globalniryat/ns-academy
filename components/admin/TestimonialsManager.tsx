"use client";

import React, { useState } from "react";
import { Plus, Trash2, AlertCircle, Star, Eye, EyeOff, MessageSquare } from "lucide-react";
import { ButtonSpinner } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Testimonial {
  id: string;
  name: string;
  college: string | null;
  role: string | null;
  quote: string;
  rating: number;
  isActive: boolean;
  sortOrder: number;
}

const emptyForm = { name: "", college: "", role: "", quote: "", rating: 5, isActive: true, sortOrder: 0 };

function StarRating({ rating, onChange }: { rating: number; onChange?: (r: number) => void }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange?.(i)}
          className={`transition-colors ${onChange ? "cursor-pointer hover:scale-110" : "cursor-default"}`}
        >
          <Star className={`w-4 h-4 ${i <= rating ? "fill-amber-400 text-amber-400" : "text-gray-200"}`} />
        </button>
      ))}
    </div>
  );
}

export default function TestimonialsManager({
  initialTestimonials,
}: {
  initialTestimonials: Testimonial[];
}) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setTestimonials((p) => [data.data, ...p]);
        setForm(emptyForm);
      } else {
        setError(data.error || "Failed to add testimonial.");
      }
    } catch {
      setError("Network error — please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this testimonial?")) return;
    setDeletingId(id);
    try {
      await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
      setTestimonials((p) => p.filter((t) => t.id !== id));
    } finally {
      setDeletingId(null);
    }
  };

  const toggleActive = async (t: Testimonial) => {
    setTogglingId(t.id);
    try {
      const res = await fetch(`/api/admin/testimonials/${t.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !t.isActive }),
      });
      const data = await res.json();
      if (data.success) {
        setTestimonials((p) => p.map((x) => (x.id === t.id ? data.data : x)));
      }
    } finally {
      setTogglingId(null);
    }
  };

  const activeCount = testimonials.filter((t) => t.isActive).length;

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-navy">Testimonials</h1>
          <p className="text-muted text-sm mt-1">
            {testimonials.length} total · {activeCount} visible
          </p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
          <MessageSquare className="w-5 h-5 text-amber-600" />
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      {/* Add form */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-heading font-semibold text-navy mb-5 flex items-center gap-2">
          <Plus className="w-4 h-4 text-muted" />
          Add Testimonial
        </h2>
        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="mb-1.5 block text-sm font-medium text-navy">Name *</Label>
            <Input
              required
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="Student name"
            />
          </div>
          <div>
            <Label className="mb-1.5 block text-sm font-medium text-navy">College</Label>
            <Input
              value={form.college}
              onChange={(e) => setForm((p) => ({ ...p, college: e.target.value }))}
              placeholder="e.g. ICAI Delhi"
            />
          </div>
          <div>
            <Label className="mb-1.5 block text-sm font-medium text-navy">Role / Achievement</Label>
            <Input
              value={form.role}
              onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
              placeholder="e.g. CA Final Student"
            />
          </div>
          <div>
            <Label className="mb-1.5 block text-sm font-medium text-navy">Rating</Label>
            <div className="flex items-center gap-3 mt-2">
              <StarRating rating={form.rating} onChange={(r) => setForm((p) => ({ ...p, rating: r }))} />
              <span className="text-sm text-muted">{form.rating}/5</span>
            </div>
          </div>
          <div className="md:col-span-2">
            <Label className="mb-1.5 block text-sm font-medium text-navy">Quote *</Label>
            <textarea
              required
              value={form.quote}
              onChange={(e) => setForm((p) => ({ ...p, quote: e.target.value }))}
              rows={3}
              placeholder="What the student said…"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue resize-none"
            />
          </div>
          <div className="md:col-span-2">
            <Button type="submit" variant="default" loading={saving} loadingText="Adding…" className="gap-2">
              <Plus className="w-4 h-4" />
              Add Testimonial
            </Button>
          </div>
        </form>
      </div>

      {/* List */}
      {testimonials.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 text-center">
          <MessageSquare className="w-10 h-10 mx-auto text-muted opacity-30 mb-3" />
          <p className="text-sm text-muted">No testimonials yet. Add your first one above.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className={`bg-white rounded-xl border shadow-sm p-5 transition-all ${
                t.isActive ? "border-gray-100" : "border-gray-100 opacity-60"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-amber-600">{t.name.charAt(0).toUpperCase()}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center flex-wrap gap-x-2 gap-y-1 mb-1">
                    <p className="font-semibold text-navy text-sm">{t.name}</p>
                    {t.college && <span className="text-xs text-muted">· {t.college}</span>}
                    {t.role && <span className="text-xs text-muted">· {t.role}</span>}
                    <div className="ml-auto">
                      <StarRating rating={t.rating} />
                    </div>
                  </div>
                  <p className="text-sm text-bodytext leading-relaxed line-clamp-2">&ldquo;{t.quote}&rdquo;</p>
                </div>
                {/* Actions */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => toggleActive(t)}
                    disabled={togglingId === t.id}
                    title={t.isActive ? "Hide" : "Show"}
                    className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${
                      t.isActive
                        ? "text-green-600 bg-green-50 hover:bg-green-100"
                        : "text-muted bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    {togglingId === t.id ? (
                      <ButtonSpinner className="w-4 h-4" />
                    ) : t.isActive ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(t.id)}
                    disabled={deletingId === t.id}
                    className="p-2 rounded-lg text-muted hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    {deletingId === t.id ? (
                      <ButtonSpinner className="w-4 h-4" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
