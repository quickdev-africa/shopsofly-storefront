"use client";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { getOrder } from "@/lib/api";

const fmt = (kobo: number) => `₦${(kobo / 100).toLocaleString("en-NG")}`;

const STATUS_STEPS = [
  { key: "pending",    label: "Order Placed",  icon: "📦", description: "We've received your order." },
  { key: "confirmed",  label: "Confirmed",     icon: "✅", description: "Your order has been confirmed." },
  { key: "processing", label: "Processing",    icon: "⚙️", description: "We're preparing your items." },
  { key: "shipped",    label: "Shipped",       icon: "🚚", description: "Your order is on its way." },
  { key: "delivered",  label: "Delivered",     icon: "🏠", description: "Your order has arrived!" },
];

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialOrder = searchParams.get("order") ?? "";

  const [orderNumber, setOrderNumber] = useState(initialOrder);
  const [inputValue,  setInputValue]  = useState(initialOrder);
  const [order,       setOrder]       = useState<any>(null);
  const [loading,     setLoading]     = useState(!!initialOrder);
  const [error,       setError]       = useState("");
  const [searched,    setSearched]    = useState(false);

  const fetchOrder = async (num: string) => {
    if (!num.trim()) return;
    setLoading(true);
    setError("");
    setOrder(null);
    setSearched(true);
    try {
      const res = await getOrder(num.trim());
      setOrder(res.data.order ?? res.data);
    } catch {
      setError("Order not found. Please check the order number and try again.");
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch if pre-filled
  useState(() => {
    if (initialOrder) fetchOrder(initialOrder);
  });

  const currentStepIndex = order
    ? STATUS_STEPS.findIndex((s) => s.key === order.status)
    : -1;

  return (
    <main className="max-w-2xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="font-heading text-3xl font-bold text-[#1A1A1A]">Track Your Order</h1>
        <p className="text-[#555555]">Enter your order number to see the latest status.</p>
      </div>

      {/* Search Form */}
      <div className="bg-white border border-gray-100 rounded-xl p-6 space-y-3">
        <label className="block text-sm font-semibold mb-1">Order Number</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchOrder(inputValue)}
            placeholder="e.g. SHF-123456"
            className="flex-1 border-2 border-gray-200 focus:border-[#4A7C59] rounded-lg px-4 py-3 text-sm focus:outline-none"
          />
          <button
            onClick={() => fetchOrder(inputValue)}
            disabled={loading}
            className="bg-[#4A7C59] hover:bg-green-800 text-white font-bold px-6 py-3 rounded-lg text-sm transition-colors disabled:opacity-50"
          >
            {loading ? "…" : "Track"}
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-8 text-[#4A7C59] animate-pulse">Fetching order details…</div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-600 text-center">
          {error}
        </div>
      )}

      {/* Results */}
      {!loading && order && (
        <div className="space-y-6">
          {/* Order Info Header */}
          <div className="bg-white border border-gray-100 rounded-xl p-6">
            <div className="flex justify-between items-start flex-wrap gap-3">
              <div>
                <p className="font-bold text-xl text-[#4A7C59]">#{order.number}</p>
                <p className="text-sm text-[#555555]">{order.email}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-[#555555]">Total</p>
                <p className="font-bold text-[#F97316] text-lg">{fmt(order.total ?? 0)}</p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white border border-gray-100 rounded-xl p-6">
            <h2 className="font-heading font-bold text-lg mb-6">Order Timeline</h2>
            <div className="relative pl-8">
              {/* Vertical line */}
              <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-gray-200">
                <div
                  className="w-full bg-[#4A7C59] transition-all"
                  style={{ height: `${((currentStepIndex < 0 ? 0 : currentStepIndex) / (STATUS_STEPS.length - 1)) * 100}%` }}
                />
              </div>

              <div className="space-y-8">
                {STATUS_STEPS.map((step, idx) => {
                  const done    = idx <= currentStepIndex;
                  const current = idx === currentStepIndex;
                  return (
                    <div key={step.key} className="relative flex gap-4">
                      {/* Circle */}
                      <div
                        className={`absolute -left-8 w-8 h-8 rounded-full flex items-center justify-center text-sm border-2 transition-colors ${
                          done
                            ? "bg-[#4A7C59] border-[#4A7C59] text-white"
                            : "bg-white border-gray-300 text-gray-300"
                        } ${current ? "ring-4 ring-[#E8F0E9]" : ""}`}
                      >
                        {done ? "✓" : step.icon}
                      </div>
                      {/* Content */}
                      <div className={`pb-0 ${done ? "" : "opacity-40"}`}>
                        <p className={`font-bold text-sm ${current ? "text-[#4A7C59]" : ""}`}>{step.label}</p>
                        <p className="text-xs text-[#555555]">{step.description}</p>
                        {current && order.updated_at && (
                          <p className="text-xs text-[#4A7C59] font-medium mt-1">
                            Last updated: {new Date(order.updated_at).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          {order.address1 && (
            <div className="bg-white border border-gray-100 rounded-xl p-6 text-sm">
              <h2 className="font-heading font-bold text-lg mb-3">Delivery Address</h2>
              <p className="font-semibold">{order.first_name} {order.last_name}</p>
              <p className="text-[#555555]">{order.address1}{order.address2 ? `, ${order.address2}` : ""}</p>
              <p className="text-[#555555]">{order.city}, {order.state_name} — {order.lga}</p>
              <p className="text-[#555555]">{order.phone}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Link
              href="/"
              className="flex-1 text-center border-2 border-[#1A1A1A] hover:bg-gray-50 text-[#1A1A1A] font-bold py-3 rounded-lg transition-colors text-sm"
            >
              Back to Home
            </Link>
            <Link
              href="/products"
              className="flex-1 text-center bg-[#F97316] hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition-colors text-sm"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      )}

      {/* Empty state (searched but no result) */}
      {!loading && searched && !order && !error && (
        <div className="text-center py-8 text-[#555555]">
          No order found.
        </div>
      )}
    </main>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-[#4A7C59]">Loading…</div>}>
      <TrackOrderContent />
    </Suspense>
  );
}
