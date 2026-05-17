export const revalidate = 0;
import { fetchStore } from "@/lib/fetch-store";
import Link from "next/link";

export default async function PrivacyPolicyPage() {
  const store = await fetchStore();
  const storeName = store?.name || "Our Store";
  const customContent = store?.theme_settings?.privacy_policy;

  return (
    <main className="max-w-4xl mx-auto px-4 py-16">
      <nav className="text-sm text-[#555555] mb-8 flex gap-2">
        <Link href="/" className="hover:text-[#4A7C59]">Home</Link>
        <span>/</span>
        <span className="text-[#1A1A1A] font-medium">Privacy Policy</span>
      </nav>
      <h1 className="font-heading text-4xl font-bold text-[#1A1A1A] mb-2">Privacy Policy</h1>
      <p className="text-[#555555] mb-10">Last updated: January 2026</p>
      {customContent ? (
        <div className="prose max-w-none text-[#555555] whitespace-pre-line leading-relaxed text-base">
          {customContent.replace(/\[STORE_NAME\]/g, storeName)}
        </div>
      ) : (
        <div className="space-y-10 text-[#555555]">
          <section>
            <h2 className="font-heading text-xl font-bold text-[#1A1A1A] mb-3">Introduction</h2>
            <p>{storeName} is committed to protecting your personal information and your right to privacy. This policy explains what information we collect, how we use it, and your rights under the Nigeria Data Protection Regulation (NDPR).</p>
          </section>
          <section>
            <h2 className="font-heading text-xl font-bold text-[#1A1A1A] mb-3">Information We Collect</h2>
            <ul className="space-y-2">
              {["Name, email address, phone number when you create an account or place an order","Delivery address for order fulfilment","Payment information (processed securely by Paystack — we never store card details)","Order history and purchase preferences","Device and browser information for website analytics"].map((item, i) => (
                <li key={i} className="flex items-start gap-3"><span className="text-[#4A7C59] font-bold mt-1">•</span><span>{item}</span></li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="font-heading text-xl font-bold text-[#1A1A1A] mb-3">How We Use Your Information</h2>
            <ul className="space-y-2">
              {["To process and fulfil your orders","To send order confirmations and delivery updates","To respond to your enquiries and provide customer support","To improve our website and product offerings"].map((item, i) => (
                <li key={i} className="flex items-start gap-3"><span className="text-[#4A7C59] font-bold mt-1">•</span><span>{item}</span></li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="font-heading text-xl font-bold text-[#1A1A1A] mb-3">Data Sharing</h2>
            <p>We do not sell your personal data to third parties. We only share your information with trusted service providers necessary to operate our business.</p>
          </section>
          <section>
            <h2 className="font-heading text-xl font-bold text-[#1A1A1A] mb-3">Your Rights</h2>
            <p>Under the NDPR, you have the right to access, correct, or delete your personal data at any time. Contact us at <Link href="/contact" className="text-[#4A7C59] hover:underline">our contact page</Link>.</p>
          </section>
          <section>
            <h2 className="font-heading text-xl font-bold text-[#1A1A1A] mb-3">Contact Us</h2>
            <p>For privacy-related enquiries, contact {storeName} via <Link href="/contact" className="text-[#4A7C59] hover:underline">our contact form</Link>.</p>
          </section>
        </div>
      )}
    </main>
  );
}
