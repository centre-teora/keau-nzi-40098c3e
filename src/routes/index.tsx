import { createFileRoute, Link } from "@tanstack/react-router";
import heroImg from "@/assets/hero-flower-of-life.png";
import { products as fallbackProducts } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { ReviewList } from "@/components/ReviewList";
import { listShopProducts, type ShopProduct } from "@/integrations/printful/products.functions";
import { Sparkles, Heart, Leaf } from "lucide-react";

export const Route = createFileRoute("/")({
  loader: () => listShopProducts(),
  head: () => ({
    meta: [
      { title: "Keau-Nzi — Géométrie sacrée pour votre pratique spirituelle" },
      {
        name: "description",
        content:
          "Découvrez nos tapis de yoga et serviettes Fleur de Vie base 12. Objets sacrés, qualité premium, alignement intérieur.",
      },
      { property: "og:image", content: heroImg },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { products: printfulProducts } = Route.useLoaderData();
  const hasPrintful = printfulProducts.length > 0;

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 flex items-center justify-center">
          <img
            src={heroImg}
            alt="Fleur de Vie dorée base 12"
            width={1920}
            height={1080}
            className="w-[60%] max-w-[520px] md:max-w-[640px] h-auto object-contain opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/50 to-background" />
        </div>

        <div className="container-spirit min-h-[88vh] flex flex-col items-center justify-center text-center py-20">
          <p className="text-xs md:text-sm uppercase tracking-[0.4em] text-gold mb-6 animate-fade-up">
            Géométrie Sacrée · Base 12
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display leading-tight max-w-4xl animate-fade-up">
            <span className="text-gradient-gold">Aligner</span> le corps,
            <br />
            l'esprit et l'âme.
          </h1>
          <p className="mt-6 max-w-xl text-base md:text-lg text-muted-foreground animate-fade-up">
            Des tapis et serviettes imprimés de la Fleur de Vie — pour faire de
            votre pratique un rituel sacré.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 animate-fade-up">
            <Link
              to="/boutique"
              className="inline-flex items-center justify-center rounded-md bg-gold px-8 py-3.5 text-sm font-medium uppercase tracking-widest text-primary-foreground hover:shadow-gold transition-all"
            >
              Découvrir la collection
            </Link>
            <Link
              to="/a-propos"
              className="inline-flex items-center justify-center rounded-md border border-gold px-8 py-3.5 text-sm font-medium uppercase tracking-widest text-gold hover:bg-gold/10 transition-all"
            >
              Notre mission
            </Link>
          </div>
        </div>
      </section>

      {/* VALEURS */}
      <section className="py-20">
        <div className="container-spirit grid gap-10 md:grid-cols-3">
          {[
            {
              icon: Sparkles,
              title: "Géométrie sacrée",
              text: "La Fleur de Vie base 12 — symbole millénaire d'unité et d'harmonie cosmique.",
            },
            {
              icon: Heart,
              title: "Énergie alignée",
              text: "Chaque pièce est pensée pour soutenir votre élévation intérieure.",
            },
            {
              icon: Leaf,
              title: "Production éthique",
              text: "Fabriqués à la demande via Printful — zéro stock, impact réduit.",
            },
          ].map((v) => (
            <div key={v.title} className="text-center px-4">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full border border-gold text-gold mb-5">
                <v.icon size={22} />
              </div>
              <h3 className="text-xl font-display mb-2">{v.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="container-spirit"><div className="divider-gold opacity-50" /></div>

      {/* PRODUITS */}
      <section className="py-20">
        <div className="container-spirit">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-[0.4em] text-gold mb-3">Collection</p>
            <h2 className="text-3xl md:text-5xl font-display">Objets sacrés</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
            {hasPrintful
              ? printfulProducts.map((p: ShopProduct) => (
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
        </div>
      </section>

      {/* STORYTELLING */}
      <section className="py-20 bg-card/50">
        <div className="container-spirit max-w-3xl text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-gold mb-4">Notre essence</p>
          <h2 className="text-3xl md:text-4xl font-display mb-6">
            Là où la matière rejoint le sacré.
          </h2>
          <p className="text-muted-foreground leading-relaxed text-lg">
            Keau-Nzi est née d'une intuition : nos objets du quotidien peuvent
            devenir des supports d'éveil. La Fleur de Vie base 12, gravée dans
            la mémoire des civilisations, traverse aujourd'hui nos tapis et nos
            serviettes pour ancrer chaque geste dans la beauté.
          </p>
          <Link
            to="/a-propos"
            className="inline-block mt-8 text-sm uppercase tracking-widest text-gold border-b border-gold pb-1 hover:opacity-80"
          >
            Lire notre histoire
          </Link>
        </div>
      </section>

      {/* AVIS */}
      <section className="py-20">
        <div className="container-spirit">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-[0.4em] text-gold mb-3">Témoignages</p>
            <h2 className="text-3xl md:text-5xl font-display">Une communauté éveillée</h2>
          </div>
          <ReviewList />
        </div>
      </section>
    </>
  );
}
