"use client";
import React, { useState } from "react";
import Image from "next/image";
import { sendLandingPageLead } from "@/lib/api";
import CountdownTimer from "./CountdownTimer";
import LandingFAQ from "./LandingFAQ";

function LeadPopup({ onClose, slug, ctaText, productPrice, dark }: {
  onClose: () => void; slug: string; ctaText: string; productPrice?: number; dark: boolean;
}) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", intent: "", notes: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const priceFormatted = productPrice ? "₦" + productPrice.toLocaleString("en-NG") : null;
  const intentOptions = [
    { value: "more_info", label: "I want to know more about this product before deciding" },
    { value: "ready_to_order", label: "I am ready to order — please contact me now" },
    { value: "can_invest", label: priceFormatted ? `Yes, I can invest ${priceFormatted} for my health today` : "Yes, I can invest in this product today" },
  ];
  async function handleSubmit() {
    if (!form.name || !form.phone) { setError("Please enter your name and phone number."); return; }
    if (!form.intent) { setError("Please select one option below."); return; }
    setLoading(true); setError("");
    try { await sendLandingPageLead({ ...form, slug }); setSuccess(true); }
    catch { setError("Something went wrong. Please try again."); }
    finally { setLoading(false); }
  }
  const bg = dark ? "#0A0A0A" : "#FFFFFF";
  const fg = dark ? "#FFFFFF" : "#1A1A1A";
  const inputCls = dark
    ? "w-full px-4 py-3 rounded-xl text-sm outline-none bg-[#1A1A1A] border border-gray-700 text-white placeholder-gray-500 focus:border-[var(--color-accent)]"
    : "w-full px-4 py-3 border border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[var(--color-accent)]";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ backgroundColor: "rgba(0,0,0,0.85)" }}>
      <div className="w-full max-w-md shadow-2xl rounded-2xl" style={{ backgroundColor: "#FFFFFF" }}>
        {success ? (
          <div className="text-center py-6">
            <div className="text-5xl mb-4">🎉</div>
            <h3 className="font-heading text-2xl font-bold mb-2" style={{ color: fg }}>Thank You!</h3>
            <p className="text-gray-400 mb-6">We have received your details. Our team will contact you very soon.</p>
            <button onClick={onClose} className="bg-[var(--color-accent)] text-white px-6 py-3 rounded-xl font-semibold w-full">Close</button>
          </div>
        ) : (
          <>
            <div className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-heading text-lg font-bold text-gray-900">{ctaText || "Get More Details"}</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>
            <p className="text-xs text-gray-500 mb-3">Fill in your details and our team will reach out shortly.</p>
            <div className="space-y-2 mb-3">
              <input type="text" placeholder="Full Name *" value={form.name} onChange={(e) => setForm(s => ({ ...s, name: e.target.value }))}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[var(--color-accent)]" />
              <input type="tel" placeholder="Phone Number (WhatsApp) *" value={form.phone} onChange={(e) => setForm(s => ({ ...s, phone: e.target.value }))}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[var(--color-accent)]" />
              <input type="email" placeholder="Email Address (optional)" value={form.email} onChange={(e) => setForm(s => ({ ...s, email: e.target.value }))}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[var(--color-accent)]" />
            </div>
            <p className="text-xs font-semibold text-gray-700 mb-2">Please select one:</p>
            <div className="space-y-1.5 mb-3">
              {intentOptions.map((opt) => (
                <button key={opt.value} type="button" onClick={() => setForm(s => ({ ...s, intent: opt.value }))}
                  className="w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all border"
                  style={{ backgroundColor: form.intent === opt.value ? "var(--color-accent)" : "#F9FAFB", borderColor: form.intent === opt.value ? "var(--color-accent)" : "#E5E7EB", color: form.intent === opt.value ? "#FFFFFF" : "#1A1A1A", fontWeight: form.intent === opt.value ? "600" : "400" }}>
                  {opt.label}
                </button>
              ))}
            </div>
            {error && <p className="text-red-500 text-xs mb-2">{error}</p>}
            <button onClick={handleSubmit} disabled={loading} className="w-full bg-[var(--color-accent)] hover:bg-orange-600 text-white font-bold py-3 rounded-lg text-sm transition-colors disabled:opacity-60">
              {loading ? "Sending..." : "Send My Details →"}
            </button>
            <p className="text-xs text-gray-400 text-center mt-2">🔒 Your details are safe. No spam, ever.</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function CTAButton({ text, onClick, size = "lg" }: { text: string; onClick: () => void; size?: "sm" | "lg" }) {
  return (
    <button onClick={onClick} className={`inline-block bg-[var(--color-accent)] hover:bg-orange-500 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-orange-500/30 hover:scale-105 ${size === "lg" ? "px-10 py-5 text-lg" : "px-6 py-3 text-sm"}`}>
      {text || "Get More Details"} →
    </button>
  );
}

function YoutubeEmbed({ url, className = "" }: { url: string; className?: string }) {
  const match = url ? url.match(/youtube\.com\/watch\?v=([^&]+)|youtu\.be\/([^?]+)|youtube\.com\/shorts\/([^?&/]+)|youtube\.com\/embed\/([^?]+)/) : null;
  const id = match ? (match[1] || match[2] || match[3] || match[4] || "") : "";
  if (!id) return <div className={"bg-gray-900 rounded-2xl flex items-center justify-center text-gray-600 text-sm aspect-video " + className}>Video coming soon</div>;
  return (
    <div className={"relative rounded-2xl overflow-hidden bg-black " + className}>
      <div className="aspect-video">
        <iframe src={"https://www.youtube.com/embed/" + id + "?autoplay=1&mute=1&loop=1&playlist=" + id + "&controls=1&rel=0"} className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
      </div>
    </div>
  );
}

function BenefitsSection({ heading, items, bg, fg, checkColor, onClick, ctaText }: {
  heading?: string; items: string[]; bg: string; fg: string; checkColor: string; onClick: () => void; ctaText: string;
}) {
  if (!heading && items.length === 0) return null;
  return (
    <section className="py-20 px-4" style={{ backgroundColor: bg }}>
      <div className="max-w-3xl mx-auto">
        {heading && <h2 className="font-heading text-3xl md:text-4xl font-black mb-10 text-center leading-tight" style={{ color: fg }}>{heading}</h2>}
        <div className="space-y-5 mb-12">
          {items.map((item, i) => item.trim() ? (
            <div key={i} className="flex items-start gap-4">
              <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center mt-0.5" style={{ backgroundColor: checkColor + "25", border: "2px solid " + checkColor }}>
                <svg width="12" height="10" viewBox="0 0 12 10" fill="none"><path d="M1 5l3.5 3.5L11 1" stroke={checkColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              <p className="text-lg leading-relaxed" style={{ color: fg === "#FFFFFF" ? "#D1D5DB" : "#374151" }}>{item.trim()}</p>
            </div>
          ) : null)}
        </div>
        <div className="text-center"><CTAButton text={ctaText} onClick={onClick} /></div>
      </div>
    </section>
  );
}

function PictureTextSection({ imageUrl, heading, body, imageLeft, dark }: {
  imageUrl?: string; heading?: string; body?: string; imageLeft: boolean; dark: boolean;
}) {
  const bg = dark ? "#111111" : "#FFFFFF";
  const fg = dark ? "#FFFFFF" : "#1A1A1A";
  const imgBlock = (
    <div className="w-full md:w-1/2">
      {imageUrl ? (
        <div className="rounded-2xl overflow-hidden shadow-2xl" style={{ minHeight: "340px" }}>
          <img src={imageUrl} alt={heading || "Section"} className="w-full h-full object-cover" style={{ minHeight: "340px" }} />
        </div>
      ) : (
        <div className="rounded-2xl h-72 flex items-center justify-center text-gray-600 text-sm" style={{ background: dark ? "#1A1A1A" : "#F3F4F6" }}>Image coming soon</div>
      )}
    </div>
  );
  const textBlock = (
    <div className="w-full md:w-1/2 flex flex-col justify-center space-y-5">
      {heading && <h2 className="font-heading text-3xl md:text-4xl font-black leading-tight" style={{ color: fg }}>{heading}</h2>}
      {body && <p className="text-lg leading-relaxed whitespace-pre-line" style={{ color: dark ? "#9CA3AF" : "#4B5563" }}>{body}</p>}
    </div>
  );
  return (
    <section className="py-20 px-4" style={{ backgroundColor: bg }}>
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-12 items-center">
        {imageLeft ? <>{imgBlock}{textBlock}</> : <>{textBlock}{imgBlock}</>}
      </div>
    </section>
  );
}

function UrgencySection({ label, endDate, stockCount, bg, fg }: { label?: string; endDate?: string; stockCount?: string; bg: string; fg: string; }) {
  if (!endDate) return null;
  return (
    <section className="py-14 px-4 text-center" style={{ backgroundColor: bg }}>
      <h2 className="font-heading text-2xl font-bold mb-6" style={{ color: fg }}>⚡ {label || "Limited Time Offer Ends In:"}</h2>
      <CountdownTimer endDate={endDate} />
      {stockCount && <p className="mt-5 text-sm font-semibold" style={{ color: fg }}>🔥 Only {stockCount} units remaining at this price!</p>}
    </section>
  );
}

function LandingFooter({ store }: { store: any }) {
  return (
    <footer className="bg-white border-t border-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-center gap-6 flex-wrap mb-4 text-sm text-gray-500">
          <a href="/pages/returns-policy" className="hover:text-gray-800 hover:underline">Returns Policy</a>
          <a href="/pages/privacy-policy" className="hover:text-gray-800 hover:underline">Privacy Policy</a>
          <a href="/pages/delivery-policy" className="hover:text-gray-800 hover:underline">Delivery Policy</a>
          <a href="/pages/terms" className="hover:text-gray-800 hover:underline">Terms & Conditions</a>
        </div>
        <div className="text-center mb-4">
          <p className="text-xs text-gray-400">© {new Date().getFullYear()} {store?.name}. All rights reserved. Powered by Shopsofly.</p>
          <p className="text-xs text-gray-400 mt-1">Payments secured by Paystack 🔒</p>
        </div>
        <div className="border-t border-gray-100 pt-4">
          <p className="text-xs text-gray-400 text-center leading-relaxed max-w-2xl mx-auto">
            <strong>DISCLAIMER:</strong> This page is not part of the Facebook website or Facebook Inc. Additionally, this site is NOT endorsed by Facebook in any way. FACEBOOK is a trademark of FACEBOOK, Inc. Results may vary. Testimonials shown are real experiences from customers but individual results may differ. This product is not intended to diagnose, treat, cure or prevent any disease. Please consult a healthcare professional before use.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function ProductSpotlightTemplate({ page, store }: { page: any; store: any }) {
  const s = page.settings || {};
  const products = page.products || [];
  const theme = store?.theme_settings || {};
  const [showPopup, setShowPopup] = useState(false);
  const ctaText = s.cta_text || "I Want to Know More - Contact Me Now";
  const ctaText2 = s.cta_text_2 || "Yes - Send Me Full Details Now";
  const ctaText3 = s.cta_text_3 || "I Am Ready - Contact Me Today";
  const slug = page.slug || "";
  const isDark = s.dark_mode !== false;
  const productPrice = products[0]?.price || null;
  const pageBg = isDark ? "#0D0D0D" : "#FFFFFF";
  const heroBg = isDark ? "#0D0D0D" : "#F8FAF8";
  const sectionAlt = isDark ? "#111111" : "#F3F4F6";
  const primaryText = isDark ? "#FFFFFF" : "#1A1A1A";
  const mutedText = isDark ? "#9CA3AF" : "#6B7280";
  const parseBenefits = (text: string) => (text || "").split("\n").filter((l: string) => l.trim());

  return (
    <div className="min-h-screen" style={{ backgroundColor: pageBg }}>

      {/* HERO */}
      <section className="relative py-20 px-4 overflow-hidden" style={{ backgroundColor: heroBg }}>
        {s.hero_image_url && (
          <>
            <div className="absolute inset-0"><img src={s.hero_image_url} alt="Hero" className="w-full h-full object-cover absolute inset-0" /></div>
            <div className="absolute inset-0" style={{ background: isDark ? "rgba(0,0,0,0.78)" : "rgba(0,0,0,0.5)" }} />
          </>
        )}
        {!s.hero_image_url && isDark && (
          <>
            <div className="absolute top-0 left-0 w-96 h-96 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #F97316, transparent)", transform: "translate(-50%,-50%)" }} />
            <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #4A7C59, transparent)", transform: "translate(50%,50%)" }} />
          </>
        )}
        <div className="relative max-w-5xl mx-auto">
          <div className="text-center max-w-4xl mx-auto mb-10">
            <div className="inline-block px-4 py-1.5 rounded-full text-xs font-bold mb-6 tracking-widest uppercase" style={{ backgroundColor: "var(--color-accent)", color: "#FFFFFF" }}>
              ⚡ {s.badge_text || "LIMITED TIME OFFER"}
            </div>
            <h1 className="font-heading text-4xl md:text-6xl font-black mb-8 leading-tight text-white drop-shadow-lg">{s.hero_headline || page.title}</h1>
            {s.hero_video_url && (
              <div className="max-w-3xl mx-auto mb-8">
                <YoutubeEmbed url={s.hero_video_url} className="w-full shadow-2xl rounded-2xl" />
                <p className="text-center text-sm mt-3" style={{ color: "#9CA3AF" }}>▶ Watch — Real testimony from a Nigerian customer</p>
              </div>
            )}
            <p className="text-lg md:text-xl mb-10 leading-relaxed max-w-2xl mx-auto" style={{ color: "#E5E7EB" }}>
              {s.hero_subheadline || "Discover the difference. Get in touch today."}
            </p>
            <CTAButton text={ctaText} onClick={() => setShowPopup(true)} />
            {theme.whatsapp_number && (
              <div className="mt-5">
                <a href={"https://wa.me/" + theme.whatsapp_number.replace(/\D/g, "")} className="text-green-400 hover:text-green-300 text-sm font-medium">
                  💬 Or chat with us on WhatsApp
                </a>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF BAR */}
      {(s.rating || s.customer_count || s.orders_today) && (
        <section className="py-8 px-4" style={{ backgroundColor: "var(--color-accent)" }}>
          <div className="max-w-3xl mx-auto flex flex-wrap justify-center gap-8 text-center">
            {s.rating && <div><div className="text-2xl font-black text-white">⭐ {s.rating}/5</div><div className="text-xs text-orange-100 mt-1 uppercase tracking-wide">Average Rating</div></div>}
            {s.customer_count && <div><div className="text-2xl font-black text-white">{s.customer_count}</div><div className="text-xs text-orange-100 mt-1 uppercase tracking-wide">Happy Customers</div></div>}
            {s.orders_today && <div><div className="text-2xl font-black text-white">{s.orders_today} Today</div><div className="text-xs text-orange-100 mt-1 uppercase tracking-wide">Enquiries</div></div>}
          </div>
        </section>
      )}

      {/* DYNAMIC SECTIONS */}
      {(() => {
        const order = (s.section_order || "products,benefits1,section1,videos1,urgency_mid,section2,benefits2,videos2,section3,benefits3,urgency,faq,urgency_bottom,final_cta")
          .split(",").map((x: string) => x.trim()).filter((x: string) => Boolean(x) && x !== "hero" && x !== "social_proof");

        const sectionMap: Record<string, React.ReactNode> = {
          products: products.length > 0 ? (
            <section key="products" className="py-20 px-6" style={{ backgroundColor: sectionAlt }}>
              <div className="max-w-5xl mx-auto">
                <h2 className="font-heading text-3xl md:text-5xl font-black text-center mb-4 leading-tight" style={{ color: primaryText }}>
                  {s.products_section_title || ("Introducing: " + (products[0]?.name || ""))}
                </h2>
                {s.products_section_subtitle && <p className="text-center mb-12 text-lg" style={{ color: mutedText }}>{s.products_section_subtitle}</p>}
                <div className="flex flex-row gap-4 overflow-x-auto md:overflow-visible items-stretch pb-4" style={{ scrollSnapType: "x mandatory" }}>
                  {[s.product_left_image, products[0]?.image_url, s.product_right_image].map((imgUrl, i) => (
                    <div key={i} className={`flex-shrink-0 rounded-2xl overflow-hidden shadow-2xl ${i === 1 ? "w-[70vw] md:flex-[2]" : "w-[45vw] md:flex-1"}`} style={{ minHeight: i === 1 ? "400px" : "260px", scrollSnapAlign: "start" }}>
                      {imgUrl ? (
                        <div className="w-full h-full" style={{ minHeight: i === 1 ? "400px" : "260px" }}>
                          <img src={imgUrl} alt="Product" className="w-full h-full object-cover" style={{ minHeight: i === 1 ? "400px" : "260px" }} />
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-600 text-sm" style={{ minHeight: i === 1 ? "400px" : "260px", background: isDark ? "#1A1A1A" : "#E5E7EB" }}>
                          {i === 1 ? "Product image" : "Side image"}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="text-center mt-12"><CTAButton text={ctaText} onClick={() => setShowPopup(true)} /></div>
              </div>
            </section>
          ) : null,

          benefits1: parseBenefits(s.benefits1_items).length > 0 ? (
            <BenefitsSection key="benefits1" heading={s.benefits1_heading} items={parseBenefits(s.benefits1_items)}
              bg={isDark ? "#111111" : "#F8FAF8"} fg={primaryText} checkColor="#4A7C59"
              onClick={() => setShowPopup(true)} ctaText={ctaText} />
          ) : null,

          benefits2: parseBenefits(s.benefits2_items).length > 0 ? (
            <BenefitsSection key="benefits2" heading={s.benefits2_heading} items={parseBenefits(s.benefits2_items)}
              bg={isDark ? "#0A0A0A" : "#1A1A1A"} fg="#FFFFFF" checkColor="var(--color-accent)"
              onClick={() => setShowPopup(true)} ctaText={ctaText} />
          ) : null,

          benefits3: parseBenefits(s.benefits3_items).length > 0 ? (
            <BenefitsSection key="benefits3" heading={s.benefits3_heading} items={parseBenefits(s.benefits3_items)}
              bg={isDark ? "#111111" : "#FFF7ED"} fg={primaryText} checkColor="var(--color-accent)"
              onClick={() => setShowPopup(true)} ctaText={ctaText} />
          ) : null,

          section1: (s.section1_image_url || s.section1_heading) ? (
            <div key="section1"><PictureTextSection imageUrl={s.section1_image_url} heading={s.section1_heading} body={s.section1_body} imageLeft={true} dark={isDark} /></div>
          ) : null,

          section2: (s.section2_image_url || s.section2_heading) ? (
            <div key="section2"><PictureTextSection imageUrl={s.section2_image_url} heading={s.section2_heading} body={s.section2_body} imageLeft={false} dark={isDark} /></div>
          ) : null,

          section3: (s.section3_image_url || s.section3_heading) ? (
            <div key="section3"><PictureTextSection imageUrl={s.section3_image_url} heading={s.section3_heading} body={s.section3_body} imageLeft={true} dark={isDark} /></div>
          ) : null,

          videos1: (s.video1_url || s.video2_url || s.video3_url || s.video4_url) ? (
            <section key="videos1" className="py-20 px-4" style={{ backgroundColor: sectionAlt }}>
              <div className="max-w-5xl mx-auto">
                <h2 className="font-heading text-3xl md:text-4xl font-black text-center mb-3 leading-tight" style={{ color: primaryText }}>
                  {s.testimonials1_title || "What Nigerians Are Saying About This Product"}
                </h2>
                {s.testimonials1_subtitle && <p className="text-center mb-10" style={{ color: mutedText }}>{s.testimonials1_subtitle}</p>}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                  {[s.video1_url, s.video2_url, s.video3_url, s.video4_url].filter(Boolean).map((url, i) => (
                    <div key={i} className="rounded-2xl overflow-hidden shadow-lg" style={{ background: isDark ? "#1A1A1A" : "#FFFFFF" }}>
                      <YoutubeEmbed url={url || ""} className="w-full" />
                      {s["video" + (i + 1) + "_caption"] && (
                        <div className="p-4">
                          <p className="text-sm font-semibold" style={{ color: primaryText }}>{s["video" + (i + 1) + "_caption"]}</p>
                          {s["video" + (i + 1) + "_location"] && <p className="text-xs mt-1" style={{ color: mutedText }}>{s["video" + (i + 1) + "_location"]}</p>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="text-center"><CTAButton text={ctaText2} onClick={() => setShowPopup(true)} /></div>
              </div>
            </section>
          ) : null,

          videos2: (s.video5_url || s.video6_url) ? (
            <section key="videos2" className="py-20 px-4" style={{ backgroundColor: pageBg }}>
              <div className="max-w-4xl mx-auto">
                <h2 className="font-heading text-3xl font-black text-center mb-3" style={{ color: primaryText }}>{s.testimonials2_title || "More Success Stories"}</h2>
                {s.testimonials2_subtitle && <p className="text-center mb-10" style={{ color: mutedText }}>{s.testimonials2_subtitle}</p>}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[s.video5_url, s.video6_url].filter(Boolean).map((url, i) => (
                    <div key={i} className="rounded-2xl overflow-hidden shadow-lg" style={{ background: isDark ? "#1A1A1A" : "#FFFFFF" }}>
                      <YoutubeEmbed url={url || ""} className="w-full" />
                      {s["video" + (i + 5) + "_caption"] && <div className="p-4"><p className="text-sm font-semibold" style={{ color: primaryText }}>{s["video" + (i + 5) + "_caption"]}</p></div>}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          ) : null,

          urgency: s.countdown_end ? <UrgencySection key="urgency" label={s.urgency_label} endDate={s.countdown_end} stockCount={s.stock_count} bg="#0D0D0D" fg="var(--color-accent)" /> : null,
          urgency_mid: s.countdown_end ? <UrgencySection key="urgency_mid" label={s.urgency_mid_label || "Don't Miss Out — Offer Ends In:"} endDate={s.countdown_end} bg={isDark ? "#1A1A1A" : "#111827"} fg="var(--color-accent)" /> : null,
          urgency_bottom: s.countdown_end ? <UrgencySection key="urgency_bottom" label={s.urgency_bottom_label || "Last Chance — This Offer Expires In:"} endDate={s.countdown_end} stockCount={s.stock_count} bg="var(--color-accent)" fg="#FFFFFF" /> : null,

          faq: <LandingFAQ key="faq" items={s.faq} title={s.faq_title} />,

          final_cta: (
            <section key="final_cta" className="py-24 px-4 text-center relative overflow-hidden" style={{ backgroundColor: isDark ? "#0A0A0A" : "#1A1A1A" }}>
              <div className="absolute inset-0 opacity-5" style={{ background: "radial-gradient(circle at 50% 0%, #F97316, transparent 70%)" }} />
              <div className="relative max-w-2xl mx-auto">
                <h2 className="font-heading text-3xl md:text-5xl font-black text-white mb-4 leading-tight">{s.final_cta_headline || "Ready to Transform Your Health?"}</h2>
                <p className="text-gray-400 mb-10 text-lg">{s.final_cta_subtitle || "Fill in your details and our team will contact you right away."}</p>
                <CTAButton text={ctaText3} onClick={() => setShowPopup(true)} />
                {theme.whatsapp_number && (
                  <p className="mt-6 text-gray-500 text-sm">Prefer WhatsApp?{" "}
                    <a href={"https://wa.me/" + theme.whatsapp_number.replace(/\D/g, "")} className="text-green-400 hover:text-green-300 font-semibold">Chat with us here →</a>
                  </p>
                )}
              </div>
            </section>
          ),
        };

        return order.map((k: string) => sectionMap[k] || null);
      })()}

      <LandingFooter store={store} />
      {showPopup && <LeadPopup onClose={() => setShowPopup(false)} slug={slug} ctaText={ctaText} productPrice={productPrice} dark={isDark} />}
    </div>
  );
}
