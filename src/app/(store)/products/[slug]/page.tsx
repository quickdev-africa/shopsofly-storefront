import StarRating from "@/components/StarRating";
import ReviewForm from "@/components/ReviewForm";
export const revalidate = 60;

import { getProduct } from "@/lib/api";
import { fetchStore } from "@/lib/fetch-store";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductActions from "@/components/product-page/ProductActions";
import Image from "next/image";
import ProductGallery from "@/components/ProductGallery";
import ProductTestimonials from "@/components/ProductTestimonials";
import ProductFAQ from "@/components/ProductFAQ";
import type { Metadata } from "next";
async function fetchProductForMeta(slug: string) {
  try {
    const store = await fetchStore();
    if (!store) return null;
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://robust-annmaria-laserstarglobal-813df33a.koyeb.app";
    const res = await fetch(`${API_URL}/api/v2/storefront/products/${slug}`, {
      headers: { ...(store.domain ? { "X-Custom-Domain": store.domain } : { "X-Store-Subdomain": store.subdomain }), "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return { product: data.product, store };
  } catch {
    return null;
  }
}
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const result = await fetchProductForMeta(params.slug);
  if (!result || !result.product) {
    return { title: "Product Not Found" };
  }
  const product = result.product;
  const store = result.store;
  const image = product.product_images?.[0]?.url || product.images?.[0]?.url || product.image_url;
  const description = (product.description || "").replace(/<[^>]*>/g, "").slice(0, 160) || ("Buy " + product.name + " at " + (store?.name || "our store") + ".");
  return {
    title: product.name + " | " + (store?.name || "Shopsofly"),
    description: description,
    openGraph: {
      title: product.name,
      description: description,
      images: image ? [{ url: image }] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: description,
      images: image ? [image] : [],
    },
  };
}

type Props = {
  params: { slug: string };
};

export default async function ProductDetailPage({ params }: Props) {
  let product: any;
  let store: any;
  try {
    store = await fetchStore();
    if (!store) notFound();
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://robust-annmaria-laserstarglobal-813df33a.koyeb.app";
    const res = await fetch(`${API_URL}/api/v2/storefront/products/${params.slug}`, {
      headers: { ...(store.domain ? { "X-Custom-Domain": store.domain } : { "X-Store-Subdomain": store.subdomain }), "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (!res.ok) notFound();
    const data = await res.json();
    product = data.product;
    if (!product) notFound();
  } catch {
    notFound();
  }

  const discount =
    product.compare_at_price && product.compare_at_price > product.price
      ? Math.round((1 - product.price / product.compare_at_price) * 100)
      : null;

  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name:        product.name,
    description: product.description,
    image:       product.image_url,
    offers: {
      "@type":       "Offer",
      price:         product.price,
      priceCurrency: "NGN",
      availability:  "https://schema.org/InStock",
    },
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Breadcrumb */}
      <nav className="text-sm text-[#555555] mb-8 flex gap-2">
        <Link href="/" className="hover:text-[#4A7C59]">Home</Link>
        <span>/</span>
        {product.taxons?.[0] && (
          <>
            <Link href={`/collections/${product.taxons[0].slug}`} className="hover:text-[#4A7C59]">
              {product.taxons[0].name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-[#1A1A1A] font-medium">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <ProductGallery product={product} />


        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="font-heading text-3xl font-bold text-[#1A1A1A]">{product.name}</h1>
            {(product.rating || 0) > 0 && (
              <StarRating rating={product.rating || 0} count={product.review_count} size="lg" />
            )}
            <div className="flex items-center gap-3 mt-3">
              {discount && (
                <span className="bg-[var(--color-accent)] text-white text-sm font-bold px-3 py-1 rounded-full">
                  Save {discount}%
                </span>
              )}
              <span className="text-2xl font-bold text-[#1A1A1A]">₦{Number(product.price)?.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              {product.compare_at_price && product.compare_at_price > product.price && (
                <span className="text-gray-400 line-through text-lg">₦{Number(product.compare_at_price)?.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              )}
            </div>
          </div>

          {/* Interactive Add to Cart (client component) */}
          <ProductActions product={product} />

          {/* Description */}
          {product.description && (
            <div>
              <h3 className="font-semibold text-[#1A1A1A] mb-2">Description</h3>
              <p className="text-[#555555] text-sm leading-relaxed">{product.description}</p>
            </div>
          )}

          {store?.theme_settings?.delivery_returns_enabled !== false && (
            <details className="border rounded-lg p-4">
              <summary className="font-semibold text-[#1A1A1A] cursor-pointer">Delivery & Returns</summary>
              <p className="text-sm text-[#555555] mt-3 whitespace-pre-line">
                {store?.theme_settings?.delivery_returns || "Standard delivery 2–5 business days. Express delivery available at checkout. Returns accepted within 7 days of delivery for unopened items."}
              </p>
            </details>
          )}
        </div>
      </div>

      {product.testimonials && product.testimonials.length > 0 && (
        <ProductTestimonials testimonials={product.testimonials} />
      )}
      {product.testimonials_enabled && (
        <div className="max-w-2xl mx-auto px-4 py-8">
          <ReviewForm productSlug={product.slug} />
        </div>
      )}
      <ProductFAQ />
    </main>
  );
}

