"use client";

import React, { useState } from "react";
import { Plus, Trash2, AlertCircle, ChevronDown, HelpCircle, Eye, EyeOff, Edit2, Check, X } from "lucide-react";
import { Button, ButtonSpinner } from "@/components/ui/button";
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

export default function FaqsManager({ initialFaqs }: { initialFaqs: FAQ[] }) {
  const [faqs, setFaqs] = useState<FAQ[]>(initialFaqs);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ question: "", answer: "" });
  const [editSaving, setEditSaving] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/faqs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setFaqs((p) => [...p, data.data]);
        setForm(emptyForm);
      } else {
        setError(data.error || "Failed to add FAQ.");
      }
    } catch {
      setError("Network error — please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this FAQ?")) return;
    setDeletingId(id);
    try {
      await fetch(`/api/admin/faqs/${id}`, { method: "DELETE" });
      setFaqs((p) => p.filter((f) => f.id !== id));
    } finally {
      setDeletingId(null);
    }
  };

  const toggleActive = async (f: FAQ) => {
    setTogglingId(f.id);
    try {
      const res = await fetch(`/api/admin/faqs/${f.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !f.isActive }),
      });
      const data = await res.json();
      if (data.success) {
        setFaqs((p) => p.map((x) => (x.id === f.id ? data.data : x)));
      }
    } finally {
      setTogglingId(null);
    }
  };

  const startEdit = (f: FAQ) => {
    setEditingId(f.id);
    setEditForm({ question: f.question, answer: f.answer });
    setExpanded(f.id);
  };

  const saveEdit = async (id: string) => {
    setEditSaving(true);
    try {
      const res = await fetch(`/api/admin/faqs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (data.success) {
        setFaqs((p) => p.map((x) => (x.id === id ? data.data : x)));
        setEditingId(null);
      }
    } finally {
      setEditSaving(false);
    }
  };

  const activeCount = faqs.filter((f) => f.isActive).length;

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-navy">FAQs</h1>
          <p className="text-muted text-sm mt-1">{faqs.length} total · {activeCount} visible</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
          <HelpCircle className="w-5 h-5 text-purple-600" />
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
          Add FAQ
        </h2>
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <Label className="mb-1.5 block text-sm font-medium text-navy">Question *</Label>
            <Input
              required
              value={form.question}
              onChange={(e) => setForm((p) => ({ ...p, question: e.target.value }))}
              placeholder="e.g. What is the duration of the course?"
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
            <Plus className="w-4 h-4" />
            Add FAQ
          </Button>
        </form>
      </div>

      {/* List */}
      {faqs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 text-center">
          <HelpCircle className="w-10 h-10 mx-auto text-muted opacity-30 mb-3" />
          <p className="text-sm text-muted">No FAQs yet. Add your first one above.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {faqs.map((f, idx) => (
            <div
              key={f.id}
              className={`bg-white rounded-xl border shadow-sm overflow-hidden transition-all ${
                f.isActive ? "border-gray-100" : "border-gray-100 opacity-60"
              }`}
            >
              {/* Question row */}
              <div className="flex items-center gap-3 px-4 py-3.5">
                <span className="text-xs font-bold text-muted w-5 shrink-0">{idx + 1}.</span>
                <button
                  type="button"
                  onClick={() => setExpanded((p) => (p === f.id ? null : f.id))}
                  className="flex-1 text-left text-sm font-medium text-navy line-clamp-1 hover:text-blue transition-colors"
                >
                  {f.question}
                </button>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => startEdit(f)}
                    className="p-1.5 text-muted hover:text-blue hover:bg-blue/10 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => toggleActive(f)}
                    disabled={togglingId === f.id}
                    title={f.isActive ? "Hide" : "Show"}
                    className={`p-1.5 rounded-lg transition-colors disabled:opacity-50 ${
                      f.isActive ? "text-green-600 hover:bg-green-50" : "text-muted hover:bg-gray-50"
                    }`}
                  >
                    {togglingId === f.id ? (
                      <ButtonSpinner className="w-3.5 h-3.5" />
                    ) : f.isActive ? (
                      <Eye className="w-3.5 h-3.5" />
                    ) : (
                      <EyeOff className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(f.id)}
                    disabled={deletingId === f.id}
                    className="p-1.5 text-muted hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {deletingId === f.id ? (
                      <ButtonSpinner className="w-3.5 h-3.5" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setExpanded((p) => (p === f.id ? null : f.id))}
                    className="p-1.5 text-muted hover:text-navy transition-colors"
                  >
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${expanded === f.id ? "rotate-180" : ""}`}
                    />
                  </button>
                </div>
              </div>

              {/* Answer / Edit */}
              {expanded === f.id && (
                <div className="border-t border-gray-50 px-5 pb-4 pt-3 bg-gray-50/50">
                  {editingId === f.id ? (
                    <div className="space-y-3">
                      <Input
                        value={editForm.question}
                        onChange={(e) => setEditForm((p) => ({ ...p, question: e.target.value }))}
                        placeholder="Question"
                        className="text-sm font-medium"
                      />
                      <textarea
                        value={editForm.answer}
                        onChange={(e) => setEditForm((p) => ({ ...p, answer: e.target.value }))}
                        rows={3}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue resize-none"
                      />
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="default"
                          size="sm"
                          onClick={() => saveEdit(f.id)}
                          loading={editSaving}
                          loadingText="Saving…"
                          disabled={editSaving}
                          className="gap-1.5"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Save
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingId(null)}
                          disabled={editSaving}
                        >
                          <X className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-bodytext leading-relaxed">{f.answer}</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
