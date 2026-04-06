export const revalidate = 60;
import { getStore } from "@/lib/api";
import Link from "next/link";
import { headers } from "next/headers";

export default async function TermsPage() {
  const headersList = headers();
  const host = headersList.get("host") || "";
  const xSubdomain = headersList.get("x-subdomain") || "";
  const parts = host.split(".");
  const subdomain = xSubdomain || (
    parts.length >= 3 && !host.includes("vercel.app") && !host.includes("localhost")
      ? parts[0]
      : (process.env.NEXT_PUBLIC_STORE_SUBDOMAIN || "")
  );

  let store: any = null;
  try { const res = await getStore(subdomain); store = res.data.store; } catch {}
  const storeName = store?.name || "Our Store";

  return (
    <main className="max-w-4xl mx-auto px-4 py-16">
      <nav className="text-sm text-[#555555] mb-8 flex gap-2">
        <Link href="/" className="hover:text-[#4A7C59]">Home</Link>
        <span>/</span>
        <span className="text-[#1A1A1A] font-medium">Terms & Conditions</span>
      </nav>

      <h1 className="font-heading text-4xl font-bold text-[#1A1A1A] mb-2">Terms & Conditions</h1>
      <p className="text-[#555555] mb-10">Last updated: January 2026</p>

      <div className="space-y-10 text-[#555555]">
        <section>
          <h2 className="font-heading text-xl font-bold text-[#1A1A1A] mb-3">1. Acceptance of Terms</h2>
          <p>By accessing or using the {storeName} website and placing orders, you agree to be bound by these Terms & Conditions. If you do not agree, please do not use our website.</p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-[#1A1A1A] mb-3">2. Products & Pricing</h2>
          <p>All prices are displayed in Nigerian Naira (₦) and are inclusive of applicable taxes. {storeName} reserves the right to change prices at any time without prior notice. In the event of a pricing error, we will contact you before processing your order.</p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-[#1A1A1A] mb-3">3. Orders & Payment</h2>
          <p>By placing an order, you confirm that the information provided is accurate and complete. Payment must be made in full before orders are dispatched. We accept Paystack, bank transfer, and cash on delivery (for eligible orders).</p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-[#1A1A1A] mb-3">4. Delivery</h2>
          <p>Delivery times are estimates and not guaranteed. {storeName} is not liable for delays caused by courier partners, weather conditions, or other circumstances beyond our control. Please refer to our <Link href="/pages/delivery-policy" className="text-[#4A7C59] hover:underline">Delivery Policy</Link> for full details.</p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-[#1A1A1A] mb-3">5. Returns & Refunds</h2>
          <p>Returns are accepted within 30 days of delivery subject to our <Link href="/pages/returns-policy" className="text-[#4A7C59] hover:underline">Returns Policy</Link>. Refunds are processed to the original payment method within 5–7 business days of receiving the returned item.</p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-[#1A1A1A] mb-3">6. Intellectual Property</h2>
          <p>All content on this website — including images, text, logos, and product descriptions — is the property of {storeName} and may not be reproduced without written permission.</p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-[#1A1A1A] mb-3">7. Limitation of Liability</h2>
          <p>{storeName} shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or website. Our total liability shall not exceed the amount paid for the specific order in question.</p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-[#1A1A1A] mb-3">8. Governing Law</h2>
          <p>These Terms & Conditions are governed by the laws of the Federal Republic of Nigeria. Any disputes shall be resolved in Nigerian courts of competent jurisdiction.</p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-[#1A1A1A] mb-3">9. Contact</h2>
          <p>For questions about these terms, contact us via <Link href="/contact" className="text-[#4A7C59] hover:underline">our contact form</Link>.</p>
        </section>
      </div>
    </main>
  );
}
