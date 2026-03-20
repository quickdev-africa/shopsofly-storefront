"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import {
  selectCartItems,
  selectCartSubtotal,
  selectCartFinalTotal,
  selectCartDiscount,
  selectCouponCode,
  selectOrderNotes,
  clearCart,
  setCoupon,
  removeCoupon,
} from "@/lib/features/carts/cartsSlice";
import { selectToken, selectUser, selectIsAuthenticated } from "@/lib/features/auth/authSlice";
import {
  getShippingMethods,
  getPickupLocations,
  createOrder,
  validatePromotion,
  createStripeIntent,
} from "@/lib/api";
import { STATE_NAMES, getLGAs } from "@/lib/nigeria-locations";

// Dynamic imports for payment UIs (SSR off — all use window)
const StripeSection = dynamic(() => import("@/components/checkout/StripeSection"), { ssr: false });
const PayPalSection = dynamic(() => import("@/components/checkout/PayPalSection"), { ssr: false });

type PaymentMethod = "paystack" | "stripe" | "paypal" | "bank_transfer" | "cod";
type DeliveryMethod = "delivery" | "pickup";

const fmt = (kobo: number) => `₦${(kobo / 100).toLocaleString("en-NG")}`;

export default function CheckoutPage() {
  const dispatch        = useAppDispatch();
  const router          = useRouter();
  const items           = useAppSelector(selectCartItems);
  const subtotal        = useAppSelector(selectCartSubtotal);
  const finalTotal      = useAppSelector(selectCartFinalTotal);
  const discount        = useAppSelector(selectCartDiscount);
  const couponCode      = useAppSelector(selectCouponCode);
  const orderNotes      = useAppSelector(selectOrderNotes);
  const token           = useAppSelector(selectToken);
  const user            = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  // Contact
  const [email,     setEmail]     = useState(user?.email ?? "");
  const [phone,     setPhone]     = useState(user?.phone ?? "");
  // Delivery
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("delivery");
  const [firstName,  setFirstName]  = useState(user?.first_name ?? "");
  const [lastName,   setLastName]   = useState(user?.last_name ?? "");
  const [address1,   setAddress1]   = useState("");
  const [address2,   setAddress2]   = useState("");
  const [city,       setCity]       = useState("");
  const [state,      setState]      = useState("");
  const [lga,        setLga]        = useState("");
  // Pickup
  const [pickupLocationId, setPickupLocationId] = useState<number | null>(null);
  const [pickupLocations,  setPickupLocations]  = useState<any[]>([]);
  // Shipping
  const [shippingMethods,  setShippingMethods]  = useState<any[]>([]);
  const [shippingMethodId, setShippingMethodId] = useState<number | null>(null);
  const [shippingCost,     setShippingCost]     = useState(0);
  // Payment
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("paystack");
  // Coupon
  const [couponInput,   setCouponInput]   = useState("");
  const [couponError,   setCouponError]   = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  // UI
  const [loading,    setLoading]    = useState(false);
  const [storeInfo,  setStoreInfo]  = useState<any>(null);

  const lgas = getLGAs(state);

  useEffect(() => {
    getShippingMethods()
      .then((r) => {
        const methods = r.data.shipping_methods ?? [];
        setShippingMethods(methods);
        if (methods.length > 0) {
          const cheapest = methods.reduce((a: any, b: any) => (a.price <= b.price ? a : b));
          setShippingMethodId(cheapest.id);
          setShippingCost(cheapest.price * 100);
        }
      })
      .catch(() => {});
    getPickupLocations()
      .then((r) => setPickupLocations(r.data.pickup_locations ?? []))
      .catch(() => {});
  }, []);

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    setCouponError("");
    try {
      const res = await validatePromotion(couponInput.trim());
      dispatch(setCoupon({ code: couponInput.trim(), discount: res.data.discount_amount ?? 0 }));
      setCouponInput("");
    } catch {
      setCouponError("Invalid or expired coupon code");
    } finally {
      setCouponLoading(false);
    }
  };

  const buildOrderPayload = (extraPaymentFields: object = {}) => ({
    order: {
      email,
      phone,
      delivery_method:   deliveryMethod,
      first_name:        firstName,
      last_name:         lastName,
      address1,
      address2,
      city,
      state_name:        state,
      lga,
      pickup_location_id: deliveryMethod === "pickup" ? pickupLocationId : null,
      notes:             orderNotes,
      ...extraPaymentFields,
    },
    line_items: items.map((i) => ({
      variant_id: i.variantId,
      quantity:   i.quantity,
    })),
    shipping_method_id: deliveryMethod === "delivery" ? shippingMethodId : null,
    promotion_code:     couponCode || null,
  });

  const handlePaystack = async () => {
    setLoading(true);
    try {
      const res = await createOrder(buildOrderPayload({ payment_method: "paystack" }), token ?? undefined);
      const order = res.data.order;

      const PaystackPop = (await import("@paystack/inline-js")).default;
      const handler = new PaystackPop();
      handler.newTransaction({
        key:      process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY ?? "",
        email,
        amount:   order.total,
        ref:      order.paystack_reference,
        currency: "NGN",
        onSuccess: () => {
          dispatch(clearCart());
          router.push(`/order-confirmation?order=${order.number}`);
        },
        onCancel: () => setLoading(false),
      });
    } catch (err: any) {
      alert(err?.response?.data?.error ?? "Could not create order. Please try again.");
      setLoading(false);
    }
  };

  const handleBankTransfer = async () => {
    setLoading(true);
    try {
      const res = await createOrder(buildOrderPayload({ payment_method: "bank_transfer" }), token ?? undefined);
      const order = res.data.order;
      dispatch(clearCart());
      router.push(`/order-confirmation?order=${order.number}`);
    } catch {
      alert("Could not create order. Please try again.");
      setLoading(false);
    }
  };

  const handleCOD = async () => {
    setLoading(true);
    try {
      const res = await createOrder(buildOrderPayload({ payment_method: "cod" }), token ?? undefined);
      const order = res.data.order;
      dispatch(clearCart());
      router.push(`/order-confirmation?order=${order.number}`);
    } catch {
      alert("Could not create order. Please try again.");
      setLoading(false);
    }
  };

  const grandTotal = finalTotal + (deliveryMethod === "delivery" ? shippingCost : 0);

  if (items.length === 0) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4 py-20 text-center">
        <p className="text-[#555555] text-lg mb-4">Your cart is empty.</p>
        <Link href="/products" className="inline-block bg-[#F97316] hover:bg-orange-600 text-white font-bold px-8 py-3 rounded-lg transition-colors">
          Continue Shopping
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="font-heading text-3xl font-bold text-[#1A1A1A] mb-8">Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Left — Form */}
        <div className="flex-1 space-y-8">

          {/* Section 1 — Contact */}
          <section className="bg-white border border-gray-100 rounded-xl p-6 space-y-4">
            <h2 className="font-heading font-bold text-lg text-[#1A1A1A]">Contact Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Email *</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full border-2 border-gray-200 focus:border-[#4A7C59] rounded-lg px-4 py-3 text-sm focus:outline-none" placeholder="you@example.com" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Phone *</label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required className="w-full border-2 border-gray-200 focus:border-[#4A7C59] rounded-lg px-4 py-3 text-sm focus:outline-none" placeholder="08012345678" />
              </div>
            </div>
          </section>

          {/* Section 2 — Delivery Method */}
          <section className="bg-white border border-gray-100 rounded-xl p-6 space-y-4">
            <h2 className="font-heading font-bold text-lg text-[#1A1A1A]">Delivery Method</h2>
            <div className="flex gap-3">
              {(["delivery", "pickup"] as DeliveryMethod[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setDeliveryMethod(m)}
                  className={`flex-1 flex items-center justify-center gap-2 border-2 rounded-lg py-3 font-semibold text-sm capitalize transition-colors ${deliveryMethod === m ? "border-[#4A7C59] bg-[#E8F0E9] text-[#4A7C59]" : "border-gray-200 hover:border-[#4A7C59]"}`}
                >
                  {m === "delivery" ? "🚚" : "📍"} {m === "delivery" ? "Home Delivery" : "Pickup"}
                </button>
              ))}
            </div>

            {deliveryMethod === "delivery" && (
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1">First Name *</label>
                    <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required className="w-full border-2 border-gray-200 focus:border-[#4A7C59] rounded-lg px-4 py-3 text-sm focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Last Name *</label>
                    <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required className="w-full border-2 border-gray-200 focus:border-[#4A7C59] rounded-lg px-4 py-3 text-sm focus:outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Address Line 1 *</label>
                  <input type="text" value={address1} onChange={(e) => setAddress1(e.target.value)} required className="w-full border-2 border-gray-200 focus:border-[#4A7C59] rounded-lg px-4 py-3 text-sm focus:outline-none" placeholder="House number, street name" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Address Line 2</label>
                  <input type="text" value={address2} onChange={(e) => setAddress2(e.target.value)} className="w-full border-2 border-gray-200 focus:border-[#4A7C59] rounded-lg px-4 py-3 text-sm focus:outline-none" placeholder="Apartment, suite (optional)" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1">City *</label>
                    <input type="text" value={city} onChange={(e) => setCity(e.target.value)} required className="w-full border-2 border-gray-200 focus:border-[#4A7C59] rounded-lg px-4 py-3 text-sm focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">State *</label>
                    <select value={state} onChange={(e) => { setState(e.target.value); setLga(""); }} required className="w-full border-2 border-gray-200 focus:border-[#4A7C59] rounded-lg px-4 py-3 text-sm focus:outline-none bg-white">
                      <option value="">Select state</option>
                      {STATE_NAMES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">LGA *</label>
                    <select value={lga} onChange={(e) => setLga(e.target.value)} required className="w-full border-2 border-gray-200 focus:border-[#4A7C59] rounded-lg px-4 py-3 text-sm focus:outline-none bg-white" disabled={!state}>
                      <option value="">Select LGA</option>
                      {lgas.map((l) => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {deliveryMethod === "pickup" && (
              <div>
                <label className="block text-sm font-semibold mb-1">Pickup Location *</label>
                {pickupLocations.length === 0 ? (
                  <p className="text-sm text-[#555555]">No pickup locations available.</p>
                ) : (
                  <select value={pickupLocationId ?? ""} onChange={(e) => setPickupLocationId(Number(e.target.value))} className="w-full border-2 border-gray-200 focus:border-[#4A7C59] rounded-lg px-4 py-3 text-sm focus:outline-none bg-white">
                    <option value="">Select a location</option>
                    {pickupLocations.map((l: any) => (
                      <option key={l.id} value={l.id}>{l.name} — {l.address}</option>
                    ))}
                  </select>
                )}
              </div>
            )}
          </section>

          {/* Section 3 — Shipping Method */}
          {deliveryMethod === "delivery" && shippingMethods.length > 0 && (
            <section className="bg-white border border-gray-100 rounded-xl p-6 space-y-3">
              <h2 className="font-heading font-bold text-lg text-[#1A1A1A]">Shipping Method</h2>
              {shippingMethods.map((m: any) => (
                <label key={m.id} className={`flex items-center gap-3 border-2 rounded-xl p-4 cursor-pointer transition-colors ${shippingMethodId === m.id ? "border-[#4A7C59] bg-[#E8F0E9]" : "border-gray-200 hover:border-[#4A7C59]"}`}>
                  <input
                    type="radio"
                    name="shipping"
                    value={m.id}
                    checked={shippingMethodId === m.id}
                    onChange={() => { setShippingMethodId(m.id); setShippingCost((m.price ?? 0) * 100); }}
                    className="accent-[#4A7C59]"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{m.name}</p>
                    {m.description && <p className="text-xs text-[#555555]">{m.description}</p>}
                  </div>
                  <span className="font-bold text-sm">{m.price === 0 ? "Free" : fmt((m.price ?? 0) * 100)}</span>
                </label>
              ))}
            </section>
          )}

          {/* Section 4 — Coupon */}
          <section className="bg-white border border-gray-100 rounded-xl p-6 space-y-3">
            <h2 className="font-heading font-bold text-lg text-[#1A1A1A]">Coupon Code</h2>
            {couponCode ? (
              <div className="flex items-center gap-2 bg-[#E8F0E9] rounded-lg px-4 py-3">
                <span className="font-semibold text-[#4A7C59] flex-1 text-sm">{couponCode} applied ✓</span>
                <button onClick={() => dispatch(removeCoupon())} className="text-xs text-red-500 hover:underline">Remove</button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input type="text" value={couponInput} onChange={(e) => { setCouponInput(e.target.value); setCouponError(""); }} placeholder="Enter coupon code" className="flex-1 border-2 border-gray-200 focus:border-[#4A7C59] rounded-lg px-4 py-3 text-sm focus:outline-none" />
                <button onClick={handleApplyCoupon} disabled={couponLoading} className="bg-[#1A1A1A] hover:bg-gray-800 text-white font-bold px-5 py-3 rounded-lg text-sm transition-colors disabled:opacity-50">
                  {couponLoading ? "..." : "Apply"}
                </button>
              </div>
            )}
            {couponError && <p className="text-xs text-red-500">{couponError}</p>}
          </section>

          {/* Section 5 — Payment */}
          <section className="bg-white border border-gray-100 rounded-xl p-6 space-y-4">
            <h2 className="font-heading font-bold text-lg text-[#1A1A1A]">Payment Method</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {([
                { key: "paystack", label: "Paystack" },
                { key: "stripe",   label: "Stripe" },
                { key: "paypal",   label: "PayPal" },
                { key: "bank_transfer", label: "Bank Transfer" },
                { key: "cod",      label: "Cash on Delivery" },
              ] as { key: PaymentMethod; label: string }[]).map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setPaymentMethod(key)}
                  className={`border-2 rounded-lg py-3 px-2 text-sm font-semibold transition-colors ${paymentMethod === key ? "border-[#4A7C59] bg-[#E8F0E9] text-[#4A7C59]" : "border-gray-200 hover:border-[#4A7C59]"}`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="pt-2">
              {paymentMethod === "paystack" && (
                <button
                  onClick={handlePaystack}
                  disabled={loading}
                  className="w-full bg-[#F97316] hover:bg-orange-600 text-white font-bold py-4 rounded-lg transition-colors disabled:opacity-50 text-base"
                >
                  {loading ? "Processing..." : `Pay ${fmt(grandTotal)} with Paystack`}
                </button>
              )}

              {paymentMethod === "stripe" && (
                <StripeSection
                  orderPayload={buildOrderPayload({ payment_method: "stripe" })}
                  token={token}
                  grandTotal={grandTotal}
                  onSuccess={(orderNumber: string) => {
                    dispatch(clearCart());
                    router.push(`/order-confirmation?order=${orderNumber}`);
                  }}
                />
              )}

              {paymentMethod === "paypal" && (
                <PayPalSection
                  orderPayload={buildOrderPayload({ payment_method: "paypal" })}
                  token={token}
                  onSuccess={(orderNumber: string) => {
                    dispatch(clearCart());
                    router.push(`/order-confirmation?order=${orderNumber}`);
                  }}
                />
              )}

              {paymentMethod === "bank_transfer" && (
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                    <p className="font-bold text-[#1A1A1A]">Transfer to:</p>
                    <p><span className="text-[#555555]">Bank:</span> <span className="font-semibold">Zenith Bank</span></p>
                    <p><span className="text-[#555555]">Account Name:</span> <span className="font-semibold">LaserStar Global Ltd</span></p>
                    <p><span className="text-[#555555]">Account Number:</span> <span className="font-semibold">2012345678</span></p>
                    <p className="text-[#555555] text-xs mt-2">Transfer {fmt(grandTotal)} and click the button below. We'll confirm within 2 hours.</p>
                  </div>
                  <button
                    onClick={handleBankTransfer}
                    disabled={loading}
                    className="w-full bg-[#4A7C59] hover:bg-green-800 text-white font-bold py-4 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {loading ? "Placing order..." : "I Have Transferred"}
                  </button>
                </div>
              )}

              {paymentMethod === "cod" && (
                <div className="space-y-4">
                  <div className="bg-[#E8F0E9] rounded-xl p-4 text-sm text-[#4A7C59] font-medium">
                    You'll pay {fmt(grandTotal)} when your order arrives.
                  </div>
                  <button
                    onClick={handleCOD}
                    disabled={loading}
                    className="w-full bg-[#1A1A1A] hover:bg-gray-800 text-white font-bold py-4 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {loading ? "Placing order..." : "Place Order — Pay on Delivery"}
                  </button>
                </div>
              )}
            </div>

            {/* Security badges */}
            <div className="flex items-center gap-4 pt-2 flex-wrap text-xs text-[#555555]">
              <span>🔒 Secured by Paystack</span>
              <span>256-bit SSL</span>
              <span>✅ Your payment is safe</span>
            </div>
          </section>
        </div>

        {/* Right — Order Summary */}
        <div className="lg:w-96">
          <div className="sticky top-20 bg-white border border-gray-100 rounded-xl p-6 space-y-4">
            <h2 className="font-heading font-bold text-lg text-[#1A1A1A]">Order Summary</h2>

            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.variantId} className="flex gap-3">
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-[#E8F0E9] shrink-0 relative">
                    {item.imageUrl ? (
                      <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[9px] text-[#4A7C59] px-1 text-center">{item.name}</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[#1A1A1A] line-clamp-1">{item.name}</p>
                    {item.variantLabel && <p className="text-xs text-[#555555]">{item.variantLabel}</p>}
                    <p className="text-xs text-[#555555]">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-bold">{fmt(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>

            <hr />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#555555]">Subtotal</span>
                <span className="font-semibold">{fmt(subtotal)}</span>
              </div>
              {deliveryMethod === "delivery" && (
                <div className="flex justify-between">
                  <span className="text-[#555555]">Shipping</span>
                  <span className="font-semibold">{shippingCost === 0 ? "Free" : fmt(shippingCost)}</span>
                </div>
              )}
              {discount > 0 && (
                <div className="flex justify-between text-[#22C55E]">
                  <span>Discount</span>
                  <span>-{fmt(discount)}</span>
                </div>
              )}
              <hr />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-[#F97316]">{fmt(grandTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
