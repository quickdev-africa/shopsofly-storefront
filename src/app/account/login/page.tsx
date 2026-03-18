"use client";
import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    // TODO: Integrate with customer auth endpoint in Batch 3
    setError("Customer login not yet available. Coming soon in Batch 3.");
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-heading text-3xl font-bold text-[#1A1A1A]">Sign In</h1>
          <p className="text-[#555555] mt-2">Welcome back! Sign in to your account.</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full border-2 border-gray-200 focus:border-[#4A7C59] rounded-lg px-4 py-3 focus:outline-none transition-colors"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-semibold text-[#1A1A1A]">
                  Password
                </label>
                <Link href="#" className="text-sm text-[#4A7C59] hover:underline">Forgot password?</Link>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full border-2 border-gray-200 focus:border-[#4A7C59] rounded-lg px-4 py-3 focus:outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</p>
            )}

            <button
              type="submit"
              className="w-full bg-[#F97316] hover:bg-orange-600 text-white font-bold py-4 rounded-lg transition-colors"
            >
              Sign In
            </button>
          </form>

          <p className="text-center text-sm text-[#555555] mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/account/register" className="text-[#4A7C59] font-semibold hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
