import React from "react";
import type { LucideIcon } from "lucide-react";

interface Props {
  icon: LucideIcon;
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
  bg?: string;
}

export default function StatsCard({ icon: Icon, label, value, sub, color = "text-blue", bg = "bg-blue/10" }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">{label}</p>
          <p className="text-3xl font-heading font-bold text-navy leading-none">{value}</p>
          {sub && <p className="text-xs text-muted mt-2">{sub}</p>}
        </div>
        <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center shrink-0 ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
