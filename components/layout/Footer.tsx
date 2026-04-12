import React from "react";
import Link from "next/link";
import { GraduationCap, Globe, Video, Share2, Mail } from "lucide-react";

const footerLinks = {
  Platform: [
    { label: "Courses", href: "/courses" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "Pricing", href: "/#pricing" },
  ],
  Company: [
    { label: "About Us", href: "/#about" },
    { label: "Contact", href: "mailto:contact@caportal.in" },
    { label: "Blog", href: "/blog" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Refund Policy", href: "/refund" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 bg-blue rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-xl">CA Portal</span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed max-w-xs">
              India&apos;s trusted online platform for CA exam preparation. Expert-led
              video courses for Foundation, Intermediate &amp; Final levels.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <Video className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-blue transition-colors"
              >
                <Share2 className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-pink-600 transition-colors"
              >
                <Globe className="w-4 h-4" />
              </a>
              <a
                href="mailto:contact@caportal.in"
                className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-teal transition-colors"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-white mb-4">{category}</h4>
              <ul className="flex flex-col gap-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-white/60 text-sm hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm">
            © {new Date().getFullYear()} CA Learning Portal. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="text-white/40 text-xs">Made with ❤️ for CA aspirants</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
