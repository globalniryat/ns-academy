"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ContentItem {
  id: string;
  key: string;
  value: string;
  type: string;
}

const GROUPS: Record<string, string[]> = {
  Hero: ["hero_headline", "hero_subheadline", "hero_badge", "hero_cta_primary", "hero_cta_secondary"],
  Stats: ["stats_students", "stats_courses", "stats_rating", "stats_label1", "stats_label2", "stats_label3"],
  Instructor: ["instructor_name", "instructor_title", "instructor_bio", "instructor_credentials"],
  CTA: ["cta_headline", "cta_subheadline", "cta_button"],
  Footer: ["footer_company_name", "footer_tagline", "footer_email", "footer_phone"],
};

export default function AdminContentPage() {
  const [content, setContent] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/content")
      .then((r) => r.json())
      .then((data) => {
        const map: Record<string, string> = {};
        (data.data ?? []).forEach((item: ContentItem) => {
          map[item.key] = item.value;
        });
        setContent(map);
      })
      .catch(() => setError("Failed to load content."))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    setError("");

    const updates = Object.entries(content).map(([key, value]) => ({ key, value, type: "text" }));
    const res = await fetch("/api/admin/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ updates }),
    });
    const data = await res.json();
    setSaving(false);

    if (data.success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } else {
      setError(data.error || "Failed to save.");
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-blue" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-navy">Site Content</h1>
          <p className="text-muted text-sm mt-1">Edit homepage and public page content.</p>
        </div>
        <Button
          variant="default"
          onClick={handleSave}
          loading={saving}
          loadingText="Saving…"
          className="gap-2 min-w-[120px]"
        >
          {saved ? <><Check className="w-4 h-4" /> Saved!</> : "Save All"}
        </Button>
      </div>

      {error && (
        <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      {Object.entries(GROUPS).map(([group, keys]) => (
        <div key={group} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-heading font-bold text-navy mb-4">{group}</h2>
          <div className="space-y-4">
            {keys.map((key) => (
              <div key={key}>
                <Label className="mb-1.5 block text-sm font-medium text-navy font-mono text-xs">
                  {key}
                </Label>
                {(content[key] ?? "").length > 100 ? (
                  <textarea
                    value={content[key] ?? ""}
                    onChange={(e) => setContent((p) => ({ ...p, [key]: e.target.value }))}
                    rows={3}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue resize-none"
                  />
                ) : (
                  <Input
                    value={content[key] ?? ""}
                    onChange={(e) => setContent((p) => ({ ...p, [key]: e.target.value }))}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
