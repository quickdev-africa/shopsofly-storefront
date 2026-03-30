"use client";

import Image from "next/image";
import Link from "next/link";
import { useAppDispatch } from "@/lib/hooks/redux";
import { addItem, openCart } from "@/lib/features/carts/cartsSlice";

interface Variant {
  id: number;
  price: number | string;
  stock_count: number;
  options: Record<string, string>;
}

interface Product {
  id: number;
  name: string;
  slug: string;
  price: number | string | null;
  compare_at_price?: number | string | null;
  image_url: string;
  variants?: Variant[];
  taxons?: Array<{ name: string }>;
}

function fmt(p: number | string | null) {
  if (!p) return "Price TBD";
  const n = typeof p === "string" ? parseFloat(p) : p;
  return `₦${n.toLocaleString("en-NG", { minimumFractionDigits: 0 })}`;
}

export default function ProductCard({ product }: { product: Product }) {
  const dispatch = useAppDispatch();
  const v = product.variants?.[0];
  const hasDisc = product.compare_at_price && Number(product.compare_at_price) > Number(product.price);
  const discPct = hasDisc
    ? Math.round((1 - Number(product.price) / Number(product.compare_at_price!)) * 100)
    : 0;
  const category = product.taxons?.[0]?.name;

  const handleQuickBuy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!v) return;
    dispatch(addItem({
      variantId: v.id,
      productId: product.id,
      name: product.name,
      variantLabel: Object.entries(v.options || {}).map(([k, val]) => `${k}: ${val}`).join(" / ") || "Default",
      price: Number(v.price),
      imageUrl: product.image_url,
      quantity: 1,
      slug: product.slug,
    }));
    dispatch(openCart());
  };

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="bg-[#F5F4F0] rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-transparent hover:border-[#4A7C59]/20 flex flex-col">
        <div className="relative overflow-hidden bg-[#EFEFEB]" style={{ aspectRatio: "3/4" }}>
          <Image
            src={product.image_url || "/placeholder.jpg"}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width:640px) 80vw,(max-width:1024px) 40vw,25vw"
          />
          {hasDisc && (
            <div className="absolute top-3 left-3 bg-[#F97316] text-white text-xs font-bold px-2.5 py-1 rounded-full">
              -{discPct}%
            </div>
          )}

        </div>

        <div className="p-4 flex flex-col gap-1">
          {category && <p className="text-[10px] font-bold text-[#888] uppercase tracking-widest">{category}</p>}
          <h3 className="font-bold text-[#1A1A1A] text-sm leading-tight line-clamp-2 group-hover:text-[#4A7C59] transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#1A1A1A] text-sm">{fmt(product.price)}</span>
              {hasDisc && <span className="text-xs text-[#888] line-through">{fmt(product.compare_at_price!)}</span>}
            </div>
            <button
              onClick={handleQuickBuy}
              className="bg-[#F97316] hover:bg-orange-600 text-white rounded-lg p-2 transition-colors flex-shrink-0"
              title="Add to Cart"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
