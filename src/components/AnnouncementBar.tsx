"use client";
import { useState } from "react";

interface Props {
  text: string;
  bgColor?: string;
  textColor?: string;
  visible?: boolean;
}

export default function AnnouncementBar({
  text,
  bgColor = "#4A7C59",
  textColor = "#ffffff",
  visible = true,
}: Props) {
  const [dismissed, setDismissed] = useState(false);

  if (!visible || dismissed) return null;

  return (
    <div
      className="relative overflow-hidden py-2 text-sm font-medium"
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      <div className="animate-marquee whitespace-nowrap">
        <span className="mx-8">{text}</span>
        <span className="mx-8">{text}</span>
        <span className="mx-8">{text}</span>
        <span className="mx-8">{text}</span>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-4 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100 z-10"
        aria-label="Dismiss"
      >
        ✕
      </button>
    </div>
  );
}
