export const revalidate = 60;

import { notFound } from "next/navigation";
import { getLandingPage, getStore } from "@/lib/api";
import ProductSpotlightTemplate from "@/components/landing-pages/ProductSpotlightTemplate";
import FlashSaleTemplate from "@/components/landing-pages/FlashSaleTemplate";

export default async function LandingPageRoute({ params }: { params: { slug: string } }) {
  try {
    const [pageRes, storeRes] = await Promise.allSettled([
      getLandingPage(params.slug),
      getStore(),
    ]);

    if (pageRes.status === "rejected") return notFound();

    const page = (pageRes as any).value.data.landing_page;
    const store = storeRes.status === "fulfilled" ? (storeRes as any).value.data.store : null;

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
