import { ShieldCheck } from "lucide-react";

interface Props {
  className?: string;
  variant?: "card" | "inline";
}

export default function GuaranteeBadge({ className = "", variant = "card" }: Props) {
  if (variant === "inline") {
    return (
      <span className={`inline-flex items-center gap-1.5 text-sm text-green-700 ${className}`}>
        <ShieldCheck className="w-4 h-4 text-green-600 shrink-0" />
        30-Day Money-Back Guarantee
      </span>
    );
  }

  return (
    <div className={`bg-green-50 border border-green-100 rounded-xl p-3 flex items-start gap-2.5 ${className}`}>
      <ShieldCheck className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
      <div>
        <p className="text-sm font-semibold text-green-800">30-Day Money-Back Guarantee</p>
        <p className="text-xs text-green-700 mt-0.5">
          Not satisfied? Full refund within 30 days, no questions asked.
        </p>
      </div>
    </div>
  );
}
