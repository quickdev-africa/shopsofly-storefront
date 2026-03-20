"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAppSelector } from "@/lib/hooks/redux";
import { selectToken } from "@/lib/features/auth/authSlice";
import { getOrders } from "@/lib/api";

const fmt = (kobo: number) => `₦${(kobo / 100).toLocaleString("en-NG")}`;

const STATUS_COLORS: Record<string, string> = {
  pending:    "bg-yellow-100 text-yellow-800",
  confirmed:  "bg-blue-100 text-blue-800",
  processing: "bg-purple-100 text-purple-800",
  shipped:    "bg-indigo-100 text-indigo-800",
  delivered:  "bg-green-100 text-green-800",
  cancelled:  "bg-red-100 text-red-800",
};

export default function AccountOrdersPage() {
  const token = useAppSelector(selectToken);
  const [orders,  setOrders]  = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");
  const [page,    setPage]    = useState(1);
  const [hasMore,  setHasMore]  = useState(false);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    getOrders(token, page)
      .then((r) => {
        const data = r.data.orders ?? r.data;
        if (page === 1) {
          setOrders(data);
        } else {
          setOrders((prev) => [...prev, ...data]);
        }
        setHasMore(data.length === 20);
      })
      .catch(() => setError("Failed to load orders."))
      .finally(() => setLoading(false));
  }, [token, page]);

  if (loading && page === 1) {
    return <div className="animate-pulse text-[#4A7C59] font-semibold">Loading orders…</div>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-16 space-y-4">
        <p className="text-5xl">📦</p>
        <p className="text-[#555555]">You haven't placed any orders yet.</p>
        <Link href="/products" className="inline-block bg-[#F97316] hover:bg-orange-600 text-white font-bold px-8 py-3 rounded-lg transition-colors">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="font-heading font-bold text-xl text-[#1A1A1A]">My Orders</h2>
      <div className="space-y-3">
        {orders.map((order: any) => (
          <div key={order.id} className="bg-white border border-gray-100 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <p className="font-bold text-[#4A7C59]">#{order.number}</p>
              <p className="text-sm text-[#555555]">
                {new Date(order.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })}
              </p>
              <p className="text-sm">
                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-600"}`}>
                  {order.status}
                </span>
              </p>
            </div>
            <div className="flex items-center gap-4">
              <p className="font-bold text-[#F97316]">{fmt(order.total ?? 0)}</p>
              <Link
                href={`/account/orders/${order.number}`}
                className="text-sm font-semibold text-[#4A7C59] hover:underline"
              >
                View →
              </Link>
            </div>
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="text-center pt-4">
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={loading}
            className="border-2 border-[#4A7C59] text-[#4A7C59] hover:bg-[#E8F0E9] font-bold px-8 py-2.5 rounded-lg text-sm transition-colors disabled:opacity-50"
          >
            {loading ? "Loading…" : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
}
