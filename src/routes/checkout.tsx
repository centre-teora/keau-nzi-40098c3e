import { createFileRoute, Link } from "@tanstack/react-router";
import { useCart } from "@/lib/cart";
import { StripeEmbeddedCheckoutForm } from "@/components/StripeEmbeddedCheckout";
import { PaymentTestModeBanner } from "@/components/PaymentTestModeBanner";
import { ShoppingBag } from "lucide-react";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Paiement — Keau-Nzi" },
      { name: "description", content: "Finalisez votre commande Keau-Nzi" },
    ],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { items, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <section className="py-24">
        <div className="container-spirit text-center max-w-lg mx-auto">
          <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
          <h1 className="text-3xl font-display mb-4">Panier vide</h1>
          <p className="text-muted-foreground mb-8">
            Ajoutez des produits avant de passer commande.
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

  // Use first item for checkout (Stripe embedded handles one price at a time)
  const firstItem = items[0];

  // Determine if we need dynamic pricing (no Stripe lookup key)
  const isLocalProduct = firstItem.priceId === "tapis_price" || firstItem.priceId === "serviette_price";

  return (
    <section className="py-8 md:py-16">
      <PaymentTestModeBanner />
      <div className="container-spirit max-w-4xl mx-auto">
        <h1 className="text-3xl font-display text-center mb-4">Paiement sécurisé</h1>
        <p className="text-center text-muted-foreground mb-8">
          Total : <span className="text-gold font-medium">{totalPrice.toFixed(2)} €</span>
        </p>

        <div className="rounded-lg border border-border bg-card p-4 md:p-8">
          <StripeEmbeddedCheckoutForm
            priceId={firstItem.priceId}
            quantity={firstItem.quantity}
            returnUrl={`${typeof window !== "undefined" ? window.location.origin : ""}/commande/confirmation?session_id={CHECKOUT_SESSION_ID}`}
            {...(!isLocalProduct && {
              productName: firstItem.product.name,
              amountInCents: Math.round(firstItem.product.price * 100),
              currency: firstItem.product.currency || "EUR",
            })}
          />
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Paiement sécurisé par Stripe · Vos données sont chiffrées
        </p>
      </div>
    </section>
  );
}