"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAppSelector } from "@/lib/hooks/redux";
import { selectToken } from "@/lib/features/auth/authSlice";
import { getOrders } from "@/lib/api";

const STATUS_STYLES: Record<string, string> = {
  pending:           "bg-amber-100 text-amber-700",
  payment_confirmed: "bg-blue-100 text-blue-700",
  processing:        "bg-blue-100 text-blue-700",
  shipped:           "bg-purple-100 text-purple-700",
  ready_for_pickup:  "bg-purple-100 text-purple-700",
  delivered:         "bg-green-100 text-green-700",
  picked_up:         "bg-green-100 text-green-700",
  completed:         "bg-green-100 text-green-700",
  cancelled:         "bg-red-100 text-red-700",
};

const STATUS_LABELS: Record<string, string> = {
  pending:           "Pending",
  payment_confirmed: "Payment Confirmed",
  processing:        "Processing",
  shipped:           "Shipped",
  ready_for_pickup:  "Ready for Pickup",
  delivered:         "Delivered",
  picked_up:         "Picked Up",
  completed:         "Completed",
  cancelled:         "Cancelled",
};

function formatPrice(amount: number | string) {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return `₦${num.toLocaleString("en-NG", { minimumFractionDigits: 0 })}`;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-NG", {
    day: "numeric", month: "short", year: "numeric"
  });
}

export default function OrdersPage() {
  const token = useAppSelector(selectToken);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    getOrders(token)
      .then((res) => {
        const data = res.data;
        setOrders(data.orders || data || []);
      })
      .catch(() => setError("Failed to load orders."))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#4A7C59] border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-[#555555]">Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
        <div className="text-6xl mb-4">📦</div>
        <h3 className="text-lg font-bold text-[#1A1A1A] mb-2">No orders yet</h3>
        <p className="text-[#555555] mb-6">When you place an order, it will appear here.</p>
        <Link
          href="/products"
          className="bg-[#F97316] hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-lg font-bold text-[#1A1A1A]">Order History</h2>
        <p className="text-sm text-[#555555]">{orders.length} order{orders.length !== 1 ? "s" : ""}</p>
      </div>

      <div className="divide-y divide-gray-50">
        {orders.map((order: any) => (
          <div key={order.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3 flex-wrap">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[order.state] || "bg-gray-100 text-gray-600"}`}>
                  {STATUS_LABELS[order.state] || order.state}
                </span>
                <span className="font-mono text-sm font-semibold text-[#1A1A1A]">
                  #{order.number}
                </span>
                <span className="text-sm text-[#555555]">
                  {order.item_count} item{order.item_count !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-bold text-[#1A1A1A]">{formatPrice(order.total)}</p>
                  <p className="text-xs text-[#555555]">{formatDate(order.created_at)}</p>
                </div>
                <Link
                  href={`/account/orders/${order.number}`}
                  className="text-sm font-semibold text-[#4A7C59] hover:underline whitespace-nowrap"
                >
                  View Details →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
