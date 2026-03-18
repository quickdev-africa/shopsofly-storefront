"use client";
import { useEffect, useState } from "react";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("cookie_consent")) {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#1A1A1A] text-white p-4 z-40">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-300">
          We use cookies to give you the best experience. By continuing, you agree to our cookie policy (NDPR compliant).
        </p>
        <button
          onClick={() => {
            localStorage.setItem("cookie_consent", "true");
            setVisible(false);
          }}
          className="shrink-0 bg-[#F97316] hover:bg-orange-600 text-white font-semibold px-5 py-2 rounded-lg transition-colors text-sm"
        >
          Accept
        </button>
      </div>
    </div>
  );
}
