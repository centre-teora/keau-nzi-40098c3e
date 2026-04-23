/**
 * Server-only Printful API helpers.
 * The PRINTFUL_API_KEY is read from process.env and NEVER exposed to the browser.
 */

const PRINTFUL_API_BASE_URL = "https://api.printful.com";

const PRINTFUL_STORE_ID = "app-9086039";

async function printfulFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const apiKey = process.env.PRINTFUL_API_KEY;
  if (!apiKey) {
    throw new Error("PRINTFUL_API_KEY is not configured on the server.");
  }

  const response = await fetch(`${PRINTFUL_API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "X-PF-Store-Id": PRINTFUL_STORE_ID,
      ...options.headers,
    },
  });

  const data = (await response.json().catch(() => ({}))) as {
    result?: T;
    error?: { message?: string };
  };

  if (!response.ok) {
    throw new Error(
      `Printful API error ${response.status}: ${
        data.error?.message ?? response.statusText
      }`,
    );
  }

  return data.result as T;
}

export interface PrintfulSyncProductSummary {
  id: number;
  external_id: string;
  name: string;
  variants: number;
  synced: number;
  thumbnail_url: string;
  is_ignored: boolean;
}

export interface PrintfulSyncVariantSummary {
  id: number;
  external_id: string;
  name: string;
  synced: boolean;
  variant_id: number;
  retail_price: string;
  currency: string;
  sku: string;
  product: { image: string; name: string };
}

export interface PrintfulSyncProductFull {
  sync_product: PrintfulSyncProductSummary;
  sync_variants: PrintfulSyncVariantSummary[];
}

export const printfulApi = {
  listSyncProducts: () =>
    printfulFetch<PrintfulSyncProductSummary[]>("/sync/products?limit=100"),
  getSyncProduct: (id: number) =>
    printfulFetch<PrintfulSyncProductFull>(`/sync/products/${id}`),
  getStore: () =>
    printfulFetch<{ id: number; name: string; currency: string }>("/store"),
  createOrder: (orderData: unknown) =>
    printfulFetch("/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    }),
};
