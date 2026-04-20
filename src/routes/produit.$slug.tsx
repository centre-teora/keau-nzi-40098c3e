import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getProduct } from "@/lib/products";
import { ReviewList } from "@/components/ReviewList";
import { toast } from "sonner";
import { Check, Star, Truck, ShieldCheck, Sparkles } from "lucide-react";

export const Route = createFileRoute("/produit/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.product.name} — Keau-Nzi` },
          { name: "description", content: loaderData.product.description.slice(0, 160) },
          { property: "og:title", content: loaderData.product.name },
          { property: "og:description", content: loaderData.product.tagline },
          { property: "og:image", content: loaderData.product.image },
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
  const { product } = Route.useLoaderData();

  const handleBuy = () => {
    toast("Paiement bientôt disponible", {
      description: "Stripe & PayPal seront activés très prochainement. Merci de votre patience.",
    });
  };

  return (
    <article className="py-12 md:py-20">
      <div className="container-spirit grid gap-12 lg:grid-cols-2 items-start">
        {/* IMAGE */}
        <div className="rounded-lg overflow-hidden border border-border bg-card">
          <img
            src={product.image}
            alt={product.name}
            width={1024}
            height={1024}
            className="w-full h-auto object-cover"
          />
        </div>

        {/* INFOS */}
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-gold mb-3">{product.tagline}</p>
          <h1 className="text-3xl md:text-4xl font-display leading-tight">{product.name}</h1>

          <div className="flex items-center gap-2 mt-4">
            <div className="flex text-gold">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={16} fill="currentColor" />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">Avis vérifiés</span>
          </div>

          <p className="text-3xl font-display text-gold mt-6">{product.price} €</p>
          <p className="text-xs text-muted-foreground">TVA incluse · Livraison estimée 5–10 jours</p>

          <p className="mt-6 text-muted-foreground leading-relaxed">{product.description}</p>

          <button
            onClick={handleBuy}
            className="mt-8 w-full inline-flex items-center justify-center rounded-md bg-gold px-8 py-4 text-sm font-medium uppercase tracking-widest text-primary-foreground hover:shadow-gold transition-all"
          >
            Acheter maintenant
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

          <ul className="mt-8 space-y-3">
            {product.features.map((f: string) => (
              <li key={f} className="flex gap-3 text-sm text-muted-foreground">
                <Check size={18} className="text-gold flex-shrink-0 mt-0.5" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
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
