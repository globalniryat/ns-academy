"use client";

import React, { useState } from "react";
import { Plus, AlertCircle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface Course {
  id: string;
  title: string;
  level: string;
}

interface Enrollment {
  id: string;
  courseId: string;
  status: string;
  enrolledAt: string;
  expiresAt: string | null;
  course: { title: string };
}

interface Props {
  userId: string;
  courses: Course[];
  existingEnrollments: Enrollment[];
  onEnrolled: (enrollment: Enrollment) => void;
}

export default function ManualEnrollForm({ userId, courses, existingEnrollments, onEnrolled }: Props) {
  const [selected, setSelected] = useState(courses[0]?.id ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const enrolledIds = new Set(existingEnrollments.map((e) => e.courseId));

  const handleEnroll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, courseId: selected }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(`Enrolled in "${data.data.course.title}"`);
        onEnrolled(data.data);
        setTimeout(() => setSuccess(""), 4000);
      } else {
        setError(data.error || "Failed to enroll.");
      }
    } catch {
      setError("Network error — please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (courses.length === 0) return (
    <p className="text-sm text-muted">No published courses available.</p>
  );

  return (
    <form onSubmit={handleEnroll} className="space-y-3">
      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-green-700">
          <Check className="w-4 h-4 shrink-0" />
          {success}
        </div>
      )}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Label className="mb-1.5 block text-xs font-medium text-muted uppercase tracking-wider">Course</Label>
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue"
          >
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
                {enrolledIds.has(c.id) ? " (already enrolled)" : ""}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <Button
            type="submit"
            variant="default"
            size="sm"
            loading={loading}
            loadingText="Enrolling…"
            disabled={loading || !selected}
            className="gap-1.5 h-10"
          >
            <Plus className="w-3.5 h-3.5" />
            Enroll
          </Button>
        </div>
      </div>
    </form>
  );
}
