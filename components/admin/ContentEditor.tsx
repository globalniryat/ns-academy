"use client";

import React, { useState } from "react";
import { Check, AlertCircle, FileText, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ContentEditorProps {
  initialContent: Record<string, string>;
}

const GROUPS: Record<string, { keys: string[]; description: string }> = {
  Hero: {
    keys: ["hero_headline", "hero_subheadline", "hero_badge", "hero_cta_primary", "hero_cta_secondary"],
    description: "Main banner shown at the top of the homepage",
  },
  Stats: {
    keys: ["stats_students", "stats_courses", "stats_rating", "stats_label1", "stats_label2", "stats_label3"],
    description: "Numbers displayed in the social proof section",
  },
  Instructor: {
    keys: ["instructor_name", "instructor_title", "instructor_bio", "instructor_credentials"],
    description: "Instructor profile section content",
  },
  CTA: {
    keys: ["cta_headline", "cta_subheadline", "cta_button"],
    description: "Call-to-action section at the bottom of the page",
  },
  Footer: {
    keys: ["footer_company_name", "footer_tagline", "footer_email", "footer_phone"],
    description: "Footer contact and branding information",
  },
};

function formatKey(key: string) {
  return key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function ContentEditor({ initialContent }: ContentEditorProps) {
  const [content, setContent] = useState<Record<string, string>>(initialContent);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({ Hero: true });

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    setError("");
    const updates = Object.entries(content).map(([key, value]) => ({ key, value, type: "text" }));
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updates }),
      });
      const data = await res.json();
      if (data.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        setError(data.error || "Failed to save.");
      }
    } catch {
      setError("Network error — please try again.");
    } finally {
      setSaving(false);
    }
  };

  const toggleGroup = (group: string) =>
    setOpenGroups((p) => ({ ...p, [group]: !p[group] }));

  return (
    <div className="space-y-6">
      {/* Header actions */}
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
          {saved ? (
            <>
              <Check className="w-4 h-4" />
              Saved!
            </>
          ) : (
            <>
              <FileText className="w-4 h-4" />
              Save All
            </>
          )}
        </Button>
      </div>

      {error && (
        <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      {saved && (
        <div className="flex items-center gap-2.5 bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-green-700">
          <Check className="w-4 h-4 shrink-0" />
          All changes saved and site content updated.
        </div>
      )}

      {/* Content groups */}
      <div className="space-y-3">
        {Object.entries(GROUPS).map(([group, { keys, description }]) => (
          <div key={group} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <button
              type="button"
              onClick={() => toggleGroup(group)}
              className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50/50 transition-colors"
            >
              <div className="text-left">
                <p className="font-heading font-semibold text-navy">{group}</p>
                <p className="text-xs text-muted mt-0.5">{description}</p>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-muted transition-transform ${openGroups[group] ? "rotate-180" : ""}`}
              />
            </button>

            {openGroups[group] && (
              <div className="px-6 pb-6 space-y-4 border-t border-gray-50">
                <div className="pt-4 grid grid-cols-1 gap-4">
                  {keys.map((key) => (
                    <div key={key}>
                      <Label className="mb-1.5 flex items-center gap-2 text-xs font-medium text-muted uppercase tracking-wider">
                        <span className="font-mono">{key}</span>
                        <span className="text-gray-200">·</span>
                        <span className="normal-case font-normal">{formatKey(key)}</span>
                      </Label>
                      {(content[key] ?? "").length > 100 ||
                      key.includes("bio") ||
                      key.includes("credentials") ? (
                        <textarea
                          value={content[key] ?? ""}
                          onChange={(e) =>
                            setContent((p) => ({ ...p, [key]: e.target.value }))
                          }
                          rows={3}
                          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue resize-none"
                        />
                      ) : (
                        <Input
                          value={content[key] ?? ""}
                          onChange={(e) =>
                            setContent((p) => ({ ...p, [key]: e.target.value }))
                          }
                          placeholder={`Enter ${formatKey(key).toLowerCase()}…`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Sticky save bar */}
      <div className="sticky bottom-6 flex justify-end">
        <Button
          variant="default"
          onClick={handleSave}
          loading={saving}
          loadingText="Saving…"
          className="gap-2 shadow-lg"
        >
          {saved ? (
            <>
              <Check className="w-4 h-4" />
              Saved!
            </>
          ) : (
            "Save All Changes"
          )}
        </Button>
      </div>
    </div>
  );
}
