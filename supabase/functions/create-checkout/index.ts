import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { type StripeEnv, createStripeClient } from "../_shared/stripe.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { items, priceId, quantity, customerEmail, returnUrl, environment, metadata, productName, amountInCents, currency } = await req.json();

    const env = (environment || 'sandbox') as StripeEnv;
    const stripe = createStripeClient(env);

    let lineItems: any[] = [];

    // Support new multi-item format
    if (items && Array.isArray(items)) {
      for (const item of items) {
        if (item.amountInCents && item.productName) {
          lineItems.push({
            price_data: {
              currency: (item.currency || 'eur').toLowerCase(),
              product_data: { name: item.productName },
              unit_amount: Math.round(item.amountInCents),
            },
            quantity: item.quantity || 1,
          });
        } else if (item.priceId && typeof item.priceId === 'string' && /^[a-zA-Z0-9_-]+$/.test(item.priceId)) {
          const prices = await stripe.prices.list({ lookup_keys: [item.priceId] });
          if (!prices.data.length) {
            return new Response(JSON.stringify({ error: `Price not found: ${item.priceId}` }), {
              status: 404,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
          }
          lineItems.push({ price: prices.data[0].id, quantity: item.quantity || 1 });
        }
      }
    } else if (amountInCents && productName) {
      // Legacy single-item support
      lineItems = [{
        price_data: {
          currency: (currency || 'eur').toLowerCase(),
          product_data: { name: productName },
          unit_amount: Math.round(amountInCents),
        },
        quantity: quantity || 1,
      }];
    } else if (priceId) {
      const prices = await stripe.prices.list({ lookup_keys: [priceId] });
      if (!prices.data.length) {
        return new Response(JSON.stringify({ error: "Price not found" }), { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      lineItems = [{ price: prices.data[0].id, quantity: quantity || 1 }];
    }

    if (lineItems.length === 0) {
      return new Response(JSON.stringify({ error: "No valid items provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: "payment",
      ui_mode: "embedded_page",
      return_url: returnUrl || `${req.headers.get("origin")}/commande/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      ...(customerEmail && { customer_email: customerEmail }),
      ...(metadata && { metadata }),
      shipping_address_collection: { allowed_countries: ['FR', 'BE', 'CH', 'LU', 'CA', 'DE', 'ES', 'IT', 'PT', 'NL', 'GB'] },
    });

    return new Response(JSON.stringify({ clientSecret: session.client_secret }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});