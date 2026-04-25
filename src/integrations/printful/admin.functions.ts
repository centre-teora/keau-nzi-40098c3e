import { createServerFn } from "@tanstack/react-start";

const PRINTFUL_API = "https://api.printful.com";
const WEBHOOK_URL = "https://keau-nzi.com/api/public/lovable-webhook";
const WEBHOOK_TYPES = [
  "order_created",
  "order_updated",
  "order_failed",
  "order_canceled",
  "package_shipped",
];

function getToken(): string | null {
  const token = process.env.PRINTFUL_API_KEY;
  return token && token.trim().length > 0 ? token.trim() : null;
}

/**
 * Teste le Private Token Printful via GET /store.
 * En cas d'erreur, renvoie un diagnostic SANS jamais exposer le token.
 */
export const testPrintfulToken = createServerFn({ method: "POST" }).handler(
  async () => {
    const token = getToken();
    if (!token) {
      return {
        ok: false,
        status: 0,
        url: `${PRINTFUL_API}/store`,
        authType: "Bearer",
        error: "PRINTFUL_API_KEY non défini côté serveur.",
      };
    }

    const url = `${PRINTFUL_API}/store`;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const bodyText = await res.text();
    let body: unknown = bodyText;
    try {
      body = JSON.parse(bodyText);
    } catch {
      // garde le texte brut
    }

    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        url,
        authType: "Bearer (Private Token)",
        tokenLength: token.length,
        error:
          res.status === 401
            ? "401 Unauthorized — vérifie que c'est bien un Private Token Printful (Settings → API)."
            : `Printful a renvoyé ${res.status}.`,
        body,
      };
    }

    return {
      ok: true,
      status: res.status,
      url,
      authType: "Bearer (Private Token)",
      store: body,
    };
  },
);

/**
 * Enregistre le webhook Lovable auprès de Printful via POST /webhooks.
 */
export const registerPrintfulWebhook = createServerFn({ method: "POST" }).handler(
  async () => {
    const token = getToken();
    if (!token) {
      return {
        ok: false,
        status: 0,
        url: `${PRINTFUL_API}/webhooks`,
        authType: "Bearer",
        error: "PRINTFUL_API_KEY non défini côté serveur.",
      };
    }

    const url = `${PRINTFUL_API}/webhooks`;
    const payload = {
      url: WEBHOOK_URL,
      types: WEBHOOK_TYPES,
    };

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const bodyText = await res.text();
    let body: unknown = bodyText;
    try {
      body = JSON.parse(bodyText);
    } catch {
      // garde le texte brut
    }

    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        url,
        authType: "Bearer (Private Token)",
        sentPayload: payload,
        error: `Printful a renvoyé ${res.status}.`,
        body,
      };
    }

    return {
      ok: true,
      status: res.status,
      url,
      webhookUrl: WEBHOOK_URL,
      types: WEBHOOK_TYPES,
      response: body,
    };
  },
);