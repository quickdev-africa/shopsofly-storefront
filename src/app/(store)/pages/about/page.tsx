export const revalidate = 0;
import { fetchStore } from "@/lib/fetch-store";
import Link from "next/link";

export default async function AboutPage() {
  const store = await fetchStore();
  const storeName = store?.name || "Our Store";
  const customContent = store?.theme_settings?.about_us;

  return (
    <main className="max-w-4xl mx-auto px-4 py-16">
      <nav className="text-sm text-[#555555] mb-8 flex gap-2">
        <Link href="/" className="hover:text-[#4A7C59]">Home</Link>
        <span>/</span>
        <span className="text-[#1A1A1A] font-medium">About Us</span>
      </nav>
      <h1 className="font-heading text-4xl font-bold text-[#1A1A1A] mb-6">About {storeName}</h1>
      {customContent ? (
        <div className="prose max-w-none text-[#555555] whitespace-pre-line leading-relaxed text-base">
          {customContent.replace(/\[STORE_NAME\]/g, storeName)}
        </div>
      ) : (
        <div className="prose prose-lg max-w-none text-[#555555] space-y-6">
          <p>Welcome to <strong>{storeName}</strong> — your trusted destination for premium wellness, health, and lifestyle products delivered across Nigeria.</p>
          <p>We believe that everyone deserves access to high-quality products that support a healthier, more energised life. That is why we carefully curate every product in our store.</p>
          <p>Our mission is simple: to make genuine wellness products accessible, affordable, and delivered fast to your doorstep anywhere in Nigeria.</p>
          <h2 className="font-heading text-2xl font-bold text-[#1A1A1A] mt-10">Why Choose Us?</h2>
          <ul className="space-y-3">
            {["100% genuine products — no counterfeits, ever","Fast delivery across all 36 Nigerian states","Secure payment via Paystack, bank transfer, or cash on delivery","Dedicated customer support via WhatsApp","Easy 30-day returns on eligible items"].map((item, i) => (
              <li key={i} className="flex items-start gap-3"><span className="text-[#4A7C59] font-bold mt-1">✓</span><span>{item}</span></li>
            ))}
          </ul>
          <div className="mt-10 flex gap-4 flex-wrap">
            <Link href="/products" className="bg-[#F97316] hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-xl transition-colors">Shop Now</Link>
            <Link href="/contact" className="border-2 border-[#4A7C59] text-[#4A7C59] hover:bg-[#4A7C59] hover:text-white font-bold px-6 py-3 rounded-xl transition-colors">Contact Us</Link>
          </div>
        </div>
      )}
    </main>
  );
}
