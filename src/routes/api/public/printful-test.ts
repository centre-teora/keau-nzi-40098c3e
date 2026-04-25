import { createFileRoute } from "@tanstack/react-router";

/**
 * Endpoint de diagnostic temporaire — teste que PRINTFUL_API_KEY fonctionne.
 * GET /api/public/printful-test
 * Ne renvoie JAMAIS le token, seulement son statut (ok / longueur).
 */
export const Route = createFileRoute("/api/public/printful-test")({
  server: {
    handlers: {
      GET: async () => {
        const token = process.env.PRINTFUL_API_KEY?.trim();
        if (!token) {
          return Response.json(
            {
              ok: false,
              error: "PRINTFUL_API_KEY non défini côté serveur.",
            },
            { status: 500 },
          );
        }

        const url = "https://api.printful.com/store";
        const res = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const text = await res.text();
        let body: unknown = text;
        try {
          body = JSON.parse(text);
        } catch {
          /* keep text */
        }

        return Response.json(
          {
            ok: res.ok,
            status: res.status,
            url,
            authType: "Bearer (Private Token)",
            tokenLength: token.length,
            body,
          },
          { status: 200 },
        );
      },
    },
  },
});