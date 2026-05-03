import Link from "next/link";

interface Props {
  storeName: string;
  copyright: string;
  theme?: any;
  footerLinks?: { title: string; url: string; open_in_new_tab?: boolean }[];
}

export default function Footer({ storeName, copyright, theme, footerLinks }: Props) {
  const socialLinks = [
    { name: "Instagram", url: theme?.instagram_url },
    { name: "Facebook", url: theme?.facebook_url },
    { name: "Twitter", url: theme?.twitter_url },
    { name: "TikTok", url: theme?.tiktok_url },
  ].filter(s => s.url);
  const defaultLinks = [
    { title: "Delivery Policy", url: "/pages/delivery-policy" },
    { title: "Returns Policy", url: "/pages/returns-policy" },
    { title: "Privacy Policy", url: "/pages/privacy-policy" },
    { title: "Terms & Conditions", url: "/pages/terms" },
    { title: "FAQ", url: "/pages/faq" },
  ];
  const links = footerLinks && footerLinks.length > 0 ? footerLinks : defaultLinks;
  return (
    <footer className="text-white" style={{ backgroundColor: "var(--color-primary-dark)" }}>
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Brand */}
        <div>
          {theme?.logo_url ? (
            <img src={theme.logo_url} alt={storeName} className="h-10 mb-3 object-contain" />
          ) : (
            <h3 className="font-heading font-bold text-xl text-white mb-3">{storeName}</h3>
          )}
          <p className="text-[#E8F0E9] text-sm leading-relaxed">
            {theme?.footer_description || "Premium wellness and lifestyle products delivered across Nigeria."}
          </p>
          {/* Social Icons */}
          <div className="flex gap-3 mt-4">
            {socialLinks.map((s) => (
              <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" className="text-[#E8F0E9] hover:opacity-70 text-xs transition-colors">
                {s.name}
              </a>
            ))}
          </div>
        </div>

        {/* Shop Links */}
        <div>
          <h4 className="font-heading font-semibold text-white mb-3">Shop</h4>
          <ul className="space-y-2 text-sm text-[#E8F0E9]">
            {[
              { label: "All Products",  href: "/products"    },
              { label: "Collections",   href: "/collections" },
              { label: "Bundles",       href: "/bundles"     },
              { label: "New Arrivals",  href: "/products?sort=newest" },
            ].map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="hover:opacity-70 transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Info Links */}
        <div>
          <h4 className="font-heading font-semibold text-white mb-3">Information</h4>
          <ul className="space-y-2 text-sm text-[#E8F0E9]">
            {[
              { label: "About Us",        href: "/pages/about"           },
              { label: "Contact Us",      href: "/contact"               },
              { label: "FAQ",             href: "/pages/faq"             },
              { label: "Track Order",     href: "/pages/track-order"     },
            ].map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="hover:opacity-70 transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Policy Links */}
        <div>
          <h4 className="font-heading font-semibold text-white mb-3">Policies</h4>
          <ul className="space-y-2 text-sm text-[#E8F0E9]">
            {[
              { label: "Privacy Policy",   href: "/pages/privacy-policy"  },
              { label: "Delivery Policy",  href: "/pages/delivery-policy" },
              { label: "Returns Policy",   href: "/pages/returns-policy"  },
              { label: "Terms & Conditions", href: "/pages/terms"         },
            ].map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="hover:opacity-70 transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/20 py-4 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-[#E8F0E9] text-xs">
            {copyright || `© ${new Date().getFullYear()} ${storeName}. All rights reserved.`}
          </p>
          {/* Payment icons */}
          <div className="flex items-center gap-2 text-[#E8F0E9] text-xs">
            {["Paystack", "Visa", "Mastercard", "Verve"].map((p) => (
              <span key={p} className="bg-white/20 px-2 py-1 rounded text-xs">
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
