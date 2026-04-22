import { createFileRoute } from "@tanstack/react-router";
import { createStripeClient, type StripeEnv } from "@/lib/stripe.server";
import { productCatalog } from "@/lib/product-catalog";

export const Route = createFileRoute("/api/public/create-checkout")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const {
            items,
            customerEmail,
            returnUrl,
            environment,
            metadata,
          } = await request.json();

          const env = (environment || "sandbox") as StripeEnv;
          const stripe = createStripeClient(env);

          const lineItems: any[] = [];

          if (!items || !Array.isArray(items) || items.length === 0) {
            return Response.json(
              { error: "Invalid request: provide items array" },
              { status: 400 }
            );
          }

          for (const item of items) {
            if (item.slug && productCatalog[item.slug]) {
              const catalogProduct = productCatalog[item.slug];
              lineItems.push({
                price_data: {
                  currency: catalogProduct.currency,
                  product_data: { name: catalogProduct.name },
                  unit_amount: catalogProduct.priceInCents,
                },
                quantity: item.quantity || 1,
              });
            } else if (item.amountInCents && item.productName) {
              // Dynamic pricing for Printful / external products
              lineItems.push({
                price_data: {
                  currency: item.currency || "eur",
                  product_data: { name: item.productName },
                  unit_amount: item.amountInCents,
                },
                quantity: item.quantity || 1,
              });
            } else if (
              item.priceId &&
              typeof item.priceId === "string" &&
              /^[a-zA-Z0-9_-]+$/.test(item.priceId)
            ) {
              const prices = await stripe.prices.list({ lookup_keys: [item.priceId] });
              if (!prices.data.length) {
                return Response.json(
                  { error: `Price not found: ${item.priceId}` },
                  { status: 404 }
                );
              }
              lineItems.push({ price: prices.data[0].id, quantity: item.quantity || 1 });
            } else {
              return Response.json(
                { error: "Invalid item: provide priceId or amountInCents+productName" },
                { status: 400 }
              );
            }
          }

          const origin = request.headers.get("origin") || request.headers.get("referer")?.replace(/\/$/, "") || "";

          // Build items metadata for the webhook (Printful fulfillment)
          const itemsMeta = items.map((item: any) => {
            if (item.slug && productCatalog[item.slug]) {
              const cat = productCatalog[item.slug];
              return { slug: item.slug, quantity: item.quantity || 1, syncVariantId: cat.syncVariantId || null };
            }
            return { priceId: item.priceId, quantity: item.quantity || 1 };
          });

          const session = await stripe.checkout.sessions.create({
            line_items: lineItems,
            mode: "payment",
            ui_mode: "embedded_page",
            return_url:
              returnUrl ||
              `${origin}/commande/confirmation?session_id={CHECKOUT_SESSION_ID}`,
            ...(customerEmail && { customer_email: customerEmail }),
            metadata: {
              ...(metadata || {}),
              items: JSON.stringify(itemsMeta),
            },
            ...(metadata?.userId && {
              payment_intent_data: { metadata: { userId: metadata.userId } },
            }),
            shipping_address_collection: {
              allowed_countries: [
                "FR", "BE", "CH", "LU", "CA", "DE", "ES", "IT", "PT", "NL", "GB",
              ],
            },
          });

          return Response.json(
            { clientSecret: session.client_secret }
          );
        } catch (error: any) {
          console.error("create-checkout error:", error);
          return Response.json(
            { error: "Unable to create checkout session. Please try again." },
            { status: 500 }
          );
        }
      },
    },
  },
});