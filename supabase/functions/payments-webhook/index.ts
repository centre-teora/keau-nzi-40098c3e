import { createClient } from "npm:@supabase/supabase-js@2";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { type StripeEnv, verifyWebhook } from "../_shared/stripe.ts";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const PRINTFUL_API_BASE = "https://api.printful.com";

async function createPrintfulOrder(session: any): Promise<number | null> {
  const apiKey = Deno.env.get("PRINTFUL_API_KEY");
  if (!apiKey) {
    console.log("PRINTFUL_API_KEY not set — skipping fulfillment");
    return null;
  }

  const shipping = session.shipping_details;
  if (!shipping?.address) {
    console.log("No shipping address — skipping Printful order");
    return null;
  }

  const items = session.metadata?.items ? JSON.parse(session.metadata.items) : [];
  const printfulItems = items.filter((i: any) => i.syncVariantId);
  if (printfulItems.length === 0) {
    console.log("No Printful items in metadata — skipping Printful order");
    return null;
  }

  const orderData = {
    external_id: session.id,
    recipient: {
      name: shipping.name || session.customer_details?.name || "Client",
      address1: shipping.address.line1,
      address2: shipping.address.line2 || undefined,
      city: shipping.address.city,
      state_code: shipping.address.state || undefined,
      country_code: shipping.address.country,
      zip: shipping.address.postal_code,
      email: session.customer_details?.email,
    },
    items: printfulItems.map((item: any) => ({
      sync_variant_id: item.syncVariantId,
      quantity: item.quantity,
    })),
  };

  try {
    const res = await fetch(`${PRINTFUL_API_BASE}/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });
    const data = await res.json();
    if (!res.ok) {
      console.error("Printful order error:", data);
      return null;
    } else {
      console.log("Printful order created:", data.result?.id);
      return data.result?.id || null;
    }
  } catch (e) {
    console.error("Printful order failed:", e);
    return null;
  }
}

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

  const { data: orderRow, error: insertError } = await supabase.from("orders").insert({
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
  }).select("id").single();

  if (insertError) {
    console.error("Failed to insert order:", insertError);
  }

  // Trigger Printful fulfillment
  const printfulOrderId = await createPrintfulOrder(session);

  // Save Printful order ID back to the order row
  if (printfulOrderId && orderRow?.id) {
    await supabase.from("orders").update({
      printful_order_id: String(printfulOrderId),
      printful_status: "pending",
    }).eq("id", orderRow.id);
  }
}