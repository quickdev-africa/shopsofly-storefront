import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const hostname =
    req.headers.get("x-forwarded-host") ||
    req.headers.get("host") ||
    "";

  let subdomain = "";
  let customDomain = "";

  if (hostname.includes("localhost") || hostname.includes("127.0.0.1")) {
    subdomain = process.env.NEXT_PUBLIC_DEV_SUBDOMAIN || "laserstarglobal";
  } else if (hostname.endsWith(".shopsofly.com")) {
    subdomain = hostname.replace(".shopsofly.com", "");
  } else if (hostname === "shopsofly.com" || hostname === "www.shopsofly.com") {
    subdomain = "";
  } else if (hostname && !hostname.includes("vercel.app")) {
    // Custom domain e.g. www.quantumliving.store
    customDomain = hostname.split(":")[0];
  }

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-subdomain", subdomain);
  requestHeaders.set("x-hostname", hostname);
  if (customDomain) requestHeaders.set("x-custom-domain", customDomain);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  response.headers.set("x-subdomain", subdomain);
  response.headers.set("x-hostname", hostname);
  if (customDomain) response.headers.set("x-custom-domain", customDomain);

  if (subdomain) {
    response.cookies.set("x-subdomain", subdomain, {
      path: "/",
      sameSite: "lax",
    });
  }
  if (customDomain) {
    response.cookies.set("x-custom-domain", customDomain, {
      path: "/",
      sameSite: "lax",
    });
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
