"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { searchProducts } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";

type Product = {
  id: number;
  name: string;
  slug: string;
  price: number;
  image_url: string | null;
};

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router       = useRouter();
  const initialQ     = searchParams.get("q") || "";

  const [query,    setQuery]    = useState(initialQ);
  const [results,  setResults]  = useState<Product[]>([]);
  const [loading,  setLoading]  = useState(false);
  const [searched, setSearched] = useState(false);

  const doSearch = async (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await searchProducts(q.trim());
      setResults(res.data.products);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQ) doSearch(initialQ);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      doSearch(query.trim());
    }
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="font-heading text-3xl font-bold text-[#1A1A1A] mb-8">Search</h1>

      <form onSubmit={handleSubmit} className="flex gap-3 mb-10 max-w-xl">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search products..."
          className="flex-1 border-2 border-gray-200 focus:border-[#4A7C59] rounded-lg px-4 py-3 focus:outline-none transition-colors"
          autoFocus
        />
        <button
          type="submit"
          className="bg-[#F97316] hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-lg transition-colors"
        >
          Search
        </button>
      </form>

      {loading && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-xl aspect-square animate-pulse" />
          ))}
        </div>
      )}

      {!loading && searched && results.length === 0 && (
        <div className="text-center py-20">
          <p className="text-[#555555] text-lg">No results for "<strong>{initialQ}</strong>"</p>
          <p className="text-sm text-gray-400 mt-2 mb-6">Try a different search term or browse our collections.</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/products"   className="border-2 border-[#4A7C59] text-[#4A7C59] font-semibold px-5 py-2 rounded-lg hover:bg-[#4A7C59] hover:text-white transition-colors">Browse Products</Link>
            <Link href="/collections" className="border-2 border-[#1A1A1A] text-[#1A1A1A] font-semibold px-5 py-2 rounded-lg hover:bg-[#1A1A1A] hover:text-white transition-colors">View Collections</Link>
          </div>
        </div>
      )}

      {!loading && results.length > 0 && (
        <>
          <p className="text-sm text-[#555555] mb-6">{results.length} result{results.length !== 1 ? "s" : ""} for "<strong>{initialQ}</strong>"</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {results.map(p => (
              <Link key={p.id} href={`/products/${p.slug}`} className="group">
                <div className="bg-gray-100 rounded-xl overflow-hidden aspect-square mb-3 relative">
                  {p.image_url ? (
                    <Image src={p.image_url} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform" />
                  ) : (
                    <div className="w-full h-full bg-[#E8F0E9] flex items-center justify-center text-[#4A7C59] font-semibold text-sm px-4 text-center">{p.name}</div>
                  )}
                </div>
                <h3 className="font-semibold text-[#1A1A1A] text-sm line-clamp-2">{p.name}</h3>
                <span className="font-bold text-[#1A1A1A]">₦{p.price?.toLocaleString() ?? ""}</span>
              </Link>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
