"use client";
import StarRating from "@/components/StarRating";
import { useAppDispatch } from "@/lib/hooks/redux";
import { addItem, openCart } from "@/lib/features/carts/cartsSlice";
import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getProducts, getTaxons } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";

type Product = {
  id: number;
  name: string;
  slug: string;
  price: number;
  compare_at_price: number | null;
  image_url: string | null;
  rating?: number;
  review_count?: number;
};

type Taxon = {
  id: number;
  name: string;
  slug: string;
};

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router       = useRouter();

  const dispatch = useAppDispatch();
  const token = useSelector(selectToken);
  const [wishlisted, setWishlisted] = useState<Record<number, boolean>>({});

  async function handleWishlist(e: React.MouseEvent, productId: number) {
    e.preventDefault();
    e.stopPropagation();
    if (!token) { window.location.href = "/account/login"; return; }
    try {
      await addWishlistItem(token, productId);
      setWishlisted(prev => ({ ...prev, [productId]: true }));
    } catch {}
  }
  const [products, setProducts]     = useState<Product[]>([]);
  const [taxons,   setTaxons]       = useState<Taxon[]>([]);
  const [pagination, setPagination] = useState({ current_page: 1, total_pages: 1, total_count: 0 });
  const [loading,  setLoading]      = useState(true);

  const taxon    = searchParams.get("taxon")     || "";
  const sort     = searchParams.get("sort")      || "";
  const minPrice = searchParams.get("min_price") || "";
  const maxPrice = searchParams.get("max_price") || "";
  const page     = Number(searchParams.get("page") || 1);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { page };
      if (taxon)    params.taxon     = taxon;
      if (sort)     params.sort      = sort;
      if (minPrice) params.min_price = minPrice;
      if (maxPrice) params.max_price = maxPrice;

      const [productsRes, taxonsRes] = await Promise.all([
        getProducts(params),
        getProducts.length ? getTaxons() : getTaxons(),
      ]);
      setProducts(productsRes.data.products);
      setPagination(productsRes.data.pagination);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [taxon, sort, minPrice, maxPrice, page]);

  useEffect(() => {
    getTaxons().then(r => setTaxons(r.data.taxons)).catch(() => {});
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("page");
    router.push(`/products?${params.toString()}`);
  };

  function handleAddToCart(e: React.MouseEvent, p: Product) {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addItem({
      variantId:    p.id,
      productId:    p.id,
      name:         p.name,
      variantLabel: "",
      price:        Number(p.price),
      imageUrl:     p.image_url || "",
      quantity:     1,
      slug:         p.slug,
    }));
    dispatch(openCart());
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="font-heading text-3xl font-bold text-[#1A1A1A] mb-8">All Products</h1>

      {/* Filters + Sort */}
      <div className="flex flex-wrap gap-4 mb-8">
        <select
          value={taxon}
          onChange={e => updateParam("taxon", e.target.value)}
          className="border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A7C59]"
        >
          <option value="">All Collections</option>
          {taxons.map(t => (
            <option key={t.id} value={t.slug}>{t.name}</option>
          ))}
        </select>

        <select
          value={sort}
          onChange={e => updateParam("sort", e.target.value)}
          className="border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A7C59]"
        >
          <option value="">Default Sort</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="newest">Newest First</option>
        </select>

        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min ₦"
            value={minPrice}
            onChange={e => updateParam("min_price", e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm w-24 focus:outline-none focus:ring-2 focus:ring-[#4A7C59]"
          />
          <span className="text-gray-400">—</span>
          <input
            type="number"
            placeholder="Max ₦"
            value={maxPrice}
            onChange={e => updateParam("max_price", e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm w-24 focus:outline-none focus:ring-2 focus:ring-[#4A7C59]"
          />
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-[#555555] mb-6">{pagination.total_count} products</p>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-xl aspect-square animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-[#555555] text-lg">No products found.</p>
          <p className="text-sm text-gray-400 mt-2">Try adjusting your filters or check back soon.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(p => (
            <Link key={p.id} href={`/products/${p.slug}`} className="group">
              <div className="bg-gray-100 rounded-xl overflow-hidden aspect-square mb-3 relative">
                {p.image_url ? (
                  <Image src={p.image_url} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform" />
                ) : (
                  <div className="w-full h-full bg-[#E8F0E9] flex items-center justify-center text-[#4A7C59] font-semibold text-sm px-4 text-center">{p.name}</div>
                )}
                {/* Quick Buy */}
                <div className="absolute bottom-0 left-0 right-0 bg-[#F97316] text-white text-center text-xs font-semibold py-2 translate-y-full group-hover:translate-y-0 transition-transform">
                  Quick View
                </div>
              </div>
              <div className="relative">
                <button onClick={(e) => handleWishlist(e, p.id)}
                  className={"absolute -top-10 right-1 w-8 h-8 rounded-full flex items-center justify-center text-base shadow-sm z-10 " + (wishlisted[p.id] ? "bg-red-500 text-white" : "bg-white/90 text-gray-400 hover:text-red-500")}>
                  {wishlisted[p.id] ? "♥" : "♡"}
                </button>
              </div>
              <h3 className="font-semibold text-[#1A1A1A] text-sm line-clamp-2">{p.name}</h3>
              {(p.rating || 0) > 0 && <StarRating rating={p.rating || 0} count={p.review_count} size="sm" />}
              <div className="flex items-center justify-between gap-2 mt-1">
                {p.compare_at_price && p.compare_at_price > p.price && (
                  <span className="text-gray-400 line-through text-sm">₦{p.compare_at_price?.toLocaleString()}</span>
                )}
                <span className="font-bold text-[#1A1A1A]">₦{p.price?.toLocaleString() ?? ""}</span>
                {p.compare_at_price && p.compare_at_price > p.price && (
                  <span className="text-xs bg-[#F97316] text-white px-1.5 py-0.5 rounded">
                    -{Math.round((1 - p.price / p.compare_at_price) * 100)}%
                  </span>
                )}
                <button onClick={(e) => handleAddToCart(e, p)}
                  className="bg-[#F97316] hover:bg-orange-600 text-white rounded-lg p-2 transition-colors flex-shrink-0 ml-auto"
                  title="Add to Cart">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </button>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.total_pages > 1 && (
        <div className="flex justify-center gap-2 mt-12">
          {Array.from({ length: pagination.total_pages }, (_, i) => i + 1).map(n => (
            <button
              key={n}
              onClick={() => updateParam("page", String(n))}
              className={`w-10 h-10 rounded-lg font-semibold text-sm transition-colors ${
                n === pagination.current_page
                  ? "bg-[#4A7C59] text-white"
                  : "bg-gray-100 text-[#1A1A1A] hover:bg-[#E8F0E9]"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      )}
    </main>
  );
}
