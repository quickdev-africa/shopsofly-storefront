import { getTaxons } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";

export default async function CollectionsPage() {
  let taxons: any[] = [];

  try {
    const res = await getTaxons();
    taxons = res.data.taxons;
  } catch {
    taxons = [];
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="font-heading text-3xl font-bold text-[#1A1A1A] mb-8">Collections</h1>

      {taxons.length === 0 ? (
        <p className="text-[#555555] text-center py-20">No collections yet. Check back soon.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {taxons.map((t: any) => {
            const iconMap: Record<string, string> = {
              "tableware": "🍽", "cookware": "🍽",
              "wearables": "⌚", "accessories": "⌚",
              "wellness": "💚", "health": "💚",
              "personal": "✨", "care": "✨",
              "eyewear": "👓",
            };
            const icon = Object.entries(iconMap).find(([key]) =>
              t.name.toLowerCase().includes(key)
            )?.[1] ?? "🛍";
            return (
            <Link key={t.id} href={`/collections/${t.slug}`} className="group relative rounded-xl overflow-hidden h-64 block">
              {t.image_url ? (
                <Image src={t.image_url} alt={t.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
              ) : (
                <div className="w-full h-full bg-[#4A7C59] group-hover:bg-[#2D4A32] transition-colors" />
              )}
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex flex-col items-start justify-end p-6">
                <div className="w-11 h-11 bg-[#E8F0E9] rounded-xl flex items-center justify-center text-xl mb-3 flex-shrink-0">
                  {icon}
                </div>
                <span className="text-white font-heading font-bold text-2xl">{t.name}</span>
                {t.description && (
                  <span className="text-white/80 text-sm mt-1 line-clamp-2">{t.description}</span>
                )}
                <span className="mt-3 text-[#F97316] font-semibold text-sm group-hover:underline">Shop Now →</span>
              </div>
            </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
