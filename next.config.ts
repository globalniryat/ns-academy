import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // ── Content Security Policy ────────────────────────────────────────
          // unsafe-inline kept for Next.js hydration scripts and Tailwind inline styles.
          // unsafe-eval removed (not required in production builds).
          // Razorpay checkout requires its CDN domain in script-src.
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' https://checkout.razorpay.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https:",
              "frame-src https://www.youtube-nocookie.com https://www.youtube.com https://api.razorpay.com",
              "connect-src 'self' https://*.supabase.co https://api.razorpay.com https://lumberjack.razorpay.com",
              "worker-src blob:",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join("; "),
          },
          // ── Clickjacking protection ────────────────────────────────────────
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          // ── MIME sniffing protection ───────────────────────────────────────
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          // ── Referrer leakage protection ────────────────────────────────────
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          // ── Browser feature policy ─────────────────────────────────────────
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=(self https://checkout.razorpay.com)",
          },
          // ── Force HTTPS (applied by CDN/Vercel in production too) ──────────
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          // ── DNS prefetch control ───────────────────────────────────────────
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
