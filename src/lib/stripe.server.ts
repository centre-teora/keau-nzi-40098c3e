import Stripe from "stripe";

export type StripeEnv = "sandbox" | "live";

const GATEWAY_STRIPE_BASE = "https://connector-gateway.lovable.dev/stripe";

function getConnectionApiKey(env: StripeEnv): string {
  const key =
    env === "sandbox"
      ? process.env.STRIPE_SANDBOX_API_KEY
      : process.env.STRIPE_LIVE_API_KEY;
  if (!key)
    throw new Error(
      `STRIPE_${env.toUpperCase()}_API_KEY is not configured`
    );
  return key;
}

export function createStripeClient(env: StripeEnv): Stripe {
  const connectionApiKey = getConnectionApiKey(env);
  const lovableApiKey = process.env.LOVABLE_API_KEY;
  if (!lovableApiKey) throw new Error("LOVABLE_API_KEY is not configured");

  return new Stripe(connectionApiKey, {
    httpClient: Stripe.createFetchHttpClient(
      (url: string | URL, init?: RequestInit) => {
        const gatewayUrl = url
          .toString()
          .replace("https://api.stripe.com", GATEWAY_STRIPE_BASE);
        return fetch(gatewayUrl, {
          ...init,
          headers: {
            ...Object.fromEntries(new Headers(init?.headers).entries()),
            "X-Connection-Api-Key": connectionApiKey,
            "Lovable-API-Key": lovableApiKey,
          },
        });
      }
    ),
  });
}