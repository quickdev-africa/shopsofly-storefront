"use client";
import { useState } from "react";
interface FAQItem { question: string; answer: string; }
export default function LandingFAQ({ items, title }: { items?: FAQItem[]; title?: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const defaultFAQs: FAQItem[] = [
    { question: "Is this product genuine?", answer: "Yes, 100% genuine. We source directly from verified manufacturers." },
    { question: "How long does delivery take?", answer: "Lagos: 1-2 business days. Other states: 3-5 business days." },
    { question: "Can I return if not satisfied?", answer: "Yes, we offer 30-day returns. Contact us on WhatsApp to initiate." },
    { question: "Is payment secure?", answer: "Yes, we use Paystack — Nigeria's most trusted payment gateway." },
    { question: "Do you offer Cash on Delivery?", answer: "Yes, COD is available in selected areas. Select at checkout." },
    { question: "How do I track my order?", answer: "You will receive a tracking link via SMS and email after dispatch." },
  ];
  const faqs = items && items.length > 0 ? items : defaultFAQs;
  return (
    <section className="py-16 px-4 max-w-3xl mx-auto">
      <h2 className="font-heading text-3xl font-bold text-center text-[#1A1A1A] mb-8">
        {title || "Frequently Asked Questions"}
      </h2>
      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between px-5 py-4 text-left bg-white hover:bg-gray-50 transition-colors"
            >
              <span className="font-medium text-[#1A1A1A] text-sm">{faq.question}</span>
              <span className="text-gray-400 text-lg ml-4">{open === i ? "−" : "+"}</span>
            </button>
            {open === i && (
              <div className="px-5 pb-4 bg-white">
                <p className="text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
