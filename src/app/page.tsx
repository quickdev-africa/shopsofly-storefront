import Link from "next/link";
import Image from "next/image";
import { getStore, getProducts, getTaxons, getBundles } from "@/lib/api";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import BundleBuilder from "@/components/BundleBuilder";
import StarProduct from "@/components/StarProduct";
import PopularSection from "@/components/PopularSection";
import ProductCard from "@/components/ProductCard";

async function fetchHomeData() {
  try {
    const [storeRes, productsRes, taxonsRes, bundlesRes] = await Promise.allSettled([
      getStore(),
      getProducts({ per_page: 12, sort: "newest" }),
      getTaxons(),
      getBundles(),
    ]);
    return {
      store:         storeRes.status === "fulfilled"   ? storeRes.value.data.store              : null,
      products:      productsRes.status === "fulfilled" ? productsRes.value.data.products        : [],
      taxons:        taxonsRes.status === "fulfilled"   ? taxonsRes.value.data.taxons            : [],
      bundles:       bundlesRes.status === "fulfilled"  ? bundlesRes.value.data.bundles          : [],
      storeProducts: bundlesRes.status === "fulfilled"  ? (bundlesRes.value.data.store_products ?? []) : [],
    };
  } catch {
    return { store: null, products: [], taxons: [], bundles: [], storeProducts: [] };
  }
}

export default async function HomePage() {
  const { store, products, taxons, bundles, storeProducts } = await fetchHomeData();
  const theme = store?.theme_settings || {};

  const featuredProducts = products.slice(0, 8);

  return (
    <div className="min-h-screen font-body">

      {/* Hero Banner */}
      <section className="bg-[#E8F0E9] py-12 md:py-20 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 space-y-6">
            <h1 className="font-heading text-3xl md:text-6xl font-bold text-[#1A1A1A] leading-tight">
              {theme.hero_heading || "Discover Premium Wellness Products"}
            </h1>
            <p className="text-lg text-[#555555]">
              {theme.hero_subtext || "Curated products for your health, beauty and lifestyle."}
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link
                href="/products"
                className="inline-block bg-[#F97316] text-white font-semibold px-8 py-4 rounded-lg hover:bg-orange-600 transition-colors"
              >
                {theme.hero_cta_text || "Shop Now"}
              </Link>
              <Link
                href="/collections"
                className="inline-block border-2 border-[#4A7C59] text-[#4A7C59] font-semibold px-8 py-4 rounded-lg hover:bg-[#4A7C59] hover:text-white transition-colors"
              >
                Browse Collections
              </Link>
            </div>
          </div>
          <div className="flex-1 flex justify-center w-full">
            <Image
              src={theme.hero_image_url || "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1440&q=80"}
              alt="Hero"
              width={600}
              height={500}
              className="w-full rounded-xl object-cover h-48 md:h-80"
            />
          </div>
        </div>
      </section>

      {/* Stats / Trust Bar */}
      <section className="bg-[#1A1A1A] text-white py-8">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center px-4">
          {[
            { label: "Happy Customers",    value: "10,000+" },
            { label: "Products Available", value: "500+"    },
            { label: "States Delivered",   value: "36"      },
            { label: "Support Hours",      value: "24/7"    },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-3xl font-heading font-bold text-[#F97316]">{stat.value}</div>
              <div className="text-sm text-gray-300 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-16 px-4 max-w-6xl mx-auto">
          <h2 className="font-heading text-3xl font-bold text-[#1A1A1A] mb-8">Featured Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((p: any) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/products" className="inline-block border-2 border-[#1A1A1A] text-[#1A1A1A] font-semibold px-8 py-3 rounded-lg hover:bg-[#1A1A1A] hover:text-white transition-colors">
              View All Products
            </Link>
          </div>
        </section>
      )}

      {/* Collections Grid */}
      {taxons.length > 0 && (
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-heading text-3xl font-bold text-[#1A1A1A] mb-8">Shop by Collection</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {taxons.slice(0, 5).map((t: any) => (
                <Link key={t.id} href={`/collections/${t.slug}`} className="group relative rounded-xl overflow-hidden h-48">
                  {t.image_url ? (
                    <Image src={t.image_url} alt={t.name} fill className="object-cover group-hover:scale-105 transition-transform" />
                  ) : (
                    <div className="w-full h-full bg-[#4A7C59]" />
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-end p-4">
                    <span className="text-white font-heading font-bold text-xl">{t.name}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <StarProduct products={products} />

      {/* Bundle Builder */}
      {bundles.length > 0 && (
        <BundleBuilder bundles={bundles} storeProducts={storeProducts} />
      )}

      {/* Promotional Banner */}
      <section className="bg-[#2D4A32] py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="text-[#F97316] font-semibold uppercase tracking-widest text-sm">Limited Time Offer</span>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mt-3 mb-4">
            Up to 30% Off Wellness Products
          </h2>
          <p className="text-gray-300 text-lg mb-8">
            Stock up on your favourite health and lifestyle products before the sale ends.
          </p>
          <Link
            href="/products"
            className="inline-block bg-[#F97316] hover:bg-orange-600 text-white font-semibold px-10 py-4 rounded-lg transition-colors text-lg"
          >
            Shop the Sale →
          </Link>
        </div>
      </section>

      {/* Testimonials Carousel */}
      <TestimonialsCarousel />

      <PopularSection products={products} />

      {/* Newsletter */}
      <section className="py-16 px-4 bg-[#4A7C59] text-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-heading text-3xl font-bold mb-4">Stay in the Loop</h2>
          <p className="text-[#E8F0E9] mb-8">Get exclusive deals and new arrivals straight to your inbox.</p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-3 rounded-lg text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#F97316]"
            />
            <button className="bg-[#F97316] hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
