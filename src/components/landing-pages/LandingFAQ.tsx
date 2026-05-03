"use client";
import { useState } from "react";
interface FAQItem { question: string; answer: string; }
export default function LandingFAQ({ items, title, dark = true }: { items?: FAQItem[]; title?: string; dark?: boolean }) {
  const [open, setOpen] = useState<number | null>(null);
  const defaultFAQs: FAQItem[] = [
    { question: "Is this product genuine?", answer: "Yes, 100% genuine. We source directly from verified manufacturers." },
    { question: "How long does delivery take?", answer: "Lagos: 1-2 business days. Other states: 3-5 business days." },
    { question: "Can I return if not satisfied?", answer: "Yes, we offer 30-day returns. Contact us on WhatsApp to initiate." },
    { question: "Is payment secure?", answer: "Yes, we use Paystack — Nigeria most trusted payment gateway." },
    { question: "Do you offer Cash on Delivery?", answer: "Yes, COD is available in selected areas. Select at checkout." },
    { question: "How do I track my order?", answer: "You will receive a tracking link via SMS and email after dispatch." },
  ];
  const faqs = items && items.length > 0 ? items : defaultFAQs;
  const bg = dark ? "#0D0D0D" : "#FFFFFF";
  const cardBg = dark ? "#1A1A1A" : "#FFFFFF";
  const cardBorder = dark ? "#2D2D2D" : "#E5E7EB";
  const questionColor = dark ? "#FFFFFF" : "#1A1A1A";
  const answerColor = dark ? "#9CA3AF" : "#6B7280";
  const chevronColor = "var(--color-accent)";
  return (
    <section className="py-20 px-4" style={{ backgroundColor: bg }}>
      <div className="max-w-3xl mx-auto">
        <h2 className="font-heading text-3xl md:text-4xl font-black text-center mb-10" style={{ color: "#FFFFFF" }}>
          {title || "Frequently Asked Questions"}
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="rounded-xl overflow-hidden" style={{ border: `1px solid ${cardBorder}` }}>
              <button onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors"
                style={{ backgroundColor: cardBg }}>
                <span className="font-semibold text-base pr-4" style={{ color: questionColor }}>{faq.question}</span>
                <span className="text-lg ml-4 flex-shrink-0 font-bold" style={{ color: chevronColor }}>{open === i ? "−" : "+"}</span>
              </button>
              {open === i && (
                <div className="px-5 pb-5" style={{ backgroundColor: cardBg }}>
                  <p className="text-base leading-relaxed" style={{ color: answerColor }}>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
