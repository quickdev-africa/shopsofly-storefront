"use client";
import { useState } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import { addItem, openCart } from "@/lib/features/carts/cartsSlice";
import { addWishlistItem } from "@/lib/api";
import { selectToken, selectIsAuthenticated } from "@/lib/features/auth/authSlice";

interface Variant {
  id: number;
  sku: string;
  price: number;
  stock_count: number;
  options?: Record<string, string>;
}

interface Props {
  product: {
    id: number;
    name: string;
    slug: string;
    price: number;
    image_url: string | null;
    variants: Variant[];
  };
}

export default function ProductActions({ product }: Props) {
  const dispatch         = useAppDispatch();
  const token            = useAppSelector(selectToken);
  const isAuthenticated  = useAppSelector(selectIsAuthenticated);

  const firstVariant = product.variants?.[0];
  const [selectedVariantId, setSelectedVariantId] = useState<number>(firstVariant?.id ?? 0);
  const [quantity, setQuantity]                   = useState(1);
  const [wishlistAdded, setWishlistAdded]         = useState(false);
  const [wishlistMsg, setWishlistMsg]             = useState("");

  const selectedVariant = product.variants?.find((v) => v.id === selectedVariantId) ?? firstVariant;
  const price = (selectedVariant?.price ?? product.price) * 100; // convert to kobo

  const variantLabel = selectedVariant
    ? selectedVariant.sku ||
      Object.entries(selectedVariant.options ?? {})
        .map(([k, v]) => `${k}: ${v}`)
        .join(" / ")
    : "";

  const handleAddToCart = () => {
    if (!selectedVariant && product.variants?.length > 0) return;
    dispatch(
      addItem({
        variantId:    selectedVariant?.id ?? product.id,
        productId:    product.id,
        name:         product.name,
        variantLabel: variantLabel,
        price:        price,
        imageUrl:     product.image_url ?? "",
        quantity:     quantity,
        slug:         product.slug,
      })
    );
    dispatch(openCart());
  };

  const handleWishlist = async () => {
    if (!isAuthenticated || !token) {
      setWishlistMsg("Please login to save to wishlist");
      setTimeout(() => setWishlistMsg(""), 3000);
      return;
    }
    try {
      await addWishlistItem(token, product.id);
      setWishlistAdded(true);
      setWishlistMsg("Added to wishlist!");
      setTimeout(() => setWishlistMsg(""), 3000);
    } catch {
      setWishlistMsg("Could not add to wishlist");
      setTimeout(() => setWishlistMsg(""), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Variant Select */}
      {product.variants?.length > 0 && (
        <div>
          <h3 className="font-semibold text-[#1A1A1A] mb-3">Options</h3>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((v) => (
              <button
                key={v.id}
                onClick={() => setSelectedVariantId(v.id)}
                disabled={v.stock_count === 0}
                className={`border-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none ${
                  selectedVariantId === v.id
                    ? "border-[#4A7C59] bg-[#E8F0E9] text-[#4A7C59]"
                    : "border-gray-200 hover:border-[#4A7C59]"
                } ${v.stock_count === 0 ? "opacity-40 cursor-not-allowed" : ""}`}
              >
                {v.sku}
                {v.stock_count === 0 && <span className="ml-1 text-red-400 text-xs">(Out)</span>}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity + Add to Cart */}
      <div className="flex items-center gap-4">
        <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="px-4 py-3 text-lg font-bold hover:bg-gray-100 transition-colors"
          >
            −
          </button>
          <span className="px-6 py-3 font-semibold">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="px-4 py-3 text-lg font-bold hover:bg-gray-100 transition-colors"
          >
            +
          </button>
        </div>
        <button
          onClick={handleAddToCart}
          className="flex-1 bg-[#F97316] hover:bg-orange-600 text-white font-bold py-4 rounded-lg transition-colors active:scale-95"
        >
          Add to Cart
        </button>
      </div>

      {/* Action Row */}
      <div className="flex gap-3 relative">
        <button
          onClick={handleWishlist}
          className={`flex items-center gap-2 border rounded-lg px-4 py-2 text-sm transition-colors ${
            wishlistAdded
              ? "border-red-400 text-red-500"
              : "border-gray-200 hover:border-[#4A7C59]"
          }`}
        >
          {wishlistAdded ? "♥" : "♡"} Wishlist
        </button>
        <a
          href={`https://wa.me/?text=Check this out: ${product.name}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-[#25D366] transition-colors"
        >
          Share on WhatsApp
        </a>
        {wishlistMsg && (
          <span className="absolute -bottom-6 left-0 text-xs text-[#555555]">{wishlistMsg}</span>
        )}
      </div>

      {/* Trust Badges */}
      <div className="flex gap-4 flex-wrap text-sm text-[#555555]">
        {["🚚 Free Delivery", "✅ Genuine Product", "🔄 Easy Returns", "🔒 Secure Payment"].map((b) => (
          <span key={b}>{b}</span>
        ))}
      </div>
    </div>
  );
}
