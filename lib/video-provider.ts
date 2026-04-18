/**
 * video-provider.ts
 *
 * Single source of truth for multi-provider video URL detection and embed
 * URL construction. All provider-specific strings are isolated here so that
 * removing a provider later requires changes only to this file.
 */

export type VideoProvider = "youtube" | "bunny";

export interface VideoConfig {
  provider: VideoProvider;
  embedUrl: string;
  /** iframe `allow` attribute value appropriate for the provider */
  allow: string;
}

// ── Provider detection ─────────────────────────────────────────────────────

/**
 * Returns "bunny" if the URL contains mediadelivery.net, otherwise "youtube".
 * No DB column needed — the URL itself is the source of truth.
 */
export function detectProvider(url: string): VideoProvider {
  if (url.includes("mediadelivery.net") || url.includes("bunnycdn.com")) return "bunny";
  return "youtube";
}

// ── YouTube ────────────────────────────────────────────────────────────────

const YOUTUBE_PATTERNS = [
  /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube-nocookie\.com\/embed\/|youtube\.com\/embed\/)([^&?/\s]{11})/,
  /^([a-zA-Z0-9_-]{11})$/,
];

const YOUTUBE_ALLOW =
  "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";

/**
 * Extracts the 11-char YouTube video ID from any known YouTube URL format or
 * bare ID. Returns the raw input unchanged if no pattern matches (graceful
 * degradation — the embed will simply fail to load, not crash the app).
 */
export function extractYoutubeId(url: string): string {
  for (const pattern of YOUTUBE_PATTERNS) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return url;
}

function buildYoutubeEmbed(url: string): VideoConfig {
  const id = extractYoutubeId(url);
  return {
    provider: "youtube",
    embedUrl: `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1`,
    allow: YOUTUBE_ALLOW,
  };
}

// ── Bunny.net ──────────────────────────────────────────────────────────────

const BUNNY_ALLOW =
  "accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;";

/**
 * Accepts either a full Bunny embed URL (iframe.mediadelivery.net/embed/...)
 * or a Bunny video page URL (video.bunnycdn.com/play/...) and normalises it
 * to the canonical embed format.
 */
function buildBunnyEmbed(url: string): VideoConfig {
  // Normalise video-page URLs like:
  //   https://video.bunnycdn.com/play/{LIBRARY_ID}/{VIDEO_GUID}
  // to embed URLs like:
  //   https://iframe.mediadelivery.net/embed/{LIBRARY_ID}/{VIDEO_GUID}?...
  // Video GUIDs are standard UUIDs but Bunny sometimes uses non-hex chars.
  // Match any sequence of non-whitespace, non-slash, non-query characters.
  const playMatch = url.match(
    /(?:video\.bunnycdn\.com|player\.mediadelivery\.net)\/play\/(\d+)\/([^/?#\s]+)/i
  );

  let embedUrl: string;
  if (playMatch) {
    embedUrl = `https://iframe.mediadelivery.net/embed/${playMatch[1]}/${playMatch[2]}?autoplay=false&preload=true`;
  } else {
    // Already an embed URL — append query params if missing
    const hasQuery = url.includes("?");
    embedUrl = hasQuery ? url : `${url}?autoplay=false&preload=true`;
  }

  return { provider: "bunny", embedUrl, allow: BUNNY_ALLOW };
}

// ── Public API ─────────────────────────────────────────────────────────────

/**
 * Main entry point. Given any videoUrl stored in the DB, returns the correct
 * embed URL and iframe attributes for that provider.
 */
export function resolveVideoConfig(url: string): VideoConfig {
  const provider = detectProvider(url);
  if (provider === "bunny") return buildBunnyEmbed(url);
  return buildYoutubeEmbed(url);
}
