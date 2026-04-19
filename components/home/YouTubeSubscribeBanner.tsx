"use client";

import React from "react";
function YoutubeSvg({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/>
    </svg>
  )
}

export interface SubscribeBannerData {
  text?: string;
  button?: { text?: string; url?: string };
}

interface Props {
  data?: SubscribeBannerData;
}

const DEFAULTS = {
  text: "Never miss a new lecture — new videos every week",
  button: { text: "Subscribe on YouTube →", url: "https://www.youtube.com/@CANikeshShah" },
};

export default function YouTubeSubscribeBanner({ data = {} }: Props) {
  const text = data.text ?? DEFAULTS.text;
  const buttonText = data.button?.text ?? DEFAULTS.button.text;
  const channelUrl = data.button?.url ?? DEFAULTS.button.url;

  return (
    <section className="bg-green-900">
      <a
        href={channelUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block max-w-7xl mx-auto px-4 md:px-8 py-10"
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <YoutubeSvg className="w-6 h-6 text-white" />
            </div>
            <p className="text-white font-semibold text-lg">{text}</p>
          </div>
          <div
            className="flex-shrink-0 px-6 py-3 rounded-xl font-bold text-white text-sm transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#FF0000" }}
          >
            {buttonText}
          </div>
        </div>
      </a>
    </section>
  );
}
