import { createFileRoute, Link } from "@tanstack/react-router";
import { useCart } from "@/lib/cart";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";

export const Route = createFileRoute("/panier")({
  head: () => ({
    meta: [
      { title: "Panier — Keau-Nzi" },
      { name: "description", content: "Votre panier Keau-Nzi" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <section className="py-24">
        <div className="container-spirit text-center max-w-lg mx-auto">
          <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
          <h1 className="text-3xl font-display mb-4">Votre panier est vide</h1>
          <p className="text-muted-foreground mb-8">
            Découvrez nos pièces sacrées et commencez votre collection.
          </p>
          <Link
            to="/boutique"
            className="inline-flex items-center justify-center rounded-md bg-gold px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90 transition"
          >
            Voir la boutique
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24">
      <div className="container-spirit max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-display text-center mb-12">Votre Panier</h1>

        <div className="space-y-6">
          {items.map((item) => (
            <div
              key={item.product.slug}
              className="flex gap-4 md:gap-6 p-4 rounded-lg border border-border bg-card"
            >
              <img
                src={item.product.image}
                alt={item.product.name}
                className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-md"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-display text-lg truncate">{item.product.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{item.product.tagline}</p>
                <p className="text-gold font-medium mt-2">{item.product.price} €</p>

                <div className="flex items-center gap-3 mt-3">
                  <button
                    onClick={() => updateQuantity(item.product.slug, item.quantity - 1)}
                    className="w-8 h-8 rounded-md border border-border flex items-center justify-center hover:border-gold transition"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product.slug, item.quantity + 1)}
                    className="w-8 h-8 rounded-md border border-border flex items-center justify-center hover:border-gold transition"
                  >
                    <Plus size={14} />
                  </button>
                  <button
                    onClick={() => removeItem(item.product.slug)}
                    className="ml-auto text-muted-foreground hover:text-destructive transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="text-right font-medium text-gold">
                {(item.product.price * item.quantity).toFixed(2)} €
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-border pt-6">
          <div className="flex justify-between items-center text-lg">
            <span className="font-display">Total</span>
            <span className="text-gold font-medium text-2xl">{totalPrice.toFixed(2)} €</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">Frais de livraison calculés à l'étape suivante</p>

          <Link
            to="/checkout"
            className="mt-6 w-full inline-flex items-center justify-center rounded-md bg-gold px-6 py-3.5 text-base font-medium text-primary-foreground hover:opacity-90 transition"
          >
            Procéder au paiement
          </Link>
        </div>
      </div>
    </section>
  );
}