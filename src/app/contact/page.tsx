export const revalidate = 60;
import { getStore } from "@/lib/api";
import Link from "next/link";
import ContactForm from "@/components/ContactForm";


export default async function ContactPage() {
  let store: any = null;
  try { const res = await getStore(); store = res.data.store; } catch {}
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
      <p className="text-[#555555] mb-12">Have a question or need help? We are here for you.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <ContactForm />
        </div>
        <div className="space-y-8">
          {whatsapp && (
            <div className="bg-[#F8FAF8] rounded-2xl p-6">
              <h3 className="font-heading font-bold text-lg text-[#1A1A1A] mb-2">WhatsApp</h3>
              <p className="text-[#555555] text-sm mb-4">Chat with us directly for the fastest response.</p>
              <a href={"https://wa.me/" + whatsapp.replace(/\D/g, "") + "?text=Hello"} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-5 py-3 rounded-xl transition-colors">
                Chat on WhatsApp
              </a>
            </div>
          )}
          <div className="bg-[#F8FAF8] rounded-2xl p-6">
            <h3 className="font-heading font-bold text-lg text-[#1A1A1A] mb-2">Response Time</h3>
            <p className="text-[#555555] text-sm">We respond within 24 hours on business days.</p>
          </div>
          <div className="bg-[#F8FAF8] rounded-2xl p-6">
            <h3 className="font-heading font-bold text-lg text-[#1A1A1A] mb-2">Order Support</h3>
            <p className="text-[#555555] text-sm mb-3">Have your order number ready for faster support.</p>
            <Link href="/pages/track-order" className="text-[#4A7C59] font-semibold hover:underline text-sm">
              Track your order
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
