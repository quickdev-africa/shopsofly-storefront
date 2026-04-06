import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const headersList = headers();
  const subdomain = headersList.get("x-subdomain") || "";
  const host = headersList.get("host") || "";
  
  return NextResponse.json({
    subdomain,
    host,
    all_headers: Object.fromEntries(headersList.entries()),
  });
}
