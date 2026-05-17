export const revalidate = 0;
import { fetchStore } from "@/lib/fetch-store";
import Link from "next/link";

export default async function DeliveryPolicyPage() {
  const store = await fetchStore();
  const storeName = store?.name || "Our Store";
  const customContent = store?.theme_settings?.delivery_policy;

  return (
    <main className="max-w-4xl mx-auto px-4 py-16">
      <nav className="text-sm text-[#555555] mb-8 flex gap-2">
        <Link href="/" className="hover:text-[#4A7C59]">Home</Link>
        <span>/</span>
        <span className="text-[#1A1A1A] font-medium">Delivery Policy</span>
      </nav>
      <h1 className="font-heading text-4xl font-bold text-[#1A1A1A] mb-2">Delivery Policy</h1>
      <p className="text-[#555555] mb-10">Last updated: January 2026</p>
      {customContent ? (
        <div className="prose max-w-none text-[#555555] whitespace-pre-line leading-relaxed text-base">
          {customContent.replace(/\[STORE_NAME\]/g, storeName)}
        </div>
      ) : (
        <div className="space-y-10 text-[#555555]">
          <section>
            <h2 className="font-heading text-xl font-bold text-[#1A1A1A] mb-3">Delivery Coverage</h2>
            <p>{storeName} delivers to all 36 states and the FCT in Nigeria.</p>
          </section>
          <section>
            <h2 className="font-heading text-xl font-bold text-[#1A1A1A] mb-3">Delivery Timeframes</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead><tr className="bg-[#E8F0E9]">
                  <th className="text-left p-3 font-semibold text-[#1A1A1A]">Zone</th>
                  <th className="text-left p-3 font-semibold text-[#1A1A1A]">States</th>
                  <th className="text-left p-3 font-semibold text-[#1A1A1A]">Timeframe</th>
                </tr></thead>
                <tbody>
                  {[["Lagos","Lagos State","1–2 business days"],["South West","Ogun, Oyo, Osun, Ekiti, Ondo","2–3 business days"],["South East & South South","Rivers, Delta, Edo, Enugu, Anambra, Imo, Abia, Cross River, Akwa Ibom","3–5 business days"],["North Central","Abuja FCT, Kwara, Kogi, Benue, Plateau, Nasarawa, Niger","3–5 business days"],["North West","Kano, Kaduna, Katsina, Sokoto, Zamfara, Kebbi, Jigawa","4–6 business days"],["North East","Borno, Yobe, Adamawa, Gombe, Taraba, Bauchi","4–7 business days"]].map(([zone, states, time], i) => (
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
            <h2 className="font-heading text-xl font-bold text-[#1A1A1A] mb-3">Order Processing</h2>
            <p>Orders are processed within 24 hours on business days (Monday–Friday, excluding public holidays).</p>
          </section>
          <section>
            <h2 className="font-heading text-xl font-bold text-[#1A1A1A] mb-3">Tracking Your Order</h2>
            <p>Track your order using our <Link href="/pages/track-order" className="text-[#4A7C59] hover:underline">order tracking page</Link>.</p>
          </section>
        </div>
      )}
    </main>
  );
}
