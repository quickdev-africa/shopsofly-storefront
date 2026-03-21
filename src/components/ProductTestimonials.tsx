"use client";
import { useState } from "react";

interface Testimonial {
  id: number; kind: string; body: string;
  media_url?: string; author: string;
}

function YTEmbed({ url }: { url: string }) {
  const id = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)?.[1];
  if (!id) return null;
  return (
    <div className="relative rounded-xl overflow-hidden" style={{ aspectRatio: "16/9" }}>
      <iframe src={`https://www.youtube.com/embed/${id}`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen className="absolute inset-0 w-full h-full border-none" />
    </div>
  );
}

export default function ProductTestimonials({ testimonials }: { testimonials: Testimonial[] }) {
  const [expanded, setExpanded] = useState<number | null>(null);
  if (!testimonials?.length) return null;
  return (
    <section className="py-10 border-t border-gray-100">
      <h2 className="text-xl font-bold text-[#1A1A1A] mb-6">What customers are saying</h2>
      <div className="space-y-5">
        {testimonials.map((t) => (
          <div key={t.id} className="bg-[#F8FAF8] rounded-2xl p-5 border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#4A7C59] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {t.author?.charAt(0)?.toUpperCase() || "C"}
              </div>
              <div>
                <p className="font-semibold text-[#1A1A1A] text-sm">{t.author || "Verified Customer"}</p>
                <div className="text-amber-400 text-xs">★★★★★</div>
              </div>
            </div>
            {t.kind === "youtube" && t.media_url && <YTEmbed url={t.media_url} />}
            {t.kind === "audio" && t.media_url && (
              <audio controls className="w-full rounded-lg mb-3"><source src={t.media_url} /></audio>
            )}
            {t.body && (
              <div className="mt-3">
                <p className={`text-[#555] text-sm leading-relaxed ${expanded !== t.id ? "line-clamp-3" : ""}`}>
                  &ldquo;{t.body}&rdquo;
                </p>
                {t.body.length > 180 && (
                  <button onClick={() => setExpanded(expanded === t.id ? null : t.id)}
                    className="text-xs text-[#4A7C59] font-semibold mt-1 hover:underline">
                    {expanded === t.id ? "Show less" : "Read more"}
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
