import { headers } from "next/headers";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://robust-annmaria-laserstarglobal-813df33a.koyeb.app";

export function getSubdomainFromHeaders(): { subdomain: string; customDomain: string } {
  const headersList = headers();
  let subdomain = headersList.get("x-subdomain") || "";
  const host = headersList.get("x-forwarded-host") || headersList.get("host") || "";
  let customDomain = "";
  if (!subdomain) {
    if (host.endsWith(".shopsofly.com")) {
      subdomain = host.replace(".shopsofly.com", "");
    } else if (host && !host.includes("shopsofly.com") && !host.includes("localhost") && !host.includes("vercel.app")) {
      customDomain = host.split(":")[0];
    }
  }
  if (subdomain === "www") subdomain = "";
  return { subdomain, customDomain };
}

export async function fetchStore() {
  try {
    const { subdomain, customDomain } = getSubdomainFromHeaders();
    if (!subdomain && !customDomain) return null;
    const res = await fetch(`${API_URL}/api/v2/storefront/store`, {
      headers: {
        ...(subdomain ? { "X-Store-Subdomain": subdomain } : {}),
        ...(customDomain ? { "X-Custom-Domain": customDomain } : {}),
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.store;
  } catch {
    return null;
  }
}
