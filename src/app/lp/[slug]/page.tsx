export const revalidate = 0;
import { notFound } from "next/navigation";
import ProductSpotlightTemplate from "@/components/landing-pages/ProductSpotlightTemplate";
import FlashSaleTemplate from "@/components/landing-pages/FlashSaleTemplate";
import { fetchStore, getSubdomainFromHeaders } from "@/lib/fetch-store";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://robust-annmaria-laserstarglobal-813df33a.koyeb.app";

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
