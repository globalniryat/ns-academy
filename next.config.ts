import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // ── Content Security Policy ────────────────────────────────────────
          // unsafe-inline kept for Next.js hydration scripts and Tailwind inline styles.
          // unsafe-eval allowed in dev only — React requires it for callstack reconstruction.
          // Razorpay checkout requires its CDN domain in script-src.
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              // Razorpay needs checkout.razorpay.com + cdn.razorpay.com + checkout-static-next.razorpay.com
              `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://checkout.razorpay.com https://cdn.razorpay.com https://checkout-static-next.razorpay.com`,
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://checkout.razorpay.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https:",
              "frame-src https://www.youtube-nocookie.com https://www.youtube.com https://api.razorpay.com https://checkout.razorpay.com",
              // Razorpay needs api.razorpay.com + lumberjack + analytics
              "connect-src 'self' https://*.supabase.co https://api.razorpay.com https://lumberjack.razorpay.com https://checkout-static-next.razorpay.com https://cdn.razorpay.com",
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
            value: "camera=(), microphone=(), geolocation=(), accelerometer=*, gyroscope=*, payment=*",
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
