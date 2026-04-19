import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Sanity Studio mis-routes /structure/* and /presentation/* without the /studio prefix.
      // Catch them all and redirect to the studio so editors never hit a 404.
      {
        source: '/structure/:path*',
        destination: '/studio/structure/:path*',
        permanent: false,
      },
      {
        source: '/presentation/:path*',
        destination: '/studio/presentation/:path*',
        permanent: false,
      },
    ]
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/images/**',
      },
    ],
  },
  async headers() {
    return [
      // ── Sanity Studio — permissive CSP (studio loads many Sanity CDN scripts) ──
      {
        source: "/studio(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://core.sanity-cdn.com https://*.sanity-cdn.com https://sanity-cdn.com https://*.sanity.io`,
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://*.sanity-cdn.com https://sanity-cdn.com",
              "font-src 'self' https://fonts.gstatic.com https://*.sanity-cdn.com https://sanity-cdn.com",
              "img-src 'self' data: blob: https:",
              "frame-src 'self' https://www.youtube-nocookie.com https://www.youtube.com",
              "connect-src 'self' https://*.api.sanity.io https://api.sanity.io wss://*.api.sanity.io wss://api.sanity.io https://*.sanity-cdn.com https://sanity-cdn.com https://core.sanity-cdn.com https://cdn.sanity.io https://*.sanity.io",
              "worker-src blob: 'self'",
              "object-src 'none'",
              "base-uri 'self'",
            ].join("; "),
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
      // ── Public site — strict CSP ──────────────────────────────────────────────
      {
        source: "/((?!studio).*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https:",
              "frame-src https://www.youtube-nocookie.com https://www.youtube.com",
              // wss:// needed for SanityLive real-time updates
              "connect-src 'self' https://*.api.sanity.io https://api.sanity.io wss://*.api.sanity.io wss://api.sanity.io https://resend.com",
              "worker-src blob:",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              // Allow Sanity Studio (same origin) to embed pages in the preview iframe
              "frame-ancestors 'self'",
            ].join("; "),
          },
          // X-Frame-Options removed — frame-ancestors in CSP above is the modern replacement
          // and is required so the Presentation Tool preview iframe works
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
        ],
      },
    ];
  },
};

export default nextConfig;
