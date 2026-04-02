"use client";

import Link from "next/link";
import Image from "next/image";
import { useAppSelector, useAppDispatch } from "@/lib/hooks/redux";
import {
  selectCartItems,
  selectCartSubtotal,
  selectCartFinalTotal,
  selectCartDiscount,
  updateQuantity,
  removeItem,
  openCart,
} from "@/lib/features/carts/cartsSlice";

const fmt = (kobo: number) => `₦${(kobo / 100).toLocaleString("en-NG")}`;

export default function CartPage() {
  const dispatch   = useAppDispatch();
  const items      = useAppSelector(selectCartItems);
  const subtotal   = useAppSelector(selectCartSubtotal);
  const discount   = useAppSelector(selectCartDiscount);
  const finalTotal = useAppSelector(selectCartFinalTotal);

  if (items.length === 0) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4 py-20 text-center">
        <svg className="w-20 h-20 text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <h1 className="font-heading text-2xl font-bold text-[#1A1A1A] mb-2">Your cart is empty</h1>
        <p className="text-[#555555] mb-6">Add some products to get started.</p>
        <Link href="/products" className="inline-block bg-[#F97316] hover:bg-orange-600 text-white font-bold px-8 py-3 rounded-lg transition-colors">
          Continue Shopping
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="font-heading text-3xl font-bold text-[#1A1A1A] mb-8">Your Cart</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Items */}
        <div className="flex-1 space-y-4">
          {items.map((item) => (
            <div key={item.variantId} className="flex gap-4 bg-white border border-gray-100 rounded-xl p-4">
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-[#E8F0E9] shrink-0">
                {item.imageUrl ? (
                  <Image src={item.imageUrl} alt={item.name} width={80} height={80} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-[#4A7C59] font-semibold px-1 text-center">{item.name}</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <Link href={`/products/${item.slug}`} className="font-semibold text-[#1A1A1A] hover:text-[#4A7C59] line-clamp-1">{item.name}</Link>
                <p className="text-sm text-[#555555]">{item.variantLabel}</p>
                <p className="font-bold text-[#1A1A1A] mt-1">{fmt(item.price)}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <button onClick={() => dispatch(removeItem(item.variantId))} className="text-red-400 hover:text-red-600 text-sm">Remove</button>
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <button onClick={() => dispatch(updateQuantity({ variantId: item.variantId, quantity: item.quantity - 1 }))} className="px-3 py-1 hover:bg-gray-100 font-bold">−</button>
                  <span className="px-3 py-1 font-semibold">{item.quantity}</span>
                  <button onClick={() => dispatch(updateQuantity({ variantId: item.variantId, quantity: item.quantity + 1 }))} className="px-3 py-1 hover:bg-gray-100 font-bold">+</button>
                </div>
                <p className="text-sm font-semibold">{fmt(item.price * item.quantity)}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:w-80 bg-white border border-gray-100 rounded-xl p-6 h-fit space-y-4">
          <h2 className="font-heading font-bold text-xl text-[#1A1A1A]">Order Summary</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-[#555555]">Subtotal</span>
              <span className="font-semibold">{fmt(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-[#22C55E]">
                <span>Discount</span>
                <span className="font-semibold">-{fmt(discount)}</span>
              </div>
            )}
            <hr />
            <div className="flex justify-between text-base font-bold">
              <span>Total</span>
              <span className="text-[#F97316]">{fmt(finalTotal)}</span>
            </div>
          </div>
          <Link href="/checkout" className="block bg-[#F97316] hover:bg-orange-600 text-white font-bold text-center py-4 rounded-lg transition-colors">
            Proceed to Checkout →
          </Link>
          <button onClick={() => dispatch(openCart())} className="w-full border-2 border-[#4A7C59] text-[#4A7C59] font-semibold py-3 rounded-lg hover:bg-[#4A7C59] hover:text-white transition-colors text-sm">
            View Cart Drawer
          </button>
        </div>
      </div>
    </main>
  );
}

