"use client";
import { useState } from "react";
import ProductCard from "@/components/ProductCard";
interface Product {
  id: number;
  name: string;
  slug: string;
  price: number | string | null;
  compare_at_price?: number | string | null;
  image_url: string;
  variants?: any[];
  taxons?: Array<{ name: string }>;
}
export default function PopularSection({ products }: { products: Product[] }) {
  const [start, setStart] = useState(0);
  const visible = products.slice(0, 6);
  const total = visible.length;
  const canPrev = start > 0;
  const canNext = start + 3 < total;
  return (
    <section className="py-14 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-[#1A1A1A]">
              Most popular products
            </h2>
            <p className="text-sm text-[#555] mt-1">
              Our customers can&apos;t stop buying these
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => setStart(Math.max(0, start - 3))}
              disabled={!canPrev}
              className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-base font-bold transition-all ${
                canPrev
                  ? "border-gray-300 text-[#1A1A1A] hover:bg-[#4A7C59] hover:text-white hover:border-[#4A7C59] cursor-pointer"
                  : "border-gray-100 text-gray-300 cursor-not-allowed"
              }`}
            >
              ←
            </button>
            <button
              onClick={() => setStart(Math.min(total - 3, start + 3))}
              disabled={!canNext}
              className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-base font-bold transition-all ${
                canNext
                  ? "border-gray-300 text-[#1A1A1A] hover:bg-[#4A7C59] hover:text-white hover:border-[#4A7C59] cursor-pointer"
                  : "border-gray-100 text-gray-300 cursor-not-allowed"
              }`}
            >
              →
            </button>
          </div>
        </div>
        {/* Mobile — horizontal scroll */}
        <div className="flex sm:hidden gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory">
          {visible.map((product) => (
            <div key={product.id} className="flex-shrink-0 w-[75vw] snap-start">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
        {/* Desktop — paginated grid */}
        <div className="hidden sm:grid grid-cols-2 lg:grid-cols-3 gap-5">
          {visible.slice(start, start + 3).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
