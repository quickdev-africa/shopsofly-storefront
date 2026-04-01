"use client";
import React from "react";

interface Props {
  price: number;
  onBuy: () => void;
  whatsappNumber?: string;
}

export default function StickyBuyNow({ price, onBuy, whatsappNumber }: Props) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-gray-200 px-4 py-3 flex gap-3 items-center shadow-lg">
      <div className="flex-1">
        <p className="text-xs text-gray-500">Total</p>
        <p className="font-bold text-lg text-[#1A1A1A]">₦{price.toLocaleString()}</p>
      </div>
      {whatsappNumber && (
        <a
          href={"https://wa.me/" + whatsappNumber.replace(/\D/g, "")}
          className="bg-green-500 text-white px-4 py-3 rounded-lg font-semibold text-sm"
        >
          💬
        </a>
      )}
      <button
        onClick={onBuy}
        className="flex-1 bg-[#F97316] text-white py-3 rounded-lg font-bold text-sm"
      >
        Buy Now
      </button>
    </div>
  );
}
