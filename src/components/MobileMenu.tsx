"use client";
import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAppDispatch } from "@/lib/hooks/redux";
import { addItem, openCart } from "@/lib/features/carts/cartsSlice";

interface NavLink { title: string; url: string; }
interface Product {
  id: number; name: string; slug: string;
  price: number | string | null;
  compare_at_price?: number | string | null;
  image_url: string;
  variants?: Array<{ id: number; price: number | string; stock_count: number; options: Record<string, string> }>;
}
interface Props {
  isOpen: boolean;
  onClose: () => void;
  navLinks?: NavLink[];
  featuredProducts?: Product[];
}

function fmt(p: number | string | null) {
  if (!p) return "";
  const n = typeof p === "string" ? parseFloat(p) : p;
  return `₦${n.toLocaleString("en-NG", { minimumFractionDigits: 0 })}`;
}

const DEFAULT_NAV: NavLink[] = [
  { title: "Shop", url: "/products" },
  { title: "Collections", url: "/collections" },
  { title: "Bundles", url: "/bundles" },
  { title: "About", url: "/pages/about" },
  { title: "Contact", url: "/contact" },
];

export default function MobileMenu({ isOpen, onClose, navLinks = DEFAULT_NAV, featuredProducts = [] }: Props) {
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  useEffect(() => { onClose(); }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const discounted = featuredProducts
    .filter((p) => p.compare_at_price && Number(p.compare_at_price) > Number(p.price))
    .slice(0, 3);

  const handleAdd = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    const v = product.variants?.[0];
    if (!v) return;
    dispatch(addItem({
      variantId: v.id, productId: product.id, name: product.name,
      variantLabel: "Default", price: Number(v.price),
      imageUrl: product.image_url, quantity: 1, slug: product.slug,
    }));
    dispatch(openCart());
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />
      <div className="fixed top-0 right-0 h-full w-80 max-w-[92vw] bg-white z-50 lg:hidden flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <span className="font-bold text-[#1A1A1A] text-lg">Menu</span>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-lg transition-colors">✕</button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <nav className="px-4 py-3">
            {navLinks.map((link) => (
              <Link key={link.url} href={link.url} onClick={onClose}
                className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-base font-medium transition-colors mb-0.5 ${
                  pathname === link.url ? "bg-[#E8F0E9] text-[#4A7C59]" : "text-[#1A1A1A] hover:bg-gray-50"
                }`}>
                {link.title} <span className="text-gray-400">›</span>
              </Link>
            ))}
          </nav>
          <div className="mx-4 border-t border-gray-100" />
          <div className="px-4 py-3 space-y-0.5">
            {[
              { icon: "👤", label: "My Account", href: "/account/profile" },
              { icon: "♡", label: "Wishlist", href: "/wishlist" },
              { icon: "📦", label: "My Orders", href: "/account/orders" },
              { icon: "🔍", label: "Track Order", href: "/pages/track-order" },
            ].map((item) => (
              <Link key={item.href} href={item.href} onClick={onClose}
                className="flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium text-[#555] hover:bg-gray-50 transition-colors">
                <span className="text-base">{item.icon}</span>{item.label}
              </Link>
            ))}
          </div>
          {discounted.length > 0 && (
            <div className="mx-4 mb-4 bg-[#FFF7ED] rounded-2xl p-4 border border-orange-100">
              <p className="text-xs font-bold text-[#F97316] uppercase tracking-wider mb-3">🔥 Special Offers</p>
              <div className="space-y-2">
                {discounted.map((product) => {
                  const pct = Math.round((1 - Number(product.price) / Number(product.compare_at_price)) * 100);
                  return (
                    <div key={product.id} className="flex items-center gap-3 bg-white rounded-xl p-2.5 border border-orange-50">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-50">
                        <Image src={product.image_url} alt={product.name} fill className="object-cover" sizes="48px" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-[#1A1A1A] truncate">{product.name}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-xs font-bold text-[#1A1A1A]">{fmt(product.price)}</span>
                          <span className="text-xs text-[#888] line-through">{fmt(product.compare_at_price!)}</span>
                          <span className="text-[10px] bg-[#F97316] text-white px-1.5 py-0.5 rounded font-bold">-{pct}%</span>
                        </div>
                      </div>
                      <button onClick={(e) => handleAdd(product, e)}
                        className="flex-shrink-0 bg-[#4A7C59] text-white text-xs font-bold px-3 py-2 rounded-lg hover:bg-[#2D4A32] transition-colors">
                        Add
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        <div className="border-t border-gray-100 px-4 py-4">
          <p className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider mb-3">
            Quick Shop
          </p>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {(featuredProducts || []).slice(0, 3).map((product) => {
              const v = product.variants?.[0];
              return (
                <div key={product.id} className="flex-shrink-0 w-28 bg-[#F5F4F0] rounded-2xl overflow-hidden border border-gray-100">
                  <div className="relative w-full bg-[#EFEFEB]" style={{ aspectRatio: "1/1" }}>
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="112px"
                    />
                  </div>
                  <div className="p-2">
                    <p className="text-xs font-semibold text-[#1A1A1A] line-clamp-1 mb-1">
                      {product.name}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs font-bold text-[#1A1A1A]">
                        {product.price
                          ? `₦${Number(product.price).toLocaleString("en-NG")}`
                          : ""}
                      </p>
                      {v && (
                        <button
                          onClick={(e) => handleAdd(product, e)}
                          className="w-7 h-7 bg-[#F97316] hover:bg-orange-600 text-white rounded-lg flex items-center justify-center flex-shrink-0 transition-colors"
                          aria-label="Add to cart"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
