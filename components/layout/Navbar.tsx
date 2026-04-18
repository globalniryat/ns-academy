"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X, BookOpen, LogOut, User, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import EnrollButton from "@/components/ui/EnrollButton";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [activeSection, setActiveSection] = useState<string>("");
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsOpen(false);
    setDashboardLoading(false);
  }, [pathname]);

  useEffect(() => {
    if (pathname !== "/") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveSection("");
      return;
    }

    const sectionIds = ["about", "testimonials", "faq"];

    const computeActive = () => {
      // Offset: a section becomes active when its top is within 30% of viewport height from the top
      const threshold = window.scrollY + window.innerHeight * 0.3;
      let current = "";
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= threshold) {
          current = id;
        }
      }
      setActiveSection(current);
    };

    computeActive();
    window.addEventListener("scroll", computeActive, { passive: true });
    return () => window.removeEventListener("scroll", computeActive);
  }, [pathname]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    router.push("/");
    router.refresh();
  };

  const displayName =
    user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Student";
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/#about", label: "About" },
    { href: "/#testimonials", label: "Reviews" },
    { href: "/#faq", label: "FAQ" },
    { href: "/contact", label: "Contact" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/" && activeSection === "";
    if (href.startsWith("/#")) {
      const sectionId = href.slice(2);
      return pathname === "/" && activeSection === sectionId;
    }
    return pathname.startsWith(href);
  };

  // Only use transparent/dark style on homepage before scrolling
  const isHeroMode = pathname === "/" && !scrolled;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 navbar-sticky ${
        isHeroMode
          ? "bg-transparent"
          : "bg-white/95 shadow-sm border-b border-gray-100"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div
              className="w-12 h-12 rounded-xl overflow-hidden shadow-sm group-hover:scale-105 transition-transform flex-shrink-0"
              style={{ background: "#16a34a" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/ns-icon.png"
                alt="NS Academy Icon"
                className="w-full h-full object-cover scale-110"
              />
            </div>
            <div className="flex flex-col leading-none">
              <span
                className={`font-bold text-base ${
                  isHeroMode ? "text-white" : "text-navy"
                }`}
              >
                NS Academy
              </span>
              <span
                className={`text-[10px] font-medium ${
                  isHeroMode ? "text-white/60" : "text-muted"
                }`}
              >
                CA Nikesh Shah
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links + Courses pill */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={
                  link.href.startsWith("/#")
                    ? { pathname: "/", hash: link.href.slice(2) }
                    : link.href
                }
                className={`text-sm font-medium transition-colors relative pb-0.5 ${
                  isActive(link.href)
                    ? isHeroMode
                      ? "text-white font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-white after:rounded-full"
                      : "text-blue font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue after:rounded-full"
                    : isHeroMode
                    ? "text-white/80 hover:text-white"
                    : "text-bodytext hover:text-blue"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Courses — highlighted pill to draw attention */}
            <Link
              href="/courses"
              className={`flex items-center gap-1.5 text-sm font-semibold px-3.5 py-1.5 rounded-full border transition-all duration-200 ${
                pathname.startsWith("/courses")
                  ? "bg-blue text-white border-blue shadow-sm"
                  : isHeroMode
                  ? "bg-white/15 text-white border-white/30 hover:bg-white/25 hover:border-white/60"
                  : "bg-blue/10 text-blue border-blue/30 hover:bg-blue hover:text-white hover:border-blue"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Courses
            </Link>
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => { setDashboardLoading(true); router.push("/dashboard"); }}
                  className="flex items-center gap-1.5 text-sm font-medium text-blue hover:text-primary-dark transition-colors"
                  disabled={dashboardLoading}
                >
                  <LayoutDashboard className={`w-4 h-4 ${dashboardLoading ? "animate-spin opacity-60" : ""}`} />
                  {dashboardLoading ? "Loading…" : "My Learning"}
                </button>
                <div className="w-8 h-8 bg-blue rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {initials}
                </div>
                <button
                  onClick={handleLogout}
                  className="text-muted hover:text-red-500 transition-colors"
                  title="Sign out"
                  aria-label="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={
                      isHeroMode ? "text-white hover:bg-white/10" : "text-bodytext"
                    }
                  >
                    Login
                  </Button>
                </Link>
                <EnrollButton variant="default" size="sm" className="gap-1.5">
                  Enroll Now
                </EnrollButton>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            className={`md:hidden transition-colors ${
              isHeroMode ? "text-white" : "text-navy"
            }`}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-xl">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={
                  link.href.startsWith("/#")
                    ? { pathname: "/", hash: link.href.slice(2) }
                    : link.href
                }
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "bg-blue/10 text-blue font-semibold"
                    : "text-bodytext hover:bg-offwhite hover:text-blue"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Courses — prominent in mobile */}
            <Link
              href="/courses"
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                pathname.startsWith("/courses")
                  ? "bg-blue text-white"
                  : "bg-blue/10 text-blue hover:bg-blue hover:text-white"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Courses
            </Link>

            <div className="pt-3 border-t border-gray-100 space-y-2">
              {user ? (
                <>
                  <div className="flex items-center gap-3 px-3 py-2.5">
                    <div className="w-8 h-8 bg-blue rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {initials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-navy">
                        {displayName}
                      </p>
                      <p className="text-xs text-muted">{user.email}</p>
                    </div>
                  </div>
                  <Link href="/dashboard" className="block">
                    <button className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-bodytext hover:bg-offwhite transition-colors">
                      <User className="w-4 h-4" />
                      My Learning
                    </button>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="block">
                    <Button variant="outline" className="w-full">
                      Login
                    </Button>
                  </Link>
                  <EnrollButton variant="default" className="w-full gap-2">
                    Enroll Now
                  </EnrollButton>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
