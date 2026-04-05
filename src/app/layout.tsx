export const revalidate = 60;

import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import HolyLoader from "holy-loader";
import Providers from "./providers";
import { getStore } from "@/lib/api";
import { headers } from "next/headers";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const headersList = headers();
  const host = headersList.get("host") || "";
  const parts = host.split(".");
  const subdomain = (parts.length >= 3 && !host.includes("vercel.app") && !host.includes("localhost"))
    ? parts[0]
    : (process.env.NEXT_PUBLIC_STORE_SUBDOMAIN || "laserstarglobal");

  try {
    const res = await getStore(subdomain);
    const store = res.data.store;
    const faviconUrl = store?.theme_settings?.favicon_url;
    return {
      title: store?.name || "Shopsofly",
      description: "Premium products, delivered.",
      icons: {
        icon: faviconUrl || "/favicon.ico",
      },
    };
  } catch {
    return {
      title: "Shopsofly",
      description: "Premium products, delivered.",
      icons: { icon: "/favicon.ico" },
    };
  }
}

export const viewport: Viewport = {
  themeColor: "#4A7C59",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${inter.variable}`}>
      <body className="font-body">
        <HolyLoader color="#F97316" />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
