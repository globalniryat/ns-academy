import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "bg-blue/10 text-blue border border-blue/20",
        foundation: "bg-blue/10 text-blue border border-blue/20",
        intermediate: "bg-teal/10 text-teal border border-teal/20",
        final: "bg-navy/10 text-navy border border-navy/20",
        gold: "bg-gold/10 text-yellow-700 border border-gold/30",
        success: "bg-green-50 text-green-700 border border-green-200",
        muted: "bg-gray-100 text-gray-600 border border-gray-200",
        free: "bg-green-500 text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
