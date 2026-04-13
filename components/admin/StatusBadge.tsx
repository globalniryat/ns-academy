import React from "react";

type BadgeVariant =
  | "active"
  | "completed"
  | "expired"
  | "refunded"
  | "draft"
  | "published"
  | "archived"
  | "captured"
  | "failed"
  | "created"
  | "authorized"
  | "foundation"
  | "intermediate"
  | "final";

const VARIANT_STYLES: Record<BadgeVariant, string> = {
  active:       "bg-green-100 text-green-700",
  completed:    "bg-teal/10 text-teal",
  expired:      "bg-gray-100 text-gray-500",
  refunded:     "bg-purple-100 text-purple-600",
  draft:        "bg-amber-100 text-amber-700",
  published:    "bg-green-100 text-green-700",
  archived:     "bg-gray-100 text-gray-500",
  captured:     "bg-green-100 text-green-700",
  failed:       "bg-red-100 text-red-600",
  created:      "bg-amber-100 text-amber-700",
  authorized:   "bg-blue/10 text-blue",
  foundation:   "bg-blue/10 text-blue",
  intermediate: "bg-amber-100 text-amber-700",
  final:        "bg-purple-100 text-purple-600",
};

const LABELS: Record<BadgeVariant, string> = {
  active:       "Active",
  completed:    "Completed",
  expired:      "Expired",
  refunded:     "Refunded",
  draft:        "Draft",
  published:    "Published",
  archived:     "Archived",
  captured:     "Captured",
  failed:       "Failed",
  created:      "Pending",
  authorized:   "Authorized",
  foundation:   "Foundation",
  intermediate: "Intermediate",
  final:        "Final",
};

interface Props {
  variant: BadgeVariant;
  label?: string;
  className?: string;
}

export default function StatusBadge({ variant, label, className = "" }: Props) {
  const styles = VARIANT_STYLES[variant] ?? "bg-gray-100 text-gray-600";
  const text = label ?? LABELS[variant] ?? variant;

  return (
    <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full ${styles} ${className}`}>
      {text}
    </span>
  );
}

/** Normalise a raw DB string to a BadgeVariant (safe fallback to "draft") */
export function toVariant(raw: string): BadgeVariant {
  return (raw.toLowerCase() as BadgeVariant) in VARIANT_STYLES
    ? (raw.toLowerCase() as BadgeVariant)
    : "draft";
}
