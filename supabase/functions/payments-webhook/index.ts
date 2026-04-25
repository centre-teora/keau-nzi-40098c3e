import { createClient } from "npm:@supabase/supabase-js@2";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { type StripeEnv, verifyWebhook } from "../_shared/stripe.ts";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const url = new URL(req.url);
  const env = (url.searchParams.get('env') || 'sandbox') as StripeEnv;

  try {
    const event = await verifyWebhook(req, env);
    console.log("Received event:", event.type, "env:", env);

    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object, env);
        break;
      default:
        console.log("Unhandled event:", event.type);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Webhook error:", e);
    return new Response("Webhook error", { status: 400 });
  }
});

async function handleCheckoutCompleted(session: any, env: StripeEnv) {
  console.log("Checkout completed:", session.id, "env:", env);

  const userId = session.metadata?.userId || null;

  const { error: insertError } = await supabase.from("orders").insert({
    stripe_session_id: session.id,
    stripe_customer_id: session.customer,
    customer_email: session.customer_details?.email,
    customer_name: session.customer_details?.name,
    amount_total: session.amount_total,
    currency: session.currency,
    status: "paid",
    shipping_address: session.shipping_details?.address || null,
    metadata: session.metadata || {},
    environment: env,
    user_id: userId,
  });

  if (insertError) {
    console.error("Failed to insert order:", insertError);
  }
}