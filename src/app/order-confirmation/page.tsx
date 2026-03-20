"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAppDispatch } from "@/lib/hooks/redux";
import { clearCart } from "@/lib/features/carts/cartsSlice";
import { getOrder } from "@/lib/api";

const fmt = (kobo: number) => `₦${(kobo / 100).toLocaleString("en-NG")}`;

const STATUS_STEPS = [
  { key: "pending",    label: "Order Placed" },
  { key: "confirmed",  label: "Confirmed" },
  { key: "processing", label: "Processing" },
  { key: "shipped",    label: "Shipped" },
  { key: "delivered",  label: "Delivered" },
];

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const router       = useRouter();
  const dispatch     = useAppDispatch();
  const orderNumber  = searchParams.get("order");

  const [order,   setOrder]   = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  useEffect(() => {
    dispatch(clearCart());
  }, [dispatch]);

  useEffect(() => {
    if (!orderNumber) {
      router.push("/");
      return;
    }
    getOrder(orderNumber)
      .then((r) => setOrder(r.data.order ?? r.data))
      .catch(() => setError("Could not load order details."))
      .finally(() => setLoading(false));
  }, [orderNumber, router]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-[#4A7C59] text-lg font-semibold">Loading your order…</div>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-red-500">{error || "Order not found."}</p>
        <Link href="/" className="text-[#4A7C59] underline">Go home</Link>
      </main>
    );
  }

  const currentStepIndex = STATUS_STEPS.findIndex((s) => s.key === order.status) ?? 0;
  const whatsappText     = encodeURIComponent(`Hi! I just placed order #${order.number} on the store. Order total: ${fmt(order.total ?? 0)}.`);

  return (
    <main className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      {/* Success Animation */}
      <div className="text-center space-y-3">
        <div className="w-20 h-20 rounded-full bg-[#22C55E] flex items-center justify-center mx-auto text-white text-4xl animate-bounce">
          ✓
        </div>
        <h1 className="font-heading text-3xl font-bold text-[#1A1A1A]">Order Confirmed!</h1>
        <p className="text-[#555555]">
          Thank you for your order. We've received it and will process it shortly.
        </p>
        <p className="font-bold text-[#4A7C59] text-xl">#{order.number}</p>
      </div>

      {/* Status Timeline */}
      <section className="bg-white border border-gray-100 rounded-xl p-6">
        <h2 className="font-heading font-bold text-lg mb-6">Order Status</h2>
        <div className="relative">
          {/* Progress bar */}
          <div className="absolute top-5 left-5 right-5 h-0.5 bg-gray-200">
            <div
              className="h-full bg-[#4A7C59] transition-all"
              style={{ width: `${(currentStepIndex / (STATUS_STEPS.length - 1)) * 100}%` }}
            />
          </div>
          <div className="relative flex justify-between">
            {STATUS_STEPS.map((step, idx) => {
              const done    = idx <= currentStepIndex;
              const current = idx === currentStepIndex;
              return (
                <div key={step.key} className="flex flex-col items-center gap-2">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors ${
                      done ? "bg-[#4A7C59] border-[#4A7C59] text-white" :
                      "bg-white border-gray-300 text-gray-300"
                    } ${current ? "ring-4 ring-[#E8F0E9]" : ""}`}
                  >
                    {done ? "✓" : idx + 1}
                  </div>
                  <p className={`text-xs text-center font-medium max-w-[64px] ${done ? "text-[#4A7C59]" : "text-gray-400"}`}>
                    {step.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Delivery Details */}
      <section className="bg-white border border-gray-100 rounded-xl p-6 grid sm:grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-xs font-semibold text-[#555555] uppercase tracking-wide mb-1">Deliver To</p>
          <p className="font-semibold">{order.first_name} {order.last_name}</p>
          <p className="text-[#555555]">{order.address1}{order.address2 ? `, ${order.address2}` : ""}</p>
          <p className="text-[#555555]">{order.city}, {order.state_name}</p>
          <p className="text-[#555555]">{order.lga}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-[#555555] uppercase tracking-wide mb-1">Order Info</p>
          <p><span className="text-[#555555]">Email: </span>{order.email}</p>
          <p><span className="text-[#555555]">Phone: </span>{order.phone}</p>
          <p><span className="text-[#555555]">Payment: </span>{order.payment_method?.replace("_", " ")}</p>
          <p><span className="text-[#555555]">Total: </span><strong className="text-[#F97316]">{fmt(order.total ?? 0)}</strong></p>
        </div>
      </section>

      {/* Order Items */}
      {Array.isArray(order.line_items) && order.line_items.length > 0 && (
        <section className="bg-white border border-gray-100 rounded-xl p-6">
          <h2 className="font-heading font-bold text-lg mb-4">Items Ordered</h2>
          <div className="divide-y divide-gray-100">
            {order.line_items.map((item: any) => (
              <div key={item.id} className="flex justify-between py-3 text-sm">
                <div>
                  <p className="font-semibold">{item.name || item.variant?.product?.name}</p>
                  {item.variant_label && <p className="text-xs text-[#555555]">{item.variant_label}</p>}
                  <p className="text-xs text-[#555555]">Qty: {item.quantity}</p>
                </div>
                <span className="font-bold">{fmt((item.price ?? 0) * item.quantity)}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href={`/pages/track-order?order=${order.number}`}
          className="flex-1 text-center bg-[#4A7C59] hover:bg-green-800 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          Track Order
        </Link>
        <a
          href={`https://wa.me/?text=${whatsappText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-center bg-[#25D366] hover:bg-green-500 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          Share on WhatsApp
        </a>
        <Link
          href="/products"
          className="flex-1 text-center border-2 border-[#1A1A1A] hover:bg-gray-50 text-[#1A1A1A] font-bold py-3 px-6 rounded-lg transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    </main>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-[#4A7C59]">Loading…</div>}>
      <OrderConfirmationContent />
    </Suspense>
  );
}
