import { Suspense } from "react";

export default function CheckoutGroupLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <a href="/" className="font-black text-xl text-[#4A7C59]">Shopsofly</a>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>🔒</span>
            <span>Secure Checkout</span>
          </div>
        </div>
      </div>
      <Suspense>
        {children}
      </Suspense>
    </div>
  );
}
