export const revalidate = 60;
import { getStore } from "@/lib/api";
import Link from "next/link";
import { headers } from "next/headers";

const FAQS = [
  {
    q: "How long does delivery take?",
    a: "Delivery times vary by location. Lagos orders arrive in 1–2 business days. Other states take 3–7 business days depending on your zone. See our Delivery Policy for full details."
  },
  {
    q: "How do I track my order?",
    a: "Once your order is dispatched, you will receive a tracking number via WhatsApp or email. You can also use our order tracking page to check your order status at any time."
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept Paystack (card, bank transfer, USSD, mobile money), direct bank transfer, and cash on delivery for eligible orders."
  },
  {
    q: "Can I return a product?",
    a: "Yes. We accept returns within 30 days of delivery for unused items in original packaging. Please see our Returns Policy for full conditions and how to initiate a return."
  },
  {
    q: "Are your products genuine?",
    a: "Absolutely. We only stock 100% genuine products sourced directly from trusted manufacturers and authorised distributors. We do not sell counterfeits."
  },
  {
    q: "How do I cancel an order?",
    a: "You can cancel an order before it is dispatched by contacting us via WhatsApp or our contact form. Once dispatched, the order cannot be cancelled but you can initiate a return after delivery."
  },
  {
    q: "Do you offer cash on delivery?",
    a: "Yes, cash on delivery is available for eligible orders and locations. Select COD at checkout to see if it is available for your area."
  },
  {
    q: "How do I contact customer support?",
    a: "You can reach us via WhatsApp (click the button at the bottom right of any page) or through our contact form. We respond within 24 hours on business days."
  },
  {
    q: "Can I change my delivery address after ordering?",
    a: "Address changes are possible if the order has not yet been dispatched. Contact us immediately via WhatsApp with your order number and new address."
  },
  {
    q: "Do you deliver outside Nigeria?",
    a: "Currently we only deliver within Nigeria. International shipping is not available at this time."
  },
];

export default async function FAQPage() {
  const headersList = headers();
  const host = headersList.get("host") || "";
  const xSubdomain = headersList.get("x-subdomain") || "";
  const parts = host.split(".");
  const subdomain = xSubdomain || (
    parts.length >= 3 && !host.includes("vercel.app") && !host.includes("localhost")
      ? parts[0]
      : (process.env.NEXT_PUBLIC_STORE_SUBDOMAIN || "laserstarglobal")
  );

  let store: any = null;
  try { const res = await getStore(subdomain); store = res.data.store; } catch {}

  return (
    <main className="max-w-4xl mx-auto px-4 py-16">
      <nav className="text-sm text-[#555555] mb-8 flex gap-2">
        <Link href="/" className="hover:text-[#4A7C59]">Home</Link>
        <span>/</span>
        <span className="text-[#1A1A1A] font-medium">FAQ</span>
      </nav>

      <h1 className="font-heading text-4xl font-bold text-[#1A1A1A] mb-3">Frequently Asked Questions</h1>
      <p className="text-[#555555] mb-12">Everything you need to know. Can&apos;t find the answer? <Link href="/contact" className="text-[#4A7C59] hover:underline">Contact us</Link>.</p>

      <div className="space-y-4">
        {FAQS.map((faq, i) => (
          <details key={i} className="border border-gray-200 rounded-xl overflow-hidden group">
            <summary className="flex items-center justify-between p-5 cursor-pointer font-semibold text-[#1A1A1A] hover:bg-[#F8FAF8] transition-colors list-none">
              <span>{faq.q}</span>
              <span className="text-[#4A7C59] text-xl font-bold ml-4 flex-shrink-0 group-open:rotate-45 transition-transform">+</span>
            </summary>
            <div className="px-5 pb-5 text-[#555555] leading-relaxed border-t border-gray-100 pt-4">
              {faq.a}
            </div>
          </details>
        ))}
      </div>

      <div className="mt-16 bg-[#F8FAF8] rounded-2xl p-8 text-center">
        <h2 className="font-heading text-2xl font-bold text-[#1A1A1A] mb-3">Still have questions?</h2>
        <p className="text-[#555555] mb-6">Our team is happy to help. Reach out and we will get back to you within 24 hours.</p>
        <Link href="/contact"
          className="bg-[#F97316] hover:bg-orange-600 text-white font-bold px-8 py-3 rounded-xl transition-colors inline-block">
          Contact Us
        </Link>
      </div>
    </main>
  );
}
