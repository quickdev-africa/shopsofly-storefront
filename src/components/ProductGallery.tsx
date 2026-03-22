"use client";
import { useState } from "react";
import Image from "next/image";

export default function ProductGallery({ product }: { product: any }) {
  const allImages = (() => {
    const imgs = product.product_images || product.images || [];
    if (imgs.length > 0) return imgs;
    if (product.image_url) return [{ url: product.image_url, alt_text: product.name }];
    return [];
  })();

  const [activeImage, setActiveImage] = useState(
    allImages[0]?.url || product.image_url || ""
  );

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
        {activeImage ? (
          <Image src={activeImage} alt={product.name} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>
        )}
      </div>

      {/* Thumbnails below — horizontal scroll */}
      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {allImages.map((img: any, idx: number) => (
            <button
              key={idx}
              onClick={() => setActiveImage(img.url)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                activeImage === img.url
                  ? "border-[#4A7C59]"
                  : "border-gray-200 hover:border-gray-400"
              }`}
            >
              <Image
                src={img.url}
                alt={img.alt_text || product.name}
                width={64}
                height={64}
                className="object-cover w-full h-full"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
