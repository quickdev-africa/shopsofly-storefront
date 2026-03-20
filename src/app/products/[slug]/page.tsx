import { getProduct } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductActions from "@/components/product-page/ProductActions";

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

          {/* Interactive Add to Cart (client component) */}
          <ProductActions product={product} />

          {/* Description */}
          {product.description && (
            <div>
              <h3 className="font-semibold text-[#1A1A1A] mb-2">Description</h3>
              <p className="text-[#555555] text-sm leading-relaxed">{product.description}</p>
            </div>
          )}

          <details className="border rounded-lg p-4">
            <summary className="font-semibold text-[#1A1A1A] cursor-pointer">Delivery & Returns</summary>
            <p className="text-sm text-[#555555] mt-3">
              Standard delivery 2–5 business days. Express delivery available at checkout.
              Returns accepted within 7 days of delivery for unopened items.
            </p>
          </details>
        </div>
      </div>

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

