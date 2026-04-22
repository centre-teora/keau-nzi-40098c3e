import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { type StripeEnv, createStripeClient } from "../_shared/stripe.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { priceId, quantity, customerEmail, returnUrl, environment, metadata, productName, amountInCents, currency } = await req.json();

    const env = (environment || 'sandbox') as StripeEnv;
    const stripe = createStripeClient(env);

    let lineItems;

    // If amountInCents is provided, use dynamic price_data (for Printful products etc.)
    if (amountInCents && productName) {
      lineItems = [{
        price_data: {
          currency: (currency || 'eur').toLowerCase(),
          product_data: { name: productName },
          unit_amount: Math.round(amountInCents),
        },
        quantity: quantity || 1,
      }];
    } else if (priceId && typeof priceId === 'string' && /^[a-zA-Z0-9_-]+$/.test(priceId)) {
      // Resolve lookup key to Stripe price
      const prices = await stripe.prices.list({ lookup_keys: [priceId] });
      if (!prices.data.length) {
        return new Response(JSON.stringify({ error: "Price not found" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      lineItems = [{ price: prices.data[0].id, quantity: quantity || 1 }];
    } else {
      return new Response(JSON.stringify({ error: "Invalid request: provide priceId or amountInCents+productName" }), {
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