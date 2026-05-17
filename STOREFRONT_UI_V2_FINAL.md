# SHOPSOFLY — STOREFRONT UI V2 — FINAL BRIEF
## For: GitHub Copilot Agent (VS Code Agent Mode)
### Working Directory: `/Users/user/Desktop/shopsofly-storefront`

---

## BEFORE YOU START — READ THESE 5 RULES

1. **Never touch**: `next.config.js`, `src/lib/store.ts`, `src/app/providers.tsx`, `src/app/layout.tsx`
2. **Build with Node 18**: `source ~/.nvm/nvm.sh && nvm use 18 && npm run build`
3. **Check before creating**: if a file already exists, READ it first, then replace carefully
4. **One step at a time**: complete and verify each step before moving to the next
5. **No new packages**: use only what is already in `package.json`

---

## STEP 0 — READ CURRENT STATE FIRST

```bash
cat src/components/ProductCard.tsx | head -20
head -30 src/app/page.tsx
cat src/components/MobileMenu.tsx 2>/dev/null | head -20 || echo "FILE NOT FOUND"
grep -n "openCart\|addItem\|clearCart\|isOpen" src/lib/features/carts/cartsSlice.ts | head -15
```

Paste results, then continue.

---

## STEP 1 — ENSURE CARTSSLICE HAS openCart AND closeCart

```bash
grep -n "openCart\|closeCart" src/lib/features/carts/cartsSlice.ts
```

If either is missing, open `src/lib/features/carts/cartsSlice.ts` and:

1. Add to the `initialState`:
```typescript
isOpen: false,
```

2. Add to the `reducers` object:
```typescript
openCart: (state) => { state.isOpen = true; },
closeCart: (state) => { state.isOpen = false; },
```

3. Add to the exports line:
```typescript
export const { addItem, removeItem, updateQuantity, clearCart, openCart, closeCart, setOrderNotes, setCoupon, removeCoupon } = cartsSlice.actions;
```

Only add what is missing — do not duplicate existing actions.

---

## STEP 2 — REPLACE `src/components/ProductCard.tsx`

Portrait card (3:4 ratio). Quick Buy slides up on hover and adds to cart immediately.

```tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useAppDispatch } from "@/lib/hooks/redux";
import { addItem, openCart } from "@/lib/features/carts/cartsSlice";

interface Variant {
  id: number;
  price: number | string;
  stock_count: number;
  options: Record<string, string>;
}

interface Product {
  id: number;
  name: string;
  slug: string;
  price: number | string | null;
  compare_at_price?: number | string | null;
  image_url: string;
  variants?: Variant[];
  taxons?: Array<{ name: string }>;
}

function fmt(p: number | string | null) {
  if (!p) return "Price TBD";
  const n = typeof p === "string" ? parseFloat(p) : p;
  return `₦${n.toLocaleString("en-NG", { minimumFractionDigits: 0 })}`;
}

export default function ProductCard({ product }: { product: Product }) {
  const dispatch = useAppDispatch();
  const v = product.variants?.[0];
  const hasDisc = product.compare_at_price && Number(product.compare_at_price) > Number(product.price);
  const discPct = hasDisc
    ? Math.round((1 - Number(product.price) / Number(product.compare_at_price!)) * 100)
    : 0;
  const category = product.taxons?.[0]?.name;

  const handleQuickBuy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!v) return;
    dispatch(addItem({
      variantId: v.id,
      productId: product.id,
      name: product.name,
      variantLabel: Object.entries(v.options || {}).map(([k, val]) => `${k}: ${val}`).join(" / ") || "Default",
      price: Number(v.price),
      imageUrl: product.image_url,
      quantity: 1,
      slug: product.slug,
    }));
    dispatch(openCart());
  };

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="bg-[#F5F4F0] rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-transparent hover:border-[#4A7C59]/20 flex flex-col">
        <div className="relative overflow-hidden bg-[#EFEFEB]" style={{ aspectRatio: "3/4" }}>
          <Image
            src={product.image_url || "/placeholder.jpg"}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width:640px) 80vw,(max-width:1024px) 40vw,25vw"
          />
          {hasDisc && (
            <div className="absolute top-3 left-3 bg-[#F97316] text-white text-xs font-bold px-2.5 py-1 rounded-full">
              -{discPct}%
            </div>
          )}
          {v && (
            <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <button
                onClick={handleQuickBuy}
                className="w-full bg-white hover:bg-[#4A7C59] text-[#1A1A1A] hover:text-white font-bold py-3 px-4 rounded-xl text-sm transition-colors shadow-lg border border-gray-200 hover:border-[#4A7C59]"
              >
                Add To Cart
              </button>
            </div>
          )}
        </div>
        <div className="p-4 flex flex-col gap-1">
          {category && <p className="text-[10px] font-bold text-[#888] uppercase tracking-widest">{category}</p>}
          <h3 className="font-bold text-[#1A1A1A] text-sm leading-tight line-clamp-2 group-hover:text-[#4A7C59] transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="font-bold text-[#1A1A1A] text-sm">{fmt(product.price)}</span>
            {hasDisc && <span className="text-xs text-[#888] line-through">{fmt(product.compare_at_price!)}</span>}
          </div>
        </div>
      </div>
    </Link>
  );
}
```

---

## STEP 3 — CREATE `src/components/PopularSection.tsx`

Client component. Shows 3 products at a time. Left/right arrow buttons navigate through all products (up to 6).

```tsx
"use client";

import { useState } from "react";
import ProductCard from "@/components/ProductCard";

interface Product {
  id: number;
  name: string;
  slug: string;
  price: number | string | null;
  compare_at_price?: number | string | null;
  image_url: string;
  variants?: any[];
  taxons?: Array<{ name: string }>;
}

export default function PopularSection({ products }: { products: Product[] }) {
  const [start, setStart] = useState(0);
  const total = Math.min(products.length, 6);
  const canPrev = start > 0;
  const canNext = start + 3 < total;

  return (
    <section className="py-14 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-[#1A1A1A]">
              Most popular products
            </h2>
            <p className="text-sm text-[#555] mt-1">
              Our customers can&apos;t stop buying these
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setStart(Math.max(0, start - 3))}
              disabled={!canPrev}
              className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-base font-bold transition-all ${
                canPrev
                  ? "border-gray-300 text-[#1A1A1A] hover:bg-[#4A7C59] hover:text-white hover:border-[#4A7C59] cursor-pointer"
                  : "border-gray-100 text-gray-300 cursor-not-allowed"
              }`}
            >
              ←
            </button>
            <button
              onClick={() => setStart(Math.min(total - 3, start + 3))}
              disabled={!canNext}
              className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-base font-bold transition-all ${
                canNext
                  ? "border-gray-300 text-[#1A1A1A] hover:bg-[#4A7C59] hover:text-white hover:border-[#4A7C59] cursor-pointer"
                  : "border-gray-100 text-gray-300 cursor-not-allowed"
              }`}
            >
              →
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.slice(start, start + 3).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
```

---

## STEP 4 — CREATE `src/components/StarProduct.tsx`

Layout: thumbnails column LEFT → big main media CENTER → product info RIGHT.
Supports up to 3 images + YouTube video. Arrow buttons + thumbnail clicks both work.

```tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAppDispatch } from "@/lib/hooks/redux";
import { addItem, openCart } from "@/lib/features/carts/cartsSlice";

interface PImage { id: number; url: string; alt_text?: string; }

interface Product {
  id: number;
  name: string;
  slug: string;
  price: number | string | null;
  compare_at_price?: number | string | null;
  image_url: string;
  description?: string;
  video_url?: string;
  product_images?: PImage[];
  variants?: Array<{ id: number; price: number | string; stock_count: number; options: Record<string, string> }>;
  taxons?: Array<{ name: string }>;
}

type MediaItem =
  | { type: "image"; url: string; alt: string }
  | { type: "video"; videoId: string };

function fmt(p: number | string | null) {
  if (!p) return "";
  const n = typeof p === "string" ? parseFloat(p) : p;
  return `₦${n.toLocaleString("en-NG", { minimumFractionDigits: 0 })}`;
}

function getYTId(url: string) {
  return url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)?.[1] || null;
}

export default function StarProduct({ products }: { products: Product[] }) {
  const dispatch = useAppDispatch();
  const [mediaIdx, setMediaIdx] = useState(0);
  const [qty, setQty] = useState(1);

  const star = [...products].sort((a, b) => Number(b.price) - Number(a.price))[0];
  if (!star) return null;

  const media: MediaItem[] = [{ type: "image", url: star.image_url, alt: star.name }];
  (star.product_images || [])
    .filter((i) => i.url !== star.image_url)
    .slice(0, 2)
    .forEach((i) => media.push({ type: "image", url: i.url, alt: i.alt_text || star.name }));
  if (star.video_url) {
    const id = getYTId(star.video_url);
    if (id) media.push({ type: "video", videoId: id });
  }

  const v = star.variants?.[0];
  const hasDisc = star.compare_at_price && Number(star.compare_at_price) > Number(star.price);
  const discPct = hasDisc ? Math.round((1 - Number(star.price) / Number(star.compare_at_price!)) * 100) : 0;
  const category = star.taxons?.[0]?.name;
  const current = media[mediaIdx] || media[0];
  const nav = (dir: number) => setMediaIdx((i) => (i + dir + media.length) % media.length);

  const handleAdd = () => {
    if (!v) return;
    dispatch(addItem({
      variantId: v.id, productId: star.id, name: star.name,
      variantLabel: "Default", price: Number(v.price),
      imageUrl: star.image_url, quantity: qty, slug: star.slug,
    }));
    dispatch(openCart());
  };

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-10">
          <div className="h-px flex-1 bg-gray-100" />
          <span className="text-xs font-bold tracking-widest text-[#4A7C59] uppercase px-4">
            ⭐ Star Product
          </span>
          <div className="h-px flex-1 bg-gray-100" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[72px_1fr_1fr] gap-4 lg:gap-6 items-start bg-[#F5F4F0] rounded-3xl p-6 lg:p-8">

          {/* Column 1 — Thumbnails (desktop only) */}
          <div className="hidden lg:flex flex-col gap-3">
            {media.map((m, i) => (
              <button
                key={i}
                onClick={() => setMediaIdx(i)}
                className={`w-16 h-16 rounded-xl overflow-hidden border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                  mediaIdx === i ? "border-[#4A7C59] shadow-sm" : "border-gray-200 hover:border-gray-400"
                }`}
              >
                {m.type === "video" ? (
                  <div className="w-full h-full bg-gray-900 rounded-lg flex items-center justify-center text-white text-xl">▶</div>
                ) : (
                  <div className="relative w-full h-full">
                    <Image src={m.url} alt={m.alt} fill className="object-cover" sizes="64px" />
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Column 2 — Main media */}
          <div className="relative rounded-2xl overflow-hidden bg-[#EBEBEB]" style={{ aspectRatio: "1/1" }}>
            {current.type === "video" ? (
              <iframe
                src={`https://www.youtube.com/embed/${current.videoId}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-none"
              />
            ) : (
              <Image
                src={current.url}
                alt={current.alt}
                fill
                className="object-cover transition-opacity duration-300"
                sizes="(max-width:768px) 100vw,50vw"
                priority
              />
            )}
            {hasDisc && (
              <div className="absolute top-4 left-4 bg-[#F97316] text-white text-xs font-bold px-3 py-1.5 rounded-full">
                Save {discPct}%
              </div>
            )}
            {media.length > 1 && (
              <>
                <button onClick={() => nav(-1)} className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full w-9 h-9 flex items-center justify-center shadow text-base font-bold transition-colors">‹</button>
                <button onClick={() => nav(1)} className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full w-9 h-9 flex items-center justify-center shadow text-base font-bold transition-colors">›</button>
                <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">{mediaIdx + 1} / {media.length}</div>
              </>
            )}
          </div>

          {/* Column 3 — Info */}
          <div className="flex flex-col gap-4">
            {category && <p className="text-xs font-bold text-[#4A7C59] uppercase tracking-wider">{category}</p>}
            <h2 className="text-2xl lg:text-3xl font-bold text-[#1A1A1A] leading-tight">{star.name}</h2>
            <div className="flex items-center gap-1 text-amber-400 text-sm">★★★★★</div>
            {star.description && (
              <p className="text-sm text-[#555] leading-relaxed line-clamp-3"
                dangerouslySetInnerHTML={{ __html: star.description.replace(/<[^>]*>/g, "").slice(0, 200) + "..." }}
              />
            )}
            <ul className="space-y-2">
              {["✓ Genuine & certified product", "✓ Fast delivery across Nigeria", "✓ 30-day easy returns"].map((t) => (
                <li key={t} className="text-sm font-medium text-[#1A1A1A]">{t}</li>
              ))}
            </ul>
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-bold text-[#1A1A1A]">{fmt(star.price)}</span>
              {hasDisc && <span className="text-base text-[#888] line-through">{fmt(star.compare_at_price!)}</span>}
            </div>
            <div>
              <p className="text-xs text-[#555] mb-2 font-medium">Quantity</p>
              <div className="flex items-center border border-gray-200 rounded-full overflow-hidden w-fit bg-white">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-10 text-xl text-[#1A1A1A] flex items-center justify-center hover:bg-gray-50 transition-colors">−</button>
                <span className="w-10 text-center text-sm font-bold text-[#1A1A1A]">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="w-10 h-10 text-xl text-[#1A1A1A] flex items-center justify-center hover:bg-gray-50 transition-colors">+</button>
              </div>
            </div>
            {v && <p className="text-xs text-[#555]">{v.stock_count > 0 ? `${v.stock_count} in stock` : "Out of stock"}</p>}
            <div className="flex gap-3">
              <button onClick={handleAdd} className="flex-1 bg-[#4A7C59] hover:bg-[#2D4A32] text-white font-bold py-4 rounded-xl text-sm transition-colors">
                Add To Cart
              </button>
              <Link href={`/products/${star.slug}`} className="flex-1 text-center bg-[#2D4A32] hover:bg-[#1a2e1f] text-white font-bold py-4 rounded-xl text-sm transition-colors flex items-center justify-center">
                Buy It Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

---

## STEP 5 — CREATE `src/components/ProductTestimonials.tsx`

```tsx
"use client";
import { useState } from "react";

interface Testimonial {
  id: number; kind: string; body: string;
  media_url?: string; author: string;
}

function YTEmbed({ url }: { url: string }) {
  const id = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)?.[1];
  if (!id) return null;
  return (
    <div className="relative rounded-xl overflow-hidden" style={{ aspectRatio: "16/9" }}>
      <iframe src={`https://www.youtube.com/embed/${id}`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen className="absolute inset-0 w-full h-full border-none" />
    </div>
  );
}

export default function ProductTestimonials({ testimonials }: { testimonials: Testimonial[] }) {
  const [expanded, setExpanded] = useState<number | null>(null);
  if (!testimonials?.length) return null;
  return (
    <section className="py-10 border-t border-gray-100">
      <h2 className="text-xl font-bold text-[#1A1A1A] mb-6">What customers are saying</h2>
      <div className="space-y-5">
        {testimonials.map((t) => (
          <div key={t.id} className="bg-[#F8FAF8] rounded-2xl p-5 border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#4A7C59] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {t.author?.charAt(0)?.toUpperCase() || "C"}
              </div>
              <div>
                <p className="font-semibold text-[#1A1A1A] text-sm">{t.author || "Verified Customer"}</p>
                <div className="text-amber-400 text-xs">★★★★★</div>
              </div>
            </div>
            {t.kind === "youtube" && t.media_url && <YTEmbed url={t.media_url} />}
            {t.kind === "audio" && t.media_url && (
              <audio controls className="w-full rounded-lg mb-3"><source src={t.media_url} /></audio>
            )}
            {t.body && (
              <div className="mt-3">
                <p className={`text-[#555] text-sm leading-relaxed ${expanded !== t.id ? "line-clamp-3" : ""}`}>
                  &ldquo;{t.body}&rdquo;
                </p>
                {t.body.length > 180 && (
                  <button onClick={() => setExpanded(expanded === t.id ? null : t.id)}
                    className="text-xs text-[#4A7C59] font-semibold mt-1 hover:underline">
                    {expanded === t.id ? "Show less" : "Read more"}
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
```

---

## STEP 6 — CREATE `src/components/ProductFAQ.tsx`

Dark red left panel + accordion right. Matches the reference image exactly.

```tsx
"use client";
import { useState } from "react";

interface FAQItem { question: string; answer: string; }

const DEFAULTS: FAQItem[] = [
  { question: "How long does it take to process an order?", answer: "Orders are usually processed within 1–2 business days. You'll receive a confirmation message once your order is fully prepared and ready to ship." },
  { question: "Do you ship internationally?", answer: "Currently we deliver within Nigeria only. We ship to all 36 states and FCT. International shipping is coming soon." },
  { question: "What is your return policy?", answer: "We offer a 30-day hassle-free return policy. If you're not satisfied, contact us and we'll arrange a return or exchange." },
  { question: "What are your sizing options?", answer: "Sizing varies by product. Each product page shows available options. Contact us if you need help choosing the right size." },
  { question: "Can I pay on delivery?", answer: "Yes, Cash on Delivery is available for select locations. You can also pay securely via Paystack, bank transfer, or card." },
];

export default function ProductFAQ({ faqs, whatsappNumber }: { faqs?: FAQItem[]; whatsappNumber?: string }) {
  const [open, setOpen] = useState<number | null>(0);
  const items = faqs?.length ? faqs : DEFAULTS;
  const waLink = whatsappNumber ? `https://wa.me/${whatsappNumber.replace(/\D/g, "")}` : "https://wa.me/";

  return (
    <section className="py-10 border-t border-gray-100">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8">
        {/* Left — dark red help panel */}
        <div className="bg-[#c0392b] rounded-2xl p-7 flex flex-col justify-between min-h-[260px]">
          <div>
            <h3 className="text-xl font-bold text-white mb-3 leading-tight">Still need help?</h3>
            <p className="text-sm text-white/80 leading-relaxed mb-6">
              Shoot our team a message and we&apos;ll get back to you ASAP.
            </p>
          </div>
          <a href={waLink} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-[#1A1A1A] font-semibold px-5 py-3 rounded-full text-sm hover:bg-gray-100 transition-colors w-fit">
            Contact us <span>›</span>
          </a>
        </div>

        {/* Right — accordion */}
        <div>
          <h2 className="text-2xl font-bold text-[#1A1A1A] mb-5">Frequently asked questions</h2>
          <div className="space-y-2">
            {items.map((faq, i) => (
              <div key={i} className="border border-gray-200 rounded-2xl overflow-hidden bg-white">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-[#1A1A1A] text-sm pr-4">{faq.question}</span>
                  <div className={`w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-[#555] text-sm flex-shrink-0 transition-transform duration-200 ${open === i ? "rotate-180" : ""}`}>
                    ∨
                  </div>
                </button>
                {open === i && (
                  <div className="px-5 pb-5">
                    <p className="text-sm text-[#555] leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
```

---

## STEP 7 — REPLACE `src/components/MobileMenu.tsx`

```tsx
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
                className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-base font-medium transition-colors mb-1 ${
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
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#555] hover:bg-gray-50 transition-colors">
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
        <div className="px-5 py-4 border-t border-gray-100">
          <Link href="/products" onClick={onClose}
            className="block w-full text-center bg-[#F97316] hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl transition-colors">
            Shop All Products
          </Link>
        </div>
      </div>
    </>
  );
}
```

---

## STEP 8 — UPDATE HOMEPAGE `src/app/page.tsx`

Read it first: `cat src/app/page.tsx`

Then make these targeted changes only:

### 8a — Add imports (after existing imports):
```tsx
import StarProduct from "@/components/StarProduct";
import PopularSection from "@/components/PopularSection";
```

### 8b — Add StarProduct AFTER hero section, BEFORE stats/trust bar:
```tsx
<StarProduct products={products} />
```

### 8c — Replace "New Arrivals" section entirely with:
```tsx
<PopularSection products={products} />
```

### 8d — Ensure Featured Products section uses `<ProductCard product={product} />`
If it's not already using ProductCard, import it and replace inline card code.

---

## STEP 9 — UPDATE PRODUCT DETAIL PAGE

```bash
wc -l "src/app/products/[slug]/page.tsx"
head -10 "src/app/products/[slug]/page.tsx"
```

### 9a — Ensure `"use client"` is at top of file
If missing, add it as line 1.

### 9b — Add imports:
```tsx
import { useState } from "react";
import ProductTestimonials from "@/components/ProductTestimonials";
import ProductFAQ from "@/components/ProductFAQ";
```

### 9c — Add state for gallery at top of component:
```tsx
const [mediaIdx, setMediaIdx] = useState(0);
```

### 9d — Build media array after state:
```tsx
type MediaItem = { type: "image"; url: string; alt: string } | { type: "video"; videoId: string };
const media: MediaItem[] = [{ type: "image", url: product.image_url, alt: product.name }];
(product.product_images || [])
  .filter((img: any) => img.url !== product.image_url)
  .slice(0, 1)
  .forEach((img: any) => media.push({ type: "image", url: img.url, alt: img.alt_text || product.name }));
if (product.video_url) {
  const ytId = product.video_url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)?.[1];
  if (ytId) media.push({ type: "video", videoId: ytId });
}
const currentMedia = media[mediaIdx] || media[0];
const navMedia = (dir: number) => setMediaIdx((i) => (i + dir + media.length) % media.length);
```

### 9e — Replace the main product image block with this gallery:
Find the `<Image` tag showing `product.image_url` in the left/top section and replace its container with:

```tsx
<div className="grid grid-cols-[56px_1fr] gap-3 items-start">
  {media.length > 1 && (
    <div className="flex flex-col gap-2">
      {media.map((m, i) => (
        <button key={i} onClick={() => setMediaIdx(i)}
          className={`w-14 h-14 rounded-xl overflow-hidden border-2 flex items-center justify-center flex-shrink-0 transition-all ${
            mediaIdx === i ? "border-[#4A7C59] shadow-sm" : "border-gray-200 hover:border-gray-400"
          }`}>
          {m.type === "video" ? (
            <div className="w-full h-full bg-gray-900 rounded-lg flex items-center justify-center text-white text-lg">▶</div>
          ) : (
            <div className="relative w-full h-full">
              <Image src={m.url} alt={m.alt} fill className="object-cover" sizes="56px" />
            </div>
          )}
        </button>
      ))}
    </div>
  )}
  <div className="relative rounded-2xl overflow-hidden bg-gray-50" style={{ aspectRatio: "1/1" }}>
    {currentMedia.type === "video" ? (
      <iframe src={`https://www.youtube.com/embed/${currentMedia.videoId}`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen className="absolute inset-0 w-full h-full border-none" />
    ) : (
      <Image src={currentMedia.url} alt={currentMedia.alt} fill
        className="object-cover transition-opacity duration-300"
        sizes="(max-width:768px) 100vw,50vw" priority />
    )}
    {media.length > 1 && (
      <>
        <button onClick={() => navMedia(-1)} className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full w-9 h-9 flex items-center justify-center shadow text-base font-bold">‹</button>
        <button onClick={() => navMedia(1)} className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full w-9 h-9 flex items-center justify-center shadow text-base font-bold">›</button>
        <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">{mediaIdx + 1} / {media.length}</div>
      </>
    )}
  </div>
</div>
```

### 9f — Add testimonials and FAQ after the product description section:
```tsx
{product.testimonials && product.testimonials.length > 0 && (
  <ProductTestimonials testimonials={product.testimonials} />
)}
<ProductFAQ />
```

---

## STEP 10 — BUILD

```bash
source ~/.nvm/nvm.sh && nvm use 18 && cd /Users/user/Desktop/shopsofly-storefront && npm run build 2>&1 | tail -40
```

**Fix every error.** Common issues:

| Error | Fix |
|---|---|
| `openCart is not exported` | Add to cartsSlice exports (Step 1) |
| `Cannot find module StarProduct` | Create the file (Step 4) |
| `Cannot find module PopularSection` | Create the file (Step 3) |
| `product.product_images is not iterable` | Use `(product.product_images \|\| [])` |
| `product.testimonials is not iterable` | Use `(product.testimonials \|\| [])` |
| `useState is not defined` | Add `"use client"` to top of file |
| `Type error on addItem` | Check CartItem interface in cartsSlice matches the payload shape |

Build must show `✓ Compiled successfully` before pushing.

---

## STEP 11 — COMMIT AND PUSH

```bash
cd /Users/user/Desktop/shopsofly-storefront
git add \
  src/components/ProductCard.tsx \
  src/components/StarProduct.tsx \
  src/components/PopularSection.tsx \
  src/components/ProductTestimonials.tsx \
  src/components/ProductFAQ.tsx \
  src/components/MobileMenu.tsx \
  src/app/page.tsx \
  src/app/globals.css \
  "src/app/products/[slug]/page.tsx"
git commit -m "feat: UI v2 — star product with video, most popular with arrows, inline gallery, FAQ, mobile menu"
git push origin main
```

---

## DONE — REPORT BACK WITH

1. Screenshot of homepage showing Star Product section (thumbnails left, big image center, info right)
2. Screenshot of Most Popular Products showing 3 portrait cards with arrow buttons
3. Screenshot of product detail page showing image gallery with thumbnails
4. Screenshot of product detail page FAQ section (red left panel + accordion)
5. Screenshot of mobile menu (hamburger open) showing nav + special offers strip
