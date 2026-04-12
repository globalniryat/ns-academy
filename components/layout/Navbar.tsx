"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { GraduationCap, Menu, X, BookOpen, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Courses", href: "/courses" },
  { label: "About", href: "/#about" },
  { label: "Pricing", href: "/#pricing" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isLoggedIn, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const isHomePage = pathname === "/";

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 navbar-sticky",
          scrolled || !isHomePage
            ? "bg-white/95 shadow-sm border-b border-gray-100"
            : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 bg-blue rounded-lg flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span
                className={cn(
                  "font-bold text-lg transition-colors",
                  scrolled || !isHomePage ? "text-navy" : "text-white"
                )}
              >
                CA Portal
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-blue",
                    scrolled || !isHomePage
                      ? "text-bodytext"
                      : "text-white/90"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center gap-3">
              {isLoggedIn ? (
                <>
                  <Link href="/dashboard">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                      <div className="w-8 h-8 bg-blue rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <span
                        className={cn(
                          "text-sm font-medium",
                          scrolled || !isHomePage ? "text-bodytext" : "text-white"
                        )}
                      >
                        {user?.name?.split(" ")[0]}
                      </span>
                    </div>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="text-muted hover:text-red-500"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        scrolled || !isHomePage
                          ? "text-bodytext"
                          : "text-white hover:bg-white/10"
                      )}
                    >
                      Login
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button size="sm" variant="default">
                      Start Free
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Hamburger */}
            <button
              className={cn(
                "md:hidden p-2 rounded-lg transition-colors",
                scrolled || !isHomePage
                  ? "text-navy hover:bg-gray-100"
                  : "text-white hover:bg-white/10"
              )}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={cn(
          "fixed top-0 right-0 z-50 h-full w-72 bg-white shadow-2xl transform transition-transform duration-300",
          mobileOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/"
              className="flex items-center gap-2"
              onClick={() => setMobileOpen(false)}
            >
              <div className="w-9 h-9 bg-blue rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-navy text-lg">CA Portal</span>
            </Link>
            <button
              onClick={() => setMobileOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-bodytext hover:bg-offwhite hover:text-blue font-medium transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                {link.label}
              </Link>
            ))}
          </div>

          <div className="mt-8 pt-8 border-t border-gray-100 flex flex-col gap-3">
            {isLoggedIn ? (
              <>
                <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                  <Button variant="default" className="w-full">
                    My Dashboard
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    handleLogout();
                    setMobileOpen(false);
                  }}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setMobileOpen(false)}>
                  <Button variant="default" className="w-full">
                    Start Free
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
