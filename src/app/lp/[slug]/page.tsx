export const revalidate = 0;
import { notFound } from "next/navigation";
import ProductSpotlightTemplate from "@/components/landing-pages/ProductSpotlightTemplate";
import FlashSaleTemplate from "@/components/landing-pages/FlashSaleTemplate";
import { fetchStore, getSubdomainFromHeaders } from "@/lib/fetch-store";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://robust-annmaria-laserstarglobal-813df33a.koyeb.app";
import type { Metadata } from "next";
async function fetchLandingPageForMeta(slug: string) {
  try {
    const { subdomain, customDomain } = getSubdomainFromHeaders();
    const [pageRes, store] = await Promise.all([
      fetch(`${API_URL}/api/v2/storefront/landing_pages/${slug}`, {
        headers: { ...(customDomain ? { "X-Custom-Domain": customDomain } : { "X-Store-Subdomain": subdomain }), "Content-Type": "application/json" },
        cache: "no-store",
      }),
      fetchStore(),
    ]);
    if (!pageRes.ok) return null;
    const data = await pageRes.json();
    return { page: data.landing_page, store };
  } catch {
    return null;
  }
}
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const result = await fetchLandingPageForMeta(params.slug);
  if (!result || !result.page) {
    return { title: "Page Not Found" };
  }
  const page = result.page;
  const store = result.store;
  const s = page.settings || {};
  const title = page.title || (store?.name || "Shopsofly");
  const description = s.hero_subheadline || s.hero_headline || ("Check out this offer from " + (store?.name || "our store") + ".");
  const image = s.hero_image_url || store?.theme_settings?.logo_url || store?.theme_settings?.hero_image_url;
  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      images: image ? [{ url: image }] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: image ? [image] : [],
    },
  };
}

export default async function LandingPageRoute({ params }: { params: { slug: string } }) {
  const { subdomain, customDomain } = getSubdomainFromHeaders();

  try {
    const [pageRes, store] = await Promise.all([
      fetch(`${API_URL}/api/v2/storefront/landing_pages/${params.slug}`, {
        headers: { ...(customDomain ? { "X-Custom-Domain": customDomain } : { "X-Store-Subdomain": subdomain }), "Content-Type": "application/json" },
        cache: "no-store",
      }),
      fetchStore(),
    ]);

    if (!pageRes.ok) return notFound();
    const data = await pageRes.json();
    const page = data.landing_page;
    if (!page) return notFound();

    switch (page.template_key) {
      case "product_spotlight":
        return <ProductSpotlightTemplate page={page} store={store} />;
      case "flash_sale":
        return <FlashSaleTemplate page={page} store={store} />;
      default:
        return notFound();
    }
  } catch {
    return notFound();
  }
}
