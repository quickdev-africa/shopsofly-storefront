export const revalidate = 60;
import { getStore } from "@/lib/api";
import Link from "next/link";
import ContactForm from "@/components/ContactForm";

export default async function ContactPage() {
  let store: any = null;
  try { const res = await getStore(); store = res.data.store; } catch {}
  const storeName = store?.name || "Our Store";
  const theme = store?.theme_settings || {};
  const whatsapp = theme.whatsapp_number || store?.settings?.whatsapp_number || "";

  return (
    <main className="max-w-5xl mx-auto px-4 py-16">
      <nav className="text-sm text-[#555555] mb-8 flex gap-2">
        <Link href="/" className="hover:text-[#4A7C59]">Home</Link>
        <span>/</span>
        <span className="text-[#1A1A1A] font-medium">Contact</span>
      </nav>

      <h1 className="font-heading text-4xl font-bold text-[#1A1A1A] mb-3">Contact Us</h1>
      <p className="text-[#555555] mb-12">Have a question or need help? We are here for you. Fill in the form below or reach us directly on WhatsApp.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <ContactForm />
        </div>

        <div className="space-y-8">
          {whatsapp && (
            <div className="bg-[#F8FAF8] rounded-2xl p-6">
              <h3 className="font-heading font-bold text-lg text-[#1A1A1A] mb-2">WhatsApp</h3>
              <p className="text-[#555555] text-sm mb-4">Chat with us directly for the fastest response.</p>
              
                href={"https://wa.me/" + whatsapp.replace(/\D/g, "") + "?text=Hello, I have a question about your products."}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-5 py-3 rounded-xl transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.549 4.116 1.512 5.849L.057 23.5l5.797-1.522A11.933 11.933 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.88 0-3.63-.493-5.147-1.355l-.369-.217-3.443.903.921-3.36-.239-.385A9.959 9.959 0 012 12C2 6.478 6.478 2 12 2s10 4.478 10 10-4.478 10-10 10z"/>
                </svg>
                Chat on WhatsApp
              </a>
            </div>
          )}

          <div className="bg-[#F8FAF8] rounded-2xl p-6">
            <h3 className="font-heading font-bold text-lg text-[#1A1A1A] mb-2">Response Time</h3>
            <p className="text-[#555555] text-sm">We respond to all enquiries within 24 hours on business days (Monday to Friday).</p>
          </div>

          <div className="bg-[#F8FAF8] rounded-2xl p-6">
            <h3 className="font-heading font-bold text-lg text-[#1A1A1A] mb-2">Order Support</h3>
            <p className="text-[#555555] text-sm mb-3">For order-related questions, have your order number ready. You can also track your order directly.</p>
            <Link href="/pages/track-order" className="text-[#4A7C59] font-semibold hover:underline text-sm">
              Track your order
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
