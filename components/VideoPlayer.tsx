"use client";

/**
 * VideoPlayer
 *
 * Provider-agnostic video embed component. Accepts the raw videoUrl stored in
 * the DB, detects the provider automatically, and renders the correct iframe.
 */

import React from "react";
import { resolveVideoConfig } from "@/lib/video-provider";

interface VideoPlayerProps {
  /** Raw URL from Lesson.videoUrl — YouTube or Bunny.net */
  videoUrl: string;
  /** Used for the iframe title (accessibility) */
  title: string;
  /** Optional className applied to the outer wrapper div */
  className?: string;
}

export default function VideoPlayer({
  videoUrl,
  title,
  className = "video-container rounded-xl overflow-hidden shadow-2xl",
}: VideoPlayerProps) {
  const { embedUrl, allow } = resolveVideoConfig(videoUrl);

  return (
    <div className={className}>
      <iframe
        src={embedUrl}
        title={title}
        allow={allow}
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  );
}
