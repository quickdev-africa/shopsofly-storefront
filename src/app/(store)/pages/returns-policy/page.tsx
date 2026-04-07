export const revalidate = 0;
import { fetchStore } from "@/lib/fetch-store";
import Link from "next/link";

export default async function ReturnsPolicyPage() {
  const store = await fetchStore();
  const storeName = store?.name || "Our Store";

  return (
    <main className="max-w-4xl mx-auto px-4 py-16">
      <nav className="text-sm text-[#555555] mb-8 flex gap-2">
        <Link href="/" className="hover:text-[#4A7C59]">Home</Link>
        <span>/</span>
        <span className="text-[#1A1A1A] font-medium">Returns & Refunds</span>
      </nav>
      <h1 className="font-heading text-4xl font-bold text-[#1A1A1A] mb-2">Returns & Refund Policy</h1>
      <p className="text-[#555555] mb-10">Last updated: January 2026</p>
      <div className="space-y-10 text-[#555555]">
        <section>
          <h2 className="font-heading text-xl font-bold text-[#1A1A1A] mb-3">30-Day Return Window</h2>
          <p>{storeName} offers a 30-day return policy. If you are not satisfied with your purchase, you may return it within 30 days of delivery for a refund or exchange, subject to the conditions below.</p>
        </section>
        <section>
          <h2 className="font-heading text-xl font-bold text-[#1A1A1A] mb-3">Conditions for Return</h2>
          <ul className="space-y-2">
            {["Item must be unused and in its original packaging","All tags, labels, and accessories must be intact","Item must not be damaged due to misuse or negligence","Proof of purchase (order number or receipt) must be provided","Perishable items, digital products, and personalised items cannot be returned"].map((item, i) => (
              <li key={i} className="flex items-start gap-3"><span className="text-[#4A7C59] font-bold mt-1">✓</span><span>{item}</span></li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="font-heading text-xl font-bold text-[#1A1A1A] mb-3">How to Return</h2>
          <ol className="space-y-3 list-none">
            {["Contact us via WhatsApp or our contact form within 30 days of delivery","Provide your order number and reason for return","We will send you a return authorisation and instructions","Package the item securely and send it to our address","Once received and inspected, your refund will be processed within 5–7 business days"].map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="bg-[#4A7C59] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </section>
        <section>
          <h2 className="font-heading text-xl font-bold text-[#1A1A1A] mb-3">Refund Methods</h2>
          <p>Refunds are issued to the original payment method. Bank transfer refunds are processed within 5–7 business days. Paystack refunds may take 3–5 business days depending on your bank.</p>
        </section>
        <section>
          <h2 className="font-heading text-xl font-bold text-[#1A1A1A] mb-3">Damaged or Wrong Items</h2>
          <p>If you received a damaged, defective, or incorrect item, please contact us within 48 hours of delivery with photos of the item. We will arrange a replacement or full refund at no cost to you.</p>
        </section>
        <section>
          <h2 className="font-heading text-xl font-bold text-[#1A1A1A] mb-3">Contact Us</h2>
          <p>For any return or refund queries, reach us via <Link href="/contact" className="text-[#4A7C59] hover:underline">our contact form</Link> or WhatsApp. We aim to respond within 24 hours.</p>
        </section>
      </div>
    </main>
  );
}
