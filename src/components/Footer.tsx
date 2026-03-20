import Link from "next/link";

interface Props {
  storeName: string;
  copyright: string;
}

export default function Footer({ storeName, copyright }: Props) {
  return (
    <footer className="bg-[#2D4A32] text-white">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Brand */}
        <div>
          <h3 className="font-heading font-bold text-xl text-white mb-3">
            {storeName}
          </h3>
          <p className="text-[#E8F0E9] text-sm leading-relaxed">
            Premium wellness and lifestyle products delivered across Nigeria.
          </p>
          {/* Social Icons */}
          <div className="flex gap-3 mt-4">
            {["Instagram", "Facebook", "Twitter", "TikTok"].map((s) => (
              <a key={s} href="#" className="text-[#E8F0E9] hover:text-[#F97316] text-xs transition-colors">
                {s}
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
                <Link href={l.href} className="hover:text-[#F97316] transition-colors">
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
                <Link href={l.href} className="hover:text-[#F97316] transition-colors">
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
                <Link href={l.href} className="hover:text-[#F97316] transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#4A7C59] py-4 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-[#E8F0E9] text-xs">
            {copyright || `© ${new Date().getFullYear()} ${storeName}. All rights reserved.`}
          </p>
          {/* Payment icons */}
          <div className="flex items-center gap-2 text-[#E8F0E9] text-xs">
            {["Paystack", "Visa", "Mastercard", "Verve"].map((p) => (
              <span key={p} className="bg-[#4A7C59] px-2 py-1 rounded text-xs">
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
