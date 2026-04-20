import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { listShopProducts } from "@/integrations/printful/products.functions";
import { products as fallbackProducts } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/boutique")({
  loader: () => listShopProducts(),
  head: () => ({
    meta: [
      { title: "Boutique — Lumiā · Tapis & serviettes Fleur de Vie" },
      {
        name: "description",
        content:
          "Notre collection complète : tapis de yoga et serviettes imprimés Fleur de Vie base 12, géométrie sacrée premium.",
      },
      { property: "og:title", content: "Boutique Lumiā — Géométrie sacrée" },
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
  const { products: printfulProducts, error } = Route.useLoaderData();
  const hasPrintful = printfulProducts.length > 0;

  return (
    <section className="py-16 md:py-24">
      <div className="container-spirit">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs uppercase tracking-[0.4em] text-gold mb-3">Collection</p>
          <h1 className="text-4xl md:text-5xl font-display">La Boutique</h1>
          <p className="mt-4 text-muted-foreground">
            Chaque pièce est créée à la demande, imprimée avec soin et expédiée
            depuis nos partenaires Printful certifiés.
          </p>
          <div className="divider-gold mt-8 max-w-xs mx-auto" />
        </div>

        {error && (
          <div className="max-w-2xl mx-auto mb-10 rounded-md border border-gold/30 bg-card/60 p-5 text-center text-sm text-muted-foreground">
            <p className="text-gold uppercase tracking-widest text-xs mb-2">Aperçu</p>
            La synchronisation Printful sera disponible dès que tes produits seront publiés sur ton store. En attendant, voici nos pièces signature.
          </div>
        )}

        <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
          {hasPrintful
            ? printfulProducts.map((p) => (
                <Link
                  key={p.id}
                  to="/produit/$slug"
                  params={{ slug: p.slug }}
                  className="group block"
                >
                  <div className="relative overflow-hidden rounded-lg border border-border bg-card transition-all duration-500 hover:border-gold hover:shadow-gold">
                    <div className="aspect-square overflow-hidden bg-secondary">
                      <img
                        src={p.thumbnail}
                        alt={p.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="text-xl font-display text-foreground group-hover:text-gold transition-colors">
                        {p.name}
                      </h3>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-lg text-gold font-medium">
                          {p.price.toFixed(2)} {p.currency === "EUR" ? "€" : p.currency}
                        </span>
                        <span className="text-xs uppercase tracking-widest text-muted-foreground group-hover:text-gold transition-colors">
                          Découvrir →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            : fallbackProducts.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-16 max-w-md mx-auto">
          Production & livraison via Printful · Paiements Stripe & PayPal sécurisés (bientôt actifs)
        </p>
      </div>
    </section>
  );
}
