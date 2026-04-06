// middleware.ts
// Place this file at the ROOT of your shopsofly-storefront repo
// (same level as app/, pages/, next.config.js)
//
// What it does:
//   Reads the subdomain from the request hostname
//   e.g. nova-impact-energy.shopsofly.com → sets x-subdomain: nova-impact-energy
//   All pages read x-subdomain to know which store's data to fetch
//
// Works on:
//   nova-impact-energy.shopsofly.com  → "nova-impact-energy"
//   laserstarglobal.shopsofly.com     → "laserstarglobal"
//   localhost:3000                    → reads NEXT_PUBLIC_DEV_SUBDOMAIN env var
//                                       (set to "laserstarglobal" locally for dev)

import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const hostname = req.headers.get("host") || "";
  const url      = req.nextUrl.clone();

  let subdomain = "";

  if (hostname.includes("localhost") || hostname.includes("127.0.0.1")) {
    // Local development — use env var to simulate a store
    subdomain = process.env.NEXT_PUBLIC_DEV_SUBDOMAIN || "laserstarglobal";
  } else if (hostname.endsWith(".shopsofly.com")) {
    // Production — extract subdomain from hostname
    subdomain = hostname.replace(".shopsofly.com", "");
  } else if (hostname === "shopsofly.com" || hostname === "www.shopsofly.com") {
    // Root domain — marketing site, not a store
    subdomain = "";
  } else {
    // Custom domain (Standard plan) — look up store by domain
    // The Rails API resolves custom domains in the storefront API
    subdomain = hostname;
  }

  const response = NextResponse.next();

  // Pass subdomain as header to all pages and server components
  response.headers.set("x-subdomain", subdomain);
  response.headers.set("x-hostname",  hostname);

  return response;
}

export const config = {
  matcher: [
    // Run on all paths EXCEPT Next.js internals and static files
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
