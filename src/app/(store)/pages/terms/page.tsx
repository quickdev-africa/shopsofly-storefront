export const revalidate = 0;
import { fetchStore } from "@/lib/fetch-store";
import Link from "next/link";

export default async function TermsPage() {
  const store = await fetchStore();
  const storeName = store?.name || "Our Store";
  const customContent = store?.theme_settings?.terms;

  return (
    <main className="max-w-4xl mx-auto px-4 py-16">
      <nav className="text-sm text-[#555555] mb-8 flex gap-2">
        <Link href="/" className="hover:text-[#4A7C59]">Home</Link>
        <span>/</span>
        <span className="text-[#1A1A1A] font-medium">Terms & Conditions</span>
      </nav>
      <h1 className="font-heading text-4xl font-bold text-[#1A1A1A] mb-2">Terms & Conditions</h1>
      <p className="text-[#555555] mb-10">Last updated: January 2026</p>
      {customContent ? (
        <div className="prose max-w-none text-[#555555] whitespace-pre-line leading-relaxed text-base">
          {customContent.replace(/\[STORE_NAME\]/g, storeName)}
        </div>
      ) : (
        <div className="space-y-10 text-[#555555]">
          <section>
            <h2 className="font-heading text-xl font-bold text-[#1A1A1A] mb-3">1. Acceptance of Terms</h2>
            <p>By accessing or using the {storeName} website and placing orders, you agree to be bound by these Terms & Conditions.</p>
          </section>
          <section>
            <h2 className="font-heading text-xl font-bold text-[#1A1A1A] mb-3">2. Products & Pricing</h2>
            <p>All prices are in Nigerian Naira (₦). {storeName} reserves the right to change prices at any time.</p>
          </section>
          <section>
            <h2 className="font-heading text-xl font-bold text-[#1A1A1A] mb-3">3. Orders & Payment</h2>
            <p>Payment must be made in full before orders are dispatched. We accept Paystack, bank transfer, and cash on delivery.</p>
          </section>
          <section>
            <h2 className="font-heading text-xl font-bold text-[#1A1A1A] mb-3">4. Returns & Refunds</h2>
            <p>Returns accepted within 30 days. See our <Link href="/pages/returns-policy" className="text-[#4A7C59] hover:underline">Returns Policy</Link>.</p>
          </section>
          <section>
            <h2 className="font-heading text-xl font-bold text-[#1A1A1A] mb-3">5. Governing Law</h2>
            <p>These terms are governed by the laws of the Federal Republic of Nigeria.</p>
          </section>
        </div>
      )}
    </main>
  );
}
