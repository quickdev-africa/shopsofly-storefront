"use client";
import React, { useState } from "react";
import Image from "next/image";
import { sendLandingPageLead } from "@/lib/api";
import CountdownTimer from "./CountdownTimer";
import LandingFAQ from "./LandingFAQ";

function LeadPopup({ onClose, slug, ctaText }: { onClose: () => void; slug: string; ctaText: string }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", notes: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    if (!form.name || !form.phone) { setError("Please enter your name and phone number."); return; }
    setLoading(true); setError("");
    try {
      await sendLandingPageLead({ ...form, slug });
      setSuccess(true);
    } catch { setError("Something went wrong. Please try again."); }
    finally { setLoading(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ backgroundColor: "rgba(0,0,0,0.7)" }}>
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
        {success ? (
          <div className="text-center py-6">
            <div className="text-5xl mb-4">🎉</div>
            <h3 className="font-heading text-2xl font-bold text-[#1A1A1A] mb-2">Thank You!</h3>
            <p className="text-gray-500 mb-6">We have received your details and will be in touch very soon.</p>
            <button onClick={onClose} className="bg-[#4A7C59] text-white px-6 py-3 rounded-xl font-semibold w-full">Close</button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-xl font-bold text-[#1A1A1A]">{ctaText || "Get More Details"}</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl leading-none">&times;</button>
            </div>
            <p className="text-gray-500 text-sm mb-5">Fill in your details and we will contact you shortly.</p>
            <div className="space-y-3">
              <input type="text" placeholder="Full Name *" value={form.name}
                onChange={(e) => setForm(s => ({ ...s, name: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#4A7C59]" />
              <input type="tel" placeholder="Phone Number *" value={form.phone}
                onChange={(e) => setForm(s => ({ ...s, phone: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#4A7C59]" />
              <input type="email" placeholder="Email Address" value={form.email}
                onChange={(e) => setForm(s => ({ ...s, email: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#4A7C59]" />
              <textarea placeholder="Any specific questions? (optional)" value={form.notes}
                onChange={(e) => setForm(s => ({ ...s, notes: e.target.value }))}
                rows={3} className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#4A7C59] resize-none" />
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <button onClick={handleSubmit} disabled={loading}
              className="mt-4 w-full bg-[#F97316] hover:bg-orange-600 text-white font-bold py-4 rounded-xl text-base transition-colors disabled:opacity-60">
              {loading ? "Sending..." : "Send My Details →"}
            </button>
            <p className="text-xs text-gray-400 text-center mt-3">🔒 Your details are safe with us. No spam.</p>
          </>
        )}
      </div>
    </div>
  );
}

function CTAButton({ text, onClick }: { text: string; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className="inline-block bg-[#F97316] hover:bg-orange-600 text-white font-bold px-10 py-4 rounded-xl text-lg transition-all shadow-lg hover:shadow-xl">
      {text || "Get More Details"} →
    </button>
  );
}

function YoutubeEmbed({ url, className = "" }: { url: string; className?: string }) {
  const match = url ? url.match(/youtube\.com\/watch\?v=([^&]+)|youtu\.be\/([^?]+)|youtube\.com\/shorts\/([^?&]+)|youtube\.com\/embed\/([^?]+)/) : null;
  const id = match ? (match[1] || match[2] || match[3] || match[4] || "") : "";
  if (!id) return (
    <div className={"bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 text-sm aspect-video " + className}>
      Video coming soon
    </div>
  );
  return (
    <div className={"relative rounded-2xl overflow-hidden bg-black " + className}>
      <div className="aspect-video">
        <iframe src={"https://www.youtube.com/embed/" + id + "?autoplay=1&mute=1&loop=1&playlist=" + id}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen />
      </div>
    </div>
  );
}

function PictureTextSection({ imageUrl, heading, body, imageLeft }: {
  imageUrl?: string; heading?: string; body?: string; imageLeft: boolean;
}) {
  const imgBlock = (
    <div className="w-full md:w-1/2">
      {imageUrl ? (
        <div className="relative rounded-2xl overflow-hidden shadow-lg" style={{ minHeight: "300px" }}>
          <Image src={imageUrl} alt={heading || "Section"} fill className="object-cover" />
        </div>
      ) : (
        <div className="bg-gray-100 rounded-2xl h-72 flex items-center justify-center text-gray-300 text-sm">Image coming soon</div>
      )}
    </div>
  );
  const textBlock = (
    <div className="w-full md:w-1/2 flex flex-col justify-center space-y-5">
      {heading && <h2 className="font-heading text-3xl md:text-4xl font-black text-[#1A1A1A] leading-tight mb-2">{heading}</h2>}
      {body && <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">{body}</p>}
    </div>
  );
  return (
    <section className="py-16 px-4">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-10 items-center">
        {imageLeft ? <>{imgBlock}{textBlock}</> : <>{textBlock}{imgBlock}</>}
      </div>
    </section>
  );
}

// NEW: Benefit/Checklist Section — "Imagine..." style
function BenefitsSection({ heading, items, bgColor = "white", textColor = "#1A1A1A", checkColor = "#4A7C59", onClick, ctaText }: {
  heading?: string;
  items: string[];
  bgColor?: string;
  textColor?: string;
  checkColor?: string;
  onClick: () => void;
  ctaText: string;
}) {
  if (!heading && items.length === 0) return null;
  return (
    <section className="py-16 px-4" style={{ backgroundColor: bgColor }}>
      <div className="max-w-3xl mx-auto">
        {heading && (
          <h2 className="font-heading text-3xl md:text-4xl font-black mb-10 text-center leading-tight" style={{ color: textColor }}>
            {heading}
          </h2>
        )}
        <div className="space-y-4 mb-10">
          {items.map((item, i) => (
            item.trim() ? (
              <div key={i} className="flex items-start gap-4">
                <div className="flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center mt-0.5"
                  style={{ borderColor: checkColor, backgroundColor: checkColor + "20" }}>
                  <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                    <path d="M1 5l3.5 3.5L11 1" stroke={checkColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className="text-lg leading-relaxed" style={{ color: textColor === "#FFFFFF" ? "#E5E7EB" : "#374151" }}>{item.trim()}</p>
              </div>
            ) : null
          ))}
        </div>
        <div className="text-center">
          <CTAButton text={ctaText} onClick={onClick} />
        </div>
      </div>
    </section>
  );
}

// NEW: Inline Countdown Timer Section
function UrgencySection({ label, endDate, stockCount, bgColor, textColor }: {
  label?: string; endDate?: string; stockCount?: string; bgColor?: string; textColor?: string;
}) {
  if (!endDate) return null;
  return (
    <section className="py-12 px-4 text-center" style={{ backgroundColor: bgColor || "#FEF2F2" }}>
      <h2 className="font-heading text-2xl font-bold mb-4" style={{ color: textColor || "#DC2626" }}>
        ⚡ {label || "Limited Time Offer Ends In:"}
      </h2>
      <CountdownTimer endDate={endDate} />
      {stockCount && (
        <p className="mt-4 text-sm font-semibold" style={{ color: textColor || "#DC2626" }}>
          🔥 Only {stockCount} spots remaining!
        </p>
      )}
    </section>
  );
}

export default function ProductSpotlightTemplate({ page, store }: { page: any; store: any }) {
  const s = page.settings || {};
  const products = page.products || [];
  const theme = store?.theme_settings || {};
  const [showPopup, setShowPopup] = useState(false);
  const ctaText = s.cta_text || "Get More Details";
  const slug = page.slug || "";

  // Parse benefit items from textarea (one per line)
  const parseBenefits = (text: string) => (text || "").split("\n").filter((l: string) => l.trim());

  return (
    <div className="min-h-screen bg-white">

      {/* HERO */}
      <section className="bg-[#1A1A1A] text-white py-16 px-4">
        <div className="max-w-5xl mx-auto">
          {s.hero_video_url ? (
            <YoutubeEmbed url={s.hero_video_url} className="w-full max-w-3xl mx-auto mb-10" />
          ) : s.hero_image_url ? (
            <div className="relative w-full max-w-3xl mx-auto rounded-2xl overflow-hidden mb-10 shadow-2xl" style={{ minHeight: "300px" }}>
              <Image src={s.hero_image_url} alt={s.hero_headline || "Hero"} fill className="object-cover" />
            </div>
          ) : null}
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="font-heading text-4xl md:text-6xl font-bold mb-4 leading-tight">
              {s.hero_headline || page.title}
            </h1>
            <p className="text-gray-300 text-lg md:text-xl mb-8 leading-relaxed">
              {s.hero_subheadline || "Discover the difference. Get in touch today."}
            </p>
            <CTAButton text={ctaText} onClick={() => setShowPopup(true)} />
            {theme.whatsapp_number && (
              <div className="mt-4">
                <a href={"https://wa.me/" + theme.whatsapp_number.replace(/\D/g, "")}
                  className="text-green-400 hover:text-green-300 text-sm font-medium">
                  💬 Or chat on WhatsApp
                </a>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF BAR */}
      {(s.rating || s.customer_count || s.orders_today) && (
        <section className="bg-[#4A7C59] text-white py-6 px-4">
          <div className="max-w-3xl mx-auto flex flex-wrap justify-center gap-8 text-center">
            {s.rating && (
              <div>
                <div className="text-2xl font-bold">⭐ {s.rating}</div>
                <div className="text-xs text-green-200 mt-1">Average Rating</div>
              </div>
            )}
            {s.customer_count && (
              <div>
                <div className="text-2xl font-bold">{s.customer_count}</div>
                <div className="text-xs text-green-200 mt-1">Happy Customers</div>
              </div>
            )}
            {s.orders_today && (
              <div>
                <div className="text-2xl font-bold">{s.orders_today}</div>
                <div className="text-xs text-green-200 mt-1">Enquiries Today</div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* DYNAMIC SECTION ORDERING */}
      {(() => {
        const order = (s.section_order || "products,benefits1,section1,videos1,urgency_mid,section2,benefits2,videos2,section3,benefits3,urgency,faq,final_cta,urgency_bottom")
          .split(",").map((x: string) => x.trim()).filter((x: string) => Boolean(x) && x !== "hero");

        const sectionMap: Record<string, React.ReactNode> = {

          products: products.length > 0 ? (
            <section key="products" className="py-16 px-6 bg-white">
              <div className="max-w-5xl mx-auto">
                <h2 className="font-heading text-3xl md:text-5xl font-black text-center text-[#1A1A1A] mb-12 leading-tight">
                  {s.products_section_title || ("Discover " + (products[0]?.name || ""))}
                </h2>
                <div className="flex flex-row gap-4 overflow-x-auto md:overflow-visible items-stretch pb-4 md:pb-0" style={{ scrollSnapType: "x mandatory" }}>
                  <div className="flex-shrink-0 w-[45vw] md:w-0 md:flex-1" style={{ scrollSnapAlign: "start" }}>
                    {s.product_left_image ? (
                      <div className="relative h-full rounded-2xl overflow-hidden shadow-lg" style={{ minHeight: "260px" }}>
                        <Image src={s.product_left_image} alt="Product view" fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="h-full rounded-2xl bg-gray-100 flex items-center justify-center text-gray-300 text-sm" style={{ minHeight: "260px" }}>Side image</div>
                    )}
                  </div>
                  <div className="flex-shrink-0 w-[70vw] md:w-0 md:flex-[2]" style={{ scrollSnapAlign: "start" }}>
                    {products[0]?.image_url ? (
                      <div className="relative rounded-2xl overflow-hidden shadow-2xl" style={{ minHeight: "380px" }}>
                        <Image src={products[0].image_url} alt={products[0].name} fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="rounded-2xl bg-gray-200 flex items-center justify-center text-gray-400" style={{ minHeight: "380px" }}>Product image</div>
                    )}
                  </div>
                  <div className="flex-shrink-0 w-[45vw] md:w-0 md:flex-1" style={{ scrollSnapAlign: "start" }}>
                    {s.product_right_image ? (
                      <div className="relative h-full rounded-2xl overflow-hidden shadow-lg" style={{ minHeight: "260px" }}>
                        <Image src={s.product_right_image} alt="Product detail" fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="h-full rounded-2xl bg-gray-100 flex items-center justify-center text-gray-300 text-sm" style={{ minHeight: "260px" }}>Side image</div>
                    )}
                  </div>
                </div>
                {s.products_section_subtitle && (
                  <p className="text-center text-gray-500 mt-6 text-lg">{s.products_section_subtitle}</p>
                )}
                <div className="text-center mt-10">
                  <CTAButton text={ctaText} onClick={() => setShowPopup(true)} />
                </div>
              </div>
            </section>
          ) : null,

          // BENEFIT SECTIONS — "Imagine..." style
          benefits1: parseBenefits(s.benefits1_items).length > 0 ? (
            <BenefitsSection key="benefits1"
              heading={s.benefits1_heading}
              items={parseBenefits(s.benefits1_items)}
              bgColor="#F8FAF8"
              checkColor="#4A7C59"
              onClick={() => setShowPopup(true)}
              ctaText={ctaText}
            />
          ) : null,

          benefits2: parseBenefits(s.benefits2_items).length > 0 ? (
            <BenefitsSection key="benefits2"
              heading={s.benefits2_heading}
              items={parseBenefits(s.benefits2_items)}
              bgColor="#1A1A1A"
              textColor="#FFFFFF"
              checkColor="#F97316"
              onClick={() => setShowPopup(true)}
              ctaText={ctaText}
            />
          ) : null,

          benefits3: parseBenefits(s.benefits3_items).length > 0 ? (
            <BenefitsSection key="benefits3"
              heading={s.benefits3_heading}
              items={parseBenefits(s.benefits3_items)}
              bgColor="#FFF7ED"
              checkColor="#F97316"
              onClick={() => setShowPopup(true)}
              ctaText={ctaText}
            />
          ) : null,

          section1: (s.section1_image_url || s.section1_heading) ? (
            <div key="section1">
              <PictureTextSection imageUrl={s.section1_image_url} heading={s.section1_heading}
                body={s.section1_body} imageLeft={true} />
            </div>
          ) : null,

          section2: (s.section2_image_url || s.section2_heading) ? (
            <div key="section2" className="bg-gray-50">
              <PictureTextSection imageUrl={s.section2_image_url} heading={s.section2_heading}
                body={s.section2_body} imageLeft={false} />
            </div>
          ) : null,

          section3: (s.section3_image_url || s.section3_heading) ? (
            <div key="section3">
              <PictureTextSection imageUrl={s.section3_image_url} heading={s.section3_heading}
                body={s.section3_body} imageLeft={true} />
            </div>
          ) : null,

          videos1: (s.video1_url || s.video2_url || s.video3_url || s.video4_url) ? (
            <section key="videos1" className="py-16 px-4 bg-gray-50">
              <div className="max-w-5xl mx-auto">
                <h2 className="font-heading text-3xl font-bold text-center text-[#1A1A1A] mb-3">
                  {s.testimonials1_title || "What Our Customers Are Saying"}
                </h2>
                {s.testimonials1_subtitle && <p className="text-gray-500 text-center mb-10">{s.testimonials1_subtitle}</p>}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                  {[s.video1_url, s.video2_url, s.video3_url, s.video4_url].map((url, i) => (
                    <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm">
                      <YoutubeEmbed url={url || ""} className="w-full" />
                      {s["video" + (i + 1) + "_caption"] && (
                        <div className="p-4">
                          <p className="text-sm font-semibold text-[#1A1A1A]">{s["video" + (i + 1) + "_caption"]}</p>
                          {s["video" + (i + 1) + "_location"] && <p className="text-xs text-gray-400">{s["video" + (i + 1) + "_location"]}</p>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="text-center"><CTAButton text={ctaText} onClick={() => setShowPopup(true)} /></div>
              </div>
            </section>
          ) : null,

          videos2: (s.video5_url || s.video6_url) ? (
            <section key="videos2" className="py-16 px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="font-heading text-3xl font-bold text-center text-[#1A1A1A] mb-3">
                  {s.testimonials2_title || "More Success Stories"}
                </h2>
                {s.testimonials2_subtitle && <p className="text-gray-500 text-center mb-10">{s.testimonials2_subtitle}</p>}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[s.video5_url, s.video6_url].map((url, i) => (
                    <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                      <YoutubeEmbed url={url || ""} className="w-full" />
                      {s["video" + (i + 5) + "_caption"] && (
                        <div className="p-4">
                          <p className="text-sm font-semibold text-[#1A1A1A]">{s["video" + (i + 5) + "_caption"]}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          ) : null,

          // URGENCY TIMERS — top, mid, bottom
          urgency: s.countdown_end ? (
            <UrgencySection key="urgency"
              label={s.urgency_label}
              endDate={s.countdown_end}
              stockCount={s.stock_count}
              bgColor="#FEF2F2"
              textColor="#DC2626"
            />
          ) : null,

          urgency_mid: s.countdown_end ? (
            <UrgencySection key="urgency_mid"
              label={s.urgency_mid_label || "Don't Miss Out — Offer Ends In:"}
              endDate={s.countdown_end}
              stockCount={undefined}
              bgColor="#1A1A1A"
              textColor="#F97316"
            />
          ) : null,

          urgency_bottom: s.countdown_end ? (
            <UrgencySection key="urgency_bottom"
              label={s.urgency_bottom_label || "Last Chance — This Offer Expires In:"}
              endDate={s.countdown_end}
              stockCount={s.stock_count}
              bgColor="#4A7C59"
              textColor="#FFFFFF"
            />
          ) : null,

          faq: <LandingFAQ key="faq" items={s.faq} title={s.faq_title} />,

          final_cta: (
            <section key="final_cta" className="py-20 px-4 bg-[#1A1A1A] text-white text-center">
              <div className="max-w-2xl mx-auto">
                <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
                  {s.final_cta_headline || "Ready to Get Started?"}
                </h2>
                <p className="text-gray-300 mb-8 text-lg">{s.final_cta_subtitle || "Fill in your details and we will contact you right away."}</p>
                <CTAButton text={ctaText} onClick={() => setShowPopup(true)} />
                {theme.whatsapp_number && (
                  <p className="mt-4 text-gray-400 text-sm">
                    Or WhatsApp us:{" "}
                    <a href={"https://wa.me/" + theme.whatsapp_number.replace(/\D/g, "")} className="text-green-400 hover:text-green-300 font-semibold">
                      {theme.whatsapp_number}
                    </a>
                  </p>
                )}
              </div>
            </section>
          ),
        };

        return order.filter((k: string) => k !== "hero").map((k: string) => sectionMap[k] || null);
      })()}

      {/* FOOTER */}
      <footer className="border-t border-gray-200 py-6 px-4 text-center text-xs text-gray-400">
        <div className="flex justify-center gap-6 flex-wrap mb-2">
          <a href="/pages/returns-policy" className="hover:underline">Returns Policy</a>
          <a href="/pages/privacy-policy" className="hover:underline">Privacy Policy</a>
          <a href="/pages/delivery-policy" className="hover:underline">Delivery Policy</a>
        </div>
        <p>{store?.name} — Secured by Paystack 🔒</p>
      </footer>

      {showPopup && <LeadPopup onClose={() => setShowPopup(false)} slug={slug} ctaText={ctaText} />}
    </div>
  );
}
