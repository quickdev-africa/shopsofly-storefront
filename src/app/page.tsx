import Link from "next/link";
import Image from "next/image";
import { getStore, getProducts, getTaxons, getBundles } from "@/lib/api";
import AnnouncementBar from "@/components/AnnouncementBar";
import WhatsAppButton from "@/components/WhatsAppButton";
import CookieConsent from "@/components/CookieConsent";

async function fetchHomeData() {
  try {
    const [storeRes, productsRes, taxonsRes, bundlesRes] = await Promise.allSettled([
      getStore(),
      getProducts({ per_page: 12, sort: "newest" }),
      getTaxons(),
      getBundles(),
    ]);
    return {
      store:    storeRes.status === "fulfilled"   ? storeRes.value.data.store       : null,
      products: productsRes.status === "fulfilled" ? productsRes.value.data.products : [],
      taxons:   taxonsRes.status === "fulfilled"   ? taxonsRes.value.data.taxons     : [],
      bundles:  bundlesRes.status === "fulfilled"  ? bundlesRes.value.data.bundles   : [],
    };
  } catch {
    return { store: null, products: [], taxons: [], bundles: [] };
  }
}

export default async function HomePage() {
  const { store, products, taxons, bundles } = await fetchHomeData();
  const theme = store?.theme_settings || {};

  const announcementText = theme.announcement_text || "Free delivery on orders over ₦50,000 • Shop the latest wellness products";
  const whatsappPhone    = theme.whatsapp_phone || "";
  const whatsappMessage  = theme.whatsapp_message || "Hello! I'd like to place an order.";

  const featuredProducts = products.slice(0, 8);
  const newArrivals      = products.slice(0, 8);

  return (
    <main className="min-h-screen font-body">
      {/* Announcement Bar */}
      <AnnouncementBar
        text={announcementText}
        bgColor={theme.announcement_bg || "#4A7C59"}
        textColor={theme.announcement_text_color || "#ffffff"}
        visible={theme.announcement_visible !== false}
      />

      {/* Hero Banner */}
      <section className="bg-brand-primary-light py-20 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 space-y-6">
            <h1 className="font-heading text-4xl md:text-6xl font-bold text-[#1A1A1A] leading-tight">
              {theme.hero_heading || "Discover Premium Wellness Products"}
            </h1>
            <p className="text-lg text-[#555555]">
              {theme.hero_subheading || "Curated products for your health, beauty and lifestyle."}
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
          <div className="flex-1 flex justify-center">
            {theme.hero_image_url ? (
              <Image src={theme.hero_image_url} alt="Hero" width={600} height={500} className="rounded-xl object-cover" />
            ) : (
              <div className="w-full max-w-md h-80 bg-[#4A7C59] rounded-xl flex items-center justify-center">
                <span className="text-white text-2xl font-heading font-bold">{store?.name || "Shopsofly"}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats / Trust Bar */}
      <section className="bg-[#1A1A1A] text-white py-8">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center px-4">
          {[
            { label: "Happy Customers",   value: "10,000+" },
            { label: "Products Available", value: "500+"   },
            { label: "States Delivered",  value: "36"      },
            { label: "Support Hours",     value: "24/7"    },
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
              <Link key={p.id} href={`/products/${p.slug}`} className="group">
                <div className="bg-gray-100 rounded-xl overflow-hidden aspect-square mb-3">
                  {p.image_url ? (
                    <Image src={p.image_url} alt={p.name} width={300} height={300} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  ) : (
                    <div className="w-full h-full bg-[#E8F0E9] flex items-center justify-center text-[#4A7C59] font-semibold text-sm px-4 text-center">{p.name}</div>
                  )}
                </div>
                <h3 className="font-semibold text-[#1A1A1A] text-sm line-clamp-2">{p.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  {p.compare_at_price && p.compare_at_price > p.price && (
                    <span className="text-gray-400 line-through text-sm">₦{p.compare_at_price?.toLocaleString()}</span>
                  )}
                  <span className="font-bold text-[#1A1A1A]">₦{p.price?.toLocaleString()}</span>
                </div>
              </Link>
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

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="py-16 px-4 max-w-6xl mx-auto">
          <h2 className="font-heading text-3xl font-bold text-[#1A1A1A] mb-8">New Arrivals</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {newArrivals.map((p: any) => (
              <Link key={p.id} href={`/products/${p.slug}`} className="group">
                <div className="bg-gray-100 rounded-xl overflow-hidden aspect-square mb-3">
                  {p.image_url ? (
                    <Image src={p.image_url} alt={p.name} width={300} height={300} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  ) : (
                    <div className="w-full h-full bg-[#E8F0E9] flex items-center justify-center text-[#4A7C59] font-semibold text-sm px-4 text-center">{p.name}</div>
                  )}
                </div>
                <h3 className="font-semibold text-[#1A1A1A] text-sm line-clamp-2">{p.name}</h3>
                <span className="font-bold text-[#1A1A1A]">₦{p.price?.toLocaleString()}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Bundles */}
      {bundles.length > 0 && (
        <section className="py-16 px-4 bg-[#E8F0E9]">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-heading text-3xl font-bold text-[#1A1A1A] mb-8">Product Bundles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {bundles.map((b: any) => (
                <Link key={b.id} href={`/bundles`} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="font-heading font-bold text-lg text-[#1A1A1A] mb-2">{b.name}</h3>
                  <p className="text-[#555555] text-sm mb-4 line-clamp-2">{b.description}</p>
                  {b.discount_percent > 0 && (
                    <span className="inline-block bg-[#F97316] text-white text-xs font-bold px-3 py-1 rounded-full">
                      Save {b.discount_percent}%
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="py-16 px-4 bg-[#4A7C59] text-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-heading text-3xl font-bold mb-4">Stay in the Loop</h2>
          <p className="text-[#E8F0E9] mb-8">Get exclusive deals and new arrivals straight to your inbox.</p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-3 rounded-lg text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#F97316]"
            />
            <button type="submit" className="bg-[#F97316] hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors">
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* Cookie Consent */}
      <CookieConsent />

      {/* WhatsApp Button */}
      <WhatsAppButton
        phone={whatsappPhone}
        message={whatsappMessage}
        visible={!!whatsappPhone}
      />
    </main>
  );
}
