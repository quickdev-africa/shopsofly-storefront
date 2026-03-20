import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import HolyLoader from "holy-loader";
import Providers from "./providers";
import GlobalLayout from "@/components/GlobalLayout";
import { getStore } from "@/lib/api";

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
  try {
    const res = await getStore();
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
          <GlobalLayout>
            {children}
          </GlobalLayout>
        </Providers>
      </body>
    </html>
  );
}
