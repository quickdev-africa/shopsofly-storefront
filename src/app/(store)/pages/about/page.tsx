export const revalidate = 60;
import { getStore } from "@/lib/api";
import Link from "next/link";

export default async function AboutPage() {
  let store: any = null;
  try { const res = await getStore(); store = res.data.store; } catch {}
  const storeName = store?.name || "Our Store";

  return (
    <main className="max-w-4xl mx-auto px-4 py-16">
      <nav className="text-sm text-[#555555] mb-8 flex gap-2">
        <Link href="/" className="hover:text-[#4A7C59]">Home</Link>
        <span>/</span>
        <span className="text-[#1A1A1A] font-medium">About Us</span>
      </nav>

      <h1 className="font-heading text-4xl font-bold text-[#1A1A1A] mb-6">About {storeName}</h1>

      <div className="prose prose-lg max-w-none text-[#555555] space-y-6">
        <p>
          Welcome to <strong>{storeName}</strong> — your trusted destination for premium wellness,
          health, and lifestyle products delivered across Nigeria.
        </p>
        <p>
          We believe that everyone deserves access to high-quality products that support a healthier,
          more energised life. That is why we carefully curate every product in our store —
          testing for quality, authenticity, and real results before making them available to you.
        </p>
        <p>
          Our mission is simple: to make genuine wellness products accessible, affordable, and
          delivered fast to your doorstep anywhere in Nigeria. We partner with trusted suppliers
          and manufacturers to bring you products that actually work.
        </p>

        <h2 className="font-heading text-2xl font-bold text-[#1A1A1A] mt-10">Why Choose Us?</h2>
        <ul className="space-y-3">
          {[
            "100% genuine products — no counterfeits, ever",
            "Fast delivery across all 36 Nigerian states",
            "Secure payment via Paystack, bank transfer, or cash on delivery",
            "Dedicated customer support via WhatsApp",
            "Easy 7-day returns on unopened items",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="text-[#4A7C59] font-bold mt-1">✓</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <h2 className="font-heading text-2xl font-bold text-[#1A1A1A] mt-10">Our Promise</h2>
        <p>
          Every order placed with {storeName} is handled with care. From the moment you click
          "Add to Cart" to the moment your package arrives at your door, we are committed to
          giving you the best shopping experience possible.
        </p>
        <p>
          Have a question? We are always here to help. Reach out to us via WhatsApp or our
          contact form — our team responds within 24 hours.
        </p>

        <div className="mt-10 flex gap-4">
          <Link href="/products"
            className="bg-[#F97316] hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-xl transition-colors">
            Shop Now
          </Link>
          <Link href="/contact"
            className="border-2 border-[#4A7C59] text-[#4A7C59] hover:bg-[#4A7C59] hover:text-white font-bold px-6 py-3 rounded-xl transition-colors">
            Contact Us
          </Link>
        </div>
      </div>
    </main>
  );
}
