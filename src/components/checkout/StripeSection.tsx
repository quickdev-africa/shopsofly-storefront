"use client";
import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { createStripeIntent, createOrder } from "@/lib/api";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "");

const fmt = (kobo: number) => `₦${(kobo / 100).toLocaleString("en-NG")}`;

interface Props {
  orderPayload: object;
  token: string | null;
  grandTotal: number;
  onSuccess: (orderNumber: string) => void;
}

function StripeForm({ orderPayload, token, grandTotal, onSuccess }: Props) {
  const stripe   = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const handlePay = async () => {
    if (!stripe || !elements) return;
    setLoading(true);
    setError("");
    try {
      // Create order + get Stripe client secret from server
      const res = await createOrder(orderPayload, token ?? undefined);
      const order = res.data.order;
      const clientSecret = res.data.stripe_client_secret;

      const cardElement = elements.getElement(CardElement);
      if (!cardElement || !clientSecret) {
        setError("Payment setup failed. Please try again.");
        setLoading(false);
        return;
      }

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
      });

      if (stripeError) {
        setError(stripeError.message ?? "Payment failed.");
        setLoading(false);
        return;
      }

      if (paymentIntent?.status === "succeeded") {
        onSuccess(order.number);
      }
    } catch (err: any) {
      setError(err?.response?.data?.error ?? "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-gray-200 rounded-lg px-4 py-4">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#1A1A1A",
                "::placeholder": { color: "#aab7c4" },
              },
            },
          }}
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <button
        onClick={handlePay}
        disabled={loading || !stripe}
        className="w-full bg-[#F97316] hover:bg-orange-600 text-white font-bold py-4 rounded-lg transition-colors disabled:opacity-50"
      >
        {loading ? "Processing..." : `Pay ${fmt(grandTotal)} with Stripe`}
      </button>
    </div>
  );
}

export default function StripeSection(props: Props) {
  return (
    <Elements stripe={stripePromise}>
      <StripeForm {...props} />
    </Elements>
  );
}
