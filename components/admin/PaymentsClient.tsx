"use client";

import React, { useState, useMemo } from "react";
import { Download, CreditCard, TrendingUp, CheckCircle2, AlertCircle } from "lucide-react";
import StatusBadge, { toVariant } from "./StatusBadge";
import { Button } from "@/components/ui/button";

interface Payment {
  id: string;
  userName: string | null;
  userEmail: string;
  courseTitle: string;
  amount: number;
  status: string;
  createdAt: string;
  razorpayOrderId: string | null;
}

type FilterStatus = "ALL" | "CAPTURED" | "FAILED" | "CREATED" | "REFUNDED";

const FILTER_TABS: { label: string; value: FilterStatus }[] = [
  { label: "All", value: "ALL" },
  { label: "Captured", value: "CAPTURED" },
  { label: "Failed", value: "FAILED" },
  { label: "Pending", value: "CREATED" },
  { label: "Refunded", value: "REFUNDED" },
];

function exportCSV(payments: Payment[]) {
  const headers = ["Date", "Student", "Email", "Course", "Amount (₹)", "Status", "Order ID"];
  const rows = payments.map((p) => [
    new Date(p.createdAt).toLocaleDateString("en-IN"),
    p.userName ?? "—",
    p.userEmail,
    p.courseTitle,
    String(Math.round(p.amount / 100)),
    p.status,
    p.razorpayOrderId ?? "—",
  ]);
  const csv = [headers, ...rows]
    .map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `payments-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function PaymentsClient({ payments }: { payments: Payment[] }) {
  const [filter, setFilter] = useState<FilterStatus>("ALL");
  const [exporting, setExporting] = useState(false);

  const filtered = useMemo(
    () => (filter === "ALL" ? payments : payments.filter((p) => p.status === filter)),
    [payments, filter]
  );

  const captured = payments.filter((p) => p.status === "CAPTURED");
  const totalRevenue = captured.reduce((s, p) => s + p.amount, 0);
  const avgOrder = captured.length > 0 ? Math.round(totalRevenue / captured.length / 100) : 0;
  const failedCount = payments.filter((p) => p.status === "FAILED").length;

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-navy">Payments</h1>
          <p className="text-muted text-sm mt-1">{payments.length} total transactions</p>
        </div>
        <Button
          variant="outline"
          loading={exporting}
          loadingText="Exporting…"
          onClick={() => {
            setExporting(true);
            exportCSV(filtered);
            setTimeout(() => setExporting(false), 600);
          }}
          className="gap-2"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Total Revenue</p>
          <p className="font-heading text-2xl font-bold text-navy">
            ₹{Math.round(totalRevenue / 100).toLocaleString("en-IN")}
          </p>
          <p className="text-xs text-muted mt-1">from {captured.length} captured</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Avg. Order</p>
          <p className="font-heading text-2xl font-bold text-navy">
            ₹{avgOrder.toLocaleString("en-IN")}
          </p>
          <p className="text-xs text-muted mt-1">per captured payment</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <p className="text-xs font-semibold text-muted uppercase tracking-wider">Captured</p>
          </div>
          <p className="font-heading text-2xl font-bold text-navy">{captured.length}</p>
          <p className="text-xs text-muted mt-1">successful payments</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <p className="text-xs font-semibold text-muted uppercase tracking-wider">Failed</p>
          </div>
          <p className="font-heading text-2xl font-bold text-navy">{failedCount}</p>
          <p className="text-xs text-muted mt-1">failed attempts</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {FILTER_TABS.map((tab) => {
          const count = tab.value === "ALL" ? payments.length : payments.filter((p) => p.status === tab.value).length;
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

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-muted" />
          <h2 className="font-semibold text-navy text-sm">
            {filter === "ALL" ? "All Transactions" : `${filter.charAt(0) + filter.slice(1).toLowerCase()} Transactions`}
          </h2>
          <span className="ml-auto text-xs text-muted">{filtered.length} records</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead>
              <tr className="bg-gray-50/80">
                {["Student", "Course", "Amount", "Status", "Date", "Order ID"].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-muted uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/40 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-muted">
                          {p.userName?.charAt(0)?.toUpperCase() ?? "?"}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-navy">{p.userName ?? "—"}</p>
                        <p className="text-xs text-muted">{p.userEmail}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-bodytext max-w-[160px]">
                    <p className="line-clamp-1">{p.courseTitle}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="text-sm font-bold text-navy whitespace-nowrap">
                      ₹{Math.round(p.amount / 100).toLocaleString("en-IN")}
                    </p>
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge variant={toVariant(p.status)} />
                  </td>
                  <td className="px-5 py-3.5 text-sm text-muted whitespace-nowrap">
                    {new Date(p.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs font-mono text-muted block max-w-[130px] truncate" title={p.razorpayOrderId ?? ""}>
                      {p.razorpayOrderId ?? "—"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <TrendingUp className="w-10 h-10 mx-auto text-muted opacity-30 mb-3" />
              <p className="text-sm text-muted">No {filter === "ALL" ? "" : filter.toLowerCase() + " "}payments found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
