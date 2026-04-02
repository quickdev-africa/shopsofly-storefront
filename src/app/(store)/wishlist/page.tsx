"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import { selectToken, selectIsAuthenticated } from "@/lib/features/auth/authSlice";
import { addItem, openCart } from "@/lib/features/carts/cartsSlice";
import { getWishlistItems, removeWishlistItem } from "@/lib/api";

interface WishlistItem {
  id: number;
  product_id: number;
  product_name: string;
  product_slug: string;
  product_image_url: string | null;
  product_price: number;
}

const fmt = (v: number) => `₦${v?.toLocaleString("en-NG") ?? "—"}`;

export default function WishlistPage() {
  const dispatch        = useAppDispatch();
  const token           = useAppSelector(selectToken);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const [items,   setItems]   = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !token) { setLoading(false); return; }
    getWishlistItems(token)
      .then((res) => setItems(res.data.wishlist_items ?? []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [isAuthenticated, token]);

  const handleRemove = async (id: number) => {
    if (!token) return;
    setItems((prev) => prev.filter((i) => i.id !== id)); // optimistic
    try { await removeWishlistItem(token, id); } catch { /* handled */ }
  };

  const handleAddToCart = (item: WishlistItem) => {
    dispatch(
      addItem({
        variantId:    item.product_id,
        productId:    item.product_id,
        name:         item.product_name,
        variantLabel: "",
        price:        (item.product_price ?? 0) * 100,
        imageUrl:     item.product_image_url ?? "",
        quantity:     1,
        slug:         item.product_slug,
      })
    );
    dispatch(openCart());
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4 py-20 text-center">
        <svg className="w-20 h-20 text-gray-200 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        <h1 className="font-heading text-2xl font-bold text-[#1A1A1A] mb-2">Your Wishlist</h1>
        <p className="text-[#555555] mb-6">Please login to view your saved items.</p>
        <Link href="/account/login" className="inline-block bg-[#4A7C59] hover:bg-green-800 text-white font-bold px-8 py-3 rounded-lg transition-colors">
          Sign In
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="font-heading text-3xl font-bold text-[#1A1A1A] mb-8">My Wishlist</h1>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-xl h-64 animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center py-24 text-center">
          <svg className="w-20 h-20 text-gray-200 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <p className="text-[#555555] text-lg mb-4">Your wishlist is empty</p>
          <Link href="/products" className="inline-block bg-[#F97316] hover:bg-orange-600 text-white font-bold px-8 py-3 rounded-lg transition-colors">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div key={item.id} className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
              <Link href={`/products/${item.product_slug}`}>
                <div className="aspect-square bg-[#E8F0E9] relative">
                  {item.product_image_url ? (
                    <Image src={item.product_image_url} alt={item.product_name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#4A7C59] font-semibold text-sm px-4 text-center">{item.product_name}</div>
                  )}
                </div>
              </Link>
              <div className="p-3 space-y-2">
                <p className="font-semibold text-[#1A1A1A] text-sm line-clamp-2">{item.product_name}</p>
                <p className="font-bold text-[#1A1A1A]">{fmt(item.product_price)}</p>
                <button
                  onClick={() => handleAddToCart(item)}
                  className="w-full bg-[#F97316] hover:bg-orange-600 text-white font-bold py-2 rounded-lg text-sm transition-colors"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => handleRemove(item.id)}
                  className="w-full border border-red-200 text-red-500 hover:bg-red-50 font-medium py-2 rounded-lg text-sm transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
