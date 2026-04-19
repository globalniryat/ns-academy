"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (pathname !== "/") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveSection("");
      return;
    }

    const sectionIds = ["about", "youtube", "testimonials", "faq"];
    const computeActive = () => {
      const threshold = window.scrollY + window.innerHeight * 0.3;
      let current = "";
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= threshold) current = id;
      }
      setActiveSection(current);
    };

    computeActive();
    window.addEventListener("scroll", computeActive, { passive: true });
    return () => window.removeEventListener("scroll", computeActive);
  }, [pathname]);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/#about", label: "About" },
    { href: "/#youtube", label: "YouTube" },
    { href: "/#testimonials", label: "Reviews" },
    { href: "/#faq", label: "FAQ" },
    { href: "/contact", label: "Contact" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/" && activeSection === "";
    if (href.startsWith("/#")) return pathname === "/" && activeSection === href.slice(2);
    return pathname.startsWith(href);
  };

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
              <span className={`font-bold text-base ${isHeroMode ? "text-white" : "text-navy"}`}>
                NS Academy
              </span>
              <span className={`text-[10px] font-medium ${isHeroMode ? "text-white/60" : "text-muted"}`}>
                CA Nikesh Shah
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href.startsWith("/#") ? { pathname: "/", hash: link.href.slice(2) } : link.href}
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
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/contact">
              <Button
                variant="outline"
                size="sm"
                className={`gap-1.5 ${
                  isHeroMode
                    ? "border-white/40 text-white hover:bg-white/10"
                    : ""
                }`}
              >
                Contact Us
              </Button>
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            className={`md:hidden transition-colors ${isHeroMode ? "text-white" : "text-navy"}`}
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
                href={link.href.startsWith("/#") ? { pathname: "/", hash: link.href.slice(2) } : link.href}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "bg-blue/10 text-blue font-semibold"
                    : "text-bodytext hover:bg-offwhite hover:text-blue"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-gray-100">
              <Link href="/contact" className="block">
                <Button variant="default" className="w-full gap-2">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
