"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAppSelector } from "@/lib/hooks/redux";
import { selectToken } from "@/lib/features/auth/authSlice";
import { getOrder } from "@/lib/api";

const fmt = (kobo: number) => `₦${(kobo / 100).toLocaleString("en-NG")}`;

const STATUS_STEPS = ["pending", "confirmed", "processing", "shipped", "delivered"];
const STATUS_LABELS: Record<string, string> = {
  pending: "Order Placed", confirmed: "Confirmed", processing: "Processing",
  shipped: "Shipped", delivered: "Delivered", cancelled: "Cancelled",
};

export default function OrderDetailPage() {
  const params = useParams<{ number: string }>();
  const token  = useAppSelector(selectToken);

  const [order,   setOrder]   = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  useEffect(() => {
    if (!params.number) return;
    getOrder(params.number, token ?? undefined)
      .then((r) => setOrder(r.data.order ?? r.data))
      .catch(() => setError("Could not load order."))
      .finally(() => setLoading(false));
  }, [params.number, token]);

  if (loading) return <div className="animate-pulse text-[#4A7C59] font-semibold">Loading…</div>;
  if (error)   return <p className="text-red-500">{error}</p>;
  if (!order)  return null;

  const currentStep = STATUS_STEPS.indexOf(order.status);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/account/orders" className="text-sm text-[#555555] hover:text-[#4A7C59]">← Orders</Link>
        <h2 className="font-heading font-bold text-xl text-[#1A1A1A]">Order #{order.number}</h2>
      </div>

      {/* Status timeline */}
      <section className="bg-white border border-gray-100 rounded-xl p-6">
        <h3 className="font-bold text-base mb-5">Status</h3>
        <div className="relative flex justify-between">
          <div className="absolute top-4 left-4 right-4 h-0.5 bg-gray-200">
            <div
              className="h-full bg-[#4A7C59]"
              style={{ width: `${(Math.max(0, currentStep) / (STATUS_STEPS.length - 1)) * 100}%` }}
            />
          </div>
          {STATUS_STEPS.map((s, i) => {
            const done = i <= currentStep;
            return (
              <div key={s} className="relative flex flex-col items-center gap-1.5">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 z-10 ${done ? "bg-[#4A7C59] border-[#4A7C59] text-white" : "bg-white border-gray-300 text-gray-300"}`}>
                  {done ? "✓" : i + 1}
                </div>
                <p className={`text-[10px] text-center max-w-[56px] font-medium ${done ? "text-[#4A7C59]" : "text-gray-400"}`}>
                  {STATUS_LABELS[s]}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Order summary */}
      <section className="bg-white border border-gray-100 rounded-xl p-6 grid sm:grid-cols-2 gap-5 text-sm">
        <div>
          <p className="font-bold mb-2">Deliver To</p>
          <p>{order.first_name} {order.last_name}</p>
          <p className="text-[#555555]">{order.address1}{order.address2 ? `, ${order.address2}` : ""}</p>
          <p className="text-[#555555]">{order.city}, {order.state_name}</p>
          <p className="text-[#555555]">{order.lga}</p>
        </div>
        <div>
          <p className="font-bold mb-2">Order Info</p>
          <p><span className="text-[#555555]">Email: </span>{order.email}</p>
          <p><span className="text-[#555555]">Phone: </span>{order.phone}</p>
          <p><span className="text-[#555555]">Payment: </span>{order.payment_method?.replace("_", " ")}</p>
          <p><span className="text-[#555555]">Total: </span><strong className="text-[#F97316]">{fmt(order.total ?? 0)}</strong></p>
        </div>
      </section>

      {/* Line items */}
      {Array.isArray(order.line_items) && order.line_items.length > 0 && (
        <section className="bg-white border border-gray-100 rounded-xl p-6">
          <h3 className="font-bold text-base mb-4">Items</h3>
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

      <Link
        href={`/pages/track-order?order=${order.number}`}
        className="inline-block bg-[#4A7C59] hover:bg-green-800 text-white font-bold px-6 py-3 rounded-lg text-sm transition-colors"
      >
        Track Order
      </Link>
    </div>
  );
}
