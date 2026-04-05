export const revalidate = 60;

import { notFound } from "next/navigation";
import { getLandingPage, getStore } from "@/lib/api";
import ProductSpotlightTemplate from "@/components/landing-pages/ProductSpotlightTemplate";
import FlashSaleTemplate from "@/components/landing-pages/FlashSaleTemplate";
import { headers } from "next/headers";

export default async function LandingPageRoute({
  const headersList = headers();
  const host = headersList.get("host") || "";
  const parts = host.split(".");
  const subdomain = (parts.length >= 3 && !host.includes("vercel.app") && !host.includes("localhost"))
    ? parts[0]
    : (process.env.NEXT_PUBLIC_STORE_SUBDOMAIN || "laserstarglobal");
 params }: { params: { slug: string } }) {
  try {
    const [pageRes, storeRes] = await Promise.allSettled([
      getLandingPage(params.slug),
      getStore(subdomain),
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
