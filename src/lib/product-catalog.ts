// Server-safe product catalog (no image imports) for price verification and Printful fulfillment
// IMPORTANT: Update syncVariantId with real Printful sync variant IDs once products are synced
export const productCatalog: Record<string, {
  name: string;
  priceInCents: number;
  currency: string;
  priceId: string;
  syncVariantId?: number;
}> = {
  "tapis-fleur-de-vie": { name: "Tapis Fleur de Vie — Base 12", priceInCents: 8900, currency: "eur", priceId: "tapis_price", syncVariantId: undefined },
  "serviette-fleur-de-vie": { name: "Serviette Fleur de Vie — Base 12", priceInCents: 3900, currency: "eur", priceId: "serviette_price", syncVariantId: undefined },
};