import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { getStripe, getStripeEnvironment } from "@/lib/stripe";
import { supabase } from "@/integrations/supabase/client";

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
    const { data, error } = await supabase.functions.invoke("create-checkout", {
      body: {
        priceId,
        quantity,
        customerEmail,
        returnUrl,
        environment: getStripeEnvironment(),
        productName,
        amountInCents,
        currency,
      },
    });
    if (error || !data?.clientSecret) {
      throw new Error(error?.message || "Échec de la création de la session de paiement");
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