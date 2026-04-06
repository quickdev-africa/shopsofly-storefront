import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const hostname = req.headers.get("host") || "";

  let subdomain = "";

  if (hostname.includes("localhost") || hostname.includes("127.0.0.1")) {
    subdomain = process.env.NEXT_PUBLIC_DEV_SUBDOMAIN || "laserstarglobal";
  } else if (hostname.endsWith(".shopsofly.com")) {
    subdomain = hostname.replace(".shopsofly.com", "");
  } else if (hostname === "shopsofly.com" || hostname === "www.shopsofly.com") {
    subdomain = "";
  } else {
    subdomain = hostname;
  }

  // CRITICAL: Must rewrite REQUEST headers, not response headers.
  // Server components read incoming request headers via headers().
  // Setting response headers does NOT make them visible to server components.
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-subdomain", subdomain);
  requestHeaders.set("x-hostname", hostname);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
