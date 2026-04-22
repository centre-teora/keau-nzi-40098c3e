import { useCallback, useMemo } from "react";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { supabase } from "@/integrations/supabase/client";
import { getStripe, getStripeEnvironment } from "@/lib/stripe";

export interface CheckoutItem {
  priceId?: string;
  quantity: number;
  slug?: string;
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
  const serializedItems = useMemo(() => JSON.stringify(items), [items]);
  const serializedMetadata = useMemo(() => JSON.stringify(metadata ?? {}), [metadata]);

  const fetchClientSecret = useCallback(async (): Promise<string> => {
    const { data, error } = await supabase.functions.invoke("create-checkout", {
      body: {
        items: JSON.parse(serializedItems),
        customerEmail,
        returnUrl,
        environment: getStripeEnvironment(),
        metadata: JSON.parse(serializedMetadata),
      },
    });

    if (error || !data?.clientSecret) {
      throw new Error(
        data?.error || error?.message || "Échec de la création de la session de paiement"
      );
    }

    return data.clientSecret;
  }, [customerEmail, returnUrl, serializedItems, serializedMetadata]);

  const checkoutKey = useMemo(
    () => `${customerEmail ?? "guest"}:${returnUrl ?? ""}:${serializedItems}:${serializedMetadata}`,
    [customerEmail, returnUrl, serializedItems, serializedMetadata]
  );

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider key={checkoutKey} stripe={getStripe()} options={{ fetchClientSecret }}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}