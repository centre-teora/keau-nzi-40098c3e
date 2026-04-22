import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/create-checkout")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const supabaseUrl = process.env.VITE_SUPABASE_URL ?? import.meta.env.VITE_SUPABASE_URL;
          const publishableKey =
            process.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

          if (!supabaseUrl || !publishableKey) {
            throw new Error("Payment backend environment is not configured");
          }

          const response = await fetch(`${supabaseUrl}/functions/v1/create-checkout`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              apikey: publishableKey,
              Authorization: `Bearer ${publishableKey}`,
            },
            body: JSON.stringify(body),
          });

          const data = await response.json();

          if (!response.ok) {
            return Response.json(
              { error: data?.error || "Unable to create checkout session. Please try again." },
              { status: response.status }
            );
          }

          return Response.json({ clientSecret: data.clientSecret });
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