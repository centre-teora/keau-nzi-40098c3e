import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const printfulKey = Deno.env.get("PRINTFUL_API_KEY");
  const webhookSecret = Deno.env.get("PRINTFUL_WEBHOOK_SECRET");
  if (!printfulKey || !webhookSecret) {
    return new Response(JSON.stringify({ error: "PRINTFUL_API_KEY or PRINTFUL_WEBHOOK_SECRET not set" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const WEBHOOK_URL = `https://keau-nzi.com/api/public/printful-webhook?token=${encodeURIComponent(webhookSecret)}`;

  try {
    // First check existing webhooks
    const existingRes = await fetch("https://api.printful.com/webhooks", {
      headers: { "Authorization": `Bearer ${printfulKey}` },
    });
    const existing = await existingRes.json();
    console.log("Existing Printful webhooks:", JSON.stringify(existing));

    // Register/update webhook
    const res = await fetch("https://api.printful.com/webhooks", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${printfulKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: WEBHOOK_URL,
        types: [
          "package_shipped",
          "order_failed",
          "order_canceled",
          "order_updated",
          "order_created",
        ],
      }),
    });

    const data = await res.json();
    console.log("Printful webhook registration:", JSON.stringify(data));

    return new Response(JSON.stringify({ success: true, result: data }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error registering Printful webhook:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});