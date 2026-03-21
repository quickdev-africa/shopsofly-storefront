"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAppDispatch } from "@/lib/hooks/redux";
import { addItem, openCart } from "@/lib/features/carts/cartsSlice";

interface PImage { id: number; url: string; alt_text?: string; }

interface Product {
  id: number;
  name: string;
  slug: string;
  price: number | string | null;
  compare_at_price?: number | string | null;
  image_url: string;
  description?: string;
  video_url?: string;
  product_images?: PImage[];
  variants?: Array<{ id: number; price: number | string; stock_count: number; options: Record<string, string> }>;
  taxons?: Array<{ name: string }>;
}

type MediaItem =
  | { type: "image"; url: string; alt: string }
  | { type: "video"; videoId: string };

function fmt(p: number | string | null) {
  if (!p) return "";
  const n = typeof p === "string" ? parseFloat(p) : p;
  return `₦${n.toLocaleString("en-NG", { minimumFractionDigits: 0 })}`;
}

function getYTId(url: string) {
  return url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)?.[1] || null;
}

export default function StarProduct({ products }: { products: Product[] }) {
  const dispatch = useAppDispatch();
  const [mediaIdx, setMediaIdx] = useState(0);
  const [qty, setQty] = useState(1);

  const star = [...products].sort((a, b) => Number(b.price) - Number(a.price))[0];
  if (!star) return null;

  const media: MediaItem[] = [{ type: "image", url: star.image_url, alt: star.name }];
  (star.product_images || [])
    .filter((i) => i.url !== star.image_url)
    .slice(0, 2)
    .forEach((i) => media.push({ type: "image", url: i.url, alt: i.alt_text || star.name }));
  if (star.video_url) {
    const id = getYTId(star.video_url);
    if (id) media.push({ type: "video", videoId: id });
  }

  const v = star.variants?.[0];
  const hasDisc = star.compare_at_price && Number(star.compare_at_price) > Number(star.price);
  const discPct = hasDisc ? Math.round((1 - Number(star.price) / Number(star.compare_at_price!)) * 100) : 0;
  const category = star.taxons?.[0]?.name;
  const current = media[mediaIdx] || media[0];
  const nav = (dir: number) => setMediaIdx((i) => (i + dir + media.length) % media.length);

  const handleAdd = () => {
    if (!v) return;
    dispatch(addItem({
      variantId: v.id, productId: star.id, name: star.name,
      variantLabel: "Default", price: Number(v.price),
      imageUrl: star.image_url, quantity: qty, slug: star.slug,
    }));
    dispatch(openCart());
  };

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-10">
          <div className="h-px flex-1 bg-gray-100" />
          <span className="text-xs font-bold tracking-widest text-[#4A7C59] uppercase px-4">
            ⭐ Star Product
          </span>
          <div className="h-px flex-1 bg-gray-100" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[72px_1fr_1fr] gap-4 lg:gap-6 items-start bg-[#F5F4F0] rounded-3xl p-6 lg:p-8">

          {/* Column 1 — Thumbnails (desktop only) */}
          <div className="hidden lg:flex flex-col gap-3">
            {media.map((m, i) => (
              <button
                key={i}
                onClick={() => setMediaIdx(i)}
                className={`w-16 h-16 rounded-xl overflow-hidden border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                  mediaIdx === i ? "border-[#4A7C59] shadow-sm" : "border-gray-200 hover:border-gray-400"
                }`}
              >
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

          {/* Column 2 — Main media */}
          <div className="relative rounded-2xl overflow-hidden bg-[#EBEBEB]" style={{ aspectRatio: "1/1" }}>
            {current.type === "video" ? (
              <iframe
                src={`https://www.youtube.com/embed/${current.videoId}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-none"
              />
            ) : (
              <Image
                src={current.url}
                alt={current.alt}
                fill
                className="object-cover transition-opacity duration-300"
                sizes="(max-width:768px) 100vw,50vw"
                priority
              />
            )}
            {hasDisc && (
              <div className="absolute top-4 left-4 bg-[#F97316] text-white text-xs font-bold px-3 py-1.5 rounded-full">
                Save {discPct}%
              </div>
            )}
            {media.length > 1 && (
              <>
                <button onClick={() => nav(-1)} className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full w-9 h-9 flex items-center justify-center shadow text-base font-bold transition-colors">‹</button>
                <button onClick={() => nav(1)} className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full w-9 h-9 flex items-center justify-center shadow text-base font-bold transition-colors">›</button>
                <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">{mediaIdx + 1} / {media.length}</div>
              </>
            )}
          </div>

          {/* Column 3 — Info */}
          <div className="flex flex-col gap-4">
            {category && <p className="text-xs font-bold text-[#4A7C59] uppercase tracking-wider">{category}</p>}
            <h2 className="text-2xl lg:text-3xl font-bold text-[#1A1A1A] leading-tight">{star.name}</h2>
            <div className="flex items-center gap-1 text-amber-400 text-sm">★★★★★</div>
            {star.description && (
              <p className="text-sm text-[#555] leading-relaxed line-clamp-3"
                dangerouslySetInnerHTML={{ __html: star.description.replace(/<[^>]*>/g, "").slice(0, 200) + "..." }}
              />
            )}
            <ul className="space-y-2">
              {["✓ Genuine & certified product", "✓ Fast delivery across Nigeria", "✓ 30-day easy returns"].map((t) => (
                <li key={t} className="text-sm font-medium text-[#1A1A1A]">{t}</li>
              ))}
            </ul>
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-bold text-[#1A1A1A]">{fmt(star.price)}</span>
              {hasDisc && <span className="text-base text-[#888] line-through">{fmt(star.compare_at_price!)}</span>}
            </div>
            <div>
              <p className="text-xs text-[#555] mb-2 font-medium">Quantity</p>
              <div className="flex items-center border border-gray-200 rounded-full overflow-hidden w-fit bg-white">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-10 text-xl text-[#1A1A1A] flex items-center justify-center hover:bg-gray-50 transition-colors">−</button>
                <span className="w-10 text-center text-sm font-bold text-[#1A1A1A]">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="w-10 h-10 text-xl text-[#1A1A1A] flex items-center justify-center hover:bg-gray-50 transition-colors">+</button>
              </div>
            </div>
            {v && <p className="text-xs text-[#555]">{v.stock_count > 0 ? `${v.stock_count} in stock` : "Out of stock"}</p>}
            <div className="flex gap-3">
              <button onClick={handleAdd} className="flex-1 bg-[#4A7C59] hover:bg-[#2D4A32] text-white font-bold py-4 rounded-xl text-sm transition-colors">
                Add To Cart
              </button>
              <Link href={`/products/${star.slug}`} className="flex-1 text-center bg-[#2D4A32] hover:bg-[#1a2e1f] text-white font-bold py-4 rounded-xl text-sm transition-colors flex items-center justify-center">
                Buy It Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
