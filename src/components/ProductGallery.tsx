"use client";
import { useState } from "react";
import Image from "next/image";

function extractYouTubeId(url: string): string {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/
  );
  return match ? match[1] : "";
}

type GalleryItem =
  | { type: "image"; url: string; alt: string }
  | { type: "video"; videoId: string };

export default function ProductGallery({ product }: { product: any }) {
  const allImages = (() => {
    const imgs = product.product_images || product.images || [];
    if (imgs.length > 0) return imgs;
    if (product.image_url) return [{ url: product.image_url, alt_text: product.name }];
    return [];
  })();

  const galleryItems: GalleryItem[] = [
    ...allImages.map((img: any) => ({
      type: "image" as const,
      url: img.url,
      alt: img.alt_text || product.name,
    })),
    ...(product.video_url && extractYouTubeId(product.video_url)
      ? [{ type: "video" as const, videoId: extractYouTubeId(product.video_url) }]
      : []),
  ];

  const [activeIdx, setActiveIdx] = useState(0);
  const current = galleryItems[activeIdx];

  if (galleryItems.length === 0) {
    return (
      <div className="aspect-square rounded-xl bg-gray-100 flex items-center justify-center text-gray-400">
        No image
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Main display */}
      <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
        {current?.type === "video" ? (
          <iframe
            src={`https://www.youtube.com/embed/${current.videoId}`}
            title={product.name}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full border-none"
          />
        ) : current?.type === "image" ? (
          <Image
            src={current.url}
            alt={current.alt}
            fill
            className="object-cover"
            priority={activeIdx === 0}
          />
        ) : null}
      </div>

      {/* Thumbnails — only show if more than 1 item */}
      {galleryItems.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {galleryItems.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIdx(idx)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                activeIdx === idx
                  ? "border-[#4A7C59]"
                  : "border-gray-200 hover:border-gray-400"
              }`}
            >
              {item.type === "video" ? (
                <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              ) : (
                <Image
                  src={item.url}
                  alt={item.alt}
                  width={64}
                  height={64}
                  className="object-cover w-full h-full"
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
