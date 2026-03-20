"use client";
import { useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { createOrder } from "@/lib/api";

interface Props {
  orderPayload: object;
  token: string | null;
  onSuccess: (orderNumber: string) => void;
}

function PayPalInner({ orderPayload, token, onSuccess }: Props) {
  const [error, setError] = useState("");

  return (
    <div className="space-y-2">
      <PayPalButtons
        style={{ layout: "vertical", label: "pay" }}
        createOrder={async () => {
          const res = await createOrder(orderPayload, token ?? undefined);
          const paypalOrderId = res.data.paypal_order_id;
          if (!paypalOrderId) throw new Error("No PayPal order ID returned.");
          return paypalOrderId;
        }}
        onApprove={async (data) => {
          setError("");
          onSuccess(data.orderID ?? "");
        }}
        onError={(err) => {
          console.error("PayPal error", err);
          setError("PayPal payment failed. Please try again.");
        }}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

export default function PayPalSection(props: Props) {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? "";
  return (
    <PayPalScriptProvider options={{ clientId, currency: "USD" }}>
      <PayPalInner {...props} />
    </PayPalScriptProvider>
  );
}
