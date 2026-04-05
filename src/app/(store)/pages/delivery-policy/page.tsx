export const revalidate = 60;
import { getStore } from "@/lib/api";
import Link from "next/link";
import { headers } from "next/headers";

export default async function DeliveryPolicyPage() {
  const headersList = headers();
  const host = headersList.get("host") || "";
  const parts = host.split(".");
  const subdomain = (parts.length >= 3 && !host.includes("vercel.app") && !host.includes("localhost"))
    ? parts[0]
    : (process.env.NEXT_PUBLIC_STORE_SUBDOMAIN || "laserstarglobal");

  let store: any = null;
  try { const res = await getStore(subdomain); store = res.data.store; } catch {}
  const storeName = store?.name || "Our Store";

  return (
    <main className="max-w-4xl mx-auto px-4 py-16">
      <nav className="text-sm text-[#555555] mb-8 flex gap-2">
        <Link href="/" className="hover:text-[#4A7C59]">Home</Link>
        <span>/</span>
        <span className="text-[#1A1A1A] font-medium">Delivery Policy</span>
      </nav>

      <h1 className="font-heading text-4xl font-bold text-[#1A1A1A] mb-2">Delivery Policy</h1>
      <p className="text-[#555555] mb-10">Last updated: January 2026</p>

      <div className="space-y-10 text-[#555555]">
        <section>
          <h2 className="font-heading text-xl font-bold text-[#1A1A1A] mb-3">Delivery Coverage</h2>
          <p>{storeName} delivers to all 36 states and the FCT in Nigeria. We use trusted courier partners to ensure your order reaches you safely and on time.</p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-[#1A1A1A] mb-3">Delivery Timeframes</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-[#E8F0E9]">
                  <th className="text-left p-3 font-semibold text-[#1A1A1A]">Zone</th>
                  <th className="text-left p-3 font-semibold text-[#1A1A1A]">States</th>
                  <th className="text-left p-3 font-semibold text-[#1A1A1A]">Timeframe</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Lagos", "Lagos State", "1–2 business days"],
                  ["South West", "Ogun, Oyo, Osun, Ekiti, Ondo", "2–3 business days"],
                  ["South East", "Enugu, Anambra, Imo, Abia, Ebonyi", "3–5 business days"],
                  ["South South", "Rivers, Delta, Edo, Cross River, Akwa Ibom, Bayelsa", "3–5 business days"],
                  ["North Central", "Abuja FCT, Kwara, Kogi, Benue, Plateau, Nasarawa, Niger", "3–5 business days"],
                  ["North West", "Kano, Kaduna, Katsina, Sokoto, Zamfara, Kebbi, Jigawa", "4–6 business days"],
                  ["North East", "Borno, Yobe, Adamawa, Gombe, Taraba, Bauchi", "4–7 business days"],
                ].map(([zone, states, time], i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="p-3 font-medium text-[#1A1A1A]">{zone}</td>
                    <td className="p-3">{states}</td>
                    <td className="p-3 text-[#4A7C59] font-medium">{time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-[#1A1A1A] mb-3">Delivery Fees</h2>
          <p>Delivery fees are calculated at checkout based on your location and order size. Orders above ₦50,000 qualify for free delivery within Lagos. For other states, delivery fees start from ₦2,000.</p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-[#1A1A1A] mb-3">Order Processing</h2>
          <p>Orders are processed within 24 hours on business days (Monday–Friday, excluding public holidays). Orders placed on weekends or public holidays are processed the next business day.</p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-[#1A1A1A] mb-3">Pickup Option</h2>
          <p>If you prefer to collect your order in person, select "Pickup" at checkout. You will receive a notification when your order is ready for collection. Please bring your order confirmation number when collecting.</p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-[#1A1A1A] mb-3">Tracking Your Order</h2>
          <p>Once your order is dispatched, you will receive a tracking number via WhatsApp or email. You can also track your order at any time using our <Link href="/pages/track-order" className="text-[#4A7C59] hover:underline">order tracking page</Link>.</p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-[#1A1A1A] mb-3">Questions?</h2>
          <p>Contact us via <Link href="/contact" className="text-[#4A7C59] hover:underline">our contact form</Link> or WhatsApp and we will be happy to help.</p>
        </section>
      </div>
    </main>
  );
}
