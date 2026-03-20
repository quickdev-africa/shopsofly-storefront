"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import {
  closeCart,
  selectCartIsOpen,
  selectCartItems,
  selectCartSubtotal,
  selectCartFinalTotal,
  selectCartDiscount,
  selectFreeShippingThreshold,
  selectCouponCode,
  selectOrderNotes,
  updateQuantity,
  removeItem,
  setCoupon,
  removeCoupon,
  setOrderNotes,
  clearCart,
} from "@/lib/features/carts/cartsSlice";
import { validatePromotion } from "@/lib/api";

const fmt = (kobo: number) => `₦${(kobo / 100).toLocaleString("en-NG")}`;

export default function CartDrawer() {
  const dispatch    = useAppDispatch();
  const router      = useRouter();
  const isOpen      = useAppSelector(selectCartIsOpen);
  const items       = useAppSelector(selectCartItems);
  const subtotal    = useAppSelector(selectCartSubtotal);
  const finalTotal  = useAppSelector(selectCartFinalTotal);
  const discount    = useAppSelector(selectCartDiscount);
  const threshold   = useAppSelector(selectFreeShippingThreshold);
  const couponCode  = useAppSelector(selectCouponCode);
  const orderNotes  = useAppSelector(selectOrderNotes);

  const [couponInput, setCouponInput]     = useState("");
  const [couponError, setCouponError]     = useState("");
  const [couponLoading, setCouponLoading] = useState(false);

  const shippingProgress = Math.min((subtotal / threshold) * 100, 100);
  const remaining        = Math.max(0, threshold - subtotal);

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    setCouponError("");
    try {
      const res = await validatePromotion(couponInput.trim());
      const data = res.data;
      dispatch(setCoupon({ code: couponInput.trim(), discount: data.discount_amount ?? 0 }));
      setCouponInput("");
    } catch {
      setCouponError("Invalid or expired coupon code");
    } finally {
      setCouponLoading(false);
    }
  };

  const handleCheckout = () => {
    dispatch(closeCart());
    router.push("/checkout");
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={() => dispatch(closeCart())}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <h2 className="font-heading font-bold text-xl text-[#1A1A1A]">Your Cart</h2>
            {items.length > 0 && (
              <span className="bg-[#F97316] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {items.reduce((s, i) => s + i.quantity, 0)}
              </span>
            )}
          </div>
          <button
            onClick={() => dispatch(closeCart())}
            className="text-[#555555] hover:text-[#1A1A1A] transition-colors"
            aria-label="Close cart"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <svg className="w-20 h-20 text-gray-200 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-[#555555] font-medium mb-4">Your cart is empty</p>
              <button
                onClick={() => { dispatch(closeCart()); router.push("/products"); }}
                className="bg-[#F97316] hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-lg transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              {/* Free Shipping Bar */}
              {subtotal < threshold && (
                <div className="bg-[#E8F0E9] rounded-lg p-3">
                  <p className="text-sm text-[#4A7C59] font-medium mb-2">
                    Add {fmt(remaining)} more for free shipping!
                  </p>
                  <div className="h-2 bg-white rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#4A7C59] rounded-full transition-all duration-500"
                      style={{ width: `${shippingProgress}%` }}
                    />
                  </div>
                </div>
              )}
              {subtotal >= threshold && (
                <div className="bg-[#E8F0E9] rounded-lg p-3 text-center text-sm text-[#4A7C59] font-semibold">
                  🎉 You qualify for free shipping!
                </div>
              )}

              {/* Cart Items */}
              {items.map((item) => (
                <div key={item.variantId} className="flex gap-3 py-3 border-b border-gray-50 last:border-0">
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-[#E8F0E9] shrink-0">
                    {item.imageUrl ? (
                      <Image src={item.imageUrl} alt={item.name} width={80} height={80} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-[#4A7C59] font-semibold px-1 text-center leading-tight">{item.name}</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#1A1A1A] text-sm line-clamp-2 leading-tight">{item.name}</p>
                    {item.variantLabel && <p className="text-xs text-[#555555] mt-0.5">{item.variantLabel}</p>}
                    <p className="font-bold text-[#1A1A1A] text-sm mt-1">{fmt(item.price)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => dispatch(updateQuantity({ variantId: item.variantId, quantity: item.quantity - 1 }))}
                          className="px-2.5 py-1 hover:bg-gray-100 font-bold text-sm"
                        >
                          −
                        </button>
                        <span className="px-3 py-1 text-sm font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => dispatch(updateQuantity({ variantId: item.variantId, quantity: item.quantity + 1 }))}
                          className="px-2.5 py-1 hover:bg-gray-100 font-bold text-sm"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-sm font-semibold text-[#555555]">{fmt(item.price * item.quantity)}</span>
                      <button
                        onClick={() => dispatch(removeItem(item.variantId))}
                        className="ml-auto text-red-400 hover:text-red-600 transition-colors"
                        aria-label="Remove item"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Order Notes */}
              <div>
                <label className="block text-sm font-semibold text-[#1A1A1A] mb-1">Order Notes</label>
                <textarea
                  rows={2}
                  value={orderNotes}
                  onChange={(e) => dispatch(setOrderNotes(e.target.value))}
                  placeholder="Any special requests for your order?"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#4A7C59] resize-none"
                />
              </div>

              {/* Coupon Code */}
              <div>
                <label className="block text-sm font-semibold text-[#1A1A1A] mb-1">Coupon Code</label>
                {couponCode ? (
                  <div className="flex items-center gap-2 bg-[#E8F0E9] rounded-lg px-3 py-2">
                    <span className="text-sm text-[#4A7C59] font-semibold flex-1">{couponCode} applied ✓</span>
                    <button onClick={() => dispatch(removeCoupon())} className="text-xs text-red-500 hover:underline">Remove</button>
                  </div>
                ) : (
                  <>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => { setCouponInput(e.target.value); setCouponError(""); }}
                        placeholder="Enter coupon code"
                        className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#4A7C59]"
                      />
                      <button
                        onClick={handleApplyCoupon}
                        disabled={couponLoading}
                        className="bg-[#1A1A1A] hover:bg-gray-800 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {couponLoading ? "..." : "Apply"}
                      </button>
                    </div>
                    {couponError && <p className="text-xs text-red-500 mt-1">{couponError}</p>}
                  </>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 px-5 py-4 space-y-3 bg-white">
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-[#555555]">Subtotal</span>
                <span className="font-semibold">{fmt(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-[#22C55E]">
                  <span>Discount ({couponCode})</span>
                  <span className="font-semibold">-{fmt(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold pt-1 border-t border-gray-100 mt-1">
                <span>Total</span>
                <span className="text-[#F97316]">{fmt(finalTotal)}</span>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-[#F97316] hover:bg-orange-600 text-white font-bold py-4 rounded-lg transition-colors text-base"
            >
              Proceed to Checkout →
            </button>
            <Link
              href="/cart"
              onClick={() => dispatch(closeCart())}
              className="block text-center text-sm text-[#555555] hover:text-[#4A7C59] transition-colors"
            >
              View full cart
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
