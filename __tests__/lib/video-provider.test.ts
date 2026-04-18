import { describe, it, expect } from "vitest";
import {
  detectProvider,
  extractYoutubeId,
  resolveVideoConfig,
} from "@/lib/video-provider";

describe("detectProvider", () => {
  it("detects bunny from embed URL", () => {
    expect(
      detectProvider("https://iframe.mediadelivery.net/embed/12345/abc-uuid")
    ).toBe("bunny");
  });
  it("detects bunny from video page URL (bunnycdn.com)", () => {
    expect(
      detectProvider("https://video.bunnycdn.com/play/12345/abc-uuid")
    ).toBe("bunny");
  });
  it("defaults to youtube for youtube.com URLs", () => {
    expect(
      detectProvider("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
    ).toBe("youtube");
  });
  it("defaults to youtube for youtu.be URLs", () => {
    expect(detectProvider("https://youtu.be/dQw4w9WgXcQ")).toBe("youtube");
  });
  it("defaults to youtube for bare 11-char IDs", () => {
    expect(detectProvider("dQw4w9WgXcQ")).toBe("youtube");
  });
});

describe("extractYoutubeId", () => {
  it("extracts from youtube.com/watch?v=", () => {
    expect(
      extractYoutubeId("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
    ).toBe("dQw4w9WgXcQ");
  });
  it("extracts from youtu.be shortlink", () => {
    expect(extractYoutubeId("https://youtu.be/dQw4w9WgXcQ")).toBe(
      "dQw4w9WgXcQ"
    );
  });
  it("extracts from youtube-nocookie embed URL", () => {
    expect(
      extractYoutubeId(
        "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ"
      )
    ).toBe("dQw4w9WgXcQ");
  });
  it("extracts from youtube.com/embed/ URL", () => {
    expect(
      extractYoutubeId("https://www.youtube.com/embed/dQw4w9WgXcQ")
    ).toBe("dQw4w9WgXcQ");
  });
  it("returns bare 11-char ID unchanged", () => {
    expect(extractYoutubeId("dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
  });
});

describe("resolveVideoConfig — YouTube", () => {
  it("builds youtube-nocookie embed URL from watch URL", () => {
    const cfg = resolveVideoConfig(
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    );
    expect(cfg.provider).toBe("youtube");
    expect(cfg.embedUrl).toBe(
      "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?rel=0&modestbranding=1"
    );
    expect(cfg.allow).toContain("accelerometer");
  });

  it("builds embed URL from youtu.be shortlink", () => {
    const cfg = resolveVideoConfig("https://youtu.be/dQw4w9WgXcQ");
    expect(cfg.embedUrl).toBe(
      "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?rel=0&modestbranding=1"
    );
  });
});

describe("resolveVideoConfig — Bunny", () => {
  it("passes through an embed URL that already has query params", () => {
    const url =
      "https://iframe.mediadelivery.net/embed/99/abc-123?autoplay=false&preload=true";
    const cfg = resolveVideoConfig(url);
    expect(cfg.provider).toBe("bunny");
    expect(cfg.embedUrl).toBe(url);
  });

  it("appends query params to an embed URL that lacks them", () => {
    const url = "https://iframe.mediadelivery.net/embed/99/abc-123";
    const cfg = resolveVideoConfig(url);
    expect(cfg.embedUrl).toBe(`${url}?autoplay=false&preload=true`);
  });

  it("converts a video page URL to an embed URL", () => {
    const cfg = resolveVideoConfig(
      "https://video.bunnycdn.com/play/99/abc-123"
    );
    expect(cfg.provider).toBe("bunny");
    expect(cfg.embedUrl).toBe(
      "https://iframe.mediadelivery.net/embed/99/abc-123?autoplay=false&preload=true"
    );
  });

  it("converts a player.mediadelivery.net URL with non-hex GUID to embed URL", () => {
    const cfg = resolveVideoConfig(
      "https://player.mediadelivery.net/play/639982/HysX3zaT6kzENG_W"
    );
    expect(cfg.provider).toBe("bunny");
    expect(cfg.embedUrl).toBe(
      "https://iframe.mediadelivery.net/embed/639982/HysX3zaT6kzENG_W?autoplay=false&preload=true"
    );
  });

  it("sets the Bunny allow attribute (no clipboard-write)", () => {
    const cfg = resolveVideoConfig(
      "https://iframe.mediadelivery.net/embed/99/abc-123"
    );
    expect(cfg.allow).toContain("gyroscope");
    expect(cfg.allow).not.toContain("clipboard-write");
  });
});
