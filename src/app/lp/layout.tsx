import type { Metadata } from "next";
import "@/styles/globals.css";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import Providers from "../providers";

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

export const metadata: Metadata = {
  title: "Special Offer",
  description: "Limited time offer",
};

export default function LandingPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${inter.variable}`}>
      <body className="font-body">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
