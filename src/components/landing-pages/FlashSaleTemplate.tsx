"use client";
import React, { useState, useEffect } from "react";
import { createLandingPageOrder } from "@/lib/api";
import LandingFAQ from "./LandingFAQ";

// ─── Abandonment Modal ────────────────────────────────────────────────────────
function AbandonmentModal({ onClaim, onWhatsApp, onClose, lowerBundle, currentBundle, whatsappNumber }: {
  onClaim: () => void;
  onWhatsApp: () => void;
  onClose: () => void;
  lowerBundle: any | null;
  currentBundle: any;
  whatsappNumber?: string;
}) {
  const fmt = (n: number) => "₦" + Math.round(n).toLocaleString("en-NG");
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4" style={{ backgroundColor: "rgba(0,0,0,0.92)" }}>
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-[#1A1A1A] px-5 py-4 text-center relative">
          <div className="text-3xl mb-1">⏳</div>
          <p className="text-white font-black text-lg">Wait! Don&apos;t miss out.</p>
          <p className="text-gray-400 text-xs mt-1">This flash sale price expires soon.</p>
        </div>
        <div className="p-5 space-y-4">
          {lowerBundle ? (
            <>
              <p className="text-sm text-gray-600 text-center">Not ready for a big pack? Start small — still save big:</p>
              <div className="rounded-xl p-4 text-center" style={{ background: "#fff7ed", border: "2px solid #F97316" }}>
                <p className="text-base font-bold text-gray-900">{lowerBundle.label}</p>
                <p className="text-2xl font-black text-orange-600 mt-1">{fmt(lowerBundle.price)}</p>
                <p className="text-xs text-gray-500 line-through mt-0.5">{fmt(lowerBundle.originalPrice)}</p>
                <p className="text-xs font-bold text-green-600">You save {fmt(lowerBundle.savings)}</p>
              </div>
              <button onClick={onClaim}
                className="w-full bg-[#F97316] text-white font-bold py-3.5 rounded-xl text-sm hover:bg-orange-600">
                Yes — Claim This Deal →
              </button>
            </>
          ) : (
            <p className="text-sm text-gray-600 text-center">You&apos;re already on our best entry price. Chat us on WhatsApp if you need help ordering.</p>
          )}
          {whatsappNumber && (
            <button onClick={onWhatsApp}
              className="w-full border border-green-500 text-green-600 font-semibold py-3 rounded-xl text-sm hover:bg-green-50">
              💬 Order on WhatsApp Instead
            </button>
          )}
          <button onClick={onClose} className="w-full text-xs text-gray-400 hover:text-gray-600 py-2">
            No thanks, I&apos;ll pass on the savings
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Checkout Modal ───────────────────────────────────────────────────────────
function CheckoutModal({ onClose, onAbandon, bundle, lowerBundle, store, slug, product }: {
  onClose: () => void;
  onAbandon: () => void;
  bundle: any;
  lowerBundle: any | null;
  store: any;
  slug: string;
  product: any;
}) {
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "", state: "", payment: "pod" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const theme = store?.theme_settings || {};
  const fmt = (n: number) => "₦" + Math.round(n).toLocaleString("en-NG");

  function handleClose() {
    if (success) { onClose(); return; }
    onAbandon();
  }

  async function handleSubmit() {
    if (!form.name || !form.phone || !form.address || !form.state) {
      setError("Please fill in all required fields.");
      return;
    }
    if (form.payment === "online" && !form.email) {
      setError("Email is required for online payment.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      // Create the order on the backend for both payment methods
      const res = await createLandingPageOrder({
        product_id:   product?.id,
        qty:          bundle.qty,
        bundle_price: bundle.price,
        bundle_label: bundle.label,
        name:         form.name,
        phone:        form.phone,
        email:        form.email,
        address:      form.address,
        state:        form.state,
        payment_method: form.payment === "online" ? "paystack" : "cod",
        slug,
      });

      const order = res.data;

      if (form.payment === "online") {
        // Open Paystack popup
        const PaystackPop = (await import("@paystack/inline-js")).default;
        const handler = new PaystackPop();
        handler.newTransaction({
          key:      process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY ?? "",
          email:    form.email,
          amount:   order.total_kobo,
          ref:      order.paystack_reference,
          currency: "NGN",
          onSuccess: () => {
            setSuccess(true);
            setLoading(false);
          },
          onCancel: () => {
            // Payment popup closed — show abandonment
            setLoading(false);
            onAbandon();
          },
        });
        // Don't set loading false here — Paystack popup is open
      } else {
        // COD — order created + confirmation email sent by backend
        setSuccess(true);
        setLoading(false);
      }
    } catch (err: any) {
      setError(err?.response?.data?.error || "Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  const inp = "w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#F97316] text-gray-900 bg-white";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ backgroundColor: "rgba(0,0,0,0.9)" }}>
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden" style={{ maxHeight: "92vh", overflowY: "auto" }}>
        {success ? (
          <div className="p-8 text-center">
            <div className="text-5xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h3>
            <p className="text-gray-500 mb-2">Our team will call you within 30 minutes to confirm.</p>
            <p className="text-sm text-orange-600 font-semibold mb-6">{bundle.label} — {fmt(bundle.price)}</p>
            <button onClick={onClose} className="w-full bg-[#F97316] text-white py-3 rounded-xl font-bold">Close</button>
          </div>
        ) : (
          <>
            <div className="bg-[#F97316] px-5 py-4 flex items-center justify-between">
              <div>
                <p className="text-white font-bold text-base">Complete Your Order</p>
                <p className="text-orange-100 text-xs mt-0.5">{bundle.label} — {fmt(bundle.price)}</p>
              </div>
              <button onClick={handleClose} className="text-white text-2xl leading-none">&times;</button>
            </div>
            <div className="p-5 space-y-3">
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 flex items-center gap-3">
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900">{bundle.label}</p>
                  <p className="text-xs text-gray-500">Save {fmt(bundle.savings)} · Flash sale price</p>
                </div>
                <div className="text-lg font-bold text-orange-600">{fmt(bundle.price)}</div>
              </div>
              <input type="text" placeholder="Full Name *" value={form.name} onChange={e => setForm(s => ({...s, name: e.target.value}))} className={inp} />
              <input type="tel" placeholder="Phone Number (WhatsApp) *" value={form.phone} onChange={e => setForm(s => ({...s, phone: e.target.value}))} className={inp} />
              <input type="email" placeholder={form.payment === "online" ? "Email Address *" : "Email Address (optional)"} value={form.email} onChange={e => setForm(s => ({...s, email: e.target.value}))} className={inp} />
              <input type="text" placeholder="Delivery Address *" value={form.address} onChange={e => setForm(s => ({...s, address: e.target.value}))} className={inp} />
              <select value={form.state} onChange={e => setForm(s => ({...s, state: e.target.value}))} className={inp}>
                <option value="">Select State *</option>
                {["Lagos","Abuja","Rivers","Ogun","Oyo","Kano","Enugu","Anambra","Delta","Edo","Kaduna","Kogi","Ondo","Osun","Ekiti","Kwara","Benue","Plateau","Nassarawa","Niger","Kebbi","Sokoto","Zamfara","Katsina","Jigawa","Bauchi","Gombe","Yobe","Borno","Adamawa","Taraba","Cross River","Akwa Ibom","Imo","Abia","Ebonyi","Bayelsa"].map(st => <option key={st} value={st}>{st}</option>)}
              </select>
              <div>
                <p className="text-xs font-semibold text-gray-700 mb-2">Payment Method:</p>
                <div className="grid grid-cols-2 gap-2">
                  {[{v:"pod",l:"Pay on Delivery"},{v:"online",l:"Pay Online (Paystack)"}].map(opt => (
                    <button key={opt.v} type="button" onClick={() => setForm(s => ({...s, payment: opt.v}))}
                      className="px-3 py-2.5 rounded-lg text-xs border transition-all"
                      style={{ background: form.payment === opt.v ? "#F97316" : "#F9FAFB", borderColor: form.payment === opt.v ? "#F97316" : "#E5E7EB", color: form.payment === opt.v ? "#fff" : "#374151", fontWeight: form.payment === opt.v ? "600" : "400" }}>
                      {opt.l}
                    </button>
                  ))}
                </div>
                {form.payment === "online" && (
                  <p className="text-xs text-blue-600 mt-1.5">🔒 Secured by Paystack — pay now and get instant confirmation.</p>
                )}
              </div>
              {error && <p className="text-red-500 text-xs">{error}</p>}
              <button onClick={handleSubmit} disabled={loading}
                className="w-full bg-[#F97316] hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl text-sm disabled:opacity-60">
                {loading ? "Processing..." : form.payment === "online" ? "Pay Now with Paystack →" : "Confirm My Order →"}
              </button>
              <p className="text-xs text-gray-400 text-center">🔒 Your information is secure. No spam.</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Flash Countdown ──────────────────────────────────────────────────────────
function FlashCountdown({ endDate, fg = "#F97316", bg = "#1A1A1A" }: { endDate: string; fg?: string; bg?: string }) {
  const [secs, setSecs] = useState(0);
  useEffect(() => {
    const end = new Date(endDate).getTime();
    const update = () => setSecs(Math.max(0, Math.floor((end - Date.now()) / 1000)));
    update(); const id = setInterval(update, 1000); return () => clearInterval(id);
  }, [endDate]);
  const h = Math.floor(secs / 3600), m = Math.floor((secs % 3600) / 60), s = secs % 60;
  const fmt = (n: number) => String(n).padStart(2, "0");
  return (
    <div className="flex items-center justify-center gap-3 py-2">
      {[{v:fmt(h),l:"Hours"},{v:fmt(m),l:"Mins"},{v:fmt(s),l:"Secs"}].map((u, i) => (
        <React.Fragment key={i}>
          <div className="text-center px-3 py-2 rounded-xl" style={{ background: bg }}>
            <div className="text-2xl font-black leading-none" style={{ color: fg }}>{u.v}</div>
            <div className="text-xs mt-1" style={{ color: "#6B7280" }}>{u.l}</div>
          </div>
          {i < 2 && <div className="text-2xl font-black" style={{ color: fg }}>:</div>}
        </React.Fragment>
      ))}
    </div>
  );
}

function CTABtn({ text, onClick }: { text: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-full font-bold rounded-xl py-4 text-base text-white transition-all hover:opacity-90" style={{ background: "#F97316" }}>
      {text} →
    </button>
  );
}

function YTEmbed({ url, caption, location }: { url: string; caption?: string; location?: string }) {
  const match = url ? url.match(/youtube\.com\/watch\?v=([^&]+)|youtu\.be\/([^?]+)|youtube\.com\/shorts\/([^?&/]+)|youtube\.com\/embed\/([^?]+)/) : null;
  const id = match ? (match[1] || match[2] || match[3] || match[4] || "") : "";
  if (!id) return <div className="rounded-2xl flex items-center justify-center py-12 text-sm" style={{ background: "#1A1A1A", border: "1px solid #2D2D2D", color: "#6B7280" }}>Video coming soon</div>;
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: "#1A1A1A", border: "1px solid #2D2D2D" }}>
      <div className="relative aspect-video">
        <iframe src={`https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=1&rel=0`}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
      </div>
      {caption && <div className="px-4 py-3"><p className="text-sm font-semibold text-white">{caption}</p>{location && <p className="text-xs mt-1" style={{ color: "#6B7280" }}>{location}</p>}</div>}
    </div>
  );
}

function LandingFooter({ store }: { store: any }) {
  return (
    <footer className="bg-white border-t border-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-center gap-6 flex-wrap mb-4 text-sm text-gray-500">
          <a href="/pages/returns-policy" className="hover:underline">Returns Policy</a>
          <a href="/pages/privacy-policy" className="hover:underline">Privacy Policy</a>
          <a href="/pages/delivery-policy" className="hover:underline">Delivery Policy</a>
          <a href="/pages/terms" className="hover:underline">Terms &amp; Conditions</a>
        </div>
        <p className="text-xs text-gray-400 text-center mb-3">© {new Date().getFullYear()} {store?.name}. All rights reserved. Powered by Shopsofly. Payments secured by Paystack 🔒</p>
        <div className="border-t border-gray-100 pt-4">
          <p className="text-xs text-gray-400 text-center leading-relaxed max-w-2xl mx-auto">
            <strong>DISCLAIMER:</strong> This page is not part of the Facebook website or Facebook Inc. Additionally, this site is NOT endorsed by Facebook in any way. FACEBOOK is a trademark of FACEBOOK, Inc. Results may vary. Individual results differ.
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── Main Template ────────────────────────────────────────────────────────────
export default function FlashSaleTemplate({ page, store }: { page: any; store: any }) {
  const s = page.settings || {};
  const products = page.products || [];
  const product = products[0] || null;
  const theme = store?.theme_settings || {};
  const [showCheckout, setShowCheckout] = useState(false);
  const [showAbandonment, setShowAbandonment] = useState(false);
  const [selectedBundle, setSelectedBundle] = useState(1);
  const [mainImg, setMainImg] = useState(0);
  const slug = page.slug || "";
  const basePrice = product?.price || s.base_price || 5500;
  const productName = product?.name || s.product_name || "Double Plus Multipurpose Liquid Laundry Soap";
  const productImages = [product?.image_url, ...(product?.images?.map((i: any) => i.url) || []), s.extra_image1, s.extra_image2].filter(Boolean);
  const fmt = (n: number) => "₦" + Math.round(n).toLocaleString("en-NG");
  const bp = (mult: number) => Math.round(basePrice * mult);

  const bundles = [
    { qty: s.bundle1_qty||1,  label: s.bundle1_label||"1 Bottle",              price: s.bundle1_price||basePrice,  originalPrice: s.bundle1_original||bp(1.18), savings: (s.bundle1_original||bp(1.18))-(s.bundle1_price||basePrice),  perUnit: s.bundle1_price||basePrice },
    { qty: s.bundle2_qty||3,  label: s.bundle2_label||"3 Bottles",             price: s.bundle2_price||bp(2.63),   originalPrice: s.bundle2_original||bp(3.54),  savings: (s.bundle2_original||bp(3.54))-(s.bundle2_price||bp(2.63)),   perUnit: Math.round((s.bundle2_price||bp(2.63))/3),  tag: s.bundle2_tag||"BEST VALUE" },
    { qty: s.bundle3_qty||5,  label: s.bundle3_label||"5 Bottles",             price: s.bundle3_price||bp(4),      originalPrice: s.bundle3_original||bp(5.9),   savings: (s.bundle3_original||bp(5.9))-(s.bundle3_price||bp(4)),       perUnit: Math.round((s.bundle3_price||bp(4))/5) },
    { qty: s.bundle4_qty||10, label: s.bundle4_label||"10 Bottles",            price: s.bundle4_price||bp(6.9),    originalPrice: s.bundle4_original||bp(11.8),  savings: (s.bundle4_original||bp(11.8))-(s.bundle4_price||bp(6.9)),    perUnit: Math.round((s.bundle4_price||bp(6.9))/10) },
    { qty: s.bundle5_qty||12, label: s.bundle5_label||"1 Dozen (12 bottles)",  price: s.bundle5_price||bp(10.9),   originalPrice: s.bundle5_original||bp(14.1),  savings: (s.bundle5_original||bp(14.1))-(s.bundle5_price||bp(10.9)),   perUnit: Math.round((s.bundle5_price||bp(10.9))/12) },
    { qty: s.bundle6_qty||24, label: s.bundle6_label||"2 Dozens (24 bottles)", price: s.bundle6_price||bp(20),     originalPrice: s.bundle6_original||bp(28.3),  savings: (s.bundle6_original||bp(28.3))-(s.bundle6_price||bp(20)),     perUnit: Math.round((s.bundle6_price||bp(20))/24) },
  ];

  const current = bundles[selectedBundle];
  // Abandonment: offer the cheapest bundle (index 0) if not already on it
  const lowerBundle = selectedBundle > 0 ? bundles[0] : null;

  const ctaText  = s.cta_text  || "Order Now — Claim My Discount";
  const ctaText2 = s.cta_text_2 || "Yes — I Want This Deal Now";
  const ctaText3 = s.cta_text_3 || "I Am Ready — Order My Pack Now";
  const ctaText4 = s.cta_text_4 || "Secure My Order Before Price Goes Up";

  const openCheckout = () => { setShowAbandonment(false); setShowCheckout(true); };

  function handleAbandon() {
    setShowCheckout(false);
    setShowAbandonment(true);
  }

  function handleAbandonmentClaim() {
    // Switch to cheapest bundle and reopen checkout
    setSelectedBundle(0);
    setShowAbandonment(false);
    setShowCheckout(true);
  }

  function handleWhatsApp() {
    const wa = theme.whatsapp_number?.replace(/\D/g, "");
    if (wa) window.open(`https://wa.me/${wa}`, "_blank");
    setShowAbandonment(false);
  }

  return (
    <div className="min-h-screen" style={{ background: "#0A0A0A", color: "#fff" }}>

      {/* HERO */}
      <section className="relative px-4 pt-8 pb-6 text-center overflow-hidden" style={{ background: "#0A0A0A", minHeight: "400px" }}>
        {s.hero_image_url && (<><div className="absolute inset-0"><img src={s.hero_image_url} alt="Hero" className="w-full h-full object-cover absolute inset-0" /></div><div className="absolute inset-0" style={{ background: "linear-gradient(to bottom,rgba(0,0,0,0.88),rgba(0,0,0,0.7) 50%,rgba(0,0,0,0.92))" }} /></>)}
        <div className="relative">
          <div className="inline-block px-4 py-1.5 rounded-full text-xs font-bold mb-4 tracking-widest uppercase" style={{ background: "#F97316", color: "#fff" }}>⚡ {s.badge_text || "FLASH SALE — LIMITED TIME ONLY"}</div>
          <h1 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">{s.hero_headline || productName}</h1>
          <p className="text-gray-300 text-sm mb-6 leading-relaxed max-w-xl mx-auto">{s.hero_subheadline || "Buy more and save up to 40%. Nigeria's most powerful stain-fighting soap."}</p>
          {s.countdown_end && (
            <div className="max-w-sm mx-auto mb-4" style={{ background: "#1A1A1A", border: "1.5px solid #F97316", borderRadius: "12px", padding: "8px 16px" }}>
              <p className="text-xs font-bold mb-1" style={{ color: "#F97316" }}>⚡ {s.urgency_label || "FLASH SALE ENDS IN:"}</p>
              <FlashCountdown endDate={s.countdown_end} />
            </div>
          )}
          {s.stock_count && <div className="text-xs font-bold mb-4" style={{ color: "#ef4444" }}>🔥 Only {s.stock_count} packs left at this price!</div>}
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="text-sm font-bold" style={{ color: "#F97316" }}>★★★★★</span>
            <span className="text-xs" style={{ color: "#9CA3AF" }}>{s.rating || "4.9"} · {s.review_count || "1,240+"} verified reviews</span>
          </div>
          <CTABtn text={ctaText} onClick={openCheckout} />
          {theme.whatsapp_number && <div className="mt-4"><a href={`https://wa.me/${theme.whatsapp_number.replace(/\D/g,"")}`} className="text-green-400 text-sm">💬 Or order on WhatsApp</a></div>}
        </div>
      </section>

      {/* DELIVERY BAR */}
      <div className="py-3 px-4 text-center text-sm font-bold text-white" style={{ background: "#F97316" }}>🚚 {s.delivery_bar || "FREE DELIVERY on orders above ₦10,000 · Nationwide · Pay on delivery available"}</div>

      {/* PRODUCT SHOWCASE */}
      <section className="px-4 py-8" style={{ background: "#111" }}>
        <h2 className="text-xl font-black text-white text-center mb-2">{s.showcase_title || productName}</h2>
        <p className="text-xs text-center mb-5" style={{ color: "#9CA3AF" }}>{s.showcase_subtitle || "Effective for hand wash and machine wash · All fabric types"}</p>
        {productImages.length > 0 && (
          <>
            <div className="rounded-2xl overflow-hidden mb-3" style={{ aspectRatio: "4/3", background: "#1A1A1A" }}>
              <img src={productImages[mainImg]} alt={productName} className="w-full h-full object-cover" />
            </div>
            {productImages.length > 1 && (
              <div className="grid gap-2 mb-4" style={{ gridTemplateColumns: `repeat(${Math.min(productImages.length,4)},1fr)` }}>
                {productImages.slice(0,4).map((img: string, i: number) => (
                  <div key={i} onClick={() => setMainImg(i)} className="rounded-xl overflow-hidden cursor-pointer" style={{ aspectRatio: "1", background: "#1A1A1A", border: mainImg===i ? "2px solid #F97316" : "1.5px solid #2D2D2D" }}>
                    <img src={img} alt={`View ${i+1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
        <div className="grid grid-cols-2 gap-3">
          {(s.showcase_features || "Removes tough stains instantly\nWhiter whites, brighter colours\nGentle on all fabric types\nSaves water — less rinsing\nHand wash and machine wash\nLong lasting formula").split("\n").filter(Boolean).map((f: string, i: number) => (
            <div key={i} className="flex items-center gap-2 rounded-xl px-3 py-2.5" style={{ background: "#1A1A1A", border: "1px solid #2D2D2D" }}>
              <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "#4ade8020", border: "1.5px solid #4ade80" }}>
                <svg width="10" height="8" viewBox="0 0 10 8"><path d="M1 4l2.5 2.5L9 1" stroke="#4ade80" strokeWidth="1.8" strokeLinecap="round" fill="none"/></svg>
              </div>
              <span className="text-xs text-gray-300">{f.trim()}</span>
            </div>
          ))}
        </div>
      </section>

      {/* BUNDLE PICKER */}
      <section className="px-4 py-8" style={{ background: "#0D0D0D" }}>
        <h2 className="text-xl font-black text-white text-center mb-2">{s.bundle_title || "Choose Your Bundle & Save"}</h2>
        <p className="text-xs text-center mb-5" style={{ color: "#9CA3AF" }}>{s.bundle_subtitle || "Flash sale prices — discount automatically applied at checkout"}</p>
        <div className="flex flex-col gap-3 mb-5">
          {bundles.map((b, i) => (
            <div key={i} onClick={() => setSelectedBundle(i)} className="relative rounded-xl cursor-pointer flex items-center gap-3 p-3.5 transition-all"
              style={{ background: selectedBundle===i ? "#1A0800" : "#1A1A1A", border: selectedBundle===i ? "2px solid #F97316" : "1.5px solid #2D2D2D" }}>
              {b.tag && <div className="absolute px-2 py-0.5 rounded text-white font-bold" style={{ top:"-9px", left:"12px", background:"#F97316", fontSize:"9px", letterSpacing:"1px" }}>{b.tag}</div>}
              <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: selectedBundle===i ? "#F97316" : "transparent", border: selectedBundle===i ? "2px solid #F97316" : "2px solid #374151" }}>
                {selectedBundle===i && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">{b.label}</p>
                <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>{fmt(b.perUnit)}/bottle</p>
              </div>
              <div className="text-right">
                <p className="text-base font-bold" style={{ color: "#F97316" }}>{fmt(b.price)}</p>
                <p className="text-xs line-through" style={{ color: "#6B7280" }}>{fmt(b.originalPrice)}</p>
                <p className="text-xs font-bold" style={{ color: "#4ade80" }}>Save {fmt(b.savings)}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-xl p-4 mb-4 flex items-center gap-3" style={{ background: "#1A1A1A", border: "1px solid #2D2D2D" }}>
          {productImages[0] && <img src={productImages[0]} alt="product" className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />}
          <div className="flex-1"><p className="text-sm font-bold text-white">{current.label}</p><p className="text-xs" style={{ color: "#9CA3AF" }}>{productName}</p></div>
          <div className="text-right"><p className="text-lg font-bold" style={{ color: "#F97316" }}>{fmt(current.price)}</p><p className="text-xs font-bold" style={{ color: "#4ade80" }}>Save {fmt(current.savings)}</p></div>
        </div>
        <CTABtn text={ctaText} onClick={openCheckout} />
        <p className="text-center text-xs mt-3" style={{ color: "#6B7280" }}>🔒 Secure checkout · Pay on delivery available · 30-day guarantee</p>
      </section>

      {/* BENEFITS */}
      <section className="px-4 py-8" style={{ background: "#111" }}>
        <h2 className="text-xl font-black text-white text-center mb-2">{s.benefits_title || "Why Nigerians Love Double Plus"}</h2>
        <p className="text-xs text-center mb-5" style={{ color: "#9CA3AF" }}>{s.benefits_subtitle || "Real results in every wash"}</p>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {(s.benefits_items || "Removes Tough Stains|Grease, oil, Ankara stains gone in one wash\nWhiter Whites|Brilliant whites and brighter colours every time\nGentle on Fabric|Safe for all fabrics including delicates\nSaves Water|Less rinsing needed for Nigeria\nHand or Machine|Works perfectly in both\nLong Lasting|One bottle goes 3x further").split("\n").filter(Boolean).map((item: string, i: number) => {
            const [title, desc] = item.split("|");
            return (
              <div key={i} className="rounded-xl p-3 text-center" style={{ background: "#1A1A1A", border: "1px solid #2D2D2D" }}>
                <p className="text-xs font-bold text-white mb-1">{title?.trim()}</p>
                <p className="text-xs" style={{ color: "#6B7280", lineHeight: "1.4" }}>{desc?.trim()}</p>
              </div>
            );
          })}
        </div>
        <CTABtn text={ctaText2} onClick={openCheckout} />
      </section>

      {/* VIDEO 1 */}
      <section className="px-4 py-8" style={{ background: "#0A0A0A" }}>
        <h2 className="text-xl font-black text-white text-center mb-2">{s.video1_title || "See It in Action"}</h2>
        <p className="text-xs text-center mb-5" style={{ color: "#9CA3AF" }}>{s.video1_subtitle || "Watch how it tackles Nigeria's toughest stains"}</p>
        <YTEmbed url={s.video1_url || ""} caption={s.video1_caption} location={s.video1_location} />
      </section>

      {/* TESTIMONIALS */}
      <section className="px-4 py-8" style={{ background: "#111" }}>
        <h2 className="text-xl font-black text-white text-center mb-2">{s.testimonials_title || "What Our Customers Are Saying"}</h2>
        <p className="text-xs text-center mb-5" style={{ color: "#9CA3AF" }}>{s.testimonials_subtitle || "Real reviews from real Nigerian households"}</p>
        {[
          { text: s.testi1_text, author: s.testi1_author },
          { text: s.testi2_text, author: s.testi2_author },
          { text: s.testi3_text, author: s.testi3_author },
        ].filter(t => t.text).map((t, i) => (
          <div key={i} className="rounded-xl p-4 mb-3" style={{ background: "#1A1A1A", border: "1px solid #2D2D2D" }}>
            <div className="text-sm mb-2" style={{ color: "#F97316" }}>★★★★★</div>
            <p className="text-sm italic mb-3" style={{ color: "#D1D5DB", lineHeight: "1.6" }}>&ldquo;{t.text}&rdquo;</p>
            <p className="text-xs font-bold" style={{ color: "#6B7280" }}>{t.author}</p>
          </div>
        ))}
      </section>

      {/* VIDEO 2 */}
      <section className="px-4 py-8" style={{ background: "#0A0A0A" }}>
        <h2 className="text-xl font-black text-white text-center mb-2">{s.video2_title || "Real Customers Share Their Experience"}</h2>
        <p className="text-xs text-center mb-5" style={{ color: "#9CA3AF" }}>{s.video2_subtitle || "Unscripted testimonials from Nigerian households"}</p>
        <YTEmbed url={s.video2_url || ""} caption={s.video2_caption} location={s.video2_location} />
        <div className="mt-5"><CTABtn text={ctaText3} onClick={openCheckout} /></div>
      </section>

      {/* HOW TO ORDER */}
      <section className="px-4 py-8" style={{ background: "#111" }}>
        <h2 className="text-xl font-black text-white text-center mb-5">{s.steps_title || "How to Order — 3 Simple Steps"}</h2>
        <div className="flex flex-col gap-4 mb-6">
          {[{n:"1",t:s.step1||"Choose your bundle and click Order Now to claim your flash sale price"},{n:"2",t:s.step2||"Fill in your name, phone, and delivery address — we deliver to all 36 states"},{n:"3",t:s.step3||"Receive your order in 1-5 days and pay on delivery or securely online via Paystack"}].map((step,i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-white text-sm" style={{ background: "#F97316" }}>{step.n}</div>
              <p className="text-sm pt-1.5" style={{ color: "#D1D5DB", lineHeight: "1.5" }}>{step.t}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <LandingFAQ dark={true} title={s.faq_title || "Frequently Asked Questions"}
        items={s.faq0_q ? Array.from({length:6},(_,i)=>s[`faq${i}_q`]?{question:s[`faq${i}_q`],answer:s[`faq${i}_a`]}:null).filter(Boolean) as any : undefined} />

      {/* FINAL CTA */}
      <section className="px-4 py-10" style={{ background: "#0D0D0D" }}>
        <h2 className="text-2xl font-black text-white text-center mb-2">{s.final_cta_headline || "Claim Your Flash Sale Price Before It Ends"}</h2>
        <p className="text-xs text-center mb-5" style={{ color: "#9CA3AF" }}>{s.final_cta_subtitle || "Prices go back to normal when the timer hits zero"}</p>
        {s.countdown_end && (
          <div className="max-w-sm mx-auto mb-5" style={{ background: "#1A1A1A", border: "1.5px solid #F97316", borderRadius: "12px", padding: "8px 16px" }}>
            <FlashCountdown endDate={s.countdown_end} />
          </div>
        )}
        <div className="rounded-xl p-4 mb-5 flex items-center gap-3" style={{ background: "#1A1A1A", border: "1px solid #2D2D2D" }}>
          {productImages[0] && <img src={productImages[0]} alt="product" className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />}
          <div className="flex-1"><p className="text-sm font-bold text-white">{current.label}</p><p className="text-xs" style={{ color: "#9CA3AF" }}>{productName}</p></div>
          <div className="text-right"><p className="text-lg font-bold" style={{ color: "#F97316" }}>{fmt(current.price)}</p><p className="text-xs font-bold" style={{ color: "#4ade80" }}>Save {fmt(current.savings)}</p></div>
        </div>
        <CTABtn text={ctaText4} onClick={openCheckout} />
        <p className="text-center text-xs mt-3" style={{ color: "#6B7280" }}>🔒 Secure checkout · Paystack · Pay on delivery available</p>
        {theme.whatsapp_number && <p className="text-center text-xs mt-2" style={{ color: "#6B7280" }}>Or WhatsApp: <a href={`https://wa.me/${theme.whatsapp_number.replace(/\D/g,"")}`} className="text-green-400 font-semibold">{theme.whatsapp_number}</a></p>}
      </section>

      <LandingFooter store={store} />

      {showCheckout && (
        <CheckoutModal
          onClose={() => setShowCheckout(false)}
          onAbandon={handleAbandon}
          bundle={current}
          lowerBundle={lowerBundle}
          store={store}
          slug={slug}
          product={product}
        />
      )}

      {showAbandonment && (
        <AbandonmentModal
          onClaim={handleAbandonmentClaim}
          onWhatsApp={handleWhatsApp}
          onClose={() => setShowAbandonment(false)}
          lowerBundle={lowerBundle}
          currentBundle={current}
          whatsappNumber={theme.whatsapp_number}
        />
      )}
    </div>
  );
}
