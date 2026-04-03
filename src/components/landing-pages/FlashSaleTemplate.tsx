"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useAppDispatch } from "@/lib/hooks/redux";
import { addItem } from "@/lib/features/carts/cartsSlice";
import CountdownTimer from "./CountdownTimer";
import LandingFAQ from "./LandingFAQ";

function YoutubeEmbed({ url, className = "" }: { url: string; className?: string }) {
  const match = url?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&
?#]+)/);
  const id = match ? match[1] : "";
  if (!id) return null;
  return (
    <div className={"relative rounded-2xl overflow-hidden bg-black " + className}>
      <div className="aspect-video">
        <iframe src={"https://www.youtube.com/embed/" + id}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen />
      </div>
    </div>
  );
}

export default function FlashSaleTemplate({ page, store }: { page: any; store: any }) {
  const s = page.settings || {};
  const products = page.products || [];
  const dispatch = useAppDispatch();
  const theme = store?.theme_settings || {};
  const [addedIds, setAddedIds] = useState<number[]>([]);

  function handleBuyNow(product: any) {
    const variant = product.variants?.[0];
    dispatch(addItem({
      variantId:    variant?.id || product.id,
      productId:    product.id,
      name:         product.name,
      variantLabel: variant?.sku || "",
      price:        variant?.price || product.price,
      imageUrl:     product.image_url || "",
      quantity:     1,
      slug:         product.slug || "",
    }));
    setAddedIds(prev => [...prev, product.id]);
    setTimeout(() => { window.location.href = "/checkout"; }, 400);
  }

  return (
    <div className="min-h-screen bg-white pb-24 md:pb-0">

      {/* HERO + COUNTDOWN */}
      <section className="bg-[#1A1A1A] text-white py-16 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block bg-red-500 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-4">
            ⚡ Flash Sale — Limited Time Only
          </div>
          <h1 className="font-heading text-4xl md:text-6xl font-bold mb-4 leading-tight">
            {s.hero_headline || "Massive Deals — Today Only"}
          </h1>
          <p className="text-gray-300 text-lg mb-8">
            {s.hero_subheadline || "Prices drop at midnight. Do not miss out."}
          </p>
          {s.countdown_end && (
            <div className="mb-8">
              <p className="text-gray-400 text-sm uppercase tracking-widest mb-3">Sale ends in:</p>
              <CountdownTimer endDate={s.countdown_end} />
            </div>
          )}
          {s.stock_count && (
            <div className="max-w-sm mx-auto bg-gray-800 rounded-2xl p-4 mt-4">
              <div className="flex justify-between text-xs text-gray-400 mb-2">
                <span>Stock remaining</span>
                <span className="text-red-400 font-bold">{s.stock_count} left!</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div className="bg-red-500 h-3 rounded-full"
                  style={{ width: Math.min(100, (Number(s.stock_count) / Number(s.starting_stock || 100)) * 100) + "%" }} />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* SOCIAL PROOF BAR */}
      <section className="bg-[#F97316] text-white py-3 px-4">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-6 text-sm font-semibold text-center">
          <span>⭐ {s.rating || "4.9"}/5 Rating</span>
          <span>👥 {s.customer_count || "2,400+"} Happy Customers</span>
          <span>🛒 {s.orders_today || "47"} orders today</span>
        </div>
      </section>

      {/* PRODUCTS GRID */}
      {products.length > 0 && (
        <section className="py-16 px-4 max-w-5xl mx-auto">
          <h2 className="font-heading text-3xl font-bold text-center text-[#1A1A1A] mb-10">
            {s.products_section_title || "Today's Flash Deals"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product: any) => {
              const variant = product.variants?.[0];
              const price = variant?.price || product.price || 0;
              const comparePrice = variant?.compare_at_price || product.compare_at_price;
              const added = addedIds.includes(product.id);
              return (
                <div key={product.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                  {product.image_url && (
                    <div className="relative aspect-square">
                      <Image src={product.image_url} alt={product.name} fill className="object-cover" />
                      {comparePrice && comparePrice > price && (
                        <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          -{Math.round(((comparePrice - price) / comparePrice) * 100)}% OFF
                        </div>
                      )}
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="font-semibold text-[#1A1A1A] mb-3 text-sm leading-tight line-clamp-2">{product.name}</h3>
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-2xl font-bold text-[#1A1A1A]">&#8358;{price.toLocaleString()}</span>
                      {comparePrice && comparePrice > price && (
                        <span className="text-gray-400 line-through text-sm">&#8358;{comparePrice.toLocaleString()}</span>
                      )}
                    </div>
                    {comparePrice && comparePrice > price && (
                      <p className="text-red-500 text-xs font-semibold mb-3">
                        You save &#8358;{(comparePrice - price).toLocaleString()}
                      </p>
                    )}
                    <button onClick={() => handleBuyNow(product)}
                      className={"w-full py-3 rounded-xl font-bold text-sm transition-all " + (
                        added ? "bg-green-500 text-white" : "bg-[#F97316] hover:bg-orange-600 text-white"
                      )}>
                      {added ? "Added! Going to checkout..." : "Buy Now →"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* VIDEO TESTIMONIALS */}
      {(s.video1_url || s.video2_url) && (
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-heading text-3xl font-bold text-center text-[#1A1A1A] mb-10">
              {s.testimonials1_title || "What Customers Are Saying"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[s.video1_url, s.video2_url, s.video3_url, s.video4_url].filter(Boolean).map((url: any, i: number) => (
                <YoutubeEmbed key={i} url={url} className="w-full" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TRUST BADGES */}
      <section className="py-8 px-4 border-t border-b border-gray-100">
        <div className="max-w-3xl mx-auto flex flex-wrap justify-center gap-6">
          {[
            { icon: "✅", text: "Genuine Product" },
            { icon: "🔒", text: "Secure Payment" },
            { icon: "🚚", text: "Fast Delivery" },
            { icon: "🔄", text: "Easy Returns" },
          ].map((b) => (
            <div key={b.text} className="flex items-center gap-2 text-sm text-gray-600 font-medium">
              <span>{b.icon}</span><span>{b.text}</span>
            </div>
          ))}
        </div>
      </section>

      <LandingFAQ items={s.faq} />

      {/* STICKY BUY BAR mobile */}
      {products.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-gray-200 px-4 py-3 flex gap-3 items-center shadow-xl">
          <div className="flex-1">
            <p className="text-xs text-gray-500">Flash Price</p>
            <p className="font-bold text-lg text-[#1A1A1A]">
              &#8358;{(products[0]?.variants?.[0]?.price || products[0]?.price || 0).toLocaleString()}
            </p>
          </div>
          {theme.whatsapp_number && (
            <a href={"https://wa.me/" + theme.whatsapp_number.replace(/\D/g, "")}
              className="bg-green-500 text-white px-3 py-3 rounded-xl text-sm font-semibold">💬</a>
          )}
          <button onClick={() => handleBuyNow(products[0])}
            className="flex-1 bg-[#F97316] text-white py-3 rounded-xl font-bold text-sm">
            Buy Now →
          </button>
        </div>
      )}

      <footer className="border-t border-gray-200 py-6 px-4 text-center text-xs text-gray-400">
        <div className="flex justify-center gap-4 flex-wrap mb-2">
          <a href="/pages/returns-policy" className="hover:underline">Returns Policy</a>
          <a href="/pages/privacy-policy" className="hover:underline">Privacy Policy</a>
        </div>
        <p>{store?.name} — Secured by Paystack 🔒</p>
      </footer>
    </div>
  );
}
