"use client";

import React, { useState, useMemo } from "react";
import { Search, Users } from "lucide-react";
import Link from "next/link";
import { Button, ButtonSpinner } from "@/components/ui/button";
import StatusBadge, { toVariant } from "./StatusBadge";

interface Enrollment {
  id: string;
  status: string;
  enrolledAt: string;
  expiresAt: string | null;
  completedAt: string | null;
  user: { id: string; name: string | null; email: string };
  course: { id: string; title: string };
}

type FilterStatus = "ALL" | "ACTIVE" | "COMPLETED" | "EXPIRED" | "REFUNDED";

const FILTER_TABS: { label: string; value: FilterStatus }[] = [
  { label: "All", value: "ALL" },
  { label: "Active", value: "ACTIVE" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Expired", value: "EXPIRED" },
  { label: "Refunded", value: "REFUNDED" },
];

const STATUSES = ["ACTIVE", "COMPLETED", "EXPIRED", "REFUNDED"] as const;

export default function EnrollmentsTable({
  enrollments: initial,
}: {
  enrollments: Enrollment[];
}) {
  const [enrollments, setEnrollments] = useState(initial);
  const [filter, setFilter] = useState<FilterStatus>("ALL");
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [expiryEdits, setExpiryEdits] = useState<Record<string, string>>({});
  const [savingExpiry, setSavingExpiry] = useState<Record<string, boolean>>({});

  const filtered = useMemo(() => {
    let list = filter === "ALL" ? enrollments : enrollments.filter((e) => e.status === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (e) =>
          (e.user.name ?? "").toLowerCase().includes(q) ||
          e.user.email.toLowerCase().includes(q) ||
          e.course.title.toLowerCase().includes(q)
      );
    }
    return list;
  }, [enrollments, filter, search]);

  const updateStatus = async (id: string, status: string) => {
    setSaving((p) => ({ ...p, [id]: true }));
    const res = await fetch(`/api/admin/enrollments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    setSaving((p) => ({ ...p, [id]: false }));
    if (data.success) {
      setEnrollments((prev) =>
        prev.map((e) => (e.id === id ? { ...e, status: data.data.status } : e))
      );
    }
  };

  const saveExpiry = async (id: string) => {
    const raw = expiryEdits[id];
    setSavingExpiry((p) => ({ ...p, [id]: true }));
    const expiresAt = raw ? new Date(raw).toISOString() : null;
    const res = await fetch(`/api/admin/enrollments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ expiresAt }),
    });
    const data = await res.json();
    setSavingExpiry((p) => ({ ...p, [id]: false }));
    if (data.success) {
      setEnrollments((prev) =>
        prev.map((e) =>
          e.id === id
            ? { ...e, expiresAt: data.data.expiresAt ?? null }
            : e
        )
      );
      setExpiryEdits((p) => {
        const next = { ...p };
        delete next[id];
        return next;
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Summary strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {FILTER_TABS.filter((t) => t.value !== "ALL").map((tab) => {
          const count = enrollments.filter((e) => e.status === tab.value).length;
          return (
            <div key={tab.value} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-1">{tab.label}</p>
              <p className="font-heading text-2xl font-bold text-navy">{count}</p>
            </div>
          );
        })}
      </div>

      {/* Filter tabs + search */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {FILTER_TABS.map((tab) => {
            const count = tab.value === "ALL" ? enrollments.length : enrollments.filter((e) => e.status === tab.value).length;
            return (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                  filter === tab.value
                    ? "bg-navy text-white shadow-sm"
                    : "bg-white border border-gray-200 text-muted hover:text-navy hover:border-gray-300"
                }`}
              >
                {tab.label}
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${filter === tab.value ? "bg-white/20" : "bg-gray-100"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
        <div className="relative sm:ml-auto">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search student or course…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue w-full sm:w-64"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
          <Users className="w-4 h-4 text-muted" />
          <h2 className="font-semibold text-navy text-sm">
            {filter === "ALL" ? "All Enrollments" : `${filter.charAt(0) + filter.slice(1).toLowerCase()} Enrollments`}
          </h2>
          <span className="ml-auto text-xs text-muted">{filtered.length} records</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead>
              <tr className="bg-gray-50/80">
                {["Student", "Course", "Status", "Enrolled", "Expires", ""].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3.5 text-left text-xs font-semibold text-muted uppercase tracking-wider whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((e) => {
                const hasExpiryEdit = expiryEdits[e.id] !== undefined;
                const currentExpiry = e.expiresAt
                  ? new Date(e.expiresAt).toISOString().slice(0, 10)
                  : "";
                return (
                  <tr key={e.id} className="hover:bg-gray-50/40 transition-colors">
                    {/* Student */}
                    <td className="px-5 py-3.5">
                      <Link
                        href={`/admin/students/${e.user.id}`}
                        className="flex items-center gap-3 group"
                      >
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-muted">
                            {e.user.name?.charAt(0)?.toUpperCase() ?? "?"}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-navy group-hover:text-blue transition-colors">
                            {e.user.name ?? "—"}
                          </p>
                          <p className="text-xs text-muted">{e.user.email}</p>
                        </div>
                      </Link>
                    </td>

                    {/* Course */}
                    <td className="px-5 py-3.5 text-sm text-bodytext max-w-[180px]">
                      <p className="line-clamp-1">{e.course.title}</p>
                    </td>

                    {/* Status — inline dropdown */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
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
                    </td>

                    {/* Enrolled date */}
                    <td className="px-5 py-3.5 text-sm text-muted whitespace-nowrap">
                      {new Date(e.enrolledAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    {/* Expires — inline date edit */}
                    <td className="px-5 py-3.5">
                      <input
                        type="date"
                        value={hasExpiryEdit ? expiryEdits[e.id] : currentExpiry}
                        onChange={(ev) =>
                          setExpiryEdits((p) => ({ ...p, [e.id]: ev.target.value }))
                        }
                        className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue bg-white w-36"
                      />
                    </td>

                    {/* Save expiry button */}
                    <td className="px-5 py-3.5">
                      {hasExpiryEdit && (
                        <Button
                          size="sm"
                          variant="navy"
                          onClick={() => saveExpiry(e.id)}
                          loading={savingExpiry[e.id]}
                          loadingText="Saving…"
                          disabled={savingExpiry[e.id]}
                          className="text-xs h-8 px-3"
                        >
                          Save
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <Users className="w-10 h-10 mx-auto text-muted opacity-30 mb-3" />
              <p className="text-sm text-muted">
                No {filter === "ALL" ? "" : filter.toLowerCase() + " "}enrollments found.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
