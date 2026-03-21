"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import { logout, selectIsAuthenticated, selectUser } from "@/lib/features/auth/authSlice";
import { clearCart } from "@/lib/features/carts/cartsSlice";

const navLinks = [
  { href: "/account/profile", label: "My Profile", icon: "👤" },
  { href: "/account/orders", label: "My Orders", icon: "📦" },
  { href: "/account/addresses", label: "My Addresses", icon: "📍" },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);
  const [hydrated, setHydrated] = useState(false);

  const isAuthPage = pathname === "/account/login" || pathname === "/account/register";

  // Wait for redux-persist to rehydrate before checking auth
  useEffect(() => {
    const timer = setTimeout(() => setHydrated(true), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (hydrated && !isAuthPage && !isAuthenticated) {
      router.push("/account/login");
    }
  }, [hydrated, isAuthPage, isAuthenticated, router]);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    router.push("/");
  };

  // Auth pages — no layout wrapper needed
  if (isAuthPage) {
    return <>{children}</>;
  }

  // Show loading spinner while redux-persist rehydrates
  if (!hydrated) {
    return (
      <div className="min-h-screen bg-[#F8FAF8] flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-[#4A7C59] border-t-transparent rounded-full" />
      </div>
    );
  }

  // Not authenticated after hydration — redirect happening
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F8FAF8]">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#1A1A1A]">My Account</h1>
          {user && (
            <p className="text-[#555555] text-sm mt-1">
              Welcome back, {user.first_name || user.email}
            </p>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar — desktop */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <nav className="flex flex-col">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href ||
                    (link.href === "/account/orders" && pathname.startsWith("/account/orders"));
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex items-center gap-3 px-4 py-3.5 text-sm font-medium transition-colors border-b border-gray-50 last:border-0 ${
                        isActive
                          ? "bg-[#E8F0E9] text-[#4A7C59] border-l-4 border-l-[#4A7C59]"
                          : "text-[#555555] hover:bg-gray-50 hover:text-[#1A1A1A]"
                      }`}
                    >
                      <span>{link.icon}</span>
                      {link.label}
                    </Link>
                  );
                })}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3.5 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors w-full text-left"
                >
                  <span>🚪</span>
                  Logout
                </button>
              </nav>
            </div>
          </aside>

          {/* Top tabs — mobile */}
          <div className="lg:hidden">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-1 flex gap-1 overflow-x-auto">
              {navLinks.map((link) => {
                const isActive = pathname === link.href ||
                  (link.href === "/account/orders" && pathname.startsWith("/account/orders"));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                      isActive
                        ? "bg-[#4A7C59] text-white"
                        : "text-[#555555] hover:bg-gray-100"
                    }`}
                  >
                    <span>{link.icon}</span>
                    {link.label}
                  </Link>
                );
              })}
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-red-500 hover:bg-red-50 whitespace-nowrap transition-colors ml-auto"
              >
                <span>🚪</span>
                Logout
              </button>
            </div>
          </div>

          {/* Main content */}
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
