import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

export const Route = createFileRoute("/api/public/printful-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const eventType = body?.type;
          const orderData = body?.data?.order;

          if (!eventType || !orderData) {
            return new Response("Invalid payload", { status: 400 });
          }

          console.log("Printful webhook:", eventType, "order:", orderData.id);

          const supabaseUrl = process.env.SUPABASE_URL;
          const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
          if (!supabaseUrl || !supabaseKey) {
            console.error("Missing Supabase credentials");
            return new Response("Server error", { status: 500 });
          }

          const supabase = createClient(supabaseUrl, supabaseKey);

          const printfulId = String(orderData.id);
          const status = orderData.status || "unknown";

          // Extract tracking info from shipments
          let trackingNumber: string | null = null;
          let trackingUrl: string | null = null;
          if (orderData.shipments && orderData.shipments.length > 0) {
            const shipment = orderData.shipments[0];
            trackingNumber = shipment.tracking_number || null;
            trackingUrl = shipment.tracking_url || null;
          }

          const updateData: Record<string, any> = {
            printful_status: status,
            updated_at: new Date().toISOString(),
          };
          if (trackingNumber) updateData.tracking_number = trackingNumber;
          if (trackingUrl) updateData.tracking_url = trackingUrl;

          // Map Printful status to a user-friendly order status
          if (status === "fulfilled") {
            updateData.status = "shipped";
          } else if (status === "canceled" || status === "failed") {
            updateData.status = status;
          }

          const { error } = await supabase
            .from("orders")
            .update(updateData)
            .eq("printful_order_id", printfulId);

          if (error) {
            console.error("Failed to update order:", error);
          }

          return Response.json({ received: true });
        } catch (e) {
          console.error("Printful webhook error:", e);
          return new Response("Webhook error", { status: 400 });
        }
      },
    },
  },
});