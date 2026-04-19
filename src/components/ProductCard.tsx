import { Link } from "@tanstack/react-router";
import type { Product } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      to="/produit/$slug"
      params={{ slug: product.slug }}
      className="group block"
    >
      <div className="relative overflow-hidden rounded-lg border border-border bg-card transition-all duration-500 hover:border-gold hover:shadow-gold">
        <div className="aspect-square overflow-hidden bg-secondary">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            width={1024}
            height={1024}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
        <div className="p-5">
          <h3 className="text-xl font-display text-foreground group-hover:text-gold transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">{product.tagline}</p>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-lg text-gold font-medium">{product.price} €</span>
            <span className="text-xs uppercase tracking-widest text-muted-foreground group-hover:text-gold transition-colors">
              Découvrir →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
