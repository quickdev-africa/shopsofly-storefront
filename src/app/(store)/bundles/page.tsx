import Link from "next/link";
import { getBundles } from "@/lib/api";
import BundleBuilder from "@/components/BundleBuilder";

export default async function BundlesPage() {
  let bundles: any[] = [];
  let storeProducts: any[] = [];

  try {
    const res = await getBundles();
    bundles = res.data.bundles ?? [];
    storeProducts = res.data.store_products ?? [];
  } catch {
    bundles = [];
    storeProducts = [];
  }

  return (
    <main>
      <div className="max-w-6xl mx-auto px-4 pt-12 pb-8 text-center">
        <h1 className="text-3xl lg:text-4xl font-bold text-[#1A1A1A] mb-4">
          Better Living Bundles
        </h1>
        <p className="text-base text-[#555] max-w-xl mx-auto leading-relaxed">
          Pick your favourite products, bundle them together and save.
          The more you bundle, the more you save — mix and match any combination.
        </p>
      </div>

      {bundles.length === 0 ? (
        <div className="text-center py-24 px-4">
          <p className="text-[#555555] text-lg">No bundles available right now.</p>
          <Link href="/products" className="mt-4 inline-block text-[#4A7C59] font-semibold hover:underline">
            Browse all products →
          </Link>
        </div>
      ) : (
        <BundleBuilder bundles={bundles} storeProducts={storeProducts} />
      )}
    </main>
  );
}
