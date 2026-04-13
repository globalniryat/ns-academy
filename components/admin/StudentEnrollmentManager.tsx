"use client";

import React, { useState } from "react";
import { ButtonSpinner } from "@/components/ui/button";
import StatusBadge, { toVariant } from "./StatusBadge";
import ManualEnrollForm from "./ManualEnrollForm";

interface Enrollment {
  id: string;
  courseId: string;
  status: string;
  enrolledAt: string;
  expiresAt: string | null;
  course: { title: string };
}

interface Course {
  id: string;
  title: string;
  level: string;
}

const STATUSES = ["ACTIVE", "COMPLETED", "EXPIRED", "REFUNDED"] as const;

export default function StudentEnrollmentManager({
  userId,
  initialEnrollments,
  courses,
}: {
  userId: string;
  initialEnrollments: Enrollment[];
  courses: Course[];
}) {
  const [enrollments, setEnrollments] = useState<Enrollment[]>(initialEnrollments);
  const [saving, setSaving] = useState<Record<string, boolean>>({});

  const updateStatus = async (enrollmentId: string, status: string) => {
    setSaving((p) => ({ ...p, [enrollmentId]: true }));
    const res = await fetch(`/api/admin/enrollments/${enrollmentId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    setSaving((p) => ({ ...p, [enrollmentId]: false }));
    if (data.success) {
      setEnrollments((prev) =>
        prev.map((e) => (e.id === enrollmentId ? { ...e, status: data.data.status } : e))
      );
    }
  };

  const handleEnrolled = (enrollment: Enrollment) => {
    setEnrollments((prev) => {
      const exists = prev.find((e) => e.courseId === enrollment.courseId);
      if (exists) return prev.map((e) => (e.courseId === enrollment.courseId ? enrollment : e));
      return [enrollment, ...prev];
    });
  };

  return (
    <div className="space-y-5">
      {/* List */}
      {enrollments.length === 0 ? (
        <p className="text-muted text-sm">No enrollments yet.</p>
      ) : (
        <div className="space-y-2">
          {enrollments.map((e) => (
            <div key={e.id} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-navy line-clamp-1">{e.course.title}</p>
                <p className="text-xs text-muted mt-0.5">
                  {new Date(e.enrolledAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}
                  {e.expiresAt && ` · expires ${new Date(e.expiresAt).toLocaleDateString("en-IN")}`}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {saving[e.id] ? (
                  <ButtonSpinner className="w-4 h-4 text-muted" />
                ) : (
                  <select
                    value={e.status}
                    onChange={(ev) => updateStatus(e.id, ev.target.value)}
                    className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue bg-white"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                )}
                <StatusBadge variant={toVariant(e.status)} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Manual enrollment */}
      <div className="pt-4 border-t border-gray-100">
        <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Manually Enroll</p>
        <ManualEnrollForm
          userId={userId}
          courses={courses}
          existingEnrollments={enrollments}
          onEnrolled={handleEnrolled}
        />
      </div>
    </div>
  );
}
