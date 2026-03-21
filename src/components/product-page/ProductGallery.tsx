"use client";

import { useState } from "react";
import Image from "next/image";

type MediaItem =
  | { type: "image"; url: string; alt: string }
  | { type: "video"; videoId: string };

interface Props {
  product: {
    name: string;
    image_url: string;
    video_url?: string;
    product_images?: Array<{ id?: number; url: string; alt_text?: string }>;
  };
}

export default function ProductGallery({ product }: Props) {
  const [mediaIdx, setMediaIdx] = useState(0);

  const media: MediaItem[] = [{ type: "image", url: product.image_url, alt: product.name }];
  (product.product_images || [])
    .filter((img) => img.url !== product.image_url)
    .slice(0, 1)
    .forEach((img) => media.push({ type: "image", url: img.url, alt: img.alt_text || product.name }));
  if (product.video_url) {
    const ytId = product.video_url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)?.[1];
    if (ytId) media.push({ type: "video", videoId: ytId });
  }

  const currentMedia = media[mediaIdx] || media[0];
  const navMedia = (dir: number) => setMediaIdx((i) => (i + dir + media.length) % media.length);

  return (
    <div className={`flex gap-3 items-start ${media.length > 1 ? "flex-row" : "flex-col"}`}>
      {media.length > 1 && (
        <div className="flex flex-col gap-2 flex-shrink-0">
          {media.map((m, i) => (
            <button key={i} onClick={() => setMediaIdx(i)}
              className={`w-16 h-16 rounded-xl overflow-hidden border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                mediaIdx === i ? "border-[#4A7C59] shadow-sm" : "border-gray-200 hover:border-gray-400"
              }`}>
              {m.type === "video" ? (
                <div className="w-full h-full bg-gray-900 rounded-lg flex items-center justify-center text-white text-xl">▶</div>
              ) : (
                <div className="relative w-full h-full">
                  <Image src={m.url} alt={m.alt} fill className="object-cover" sizes="64px" />
                </div>
              )}
            </button>
          ))}
        </div>
      )}
      <div className="relative rounded-2xl overflow-hidden bg-gray-50 flex-1" style={{ aspectRatio: "1/1" }}>
        {currentMedia.type === "video" ? (
          <iframe src={`https://www.youtube.com/embed/${currentMedia.videoId}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen className="absolute inset-0 w-full h-full border-none" />
        ) : (
          <Image src={currentMedia.url} alt={currentMedia.alt} fill
            className="object-cover transition-opacity duration-300"
            sizes="(max-width:768px) 100vw, 50vw" priority />
        )}
        {media.length > 1 && (
          <>
            <button onClick={() => navMedia(-1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full w-9 h-9 flex items-center justify-center shadow text-base font-bold">‹</button>
            <button onClick={() => navMedia(1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full w-9 h-9 flex items-center justify-center shadow text-base font-bold">›</button>
            <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
              {mediaIdx + 1} / {media.length}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
