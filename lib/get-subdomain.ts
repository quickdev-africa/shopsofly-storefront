// lib/get-subdomain.ts
// Place in: shopsofly-storefront/lib/get-subdomain.ts
//
// Usage in any Server Component or layout:
//
//   import { getSubdomain } from "@/lib/get-subdomain"
//   const subdomain = getSubdomain()
//   const data = await fetch(`${API_URL}/api/v2/storefront/products`, {
//     headers: { "X-Store-Subdomain": subdomain }
//   })

import { headers } from "next/headers";

/**
 * Returns the current store subdomain from the x-subdomain header
 * set by middleware.ts. Works in Server Components and API routes.
 */
export function getSubdomain(): string {
  const headersList = headers();
  return headersList.get("x-subdomain") || "";
}

/**
 * Returns common store headers to pass to the Rails API.
 * Use this on every storefront API call.
 */
export function getStoreHeaders(): Record<string, string> {
  const subdomain = getSubdomain();
  return {
    "X-Store-Subdomain": subdomain,
    "Content-Type":      "application/json",
  };
}

/**
 * Returns the base API URL from environment.
 * Reads NEXT_PUBLIC_API_URL — set this in Vercel environment variables.
 */
export function getApiUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL || "https://robust-annmaria-laserstarglobal-813df33a.koyeb.app";
}
