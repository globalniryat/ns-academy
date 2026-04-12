"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Loader2, AlertCircle, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  isActive: boolean;
  sortOrder: number;
}

const emptyForm = { question: "", answer: "", isActive: true, sortOrder: 0 };

export default function AdminFAQsPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/faqs")
      .then((r) => r.json())
      .then((d) => setFaqs(d.data ?? []))
      .catch(() => setError("Failed to load."))
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    const res = await fetch("/api/admin/faqs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setSaving(false);
    if (data.success) {
      setFaqs((p) => [data.data, ...p]);
      setForm(emptyForm);
    } else {
      setError(data.error || "Failed to add FAQ.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this FAQ?")) return;
    setDeletingId(id);
    await fetch(`/api/admin/faqs/${id}`, { method: "DELETE" });
    setFaqs((p) => p.filter((f) => f.id !== id));
    setDeletingId(null);
  };

  const toggleActive = async (f: FAQ) => {
    const res = await fetch(`/api/admin/faqs/${f.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !f.isActive }),
    });
    const data = await res.json();
    if (data.success) {
      setFaqs((p) => p.map((x) => (x.id === f.id ? data.data : x)));
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-4xl">
      <div>
        <h1 className="font-heading text-2xl font-bold text-navy">FAQs</h1>
        <p className="text-muted text-sm mt-1">{faqs.length} FAQs</p>
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
          Add FAQ
        </h2>
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <Label className="mb-1.5 block text-sm font-medium text-navy">Question *</Label>
            <Input
              required
              value={form.question}
              onChange={(e) => setForm((p) => ({ ...p, question: e.target.value }))}
              placeholder="What is the duration of the course?"
            />
          </div>
          <div>
            <Label className="mb-1.5 block text-sm font-medium text-navy">Answer *</Label>
            <textarea
              required
              value={form.answer}
              onChange={(e) => setForm((p) => ({ ...p, answer: e.target.value }))}
              rows={3}
              placeholder="The course includes 120+ hours of video content…"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue resize-none"
            />
          </div>
          <Button type="submit" variant="default" loading={saving} loadingText="Adding…" className="gap-2">
            Add FAQ
          </Button>
        </form>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-blue" /></div>
      ) : (
        <div className="space-y-2">
          {faqs.map((f) => (
            <div key={f.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3">
                <button
                  type="button"
                  onClick={() => setExpanded((p) => (p === f.id ? null : f.id))}
                  className="text-muted hover:text-navy transition-colors"
                >
                  {expanded === f.id ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
                <p className="flex-1 text-sm font-medium text-navy line-clamp-1">{f.question}</p>
                <button
                  onClick={() => toggleActive(f)}
                  className={`text-xs font-semibold px-2 py-1 rounded-full transition-colors shrink-0 ${
                    f.isActive ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {f.isActive ? "Active" : "Hidden"}
                </button>
                <button
                  onClick={() => handleDelete(f.id)}
                  disabled={deletingId === f.id}
                  className="p-1 text-muted hover:text-red-500 transition-colors shrink-0"
                >
                  {deletingId === f.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                </button>
              </div>
              {expanded === f.id && (
                <div className="px-10 pb-3">
                  <p className="text-sm text-bodytext leading-relaxed">{f.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
