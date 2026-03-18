import { getProduct } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
  params: { slug: string };
};

export default async function ProductDetailPage({ params }: Props) {
  let product: any;

  try {
    const res = await getProduct(params.slug);
    product = res.data.product;
  } catch {
    notFound();
  }

  const discount =
    product.compare_at_price && product.compare_at_price > product.price
      ? Math.round((1 - product.price / product.compare_at_price) * 100)
      : null;

  // JSON-LD structured data
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
      {/* JSON-LD */}
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
        <div className="space-y-4">
          <div className="bg-gray-100 rounded-xl overflow-hidden aspect-square relative">
            {product.image_url ? (
              <Image src={product.image_url} alt={product.name} fill className="object-cover" priority />
            ) : (
              <div className="w-full h-full bg-[#E8F0E9] flex items-center justify-center text-[#4A7C59] font-semibold">{product.name}</div>
            )}
          </div>
          {product.images?.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.slice(0, 4).map((img: any, i: number) => (
                <div key={i} className="bg-gray-100 rounded-lg overflow-hidden aspect-square relative">
                  <Image src={img.url} alt={img.alt_text || product.name} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="font-heading text-3xl font-bold text-[#1A1A1A]">{product.name}</h1>
            <div className="flex items-center gap-3 mt-3">
              {discount && (
                <span className="bg-[#F97316] text-white text-sm font-bold px-3 py-1 rounded-full">
                  Save {discount}%
                </span>
              )}
              <span className="text-2xl font-bold text-[#1A1A1A]">₦{product.price?.toLocaleString()}</span>
              {product.compare_at_price && product.compare_at_price > product.price && (
                <span className="text-gray-400 line-through text-lg">₦{product.compare_at_price?.toLocaleString()}</span>
              )}
            </div>
          </div>

          {/* Variants */}
          {product.variants?.length > 0 && (
            <div>
              <h3 className="font-semibold text-[#1A1A1A] mb-3">Options</h3>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v: any) => (
                  <button
                    key={v.id}
                    className="border-2 border-gray-200 hover:border-[#4A7C59] rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:border-[#4A7C59] focus:outline-none"
                  >
                    {v.sku}
                    {v.stock_count === 0 && <span className="ml-1 text-red-400 text-xs">(Out)</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity + Add to Cart */}
          <div className="flex items-center gap-4">
            <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden">
              <button className="px-4 py-3 text-lg font-bold hover:bg-gray-100 transition-colors">−</button>
              <span className="px-6 py-3 font-semibold">1</span>
              <button className="px-4 py-3 text-lg font-bold hover:bg-gray-100 transition-colors">+</button>
            </div>
            <button className="flex-1 bg-[#F97316] hover:bg-orange-600 text-white font-bold py-4 rounded-lg transition-colors active:scale-95">
              Add to Cart
            </button>
          </div>

          {/* Action Row */}
          <div className="flex gap-3">
            <button className="flex items-center gap-2 border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-[#4A7C59] transition-colors">
              ♡ Wishlist
            </button>
            <a
              href={`https://wa.me/?text=Check this out: ${product.name} - ${typeof window !== "undefined" ? window.location.href : ""}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-[#25D366] transition-colors"
            >
              Share on WhatsApp
            </a>
          </div>

          {/* Trust Badges */}
          <div className="flex gap-4 flex-wrap text-sm text-[#555555]">
            {["🚚 Free Delivery", "✅ Genuine Product", "🔄 Easy Returns", "🔒 Secure Payment"].map(b => (
              <span key={b} className="flex items-center gap-1">{b}</span>
            ))}
          </div>

          {/* Description */}
          {product.description && (
            <div>
              <h3 className="font-semibold text-[#1A1A1A] mb-2">Description</h3>
              <p className="text-[#555555] text-sm leading-relaxed">{product.description}</p>
            </div>
          )}

          {/* Delivery & Returns Accordion */}
          <details className="border rounded-lg p-4">
            <summary className="font-semibold text-[#1A1A1A] cursor-pointer">Delivery & Returns</summary>
            <p className="text-sm text-[#555555] mt-3">
              Standard delivery 2–5 business days. Express delivery available at checkout.
              Returns accepted within 7 days of delivery for unopened items.
            </p>
          </details>
        </div>
      </div>

      {/* Testimonials */}
      {product.testimonials?.length > 0 && (
        <section className="mt-16">
          <h2 className="font-heading text-2xl font-bold text-[#1A1A1A] mb-8">Customer Reviews</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {product.testimonials.map((t: any) => (
              <div key={t.id} className="bg-gray-50 rounded-xl p-6">
                <p className="text-[#555555] italic">"{t.body}"</p>
                <p className="font-semibold text-[#1A1A1A] mt-4">— {t.author}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
