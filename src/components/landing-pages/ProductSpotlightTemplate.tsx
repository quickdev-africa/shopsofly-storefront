"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAppDispatch } from "@/lib/hooks/redux";
import { addItem } from "@/lib/features/carts/cartsSlice";
import TrustBadges from "./TrustBadges";
import VideoTestimonials from "./VideoTestimonials";
import LandingFAQ from "./LandingFAQ";
import StickyBuyNow from "./StickyBuyNow";
import CountdownTimer from "./CountdownTimer";

export default function ProductSpotlightTemplate({ page, store }: { page: any; store: any }) {
  const s = page.settings || {};
  const product = page.products?.[0];
  const dispatch = useAppDispatch();
  const [selectedVariant, setSelectedVariant] = useState(product?.variants?.[0]);
  const theme = store?.theme_settings || {};

  const price = selectedVariant?.price || product?.price || 0;
  const comparePrice = selectedVariant?.compare_at_price || product?.compare_at_price;

  function handleBuyNow() {
    if (!product) return;
    dispatch(addItem({
      variantId: selectedVariant?.id || product.id,
      productId: product.id,
      name: product.name,
      variantLabel: selectedVariant?.sku || "",
      price: price,
      imageUrl: product.image_url || "",
      quantity: 1,
      slug: product.slug || "",
    }));
    window.location.href = "/checkout";
  }

  return (
    <div className="min-h-screen bg-white pb-24 md:pb-0">

      {/* Hero */}
      <section className="bg-[#1A1A1A] text-white py-16 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          {s.hero_video_url ? (
            <div className="relative aspect-video w-full max-w-2xl mx-auto rounded-2xl overflow-hidden mb-8">
              <iframe
                src={"https://www.youtube.com/embed/" + (s.hero_video_url.match(/(?:v=|youtu\.be\/)([^&\n?#]+)/)?.[1] || "")}
                className="absolute inset-0 w-full h-full"
                allowFullScreen
              />
            </div>
          ) : product?.image_url ? (
            <div className="relative w-full max-w-md mx-auto aspect-square rounded-2xl overflow-hidden mb-8">
              <Image src={product.image_url} alt={product.name} fill className="object-cover" />
            </div>
          ) : null}
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">
            {s.hero_headline || page.title}
          </h1>
          <p className="text-gray-300 text-lg mb-8">
            {s.hero_subheadline || "Premium quality, delivered to your door."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleBuyNow}
              className="bg-[#F97316] hover:bg-orange-600 text-white font-bold px-10 py-4 rounded-xl text-lg transition-colors"
            >
              {s.cta_text || "Buy Now"} — ₦{price.toLocaleString()}
            </button>
            {theme.whatsapp_number && (
              <a
                href={"https://wa.me/" + theme.whatsapp_number.replace(/\D/g, "")}
                className="bg-green-500 hover:bg-green-600 text-white font-bold px-10 py-4 rounded-xl text-lg transition-colors"
              >
                💬 Chat on WhatsApp
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Social Proof Bar */}
      <section className="bg-[#F97316] text-white py-4 px-4">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-6 text-sm font-semibold text-center">
          <span>⭐ {s.rating || "4.9"}/5 Rating</span>
          <span>👥 {s.customer_count || "2,400+"} Customers</span>
          <span>🛒 {s.orders_today || "47"} orders today</span>
        </div>
      </section>

      {/* Product Images */}
      {product?.images?.length > 1 && (
        <section className="py-12 px-4 max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {product.images.slice(0, 6).map((img: any, i: number) => (
              <div key={i} className="relative aspect-square rounded-xl overflow-hidden">
                <Image src={img.url} alt={img.alt_text || product.name} fill className="object-cover" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Benefits */}
      {s.benefits?.length > 0 && (
        <section className="py-12 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-heading text-3xl font-bold text-center text-[#1A1A1A] mb-8">
              Why Choose This Product?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {s.benefits.map((b: any, i: number) => (
                <div key={i} className="flex gap-4 p-5 bg-white rounded-xl border border-gray-100">
                  <span className="text-3xl">{b.icon || "✅"}</span>
                  <div>
                    <h3 className="font-semibold text-[#1A1A1A] mb-1">{b.heading}</h3>
                    <p className="text-sm text-gray-600">{b.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <TrustBadges />
      <VideoTestimonials testimonials={s.testimonials} />

      {/* Countdown */}
      {s.countdown_end && (
        <section className="py-12 px-4 bg-red-50 text-center">
          <h2 className="font-heading text-2xl font-bold text-red-600 mb-4">⚡ Limited Time Offer Ends In:</h2>
          <CountdownTimer endDate={s.countdown_end} />
          {s.stock_count && (
            <p className="mt-6 text-sm font-semibold text-red-600">
              🔥 Only {s.stock_count} left in stock!
            </p>
          )}
        </section>
      )}

      {/* Pricing + Variants */}
      <section className="py-12 px-4 max-w-2xl mx-auto text-center">
        <div className="bg-white border-2 border-[#F97316] rounded-2xl p-8">
          {comparePrice && comparePrice > price && (
            <p className="text-gray-400 line-through text-xl mb-1">₦{comparePrice.toLocaleString()}</p>
          )}
          <p className="font-heading text-5xl font-bold text-[#1A1A1A] mb-2">
            ₦{price.toLocaleString()}
          </p>
          {comparePrice && comparePrice > price && (
            <span className="bg-[#F97316] text-white text-sm font-bold px-3 py-1 rounded-full">
              Save ₦{(comparePrice - price).toLocaleString()}
            </span>
          )}
          {product?.variants?.length > 1 && (
            <div className="mt-6 flex flex-wrap gap-2 justify-center">
              {product.variants.map((v: any) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariant(v)}
                  className={"px-4 py-2 rounded-lg border-2 text-sm font-medium transition-colors " + (
                    selectedVariant?.id === v.id
                      ? "border-[#F97316] bg-[#F97316] text-white"
                      : "border-gray-300 text-gray-700"
                  )}
                >
                  {v.sku}
                </button>
              ))}
            </div>
          )}
          <button
            onClick={handleBuyNow}
            className="mt-6 w-full bg-[#F97316] hover:bg-orange-600 text-white font-bold py-4 rounded-xl text-lg transition-colors"
          >
            {s.cta_text || "Buy Now"} →
          </button>
          <TrustBadges />
        </div>
      </section>

      <LandingFAQ items={s.faq} />

      <footer className="border-t border-gray-200 py-6 px-4 text-center text-sm text-gray-500">
        <div className="flex justify-center gap-4 flex-wrap">
          <Link href="/pages/returns-policy" className="hover:underline">Returns Policy</Link>
          <Link href="/pages/privacy-policy" className="hover:underline">Privacy Policy</Link>
          <Link href="/pages/delivery-policy" className="hover:underline">Delivery Policy</Link>
        </div>
        <p className="mt-3 text-xs">{store?.name} — Secured by Paystack 🔒</p>
      </footer>

      <StickyBuyNow price={price} onBuy={handleBuyNow} whatsappNumber={theme.whatsapp_number} />
    </div>
  );
}
