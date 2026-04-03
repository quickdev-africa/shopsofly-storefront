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
    setLoading(true);
    setError("");
    try {
      await sendLandingPageLead({ ...form, slug });
      setSuccess(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
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
            <p className="text-gray-500 text-sm mb-5">Fill in your details and we will contact you shortly with all the information you need.</p>
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
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#4A7C59] resize-none" />
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
  const match = url ? url.match(/youtube\.com\/watch\?v=([^&]+)|youtu\.be\/([^?]+)|youtube\.com\/embed\/([^?]+)/) : null;
  const id = match ? match[1] : "";
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

function PictureTextSection({ imageUrl, heading, body, imageLeft, onCTA, ctaText }: {
  imageUrl?: string; heading?: string; body?: string;
  imageLeft: boolean; onCTA: () => void; ctaText: string;
}) {
  const imgBlock = (
    <div className="w-full md:w-1/2">
      {imageUrl ? (
        <div className="relative rounded-2xl overflow-hidden shadow-lg" style={{ minHeight: "300px" }}>
          <Image src={imageUrl} alt={heading || "Section"} fill className="object-cover" />
        </div>
      ) : (
        <div className="bg-gray-100 rounded-2xl h-72 flex items-center justify-center text-gray-300 text-sm">
          Image coming soon
        </div>
      )}
    </div>
  );
  const textBlock = (
    <div className="w-full md:w-1/2 flex flex-col justify-center space-y-5">
      {heading && <h2 className="font-heading text-2xl md:text-3xl font-bold text-[#1A1A1A] leading-tight">{heading}</h2>}
      {body && <p className="text-gray-600 text-base leading-relaxed whitespace-pre-line">{body}</p>}
      <div><CTAButton text={ctaText} onClick={onCTA} /></div>
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

export default function ProductSpotlightTemplate({ page, store }: { page: any; store: any }) {
  const s = page.settings || {};
  const products = page.products || [];
  const theme = store?.theme_settings || {};
  const [showPopup, setShowPopup] = useState(false);
  const ctaText = s.cta_text || "Get More Details";
  const slug = page.slug || "";

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
      <section className="bg-[#F97316] text-white py-4 px-4">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-6 text-sm font-semibold text-center">
          <span>⭐ {s.rating || "4.9"}/5 Rating</span>
          <span>👥 {s.customer_count || "2,400+"} Happy Customers</span>
          <span>🛒 {s.orders_today || "47"} enquiries today</span>
        </div>
      </section>

      {/* PRODUCTS */}
      {products.length > 0 && (
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-center text-[#1A1A1A] mb-3">
              {s.products_section_title || "Featured Products"}
            </h2>
            <p className="text-gray-500 text-center mb-10">
              {s.products_section_subtitle || "Premium quality products selected just for you"}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product: any) => {
                const price = product.variants?.[0]?.price || product.price || 0;
                const comparePrice = product.variants?.[0]?.compare_at_price || product.compare_at_price;
                return (
                  <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    {product.image_url && (
                      <div className="relative aspect-square">
                        <Image src={product.image_url} alt={product.name} fill className="object-cover" />
                        {comparePrice && comparePrice > price && (
                          <div className="absolute top-3 left-3 bg-[#F97316] text-white text-xs font-bold px-2 py-1 rounded-full">
                            Save ₦{(comparePrice - price).toLocaleString()}
                          </div>
                        )}
                      </div>
                    )}
                    <div className="p-5">
                      <h3 className="font-semibold text-[#1A1A1A] mb-2 text-base leading-tight">{product.name}</h3>
                      <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-2xl font-bold text-[#1A1A1A]">₦{price.toLocaleString()}</span>
                        {comparePrice && comparePrice > price && (
                          <span className="text-gray-400 line-through text-sm">₦{comparePrice.toLocaleString()}</span>
                        )}
                      </div>
                      <button onClick={() => setShowPopup(true)}
                        className="w-full border-2 border-[#F97316] text-[#F97316] hover:bg-[#F97316] hover:text-white font-semibold py-2.5 rounded-xl text-sm transition-colors">
                        {ctaText}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="text-center mt-10">
              <CTAButton text={ctaText} onClick={() => setShowPopup(true)} />
            </div>
          </div>
        </section>
      )}

      {/* PICTURE + TEXT SECTION 1 */}
      {(s.section1_image_url || s.section1_heading) && (
        <PictureTextSection imageUrl={s.section1_image_url} heading={s.section1_heading}
          body={s.section1_body} imageLeft={true} onCTA={() => setShowPopup(true)} ctaText={ctaText} />
      )}

      {/* PICTURE + TEXT SECTION 2 */}
      {(s.section2_image_url || s.section2_heading) && (
        <section className="bg-gray-50">
          <PictureTextSection imageUrl={s.section2_image_url} heading={s.section2_heading}
            body={s.section2_body} imageLeft={false} onCTA={() => setShowPopup(true)} ctaText={ctaText} />
        </section>
      )}

      {/* PICTURE + TEXT SECTION 3 */}
      {(s.section3_image_url || s.section3_heading) && (
        <PictureTextSection imageUrl={s.section3_image_url} heading={s.section3_heading}
          body={s.section3_body} imageLeft={true} onCTA={() => setShowPopup(true)} ctaText={ctaText} />
      )}

      {/* VIDEO TESTIMONIALS BLOCK 1 — 4 videos */}
      {(s.video1_url || s.video2_url || s.video3_url || s.video4_url) && (
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-heading text-3xl font-bold text-center text-[#1A1A1A] mb-3">
              {s.testimonials1_title || "What Our Customers Are Saying"}
            </h2>
            {s.testimonials1_subtitle && (
              <p className="text-gray-500 text-center mb-10">{s.testimonials1_subtitle}</p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              {[s.video1_url, s.video2_url, s.video3_url, s.video4_url].map((url, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm">
                  <YoutubeEmbed url={url || ""} className="w-full" />
                  {s["video" + (i + 1) + "_caption"] && (
                    <div className="p-4">
                      <p className="text-sm font-semibold text-[#1A1A1A]">{s["video" + (i + 1) + "_caption"]}</p>
                      {s["video" + (i + 1) + "_location"] && (
                        <p className="text-xs text-gray-400">{s["video" + (i + 1) + "_location"]}</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="text-center">
              <CTAButton text={ctaText} onClick={() => setShowPopup(true)} />
            </div>
          </div>
        </section>
      )}

      {/* VIDEO TESTIMONIALS BLOCK 2 — 2 videos */}
      {(s.video5_url || s.video6_url) && (
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-heading text-3xl font-bold text-center text-[#1A1A1A] mb-3">
              {s.testimonials2_title || "More Success Stories"}
            </h2>
            {s.testimonials2_subtitle && (
              <p className="text-gray-500 text-center mb-10">{s.testimonials2_subtitle}</p>
            )}
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
      )}

      {/* URGENCY */}
      {s.countdown_end && (
        <section className="py-12 px-4 bg-red-50 text-center">
          <h2 className="font-heading text-2xl font-bold text-red-600 mb-4">⚡ Limited Time Offer Ends In:</h2>
          <CountdownTimer endDate={s.countdown_end} />
          {s.stock_count && (
            <p className="mt-4 text-sm font-semibold text-red-600">🔥 Only {s.stock_count} spots remaining!</p>
          )}
        </section>
      )}

      {/* TRUST BADGES */}
      <section className="py-8 px-4 border-t border-gray-100">
        <div className="max-w-3xl mx-auto flex flex-wrap justify-center gap-6">
          {[
            { icon: "✅", text: "100% Genuine" },
            { icon: "🔒", text: "Secure & Trusted" },
            { icon: "🚚", text: "Fast Delivery" },
            { icon: "💬", text: "24/7 Support" },
            { icon: "🔄", text: "Easy Returns" },
          ].map((b) => (
            <div key={b.text} className="flex items-center gap-2 text-sm text-gray-600 font-medium">
              <span className="text-lg">{b.icon}</span>
              <span>{b.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <LandingFAQ items={s.faq} title={s.faq_title} />

      {/* FINAL CTA */}
      <section className="py-20 px-4 bg-[#1A1A1A] text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            {s.final_cta_headline || "Ready to Get Started?"}
          </h2>
          <p className="text-gray-300 mb-8 text-lg">
            {s.final_cta_subtitle || "Fill in your details and we will contact you right away."}
          </p>
          <CTAButton text={ctaText} onClick={() => setShowPopup(true)} />
          {theme.whatsapp_number && (
            <p className="mt-4 text-gray-400 text-sm">
              Or WhatsApp us:{" "}
              <a href={"https://wa.me/" + theme.whatsapp_number.replace(/\D/g, "")}
                className="text-green-400 hover:text-green-300 font-semibold">
                {theme.whatsapp_number}
              </a>
            </p>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-200 py-6 px-4 text-center text-xs text-gray-400">
        <div className="flex justify-center gap-6 flex-wrap mb-2">
          <a href="/pages/returns-policy" className="hover:underline">Returns Policy</a>
          <a href="/pages/privacy-policy" className="hover:underline">Privacy Policy</a>
          <a href="/pages/delivery-policy" className="hover:underline">Delivery Policy</a>
        </div>
        <p>{store?.name} — Secured by Paystack 🔒</p>
      </footer>

      {/* POPUP */}
      {showPopup && (
        <LeadPopup onClose={() => setShowPopup(false)} slug={slug} ctaText={ctaText} />
      )}
    </div>
  );
}
