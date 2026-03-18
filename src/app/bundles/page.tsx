import { getBundles } from "@/lib/api";
import Link from "next/link";

export default async function BundlesPage() {
  let bundles: any[] = [];

  try {
    const res = await getBundles();
    bundles = res.data.bundles;
  } catch {
    bundles = [];
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="font-heading text-3xl font-bold text-[#1A1A1A] mb-8">Product Bundles</h1>
      <p className="text-[#555555] mb-10">Save more when you buy together — curated bundles with exclusive discounts.</p>

      {bundles.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-[#555555] text-lg">No bundles available right now.</p>
          <Link href="/products" className="mt-4 inline-block text-[#4A7C59] font-semibold hover:underline">
            Browse all products →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {bundles.map((b: any) => {
            const total = b.items?.reduce((sum: number, i: any) => sum + (i.unit_price * i.quantity), 0) || 0;
            const savings = b.discount_percent > 0 ? total * (b.discount_percent / 100) : 0;
            const bundlePrice = total - savings;

            return (
              <div key={b.id} className="bg-white border-2 border-gray-100 rounded-xl overflow-hidden hover:border-[#4A7C59] hover:shadow-md transition-all">
                <div className="bg-[#E8F0E9] p-6">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="font-heading font-bold text-xl text-[#1A1A1A]">{b.name}</h2>
                    {b.discount_percent > 0 && (
                      <span className="shrink-0 bg-[#F97316] text-white text-xs font-bold px-3 py-1 rounded-full">
                        Save {b.discount_percent}%
                      </span>
                    )}
                  </div>
                  {b.description && <p className="text-[#555555] text-sm mt-2 line-clamp-2">{b.description}</p>}
                </div>

                <div className="p-6 space-y-3">
                  {b.items?.map((item: any, i: number) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="text-[#1A1A1A]">
                        {item.quantity}× {item.product_name || "Product"}
                      </span>
                      <span className="text-[#555555]">₦{(item.unit_price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}

                  {savings > 0 && (
                    <div className="border-t pt-3 flex items-center justify-between">
                      <span className="text-gray-400 line-through text-sm">₦{total.toLocaleString()}</span>
                      <span className="font-bold text-xl text-[#1A1A1A]">₦{bundlePrice.toLocaleString()}</span>
                    </div>
                  )}

                  <Link
                    href="/products"
                    className="block bg-[#F97316] hover:bg-orange-600 text-white font-bold text-center py-3 rounded-lg mt-4 transition-colors"
                  >
                    Add Bundle to Cart
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
