export const revalidate = 60;

import { getStore } from "@/lib/api";
import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import CookieConsent from "@/components/CookieConsent";
import CartDrawer from "@/components/CartDrawer";
import Script from "next/script";

async function fetchStore() {
  try {
    const headersList = headers();
    const host = headersList.get("host") || "";
    const parts = host.split(".");
    let subdomain = process.env.NEXT_PUBLIC_STORE_SUBDOMAIN || "laserstarglobal";
    if (parts.length >= 3 && !host.includes("vercel.app") && !host.includes("localhost")) {
      subdomain = parts[0];
    }
    const res = await getStore(subdomain);
    return res.data.store;
  } catch {
    return null;
  }
}

export default async function GlobalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const store = await fetchStore();
  const theme = store?.theme_settings || {};

  return (
    <>
      <style>{`
        :root {
          --color-primary: ${theme.primary_color || '#4A7C59'};
          --color-primary-dark: ${theme.footer_bg_color || '#2D4A32'};
          --color-accent: ${theme.accent_color || '#F97316'};
          --color-primary-light: ${theme.primary_color ? theme.primary_color + '20' : '#E8F0E9'};
          --color-primary-bg: ${theme.background_color || '#F4F7F4'};
        }
      `}</style>
      <AnnouncementBar
        text={theme.announcement_text || "Free delivery on orders over ₦50,000"}
        bgColor={theme.announcement_bg_color || "#4A7C59"}
        textColor={theme.announcement_text_color || "#ffffff"}
        visible={theme.announcement_enabled !== false}
        link={theme.announcement_link}
      />
      <Header storeName={store?.name || "Shopsofly"} theme={theme} navLinks={store?.header_links || []} />
      <CartDrawer />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer storeName={store?.name || "Shopsofly"} copyright={theme.footer_copyright || ""} theme={theme} footerLinks={store?.footer_links || []} />
      <WhatsAppButton
        phone={theme.whatsapp_number || ""}
        message={theme.whatsapp_message || "Hello! I'd like to place an order."}
        visible={theme.whatsapp_enabled !== false && !!theme.whatsapp_number}
      />
      <CookieConsent />

      {/* Google Analytics */}
      {store?.ga_id && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${store.ga_id}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${store.ga_id}');
            `}
          </Script>
        </>
      )}

      {/* Facebook Pixel */}
      {store?.fb_pixel_id && (
        <Script id="fb-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${store.fb_pixel_id}');
            fbq('track', 'PageView');
          `}
        </Script>
      )}

      {/* Google Site Verification */}
      {store?.gsc_code && (
        <meta name="google-site-verification" content={store.gsc_code} />
      )}
    </>
  );
}
