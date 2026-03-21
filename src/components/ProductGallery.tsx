"use client";
import { useState } from "react";
import Image from "next/image";

export default function ProductGallery({ product }: { product: any }) {
  const [activeImage, setActiveImage] = useState(
    product.images?.[0]?.url || product.image_url
  );

  return (
    <div className="space-y-3">
      <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
        <Image src={activeImage} alt={product.name} fill className="object-cover" />
      </div>
      {product.images && product.images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {product.images.map((img: any, idx: number) => (
            <button
              key={idx}
              onClick={() => setActiveImage(img.url)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                activeImage === img.url ? "border-[#4A7C59]" : "border-transparent"
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