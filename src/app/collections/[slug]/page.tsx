import { getTaxon } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
  params: { slug: string };
  searchParams: { page?: string };
};

export default async function CollectionPage({ params, searchParams }: Props) {
  let taxon: any;
  let products: any[] = [];
  let pagination = { current_page: 1, total_pages: 1, total_count: 0 };

  try {
    const res = await getTaxon(params.slug);
    taxon      = res.data.taxon;
    products   = res.data.products;
    pagination = res.data.pagination;
  } catch {
    notFound();
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <nav className="text-sm text-[#555555] mb-6 flex gap-2">
        <Link href="/" className="hover:text-[#4A7C59]">Home</Link>
        <span>/</span>
        <Link href="/collections" className="hover:text-[#4A7C59]">Collections</Link>
        <span>/</span>
        <span className="text-[#1A1A1A] font-medium">{taxon.name}</span>
      </nav>

      <h1 className="font-heading text-3xl font-bold text-[#1A1A1A] mb-2">{taxon.name}</h1>
      {taxon.description && <p className="text-[#555555] mb-8">{taxon.description}</p>}

      <p className="text-sm text-[#555555] mb-6">{pagination.total_count} products</p>

      {products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-[#555555] text-lg">No products in this collection yet.</p>
          <Link href="/products" className="mt-4 inline-block text-[#4A7C59] font-semibold hover:underline">
            Browse all products →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p: any) => (
            <Link key={p.id} href={`/products/${p.slug}`} className="group">
              <div className="bg-gray-100 rounded-xl overflow-hidden aspect-square mb-3 relative">
                {p.image_url ? (
                  <Image src={p.image_url} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform" />
                ) : (
                  <div className="w-full h-full bg-[#E8F0E9] flex items-center justify-center text-[#4A7C59] font-semibold text-sm px-4 text-center">{p.name}</div>
                )}
              </div>
              <h3 className="font-semibold text-[#1A1A1A] text-sm line-clamp-2">{p.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                {p.compare_at_price && p.compare_at_price > p.price && (
                  <span className="text-gray-400 line-through text-sm">₦{p.compare_at_price.toLocaleString()}</span>
                )}
                <span className="font-bold text-[#1A1A1A]">₦{p.price.toLocaleString()}</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {pagination.total_pages > 1 && (
        <div className="flex justify-center gap-2 mt-12">
          {Array.from({ length: pagination.total_pages }, (_, i) => i + 1).map(n => (
            <Link
              key={n}
              href={`/collections/${params.slug}?page=${n}`}
              className={`w-10 h-10 rounded-lg font-semibold text-sm flex items-center justify-center transition-colors ${
                n === pagination.current_page
                  ? "bg-[#4A7C59] text-white"
                  : "bg-gray-100 text-[#1A1A1A] hover:bg-[#E8F0E9]"
              }`}
            >
              {n}
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
