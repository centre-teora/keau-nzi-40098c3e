import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { getStripe, getStripeEnvironment } from "@/lib/stripe";

export interface CheckoutItem {
  priceId: string;
  quantity: number;
  productName?: string;
  amountInCents?: number;
  currency?: string;
}

interface Props {
  items: CheckoutItem[];
  customerEmail?: string;
  returnUrl?: string;
  metadata?: Record<string, string>;
}

export function StripeEmbeddedCheckoutForm({ items, customerEmail, returnUrl, metadata }: Props) {
  const fetchClientSecret = async (): Promise<string> => {
    const res = await fetch("/api/public/create-checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items,
        customerEmail,
        returnUrl,
        environment: getStripeEnvironment(),
        metadata,
      }),
    });
    const data = await res.json();
    if (!res.ok || !data?.clientSecret) {
      throw new Error(data?.error || "Échec de la création de la session de paiement");
    }
    return data.clientSecret;
  };

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider stripe={getStripe()} options={{ fetchClientSecret }}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}