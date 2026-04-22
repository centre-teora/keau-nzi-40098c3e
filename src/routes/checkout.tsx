import { createFileRoute, Link } from "@tanstack/react-router";
import { useCart } from "@/lib/cart";
import { StripeEmbeddedCheckoutForm, type CheckoutItem } from "@/components/StripeEmbeddedCheckout";
import { PaymentTestModeBanner } from "@/components/PaymentTestModeBanner";
import { ShoppingBag } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

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
  const { user } = useAuth();

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

  const LOCAL_PRICE_IDS = ["tapis_price", "serviette_price"];

  const checkoutItems: CheckoutItem[] = items.map((item) => {
    const isLocal = LOCAL_PRICE_IDS.includes(item.priceId);
    if (isLocal) {
      return {
        priceId: item.priceId,
        quantity: item.quantity,
      };
    }
    return {
      priceId: item.priceId,
      quantity: item.quantity,
      productName: item.product.name,
      amountInCents: Math.round(item.product.price * 100),
      currency: item.product.currency || "EUR",
    };
  });

  return (
    <section className="py-8 md:py-16">
      <PaymentTestModeBanner />
      <div className="container-spirit max-w-4xl mx-auto">
        <h1 className="text-3xl font-display text-center mb-4">Paiement sécurisé</h1>
        <p className="text-center text-muted-foreground mb-8">
          {items.length} article{items.length > 1 ? "s" : ""} · Total : <span className="text-gold font-medium">{totalPrice.toFixed(2)} €</span>
        </p>

        <div className="rounded-lg border border-border bg-card p-4 md:p-8">
          <StripeEmbeddedCheckoutForm
            items={checkoutItems}
            returnUrl={`${typeof window !== "undefined" ? window.location.origin : ""}/commande/confirmation?session_id={CHECKOUT_SESSION_ID}`}
            customerEmail={user?.email ?? undefined}
            metadata={user ? { userId: user.id } : undefined}
          />
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Paiement sécurisé par Stripe · Vos données sont chiffrées
        </p>
      </div>
    </section>
  );
}