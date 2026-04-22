// Server-safe product catalog (no image imports) for price verification
export const productCatalog: Record<string, { name: string; priceInCents: number; currency: string; priceId: string }> = {
  "tapis-fleur-de-vie": { name: "Tapis Fleur de Vie — Base 12", priceInCents: 8900, currency: "eur", priceId: "tapis_price" },
  "serviette-fleur-de-vie": { name: "Serviette Fleur de Vie — Base 12", priceInCents: 3900, currency: "eur", priceId: "serviette_price" },
};