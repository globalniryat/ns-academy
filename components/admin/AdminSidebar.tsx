"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard, BookOpen, Users, CreditCard,
  FileText, MessageSquare, HelpCircle, Settings,
  LogOut, ExternalLink, Menu, X, GraduationCap, ClipboardList,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/courses", icon: BookOpen, label: "Courses" },
  { href: "/admin/students", icon: Users, label: "Students" },
  { href: "/admin/enrollments", icon: ClipboardList, label: "Enrollments" },
  { href: "/admin/payments", icon: CreditCard, label: "Payments" },
  { href: "/admin/content", icon: FileText, label: "Site Content" },
  { href: "/admin/testimonials", icon: MessageSquare, label: "Testimonials" },
  { href: "/admin/faqs", icon: HelpCircle, label: "FAQs" },
  { href: "/admin/settings", icon: Settings, label: "Settings" },
];

function SidebarContent({ onNavClick }: { onNavClick?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10">
        <Link href="/admin" onClick={onNavClick} className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center shrink-0">
            <GraduationCap className="w-4.5 h-4.5 text-green-400" />
          </div>
          <div>
            <p className="font-heading font-bold text-white text-sm leading-tight">NS Academy</p>
            <p className="text-white/40 text-xs">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavClick}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                isActive
                  ? "bg-white/10 text-white font-medium shadow-sm"
                  : "text-white/55 hover:text-white hover:bg-white/8"
              }`}
            >
              <item.icon className={`w-4 h-4 shrink-0 ${isActive ? "text-green-400" : ""}`} />
              {item.label}
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-white/10 space-y-0.5">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-white/40 hover:text-white/70 hover:bg-white/8 transition-all"
        >
          <ExternalLink className="w-3.5 h-3.5 shrink-0" />
          View Site
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/55 hover:text-white hover:bg-red-500/15 transition-all w-full"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Logout
        </button>
      </div>
    </div>
  );
}

export default function AdminSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop sidebar — sticky so logo + logout are always visible */}
      <aside className="hidden lg:flex w-60 h-screen sticky top-0 bg-navy flex-col shrink-0 border-r border-white/5 overflow-hidden">
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-navy border-b border-white/10 flex items-center justify-between px-4 py-3">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-green-500/20 flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-green-400" />
          </div>
          <span className="font-heading font-bold text-white text-sm">NS Academy</span>
        </Link>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 text-white/70 hover:text-white transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`lg:hidden fixed top-0 left-0 bottom-0 z-50 w-72 bg-navy flex flex-col transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <p className="font-heading font-bold text-white text-sm">NS Academy Admin</p>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1.5 text-white/50 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <SidebarContent onNavClick={() => setMobileOpen(false)} />
        </div>
      </aside>
    </>
  );
}
