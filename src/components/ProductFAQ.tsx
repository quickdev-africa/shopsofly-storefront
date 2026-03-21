"use client";
import { useState } from "react";

interface FAQItem { question: string; answer: string; }

const DEFAULTS: FAQItem[] = [
  { question: "How long does it take to process an order?", answer: "Orders are usually processed within 1–2 business days. You'll receive a confirmation message once your order is fully prepared and ready to ship." },
  { question: "Do you ship internationally?", answer: "Currently we deliver within Nigeria only. We ship to all 36 states and FCT. International shipping is coming soon." },
  { question: "What is your return policy?", answer: "We offer a 30-day hassle-free return policy. If you're not satisfied, contact us and we'll arrange a return or exchange." },
  { question: "What are your sizing options?", answer: "Sizing varies by product. Each product page shows available options. Contact us if you need help choosing the right size." },
  { question: "Can I pay on delivery?", answer: "Yes, Cash on Delivery is available for select locations. You can also pay securely via Paystack, bank transfer, or card." },
];

export default function ProductFAQ({ faqs, whatsappNumber }: { faqs?: FAQItem[]; whatsappNumber?: string }) {
  const [open, setOpen] = useState<number | null>(0);
  const items = faqs?.length ? faqs : DEFAULTS;
  const waLink = whatsappNumber ? `https://wa.me/${whatsappNumber.replace(/\D/g, "")}` : "https://wa.me/";

  return (
    <section className="py-10 border-t border-gray-100">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8">
        {/* Left — help panel */}
        <div className="bg-[#F97316] rounded-2xl p-7 flex flex-col justify-between min-h-[260px]">
          <div>
            <h3 className="text-xl font-bold text-white mb-3 leading-tight">Still need help?</h3>
            <p className="text-sm text-white/80 leading-relaxed mb-6">
              Shoot our team a message and we&apos;ll get back to you ASAP.
            </p>
          </div>
          <a href={waLink} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-[#1A1A1A] font-semibold px-5 py-3 rounded-full text-sm hover:bg-gray-100 transition-colors w-fit">
            Contact us <span>›</span>
          </a>
        </div>

        {/* Right — accordion */}
        <div>
          <h2 className="text-2xl font-bold text-[#1A1A1A] mb-5">Frequently asked questions</h2>
          <div className="space-y-2">
            {items.map((faq, i) => (
              <div key={i} className="border border-gray-200 rounded-2xl overflow-hidden bg-white">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-[#1A1A1A] text-sm pr-4">{faq.question}</span>
                  <div className={`w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-[#555] text-sm flex-shrink-0 transition-transform duration-200 ${open === i ? "rotate-180" : ""}`}>
                    ∨
                  </div>
                </button>
                {open === i && (
                  <div className="px-5 pb-5">
                    <p className="text-sm text-[#555] leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
