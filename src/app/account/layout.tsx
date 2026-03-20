"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import { selectIsAuthenticated, logout } from "@/lib/features/auth/authSlice";

const NAV_LINKS = [
  { href: "/account/profile",   label: "👤 My Profile" },
  { href: "/account/orders",    label: "📦 My Orders" },
  { href: "/account/addresses", label: "📍 Addresses" },
  { href: "/wishlist",          label: "❤️ Wishlist" },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const router          = useRouter();
  const pathname        = usePathname();
  const dispatch        = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/account/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="font-heading text-3xl font-bold text-[#1A1A1A] mb-8">My Account</h1>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="md:w-56 shrink-0">
          <nav className="bg-white border border-gray-100 rounded-xl overflow-hidden">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center px-5 py-4 text-sm font-semibold border-b border-gray-50 last:border-0 transition-colors ${
                  pathname.startsWith(href)
                    ? "bg-[#E8F0E9] text-[#4A7C59]"
                    : "hover:bg-gray-50 text-[#1A1A1A]"
                }`}
              >
                {label}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-5 py-4 text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors"
            >
              🚪 Logout
            </button>
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
