import { createFileRoute } from "@tanstack/react-router";
import { createStripeClient, type StripeEnv } from "@/lib/stripe.server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export const Route = createFileRoute("/api/public/create-checkout")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: corsHeaders }),
      POST: async ({ request }) => {
        try {
          const {
            priceId,
            quantity,
            customerEmail,
            returnUrl,
            environment,
            metadata,
            productName,
            amountInCents,
            currency,
          } = await request.json();

          const env = (environment || "sandbox") as StripeEnv;
          const stripe = createStripeClient(env);

          let lineItems: any[];

          if (amountInCents && productName) {
            lineItems = [
              {
                price_data: {
                  currency: (currency || "eur").toLowerCase(),
                  product_data: { name: productName },
                  unit_amount: Math.round(amountInCents),
                },
                quantity: quantity || 1,
              },
            ];
          } else if (
            priceId &&
            typeof priceId === "string" &&
            /^[a-zA-Z0-9_-]+$/.test(priceId)
          ) {
            const prices = await stripe.prices.list({ lookup_keys: [priceId] });
            if (!prices.data.length) {
              return Response.json({ error: "Price not found" }, { status: 404, headers: corsHeaders });
            }
            lineItems = [{ price: prices.data[0].id, quantity: quantity || 1 }];
          } else {
            return Response.json(
              { error: "Invalid request: provide priceId or amountInCents+productName" },
              { status: 400, headers: corsHeaders }
            );
          }

          const origin = request.headers.get("origin") || request.headers.get("referer")?.replace(/\/$/, "") || "";

          const session = await stripe.checkout.sessions.create({
            line_items: lineItems,
            mode: "payment",
            ui_mode: "embedded_page",
            return_url:
              returnUrl ||
              `${origin}/commande/confirmation?session_id={CHECKOUT_SESSION_ID}`,
            ...(customerEmail && { customer_email: customerEmail }),
            ...(metadata && { metadata }),
            shipping_address_collection: {
              allowed_countries: [
                "FR", "BE", "CH", "LU", "CA", "DE", "ES", "IT", "PT", "NL", "GB",
              ],
            },
          });

          return Response.json(
            { clientSecret: session.client_secret },
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        } catch (error: any) {
          console.error("create-checkout error:", error);
          return Response.json(
            { error: error.message },
            { status: 500, headers: corsHeaders }
          );
        }
      },
    },
  },
});