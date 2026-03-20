"use client";
import Link from "next/link";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import { openCart, selectCartCount } from "@/lib/features/carts/cartsSlice";

interface Props {
  storeName: string;
  navLinks: { title: string; url: string }[];
}

export default function Header({ storeName, navLinks }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const dispatch   = useAppDispatch();
  const cartCount  = useAppSelector(selectCartCount);

  const defaultLinks = [
    { title: "Shop",    url: "/products"    },
    { title: "Collections", url: "/collections" },
    { title: "Bundles", url: "/bundles"     },
    { title: "About",   url: "/pages/about" },
    { title: "Contact", url: "/contact"     },
  ];

  const links = navLinks?.length > 0 ? navLinks : defaultLinks;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="font-heading font-bold text-xl text-[#4A7C59]">
          {storeName || "Shopsofly"}
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.title}
              href={link.url}
              className="text-[#1A1A1A] hover:text-[#4A7C59] font-medium text-sm transition-colors"
            >
              {link.title}
            </Link>
          ))}
        </nav>

        {/* Icons */}
        <div className="flex items-center gap-4">
          <Link href="/search" className="text-[#1A1A1A] hover:text-[#4A7C59]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </Link>
          <Link href="/wishlist" className="text-[#1A1A1A] hover:text-[#4A7C59]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </Link>
          {/* Cart Icon with badge */}
          <button
            onClick={() => dispatch(openCart())}
            className="relative text-[#1A1A1A] hover:text-[#4A7C59]"
            aria-label="Open cart"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#F97316] text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </button>
          <Link href="/account/login" className="text-[#1A1A1A] hover:text-[#4A7C59]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </Link>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-[#1A1A1A]"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-4">
          {links.map((link) => (
            <Link
              key={link.title}
              href={link.url}
              className="text-[#1A1A1A] hover:text-[#4A7C59] font-medium"
              onClick={() => setMenuOpen(false)}
            >
              {link.title}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
