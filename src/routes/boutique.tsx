import { createFileRoute } from "@tanstack/react-router";
import { products as fallbackProducts } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/boutique")({
  head: () => ({
    meta: [
      { title: "Boutique — Keau-Nzi · Tapis & serviettes Fleur de Vie" },
      {
        name: "description",
        content:
          "Notre collection complète : tapis de yoga et serviettes imprimés Fleur de Vie base 12, géométrie sacrée premium.",
      },
      { property: "og:title", content: "Boutique Keau-Nzi — Géométrie sacrée" },
      {
        property: "og:description",
        content: "Découvrez tous nos objets sacrés pour votre pratique.",
      },
    ],
  }),
  component: ShopPage,
  errorComponent: ({ error }) => (
    <div className="container-spirit py-32 text-center">
      <h1 className="text-3xl font-display mb-4">Boutique indisponible</h1>
      <p className="text-muted-foreground">{error.message}</p>
    </div>
  ),
});

function ShopPage() {
  return (
    <section className="py-16 md:py-24">
      <div className="container-spirit">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs uppercase tracking-[0.4em] text-gold mb-3">Collection</p>
          <h1 className="text-4xl md:text-5xl font-display">La Boutique</h1>
          <p className="mt-4 text-muted-foreground">
            Chaque pièce est créée à la demande, imprimée avec soin et expédiée
            avec soin.
          </p>
          <div className="divider-gold mt-8 max-w-xs mx-auto" />
        </div>

        <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
          {fallbackProducts.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-16 max-w-md mx-auto">
          Paiements sécurisés · Livraison soignée
        </p>
      </div>
    </section>
  );
}
