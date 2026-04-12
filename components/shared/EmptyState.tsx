import React from "react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Props {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    href: string;
  };
  className?: string;
}

export default function EmptyState({ icon: Icon, title, description, action, className = "" }: Props) {
  return (
    <div className={`text-center py-16 px-6 ${className}`}>
      <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Icon className="w-7 h-7 text-muted" />
      </div>
      <h3 className="font-heading font-bold text-navy text-lg mb-2">{title}</h3>
      {description && (
        <p className="text-muted text-sm mb-6 max-w-sm mx-auto leading-relaxed">{description}</p>
      )}
      {action && (
        <Link href={action.href}>
          <Button variant="default">{action.label}</Button>
        </Link>
      )}
    </div>
  );
}
