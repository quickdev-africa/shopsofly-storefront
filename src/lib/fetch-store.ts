import { headers } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://robust-annmaria-laserstarglobal-813df33a.koyeb.app";

export function getSubdomainFromHeaders(): string {
  const headersList = headers();
  let subdomain = headersList.get("x-subdomain") || "";

  if (!subdomain) {
    const host = headersList.get("x-forwarded-host") || headersList.get("host") || "";
    if (host.endsWith(".shopsofly.com")) {
      subdomain = host.replace(".shopsofly.com", "");
    }
  }

  if (subdomain === "www") return "";
  return subdomain;
}

export async function fetchStore() {
  try {
    const subdomain = getSubdomainFromHeaders();
    if (!subdomain) return null;

    const res = await fetch(`${API_URL}/api/v2/storefront/store`, {
      headers: {
        "X-Store-Subdomain": subdomain,
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
