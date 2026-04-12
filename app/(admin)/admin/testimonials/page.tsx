"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Loader2, AlertCircle, Star } from "lucide-react";
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

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/testimonials")
      .then((r) => r.json())
      .then((d) => setTestimonials(d.data ?? []))
      .catch(() => setError("Failed to load."))
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const res = await fetch("/api/admin/testimonials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setSaving(false);

    if (data.success) {
      setTestimonials((p) => [data.data, ...p]);
      setForm(emptyForm);
    } else {
      setError(data.error || "Failed to add testimonial.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this testimonial?")) return;
    setDeletingId(id);
    await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
    setTestimonials((p) => p.filter((t) => t.id !== id));
    setDeletingId(null);
  };

  const toggleActive = async (t: Testimonial) => {
    const res = await fetch(`/api/admin/testimonials/${t.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !t.isActive }),
    });
    const data = await res.json();
    if (data.success) {
      setTestimonials((p) => p.map((x) => (x.id === t.id ? data.data : x)));
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-4xl">
      <div>
        <h1 className="font-heading text-2xl font-bold text-navy">Testimonials</h1>
        <p className="text-muted text-sm mt-1">{testimonials.length} testimonials</p>
      </div>

      {error && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      {/* Add form */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-heading font-bold text-navy mb-4 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Testimonial
        </h2>
        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="mb-1.5 block text-sm font-medium text-navy">Name *</Label>
            <Input required value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="Student name" />
          </div>
          <div>
            <Label className="mb-1.5 block text-sm font-medium text-navy">College</Label>
            <Input value={form.college} onChange={(e) => setForm((p) => ({ ...p, college: e.target.value }))} placeholder="College name" />
          </div>
          <div>
            <Label className="mb-1.5 block text-sm font-medium text-navy">Role / Achievement</Label>
            <Input value={form.role} onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))} placeholder="e.g. CA Final Student" />
          </div>
          <div>
            <Label className="mb-1.5 block text-sm font-medium text-navy">Rating (1–5)</Label>
            <Input
              type="number" min={1} max={5}
              value={form.rating}
              onChange={(e) => setForm((p) => ({ ...p, rating: parseInt(e.target.value) || 5 }))}
            />
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
              Add Testimonial
            </Button>
          </div>
        </form>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-blue" /></div>
      ) : (
        <div className="space-y-3">
          {testimonials.map((t) => (
            <div key={t.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-navy text-sm">{t.name}</p>
                  {t.college && <span className="text-xs text-muted">· {t.college}</span>}
                  <div className="flex items-center gap-0.5 ml-auto">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-gold text-gold" />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-bodytext line-clamp-2">&ldquo;{t.quote}&rdquo;</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => toggleActive(t)}
                  className={`text-xs font-semibold px-2 py-1 rounded-full transition-colors ${
                    t.isActive ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {t.isActive ? "Active" : "Hidden"}
                </button>
                <button
                  onClick={() => handleDelete(t.id)}
                  disabled={deletingId === t.id}
                  className="p-1.5 text-muted hover:text-red-500 transition-colors"
                >
                  {deletingId === t.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
