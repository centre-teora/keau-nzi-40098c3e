import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { useEffect } from "react";
import { useCart } from "@/lib/cart";
import { CheckCircle } from "lucide-react";

export const Route = createFileRoute("/commande/confirmation")({
  validateSearch: (search: Record<string, unknown>) => ({
    session_id: (search.session_id as string) || "",
  }),
  head: () => ({
    meta: [
      { title: "Commande confirmée — Keau-Nzi" },
      { name: "description", content: "Votre commande a bien été enregistrée" },
    ],
  }),
  component: ConfirmationPage,
});

function ConfirmationPage() {
  const { session_id } = Route.useSearch();
  const { clearCart } = useCart();

  useEffect(() => {
    if (session_id) {
      clearCart();
    }
  }, [session_id, clearCart]);

  return (
    <section className="py-24">
      <div className="container-spirit text-center max-w-lg mx-auto">
        <CheckCircle className="w-20 h-20 text-gold mx-auto mb-6" />
        <h1 className="text-3xl md:text-4xl font-display mb-4">Merci pour votre commande !</h1>
        <p className="text-muted-foreground mb-2">
          Votre paiement a été confirmé avec succès.
        </p>
        <p className="text-muted-foreground mb-8 text-sm">
          Un email de confirmation vous sera envoyé prochainement.
          Votre commande sera préparée et expédiée via Printful.
        </p>
        {session_id && (
          <p className="text-xs text-muted-foreground mb-6">
            Référence : {session_id.slice(0, 20)}…
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/boutique"
            className="inline-flex items-center justify-center rounded-md bg-gold px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90 transition"
          >
            Continuer mes achats
          </Link>
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md border border-border px-6 py-3 text-sm font-medium hover:border-gold transition"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </section>
  );
}