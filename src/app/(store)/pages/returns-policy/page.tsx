export const revalidate = 0;
import { fetchStore } from "@/lib/fetch-store";
import Link from "next/link";

export default async function ReturnsPolicyPage() {
  const store = await fetchStore();
  const storeName = store?.name || "Our Store";
  const customContent = store?.theme_settings?.returns_policy;

  return (
    <main className="max-w-4xl mx-auto px-4 py-16">
      <nav className="text-sm text-[#555555] mb-8 flex gap-2">
        <Link href="/" className="hover:text-[#4A7C59]">Home</Link>
        <span>/</span>
        <span className="text-[#1A1A1A] font-medium">Returns & Refunds</span>
      </nav>
      <h1 className="font-heading text-4xl font-bold text-[#1A1A1A] mb-2">Returns & Refund Policy</h1>
      <p className="text-[#555555] mb-10">Last updated: January 2026</p>
      {customContent ? (
        <div className="prose max-w-none text-[#555555] whitespace-pre-line leading-relaxed text-base">
          {customContent.replace(/\[STORE_NAME\]/g, storeName)}
        </div>
      ) : (
        <div className="space-y-10 text-[#555555]">
          <section>
            <h2 className="font-heading text-xl font-bold text-[#1A1A1A] mb-3">30-Day Return Window</h2>
            <p>{storeName} offers a 30-day return policy. If you are not satisfied with your purchase, you may return it within 30 days of delivery for a refund or exchange.</p>
          </section>
          <section>
            <h2 className="font-heading text-xl font-bold text-[#1A1A1A] mb-3">Conditions for Return</h2>
            <ul className="space-y-2">
              {["Item must be unused and in its original packaging","All tags, labels, and accessories must be intact","Proof of purchase must be provided","Perishable items and digital products cannot be returned"].map((item, i) => (
                <li key={i} className="flex items-start gap-3"><span className="text-[#4A7C59] font-bold mt-1">✓</span><span>{item}</span></li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="font-heading text-xl font-bold text-[#1A1A1A] mb-3">Refund Methods</h2>
            <p>Refunds are issued to the original payment method within 5–7 business days.</p>
          </section>
          <section>
            <h2 className="font-heading text-xl font-bold text-[#1A1A1A] mb-3">Contact Us</h2>
            <p>For returns, reach us via <Link href="/contact" className="text-[#4A7C59] hover:underline">our contact form</Link> or WhatsApp.</p>
          </section>
        </div>
      )}
    </main>
  );
}
