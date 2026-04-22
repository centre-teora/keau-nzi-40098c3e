import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getProduct } from "@/lib/products";
import { getShopProduct } from "@/integrations/printful/products.functions";
import { ReviewList } from "@/components/ReviewList";
import { toast } from "sonner";
import { Check, Star, Truck, ShieldCheck, Sparkles, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/produit/$slug")({
  loader: async ({ params }) => {
    const product = getProduct(params.slug);
    if (product) return { product, source: "local" as const };

    // Try Printful
    const { product: pfProduct, error } = await getShopProduct({ data: { slug: params.slug } });
    if (!pfProduct) throw notFound();
    return { product: pfProduct, source: "printful" as const };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.product.name} — Keau-Nzi` },
          { name: "description", content: (loaderData.product.description || loaderData.product.name).slice(0, 160) },
          { property: "og:title", content: loaderData.product.name },
          { property: "og:description", content: loaderData.source === "local" ? (loaderData.product as any).tagline : loaderData.product.name },
          ...(loaderData.source === "local" ? [{ property: "og:image", content: (loaderData.product as any).image }] : [{ property: "og:image", content: (loaderData.product as any).thumbnail }]),
        ]
      : [],
  }),
  component: ProductPage,
  notFoundComponent: () => (
    <div className="container-spirit py-32 text-center">
      <h1 className="text-3xl font-display mb-4">Produit introuvable</h1>
      <Link to="/boutique" className="text-gold underline">
        Retour à la boutique
      </Link>
    </div>
  ),
});

function ProductPage() {
  const { product, source } = Route.useLoaderData();
  const { addItem } = useCart();

  const handleAddToCart = () => {
    if (source === "local" && "priceId" in product) {
      addItem(product as any, (product as any).priceId);
    }
    toast("Ajouté au panier", {
      description: `${product.name} a été ajouté à votre panier.`,
    });
  };

  return (
    <article className="py-12 md:py-20">
      <div className="container-spirit grid gap-12 lg:grid-cols-2 items-start">
        {/* IMAGE */}
        <div className="rounded-lg overflow-hidden border border-border bg-card">
          <img
            src={source === "local" ? (product as any).image : (product as any).thumbnail}
            alt={product.name}
            width={1024}
            height={1024}
            className="w-full h-auto object-cover"
          />
        </div>

        {/* INFOS */}
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-gold mb-3">
            {source === "local" ? (product as any).tagline : "Produit Printful"}
          </p>
          <h1 className="text-3xl md:text-4xl font-display leading-tight">{product.name}</h1>

          <div className="flex items-center gap-2 mt-4">
            <div className="flex text-gold">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={16} fill="currentColor" />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">Avis vérifiés</span>
          </div>

          <p className="text-3xl font-display text-gold mt-6">
            {typeof product.price === "number" ? product.price.toFixed(2) : product.price} {(product as any).currency === "EUR" ? "€" : (product as any).currency || "€"}
          </p>
          <p className="text-xs text-muted-foreground">TVA incluse · Livraison estimée 5–10 jours</p>

          <p className="mt-6 text-muted-foreground leading-relaxed">
            {source === "local" ? (product as any).description : (product as any).description || product.name}
          </p>

          <button
            onClick={handleAddToCart}
            className="mt-8 w-full inline-flex items-center justify-center gap-2 rounded-md bg-gold px-8 py-4 text-sm font-medium uppercase tracking-widest text-primary-foreground hover:shadow-gold transition-all"
          >
            <ShoppingBag size={18} />
            Ajouter au panier
          </button>

          <div className="mt-6 grid grid-cols-3 gap-3 text-center">
            <div className="text-xs text-muted-foreground">
              <Truck className="mx-auto mb-1 text-gold" size={18} />
              Livraison mondiale
            </div>
            <div className="text-xs text-muted-foreground">
              <ShieldCheck className="mx-auto mb-1 text-gold" size={18} />
              Paiement sécurisé
            </div>
            <div className="text-xs text-muted-foreground">
              <Sparkles className="mx-auto mb-1 text-gold" size={18} />
              Produit sacré
            </div>
          </div>

          {source === "local" && (product as any).features && (
            <ul className="mt-8 space-y-3">
              {(product as any).features.map((f: string) => (
                <li key={f} className="flex gap-3 text-sm text-muted-foreground">
                  <Check size={18} className="text-gold flex-shrink-0 mt-0.5" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          )}

          {source === "printful" && (product as any).variants && (product as any).variants.length > 1 && (
            <div className="mt-8">
              <p className="text-sm font-medium text-foreground mb-3">Variantes disponibles</p>
              <ul className="space-y-2">
                {(product as any).variants.map((v: any) => (
                  <li key={v.id} className="flex justify-between text-sm text-muted-foreground">
                    <span>{v.name}</span>
                    <span className="text-gold">{v.price.toFixed(2)} {v.currency === "EUR" ? "€" : v.currency}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* AVIS */}
      <section className="container-spirit mt-24">
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-[0.4em] text-gold mb-3">Témoignages</p>
          <h2 className="text-3xl md:text-4xl font-display">Ce qu'en dit la communauté</h2>
        </div>
        <ReviewList productSlug={product.slug} />
      </section>
    </article>
  );
}
