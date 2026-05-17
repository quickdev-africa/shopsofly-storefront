"use client";
import { useState } from "react";
import { sendReview } from "@/lib/api";

export default function ReviewForm({ productSlug }: { productSlug: string }) {
  const [form, setForm] = useState({ author: "", body: "", rating: 5 });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    if (!form.author || !form.body) { setError("Please fill in your name and review."); return; }
    setLoading(true);
    setError("");
    try {
      await sendReview(productSlug, form);
      setSuccess(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) return (
    <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
      <p className="text-2xl mb-2">⭐</p>
      <p className="font-semibold text-green-800">Thank you for your review!</p>
      <p className="text-sm text-green-600 mt-1">It will appear after approval.</p>
    </div>
  );

  return (
    <div className="bg-gray-50 rounded-2xl p-6">
      <h3 className="font-heading font-bold text-lg text-[#1A1A1A] mb-4">Leave a Review</h3>
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Your Rating</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} onClick={() => setForm(s => ({ ...s, rating: n }))}
                className={"text-2xl transition-colors " + (n <= form.rating ? "text-yellow-400" : "text-gray-200")}>
                ★
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
          <input type="text" value={form.author}
            onChange={(e) => setForm(s => ({ ...s, author: e.target.value }))}
            placeholder="e.g. John Doe"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#4A7C59]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Your Review</label>
          <textarea value={form.body}
            onChange={(e) => setForm(s => ({ ...s, body: e.target.value }))}
            placeholder="Share your experience with this product..."
            rows={4}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#4A7C59] resize-none" />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button onClick={handleSubmit} disabled={loading}
          className="w-full bg-[#4A7C59] hover:bg-[#2D4A32] text-white font-semibold py-3 rounded-xl text-sm transition-colors disabled:opacity-60">
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </div>
    </div>
  );
}
