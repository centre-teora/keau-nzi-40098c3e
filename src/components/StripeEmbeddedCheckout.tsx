import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { getStripe, getStripeEnvironment } from "@/lib/stripe";

interface Props {
  priceId: string;
  quantity?: number;
  customerEmail?: string;
  returnUrl?: string;
  productName?: string;
  amountInCents?: number;
  currency?: string;
}

export function StripeEmbeddedCheckoutForm({ priceId, quantity, customerEmail, returnUrl, productName, amountInCents, currency }: Props) {
  const fetchClientSecret = async (): Promise<string> => {
    const res = await fetch("/api/public/create-checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        priceId,
        quantity,
        customerEmail,
        returnUrl,
        environment: getStripeEnvironment(),
        productName,
        amountInCents,
        currency,
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