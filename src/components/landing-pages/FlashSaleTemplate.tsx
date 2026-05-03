"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/hooks/redux";
import { addItem, clearCart } from "@/lib/features/carts/cartsSlice";
import LandingFAQ from "./LandingFAQ";

const DEFAULT_VIDEO_URL = "https://youtube.com/shorts/BJom5Fud0iI";
const DEFAULT_IMG_1 = "https://res.cloudinary.com/djucbsrds/image/upload/v1776001306/y7gpxswg2filqyhlzssp.webp";
const DEFAULT_IMG_2 = "https://res.cloudinary.com/djucbsrds/image/upload/v1776001439/woyjqq8t9ok6w31op8vp.jpg";

const DEFAULT_TESTIMONIALS = [
  { text: "I've been washing clothes for my family of 6 for years. Nothing compares to Double Plus. Removes palm oil, tomato paste, even motor grease without soaking overnight. My whites are whiter than they've been in years. Ordered 3 bottles last month and I'm already back for a dozen.", author: "Adaeze O.", location: "Lagos" },
  { text: "I run a small laundry business and tried every detergent in the market. Double Plus cuts my work time in half — less scrubbing, faster results. Clients keep asking what I use. My repeat business went up because their clothes come back looking brand new. The one product I can't run out of.", author: "Emeka T.", location: "Abuja" },
  { text: "Ordered 5 bottles for my family. The colour-safe formula sold me — I have expensive Ankara fabrics and was scared. Not only did it clean tough stains, the colours look brighter now. Zero fading. My husband asked what washing magic I was using. Highly recommend for anyone with coloured fabric.", author: "Fatima A.", location: "Kano" },
  { text: "Tough stains from my kids' uniforms were destroying my sanity. Double Plus removed a 3-day set-in grass stain in ONE wash — didn't even need to soak it. For the price, especially this bundle deal, it's the best money I've spent on household products this year. I've already told my entire estate.", author: "Blessing N.", location: "Port Harcourt" },
  { text: "I was sceptical about ordering online but the pay-on-delivery option convinced me. When it arrived I tried it immediately — the lather is thick, scent is clean and it rinses fast. Used less water than usual. For a family that does laundry twice a week, this saves real money. Already ordered a dozen.", author: "Seun M.", location: "Ibadan" },
  { text: "Bought the 3-bottle pack to test. That was 4 months ago. I'm now on my second dozen. I've gifted bottles to my mum and sister. The machine-wash formula is perfect — no residue, no drum damage. This is the most honest cleaning product I've used in Nigeria. Nothing else comes close.", author: "Chiamaka R.", location: "Enugu" },
];

const BUNDLE_BENEFITS = [
  "Cleans tough stains in a single wash",
  "Safe for all fabrics — Ankara, cotton, synthetic",
  "Works hand wash & machine wash",
  "30-day money-back guarantee",
];

// ─── Bundle Picker Modal ──────────────────────────────────────────────────────
function BundlePickerModal({ bundles, initialBundle, productName, productImages, onConfirm, onClose }: {
  bundles: any[];
  initialBundle: number;
  productName: string;
  productImages: string[];
  onConfirm: (idx: number) => void;
  onClose: () => void;
}) {
  const [selected, setSelected] = useState(initialBundle);
  const current = bundles[selected];
  const fmt = (n: number) => "₦" + Math.round(n).toLocaleString("en-NG");

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.88)" }}>
      <div className="w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden" style={{ maxHeight: "92vh", overflowY: "auto" }}>
        <div className="bg-[var(--color-accent)] px-5 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <p className="text-white font-black text-lg">Choose Your Bundle</p>
            <p className="text-orange-100 text-sm mt-0.5">Flash sale prices — pick your pack</p>
          </div>
          <button onClick={onClose} className="text-white text-3xl leading-none font-bold">&times;</button>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-orange-50 border border-orange-100">
            {productImages[0] && <img src={productImages[0]} alt={productName} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />}
            <div className="flex-1 min-w-0">
              <p className="text-base font-bold text-gray-900 truncate">{productName}</p>
              <p className="text-sm text-gray-500 mt-0.5">Select your bundle below</p>
            </div>
          </div>
          <div className="flex flex-col gap-2.5 mb-5">
            {bundles.map((b, i) => (
              <div key={i} onClick={() => setSelected(i)}
                className="relative rounded-xl cursor-pointer flex items-center gap-3 px-3.5 py-3.5 transition-all"
                style={{ background: selected === i ? "#1A0800" : "#F9FAFB", border: selected === i ? "2px solid #F97316" : "1.5px solid #E5E7EB" }}>
                {b.tag && (
                  <div className="absolute px-2 py-0.5 rounded text-white font-bold"
                    style={{ top: "-9px", left: "12px", background: "var(--color-accent)", fontSize: "10px", letterSpacing: "1px" }}>
                    {b.tag}
                  </div>
                )}
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: selected === i ? "var(--color-accent)" : "transparent", border: selected === i ? "2px solid #F97316" : "2px solid #9CA3AF" }}>
                  {selected === i && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
                <div className="flex-1">
                  <p className="text-base font-semibold" style={{ color: selected === i ? "#fff" : "#111827" }}>{b.label}</p>
                  <p className="text-sm mt-0.5" style={{ color: selected === i ? "#fdba74" : "#9CA3AF" }}>{fmt(b.perUnit)}/bottle</p>
                </div>
                <div className="text-right">
                  <p className="text-base font-bold" style={{ color: "var(--color-accent)" }}>{fmt(b.price)}</p>
                  <p className="text-sm line-through" style={{ color: selected === i ? "#9CA3AF" : "#D1D5DB" }}>{fmt(b.originalPrice)}</p>
                  <p className="text-sm font-bold text-green-600">Save {fmt(b.savings)}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-xl p-4 mb-5 flex items-center justify-between bg-orange-50 border border-orange-200">
            <div>
              <p className="text-sm text-gray-500">Selected</p>
              <p className="text-base font-bold text-gray-900">{current.label}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-orange-600">{fmt(current.price)}</p>
              <p className="text-sm font-semibold text-green-600">Save {fmt(current.savings)}</p>
            </div>
          </div>
          <button onClick={() => onConfirm(selected)}
            className="w-full bg-[var(--color-accent)] hover:bg-orange-600 text-white font-black py-4 rounded-xl text-lg transition-all">
            I Want This Deal! →
          </button>
          <p className="text-sm text-gray-400 text-center mt-3">🔒 Secure checkout · Pay on delivery available</p>
        </div>
      </div>
    </div>
  );
}

// ─── Flash Countdown ──────────────────────────────────────────────────────────
function FlashCountdown({ endDate, fg = "var(--color-accent)", bg = "#1A1A1A", large = false }: { endDate: string; fg?: string; bg?: string; large?: boolean }) {
  const [secs, setSecs] = useState(0);
  useEffect(() => {
    const end = new Date(endDate).getTime();
    const update = () => setSecs(Math.max(0, Math.floor((end - Date.now()) / 1000)));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [endDate]);
  const h = Math.floor(secs / 3600), m = Math.floor((secs % 3600) / 60), s = secs % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <div className="flex items-center justify-center gap-3 py-2">
      {[{ v: pad(h), l: "Hours" }, { v: pad(m), l: "Mins" }, { v: pad(s), l: "Secs" }].map((u, i) => (
        <React.Fragment key={i}>
          <div className={`text-center rounded-xl ${large ? "px-5 py-3" : "px-4 py-2"}`} style={{ background: bg }}>
            <div className={`font-black leading-none ${large ? "text-5xl" : "text-3xl"}`} style={{ color: fg }}>{u.v}</div>
            <div className={`mt-1 font-semibold text-gray-400 ${large ? "text-base" : "text-sm"}`}>{u.l}</div>
          </div>
          {i < 2 && <div className={`font-black ${large ? "text-5xl" : "text-3xl"}`} style={{ color: fg }}>:</div>}
        </React.Fragment>
      ))}
    </div>
  );
}

function CTABtn({ text, onClick }: { text: string; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className="w-full font-black rounded-xl py-5 text-lg text-white transition-all hover:opacity-90 shadow-lg active:scale-95"
      style={{ background: "linear-gradient(135deg,#F97316,#ea580c)" }}>
      {text}
    </button>
  );
}

function YTEmbed({ url, caption, location }: { url: string; caption?: string; location?: string }) {
  const match = url ? url.match(/youtube\.com\/watch\?v=([^&]+)|youtu\.be\/([^?]+)|youtube\.com\/shorts\/([^?&/]+)|youtube\.com\/embed\/([^?]+)/) : null;
  const id = match ? (match[1] || match[2] || match[3] || match[4] || "") : "";
  if (!id) return null;
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: "#1A1A1A", border: "1px solid #2D2D2D" }}>
      <div className="relative aspect-video">
        <iframe
          src={`https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=1&rel=0&playsinline=1`}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen />
      </div>
      {caption && (
        <div className="px-4 py-3">
          <p className="text-base font-semibold text-white">{caption}</p>
          {location && <p className="text-sm mt-1 text-gray-500">{location}</p>}
        </div>
      )}
    </div>
  );
}

function TrustBar() {
  return (
    <div className="py-4 px-4" style={{ background: "#161616", borderTop: "1px solid #2D2D2D", borderBottom: "1px solid #2D2D2D" }}>
      <div className="max-w-2xl mx-auto flex items-center justify-between gap-2 flex-wrap">
        {[
          { icon: "🔒", text: "Secure Checkout" },
          { icon: "🚚", text: "Fast Delivery" },
          { icon: "🤝", text: "Pay on Delivery" },
          { icon: "⭐", text: "4.9 Rating" },
          { icon: "↩️", text: "30-Day Returns" },
        ].map((t, i) => (
          <div key={i} className="flex items-center gap-1.5 text-xs text-gray-400 font-semibold">
            <span>{t.icon}</span><span>{t.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function LandingFooter({ store }: { store: any }) {
  return (
    <footer className="bg-white border-t border-gray-100 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-center gap-5 flex-wrap mb-4 text-sm text-gray-500">
          <a href="/pages/returns-policy" className="hover:underline">Returns Policy</a>
          <a href="/pages/privacy-policy" className="hover:underline">Privacy Policy</a>
          <a href="/pages/delivery-policy" className="hover:underline">Delivery Policy</a>
          <a href="/pages/terms" className="hover:underline">Terms &amp; Conditions</a>
        </div>
        <p className="text-sm text-gray-400 text-center mb-3">
          © {new Date().getFullYear()} {store?.name}. All rights reserved. Powered by Shopsofly. Payments secured by Paystack 🔒
        </p>
        <div className="border-t border-gray-100 pt-4">
          <p className="text-xs text-gray-400 text-center leading-relaxed">
            <strong>DISCLAIMER:</strong> This page is not part of Facebook Inc. FACEBOOK is a trademark of FACEBOOK, Inc. Results may vary.
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── Abandonment Modal ───────────────────────────────────────────────────────
function AbandonmentModal({ lowestBundle, productName, productImages, whatsapp, onTakeDeal, onClose }: {
  lowestBundle: any;
  productName: string;
  productImages: string[];
  whatsapp?: string;
  onTakeDeal: () => void;
  onClose: () => void;
}) {
  const fmt = (n: number) => "₦" + Math.round(n).toLocaleString("en-NG");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ backgroundColor: "rgba(0,0,0,0.92)" }}>
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-red-600 px-5 py-3 text-center">
          <p className="text-white font-black text-base tracking-wide">⚠️ WAIT — Don&apos;t Miss Out!</p>
        </div>
        <div className="p-5 text-center">
          {productImages[0] && (
            <img src={productImages[0]} alt={productName} className="w-20 h-20 rounded-xl object-cover mx-auto mb-4" />
          )}
          <p className="text-lg font-black text-gray-900 mb-1">Still thinking?</p>
          <p className="text-sm text-gray-500 mb-4 leading-relaxed">
            Flash sale prices disappear when the timer ends. Start with just <strong>{lowestBundle.label}</strong> and see the results yourself.
          </p>
          <div className="rounded-xl p-4 mb-4 text-left" style={{ background: "#FFF7ED", border: "2px solid #F97316" }}>
            <p className="text-xs text-orange-500 font-bold uppercase mb-1">Special Offer</p>
            <p className="text-base font-black text-gray-900">{lowestBundle.label}</p>
            <div className="flex items-center justify-between mt-1">
              <span className="text-2xl font-black text-orange-600">{fmt(lowestBundle.price)}</span>
              <span className="text-sm line-through text-gray-400">{fmt(lowestBundle.originalPrice)}</span>
            </div>
          </div>
          <button onClick={onTakeDeal}
            className="w-full font-black py-4 rounded-xl text-white text-base mb-3"
            style={{ background: "linear-gradient(135deg,#F97316,#ea580c)" }}>
            Yes — I Want This Deal! →
          </button>
          {whatsapp && (
            <a href={`https://wa.me/${whatsapp.replace(/\D/g, "")}?text=Hi%2C%20I%20want%20to%20order%20${encodeURIComponent(productName)}`}
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold text-base mb-3"
              style={{ background: "#25D366", color: "#fff" }}>
              💬 Order on WhatsApp Instead
            </a>
          )}
          <button onClick={onClose} className="text-sm text-gray-400 underline">
            No thanks, I don&apos;t want the discount
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Template ────────────────────────────────────────────────────────────
export default function FlashSaleTemplate({ page, store }: { page: any; store: any }) {
  const s = page.settings || {};
  const products = page.products || [];
  const product = products[0] || null;
  const theme = store?.theme_settings || {};
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [showBundlePicker, setShowBundlePicker] = useState(false);
  const [showAbandonModal, setShowAbandonModal] = useState(false);
  const [selectedBundle, setSelectedBundle] = useState(1);
  const [mainImg, setMainImg] = useState(0);

  // Always show countdown — default to 24 h from initial page load if not configured
  const defaultCountdownEnd = useMemo(() => {
    const d = new Date();
    d.setTime(d.getTime() + 23 * 3600 * 1000 + 59 * 60 * 1000);
    return d.toISOString();
  }, []);
  const countdownEnd = s.countdown_end || defaultCountdownEnd;

  const slug = page.slug || "";
  const basePrice = product?.price || s.base_price || 5500;
  const productName = product?.name || s.product_name || "Double Plus Multipurpose Liquid Laundry Soap";

  const rawImages = [
    product?.image_url,
    ...(product?.images?.map((i: any) => i.url) || []),
    s.extra_image1,
    s.extra_image2,
  ].filter(Boolean);
  const productImages = rawImages.length > 0 ? rawImages : [DEFAULT_IMG_1, DEFAULT_IMG_2];

  const fmt = (n: number) => "₦" + Math.round(n).toLocaleString("en-NG");
  const bp = (mult: number) => Math.round(basePrice * mult);

  const bundles = [
    { qty: s.bundle1_qty || 1,  label: s.bundle1_label || "1 Bottle",              price: s.bundle1_price || basePrice, originalPrice: s.bundle1_original || bp(1.18), savings: (s.bundle1_original || bp(1.18)) - (s.bundle1_price || basePrice),  perUnit: s.bundle1_price || basePrice },
    { qty: s.bundle2_qty || 3,  label: s.bundle2_label || "3 Bottles",             price: s.bundle2_price || bp(2.63),  originalPrice: s.bundle2_original || bp(3.54),  savings: (s.bundle2_original || bp(3.54))  - (s.bundle2_price || bp(2.63)),  perUnit: Math.round((s.bundle2_price || bp(2.63)) / 3),  tag: s.bundle2_tag || "BEST VALUE" },
    { qty: s.bundle3_qty || 5,  label: s.bundle3_label || "5 Bottles",             price: s.bundle3_price || bp(4),     originalPrice: s.bundle3_original || bp(5.9),   savings: (s.bundle3_original || bp(5.9))   - (s.bundle3_price || bp(4)),     perUnit: Math.round((s.bundle3_price || bp(4)) / 5) },
    { qty: s.bundle4_qty || 10, label: s.bundle4_label || "10 Bottles",            price: s.bundle4_price || bp(6.9),   originalPrice: s.bundle4_original || bp(11.8),  savings: (s.bundle4_original || bp(11.8))  - (s.bundle4_price || bp(6.9)),   perUnit: Math.round((s.bundle4_price || bp(6.9)) / 10) },
    { qty: s.bundle5_qty || 12, label: s.bundle5_label || "1 Dozen (12 bottles)",  price: s.bundle5_price || bp(10.9),  originalPrice: s.bundle5_original || bp(14.1),  savings: (s.bundle5_original || bp(14.1))  - (s.bundle5_price || bp(10.9)),  perUnit: Math.round((s.bundle5_price || bp(10.9)) / 12) },
    { qty: s.bundle6_qty || 24, label: s.bundle6_label || "2 Dozens (24 bottles)", price: s.bundle6_price || bp(20),    originalPrice: s.bundle6_original || bp(28.3),  savings: (s.bundle6_original || bp(28.3))  - (s.bundle6_price || bp(20)),    perUnit: Math.round((s.bundle6_price || bp(20)) / 24) },
  ];

  const current = bundles[selectedBundle];
  const ctaText  = s.cta_text   || "I Want This Deal!";
  const ctaText2 = s.cta_text_2 || "I Want This Deal!";
  const ctaText3 = s.cta_text_3 || "I Want This Deal!";
  const ctaText4 = s.cta_text_4 || "Claim My Flash Sale Price Now";

  function openBundlePicker() { setShowBundlePicker(true); }

  function handleBundleClose() {
    setShowBundlePicker(false);
    setShowAbandonModal(true);
  }

  function handleConfirmBundle(idx: number) {
    const bundle = bundles[idx];
    setSelectedBundle(idx);
    const variant = product?.variants?.[0];
    dispatch(clearCart());
    dispatch(addItem({
      variantId:    variant?.id ?? (product?.id ?? idx + 1),
      productId:    product?.id ?? 0,
      name:         product?.name ?? productName,
      variantLabel: bundle.label,
      price:        bundle.price,
      imageUrl:     product?.image_url ?? productImages[0] ?? "",
      quantity:     1,
      slug:         product?.slug ?? slug,
    }));
    setShowBundlePicker(false);
    setShowAbandonModal(false);
    router.push("/checkout");
  }

  // Build testimonials from settings (fall back to defaults)
  const testimonials = DEFAULT_TESTIMONIALS.map((def, i) => ({
    text:     s[`testi${i + 1}_text`]   || def.text,
    author:   s[`testi${i + 1}_author`] || def.author,
    location: s[`testi${i + 1}_location`] || def.location,
  }));

  return (
    <div className="min-h-screen" style={{ background: "#0A0A0A", color: "#fff" }}>

      {/* ── HERO ───────────────────────────────────────────────── */}
      <section className="relative pt-10 pb-6 overflow-hidden text-center" style={{ background: "#0A0A0A", minHeight: "360px" }}>
        {s.hero_image_url && (
          <>
            <div className="absolute inset-0"><img src={s.hero_image_url} alt="Hero" className="w-full h-full object-cover" /></div>
            <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom,rgba(0,0,0,0.88),rgba(0,0,0,0.65) 50%,rgba(0,0,0,0.92))" }} />
          </>
        )}
        <div className="relative max-w-2xl mx-auto px-4">
          <div className="inline-block px-4 py-1.5 rounded-full text-sm font-bold mb-5 tracking-widest uppercase" style={{ background: "var(--color-accent)" }}>
            ⚡ {s.badge_text || "FLASH SALE — LIMITED TIME ONLY"}
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">{s.hero_headline || productName}</h1>
          <p className="text-gray-300 text-lg mb-5 leading-relaxed">{s.hero_subheadline || "Buy more and save up to 40%. Nigeria's most powerful stain-fighting soap."}</p>
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-lg font-bold text-[var(--color-accent)]">★★★★★</span>
            <span className="text-base text-gray-300">{s.rating || "4.9"} · {s.review_count || "1,240+"} verified reviews</span>
          </div>
        </div>
      </section>

      {/* ── VIDEO 1 — directly below hero ──────────────────────── */}
      <section className="pb-8 pt-0" style={{ background: "#0A0A0A" }}>
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-2xl font-black text-white text-center mb-2">{s.video1_title || "See It in Action"}</h2>
          <p className="text-base text-gray-400 text-center mb-5">{s.video1_subtitle || "Watch how it tackles Nigeria's toughest stains"}</p>
          <YTEmbed url={s.video1_url || DEFAULT_VIDEO_URL} caption={s.video1_caption} location={s.video1_location} />
        </div>
      </section>

      {/* ── DELIVERY BAR ───────────────────────────────────────── */}
      <div className="py-3.5 text-center text-base font-bold text-white" style={{ background: "var(--color-accent)" }}>
        🚚 {s.delivery_bar || "FREE DELIVERY on orders above ₦40,000 · Nationwide Delivery!"}
      </div>

      {/* ── TRUST BAR ──────────────────────────────────────────── */}
      <TrustBar />

      {/* ── COUNTDOWN + FIRST CTA ──────────────────────────────── */}
      <section className="py-10" style={{ background: "#0D0D0D" }}>
        <div className="max-w-2xl mx-auto px-4 text-center">
          <p className="text-sm font-bold mb-3 uppercase tracking-widest" style={{ color: "var(--color-accent)" }}>
            ⚡ {s.urgency_label || "FLASH SALE ENDS IN:"}
          </p>
          <FlashCountdown endDate={countdownEnd} large />
          {s.stock_count && <p className="text-base font-bold mt-4 text-red-400">🔥 Only {s.stock_count} packs left at this price!</p>}
          <div className="mt-6">
            <CTABtn text={ctaText} onClick={openBundlePicker} />
          </div>
          {theme.whatsapp_number && (
            <div className="mt-4">
              <a href={`https://wa.me/${theme.whatsapp_number.replace(/\D/g, "")}`} className="text-green-400 text-base font-medium">
                💬 Or order on WhatsApp
              </a>
            </div>
          )}
        </div>
      </section>

      {/* ── PRODUCT SHOWCASE ───────────────────────────────────── */}
      <section className="py-10" style={{ background: "#111" }}>
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-2xl font-black text-white text-center mb-1">{s.showcase_title || productName}</h2>
          <p className="text-base text-gray-400 text-center mb-6">{s.showcase_subtitle || "Effective for hand wash and machine wash · All fabric types"}</p>
          {productImages.length > 0 && (
            <>
              <div className="rounded-2xl overflow-hidden mb-3" style={{ aspectRatio: "4/3", background: "#1A1A1A" }}>
                <img src={productImages[mainImg]} alt={productName} className="w-full h-full object-cover" />
              </div>
              {productImages.length > 1 && (
                <div className="grid gap-2 mb-6" style={{ gridTemplateColumns: `repeat(${Math.min(productImages.length, 4)}, 1fr)` }}>
                  {productImages.slice(0, 4).map((img: string, i: number) => (
                    <div key={i} onClick={() => setMainImg(i)} className="rounded-xl overflow-hidden cursor-pointer"
                      style={{ aspectRatio: "1", background: "#1A1A1A", border: mainImg === i ? "2px solid #F97316" : "1.5px solid #2D2D2D" }}>
                      <img src={img} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
          <ul className="flex flex-col gap-3">
            {(s.showcase_features || "Removes tough stains instantly\nWhiter whites, brighter colours\nGentle on all fabric types\nSaves water — less rinsing\nHand wash and machine wash\nLong lasting formula")
              .split("\n").filter(Boolean).map((f: string, i: number) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center" style={{ background: "#4ade8020", border: "1.5px solid #4ade80" }}>
                    <svg width="11" height="9" viewBox="0 0 11 9"><path d="M1 4.5l2.8 2.8L10 1" stroke="#4ade80" strokeWidth="1.8" strokeLinecap="round" fill="none" /></svg>
                  </div>
                  <span className="text-base text-gray-200">{f.trim()}</span>
                </li>
              ))}
          </ul>
        </div>
      </section>

      {/* ── BUNDLE SECTION — two-column ─────────────────────────── */}
      <section className="py-10" style={{ background: "#0D0D0D" }}>
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-black text-white text-center mb-1">{s.bundle_title || "Choose Your Bundle & Save"}</h2>
          <p className="text-base text-gray-400 text-center mb-7">{s.bundle_subtitle || "Flash sale prices — the more you buy, the more you save"}</p>

          <div className="flex flex-col md:flex-row gap-5">
            {/* LEFT — bundle list */}
            <div className="flex flex-col gap-2.5 flex-1">
              {bundles.map((b, i) => (
                <div key={i} onClick={() => setSelectedBundle(i)}
                  className="relative rounded-xl cursor-pointer flex items-center gap-3 px-4 py-3.5 transition-all"
                  style={{
                    background: selectedBundle === i ? "#1A0800" : "#1A1A1A",
                    border: selectedBundle === i ? "2px solid #F97316" : "1.5px solid #2D2D2D",
                    boxShadow: selectedBundle === i ? "0 0 0 3px #F9731630" : "none",
                  }}>
                  {b.tag && (
                    <div className="absolute font-bold text-white"
                      style={{ top: "-9px", left: "12px", background: "var(--color-accent)", fontSize: "10px", letterSpacing: "1px", padding: "1px 7px", borderRadius: "4px" }}>
                      {b.tag}
                    </div>
                  )}
                  <div className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center"
                    style={{ background: selectedBundle === i ? "var(--color-accent)" : "transparent", border: selectedBundle === i ? "2px solid #F97316" : "2px solid #374151" }}>
                    {selectedBundle === i && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-base font-semibold text-white">{b.label}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{fmt(b.perUnit)}/bottle</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-[var(--color-accent)]">{fmt(b.price)}</p>
                    <p className="text-xs line-through text-gray-600">{fmt(b.originalPrice)}</p>
                    <p className="text-xs font-bold text-green-500">Save {fmt(b.savings)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* RIGHT — selection summary panel */}
            <div className="md:w-60 flex-shrink-0">
              <div className="sticky top-4 rounded-2xl overflow-hidden" style={{ background: "#161616", border: "1.5px solid #F97316" }}>
                {/* Orange header */}
                <div className="px-4 py-3" style={{ background: "linear-gradient(135deg,#F97316,#ea580c)" }}>
                  <p className="text-white text-xs font-bold uppercase tracking-wider mb-0.5">Your Selection</p>
                  <p className="text-white font-black text-lg leading-tight">{current.label}</p>
                </div>

                {/* Price block */}
                <div className="px-4 pt-4 pb-3 border-b" style={{ borderColor: "#2D2D2D" }}>
                  {productImages[0] && (
                    <img src={productImages[0]} alt={productName} className="w-14 h-14 rounded-xl object-cover mb-3" />
                  )}
                  <p className="text-3xl font-black text-[var(--color-accent)]">{fmt(current.price)}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-sm line-through text-gray-600">{fmt(current.originalPrice)}</p>
                    <span className="text-xs font-black px-2 py-0.5 rounded-full text-white" style={{ background: "#16a34a" }}>
                      SAVE {fmt(current.savings)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{fmt(current.perUnit)}/bottle</p>
                </div>

                {/* Benefits */}
                <div className="px-4 py-3">
                  <ul className="flex flex-col gap-2">
                    {BUNDLE_BENEFITS.map((b, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <svg className="flex-shrink-0 mt-0.5" width="13" height="11" viewBox="0 0 13 11"><path d="M1 5.5l3.5 3.5L12 1" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" fill="none" /></svg>
                        <span className="text-xs text-gray-300" style={{ lineHeight: "1.4" }}>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <div className="px-4 pb-4">
                  <button onClick={openBundlePicker}
                    className="w-full font-black py-3.5 rounded-xl text-white text-sm transition-all hover:opacity-90 active:scale-95"
                    style={{ background: "linear-gradient(135deg,#F97316,#ea580c)" }}>
                    I Want This Deal! →
                  </button>
                  <p className="text-center text-xs mt-2 text-gray-600">🔒 Secure · Pay on delivery</p>
                </div>
              </div>
            </div>
          </div>

          <p className="text-center text-sm mt-5 text-gray-600">🔒 Secure checkout · Pay on delivery available · 30-day guarantee</p>
        </div>
      </section>

      {/* ── BENEFITS ───────────────────────────────────────────── */}
      <section className="py-10" style={{ background: "#111" }}>
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-2xl font-black text-white text-center mb-1">{s.benefits_title || "Why People Love the Double Plus Multipurpose Liquid Laundry Soap"}</h2>
          <p className="text-base text-gray-400 text-center mb-6">{s.benefits_subtitle || "Real results in every wash"}</p>
          <ul className="flex flex-col divide-y" style={{ borderColor: "#2D2D2D" }}>
            {(s.benefits_items || "Removes Tough Stains|Grease, oil, Ankara stains gone in one wash\nWhiter Whites|Brilliant whites and brighter colours every time\nGentle on Fabric|Safe for all fabrics including delicates\nSaves Water|Less rinsing needed — saves time and money\nHand or Machine|Works perfectly in both\nLong Lasting|One bottle goes 3x further than regular soap")
              .split("\n").filter(Boolean).map((item: string, i: number) => {
                const [title, desc] = item.split("|");
                return (
                  <li key={i} className="flex items-start gap-4 py-4">
                    <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5" style={{ background: "#F9731620", border: "1.5px solid #F97316" }}>
                      <svg width="12" height="10" viewBox="0 0 12 10"><path d="M1 5l3.2 3.2L11 1" stroke="var(--color-accent)" strokeWidth="1.8" strokeLinecap="round" fill="none" /></svg>
                    </div>
                    <div>
                      <p className="text-base font-bold text-white">{title?.trim()}</p>
                      <p className="text-sm text-gray-400 mt-0.5" style={{ lineHeight: "1.5" }}>{desc?.trim()}</p>
                    </div>
                  </li>
                );
              })}
          </ul>
          <div className="mt-8">
            <CTABtn text={ctaText2} onClick={openBundlePicker} />
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS — horizontally scrollable, 4 visible ─── */}
      <section className="py-10 overflow-hidden" style={{ background: "#0A0A0A" }}>
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-black text-white text-center mb-1">{s.testimonials_title || "What Our Customers Are Saying"}</h2>
          <p className="text-base text-gray-400 text-center mb-6">{s.testimonials_subtitle || "Real reviews from real Nigerian households"}</p>
        </div>
        {/* Scroll container — 4 cards visible, snaps per card */}
        <div
          className="flex gap-4 px-4 overflow-x-auto pb-4"
          style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}>
          <style>{`.testi-scroll::-webkit-scrollbar{display:none}`}</style>
          {testimonials.map((t, i) => (
            <div key={i}
              className="flex-shrink-0 rounded-2xl p-5 flex flex-col justify-between"
              style={{
                width: "clamp(240px, 72vw, 280px)",
                scrollSnapAlign: "start",
                background: "#161616",
                border: "1px solid #2D2D2D",
              }}>
              <div>
                <div className="text-base mb-3 text-[var(--color-accent)]">★★★★★</div>
                <p className="text-sm text-gray-200 italic leading-relaxed mb-4">&ldquo;{t.text}&rdquo;</p>
              </div>
              <div className="flex items-center gap-2 mt-auto pt-3 border-t" style={{ borderColor: "#2D2D2D" }}>
                <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center font-black text-sm text-white" style={{ background: "var(--color-accent)" }}>
                  {t.author[0]}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{t.author}</p>
                  <p className="text-xs text-gray-500">{t.location}</p>
                </div>
              </div>
            </div>
          ))}
          {/* Trailing spacer so last card doesn't get cut off */}
          <div className="flex-shrink-0 w-4" />
        </div>
      </section>

      {/* ── VIDEO 2 ─────────────────────────────────────────────── */}
      <section className="py-10" style={{ background: "#111" }}>
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-2xl font-black text-white text-center mb-1">{s.video2_title || "Real Customers Share Their Experience"}</h2>
          <p className="text-base text-gray-400 text-center mb-5">{s.video2_subtitle || "Unscripted testimonials from Nigerian households"}</p>
          <YTEmbed url={s.video2_url || DEFAULT_VIDEO_URL} caption={s.video2_caption} location={s.video2_location} />
          <div className="mt-6"><CTABtn text={ctaText3} onClick={openBundlePicker} /></div>
        </div>
      </section>

      {/* ── HOW TO ORDER ────────────────────────────────────────── */}
      <section className="py-10" style={{ background: "#0A0A0A" }}>
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-2xl font-black text-white text-center mb-7">{s.steps_title || "How to Order — 3 Simple Steps"}</h2>
          <div className="flex flex-col gap-5 mb-6">
            {[
              { n: "1", t: s.step1 || "Choose your bundle and click 'I Want This Deal!' to lock in your flash sale price" },
              { n: "2", t: s.step2 || "Fill in your delivery address and choose Pay on Delivery or pay securely online via Paystack" },
              { n: "3", t: s.step3 || "Receive your order in 1–5 days. Pay on delivery or track online." },
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center font-black text-white text-lg" style={{ background: "var(--color-accent)" }}>
                  {step.n}
                </div>
                <p className="text-base pt-2.5 text-gray-300" style={{ lineHeight: "1.6" }}>{step.t}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────── */}
      <LandingFAQ dark={true} title={s.faq_title || "Frequently Asked Questions"}
        items={s.faq0_q
          ? Array.from({ length: 6 }, (_, i) => s[`faq${i}_q`] ? { question: s[`faq${i}_q`], answer: s[`faq${i}_a`] } : null).filter(Boolean) as any
          : undefined} />

      {/* ── FINAL CTA — always-on countdown ─────────────────────── */}
      <section className="py-14" style={{ background: "#0D0D0D" }}>
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black text-white mb-2">{s.final_cta_headline || "Claim Your Flash Sale Price Before It Ends"}</h2>
          <p className="text-base text-gray-400 mb-6">{s.final_cta_subtitle || "Prices go back to normal when the timer hits zero"}</p>

          {/* Prominent countdown — always visible */}
          <div className="rounded-2xl px-6 py-5 mb-6 inline-block" style={{ background: "#1A1A1A", border: "2px solid #F97316" }}>
            <p className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: "var(--color-accent)" }}>
              ⚡ {s.urgency_label || "SALE ENDS IN:"}
            </p>
            <FlashCountdown endDate={countdownEnd} fg="var(--color-accent)" bg="#0A0A0A" large />
          </div>

          {/* Selected bundle recap */}
          <div className="rounded-xl p-4 mb-6 flex items-center gap-3 text-left" style={{ background: "#1A1A1A", border: "1px solid #2D2D2D" }}>
            {productImages[0] && <img src={productImages[0]} alt="product" className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />}
            <div className="flex-1">
              <p className="text-base font-bold text-white">{current.label}</p>
              <p className="text-sm text-gray-400">{productName}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-[var(--color-accent)]">{fmt(current.price)}</p>
              <p className="text-sm font-bold text-green-500">Save {fmt(current.savings)}</p>
            </div>
          </div>
          <CTABtn text={ctaText4} onClick={openBundlePicker} />
          <p className="text-center text-sm mt-4 text-gray-600">🔒 Secure checkout · Paystack · Pay on delivery available</p>
          {theme.whatsapp_number && (
            <p className="text-center text-sm mt-2 text-gray-600">
              Or WhatsApp:{" "}
              <a href={`https://wa.me/${theme.whatsapp_number.replace(/\D/g, "")}`} className="text-green-400 font-semibold">
                {theme.whatsapp_number}
              </a>
            </p>
          )}
        </div>
      </section>

      <LandingFooter store={store} />

      {/* ── Bundle Picker Modal ──────────────────────────────── */}
      {showBundlePicker && (
        <BundlePickerModal
          bundles={bundles}
          initialBundle={selectedBundle}
          productName={productName}
          productImages={productImages}
          onConfirm={handleConfirmBundle}
          onClose={handleBundleClose}
        />
      )}

      {/* ── Abandonment Modal ────────────────────────────────── */}
      {showAbandonModal && (
        <AbandonmentModal
          lowestBundle={bundles[0]}
          productName={productName}
          productImages={productImages}
          whatsapp={theme.whatsapp_number}
          onTakeDeal={() => handleConfirmBundle(0)}
          onClose={() => setShowAbandonModal(false)}
        />
      )}
    </div>
  );
}
