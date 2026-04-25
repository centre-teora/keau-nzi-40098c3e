import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const Route = createFileRoute("/api/public/lovable-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // Répondre 200 OK le plus vite possible — Printful exige une réponse rapide.
        // On lit le body, on enregistre, mais on ne fait jamais échouer la réponse côté Printful.
        let payload: unknown = null;
        let eventType = "unknown";

        try {
          const raw = await request.text();
          if (raw) {
            try {
              const parsed = JSON.parse(raw);
              payload = parsed;
              if (parsed && typeof parsed === "object" && "type" in parsed) {
                eventType = String((parsed as { type: unknown }).type ?? "unknown");
              }
            } catch {
              payload = { raw };
            }
          }

          // Enregistrement asynchrone (best-effort) — on n'attend pas pour répondre 200.
          if (payload !== null) {
            void supabaseAdmin
              .from("printful_webhook_events")
              .insert({
                event_type: eventType,
                payload: payload as object,
              })
              .then(({ error }) => {
                if (error) {
                  console.error("[lovable-webhook] insert error:", error.message);
                }
              });
          }
        } catch (err) {
          console.error("[lovable-webhook] handler error:", err);
        }

        return new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      },
      GET: async () => {
        // Healthcheck simple — utile pour vérifier que l'endpoint est joignable.
        return new Response(JSON.stringify({ ok: true, endpoint: "lovable-webhook" }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
});