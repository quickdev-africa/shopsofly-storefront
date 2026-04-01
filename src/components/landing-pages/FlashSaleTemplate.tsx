"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAppDispatch } from "@/lib/hooks/redux";
import { addToCart } from "@/lib/features/carts/cartsSlice";
import CountdownTimer from "./CountdownTimer";
import TrustBadges from "./TrustBadges";
import VideoTestimonials from "./VideoTestimonials";
import LandingFAQ from "./LandingFAQ";
import StickyBuyNow from "./StickyBuyNow";

export default function FlashSaleTemplate({ page, store }: { page: any; store: any }) {
  const s = page.settings || {};
  const products = page.products || [];
  const dispatch = useAppDispatch();
  const theme = store?.theme_settings || {};
  const [addedIds, setAddedIds] = useState<number[]>([]);

  function handleAddToCart(product: any) {
    const variant = product.variants?.[0];
    dispatch(addToCart({
      id: product.id,
      variantId: variant?.id,
      name: product.name,
      price: variant?.price || product.price,
      image: product.image_url,
      quantity: 1,
    }));
    setAddedIds((prev) => [...prev, product.id]);
    setTimeout(() => { window.location.href = "/checkout"; }, 500);
  }

  return (
    <div className="min-h-screen bg-white pb-24 md:pb-0">

      {/* Countdown Hero */}
      <section className="bg-[#1A1A1A] text-white py-16 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-[#F97316] font-bold uppercase tracking-widest text-sm mb-3">
            ⚡ FLASH SALE
          </p>
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">
            {s.hero_headline || "Limited Time Deals"}
          </h1>
          <p className="text-gray-300 mb-8">
            {s.hero_subheadline || "Sale ends when the timer hits zero"}
          </p>
          {s.countdown_end && (
            <div className="mb-8">
              <p className="text-sm text-gray-400 mb-3">SALE ENDS IN:</p>
              <CountdownTimer endDate={s.countdown_end} />
            </div>
          )}
          {s.stock_count && (
            <div className="max-w-md mx-auto bg-gray-800 rounded-xl p-4 mt-4">
              <div className="flex justify-between text-xs text-gray-400 mb-2">
                <span>Remaining stock</span>
                <span>{s.stock_count} of {s.starting_stock || 100}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div
                  className="bg-red-500 h-3 rounded-full"
                  style={{ width: Math.min(100, (Number(s.stock_count) / Number(s.starting_stock || 100)) * 100) + "%" }}
                />
              </div>
              <p className="text-red-400 text-xs mt-2 font-semibold">
                🔥 Only {s.stock_count} left!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Social Proof Bar */}
      <section className="bg-[#F97316] text-white py-4 px-4">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-6 text-sm font-semibold text-center">
          <span>⭐ {s.rating || "4.9"}/5 Rating</span>
          <span>👥 {s.customer_count || "2,400+"} Happy Customers</span>
          <span>🛒 {s.orders_today || "47"} orders today</span>
        </div>
      </section>

      {/* Products Grid */}
      {products.length > 0 && (
        <section className="py-12 px-4 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product: any) => {
              const variant = product.variants?.[0];
              const price = variant?.price || product.price || 0;
              const comparePrice = variant?.compare_at_price || product.compare_at_price;
              return (
                <div key={product.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                  {product.image_url && (
                    <div className="relative aspect-square">
                      <Image src={product.image_url} alt={product.name} fill className="object-cover" />
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="font-semibold text-[#1A1A1A] mb-2 line-clamp-2">{product.name}</h3>
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-2xl font-bold text-[#1A1A1A]">₦{price.toLocaleString()}</span>
                      {comparePrice && comparePrice > price && (
                        <span className="text-gray-400 line-through text-sm">₦{comparePrice.toLocaleString()}</span>
                      )}
                    </div>
                    {comparePrice && comparePrice > price && (
                      <span className="bg-[#F97316] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        Save ₦{(comparePrice - price).toLocaleString()}
                      </span>
                    )}
                    <button
                      onClick={() => handleAddToCart(product)}
                      className={"w-full mt-4 py-3 rounded-xl font-bold text-sm transition-colors " + (
                        addedIds.includes(product.id)
                          ? "bg-green-500 text-white"
                          : "bg-[#F97316] hover:bg-orange-600 text-white"
                      )}
                    >
                      {addedIds.includes(product.id) ? "✓ Added! Going to checkout..." : "Buy Now →"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <TrustBadges />
      <VideoTestimonials testimonials={s.testimonials} />
      <LandingFAQ items={s.faq} />

      <footer className="border-t border-gray-200 py-6 px-4 text-center text-sm text-gray-500">
        <div className="flex justify-center gap-4 flex-wrap">
          <Link href="/pages/returns-policy" className="hover:underline">Returns Policy</Link>
          <Link href="/pages/privacy-policy" className="hover:underline">Privacy Policy</Link>
        </div>
        <p className="mt-3 text-xs">{store?.name} — Secured by Paystack 🔒</p>
      </footer>

      {products.length > 0 && (
        <StickyBuyNow
          price={products[0]?.variants?.[0]?.price || products[0]?.price || 0}
          onBuy={() => handleAddToCart(products[0])}
          whatsappNumber={theme.whatsapp_number}
        />
      )}
    </div>
  );
}
