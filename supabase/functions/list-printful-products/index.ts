import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async () => {
  const apiKey = Deno.env.get("PRINTFUL_API_KEY");
  if (!apiKey) return new Response(JSON.stringify({ error: "No key" }), { status: 500 });

  const res = await fetch("https://api.printful.com/sync/products?limit=100", {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  const data = await res.json();
  if (!res.ok) return new Response(JSON.stringify({ error: data }), { status: res.status });

  const products = data.result || [];
  const details = [];
  for (const p of products) {
    const r = await fetch(`https://api.printful.com/sync/products/${p.id}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    const d = await r.json();
    if (r.ok) {
      details.push({
        id: p.id, name: p.name,
        variants: (d.result?.sync_variants || []).map((v: any) => ({
          id: v.id, name: v.name, retail_price: v.retail_price, currency: v.currency, sku: v.sku,
        })),
      });
    }
  }
  return new Response(JSON.stringify({ products: details }), { headers: { "Content-Type": "application/json" } });
});
