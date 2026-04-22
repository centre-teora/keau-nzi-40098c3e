import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Package, LogIn } from "lucide-react";

export const Route = createFileRoute("/mes-commandes")({
  head: () => ({
    meta: [
      { title: "Mes commandes — Keau-Nzi" },
      { name: "description", content: "Historique de vos commandes Keau-Nzi" },
    ],
  }),
  component: OrdersPage,
});

interface Order {
  id: string;
  created_at: string;
  amount_total: number;
  currency: string;
  status: string;
  customer_name: string | null;
  stripe_session_id: string;
  printful_status: string | null;
  tracking_number: string | null;
  tracking_url: string | null;
}

function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }

    supabase
      .from("orders")
      .select("id, created_at, amount_total, currency, status, customer_name, stripe_session_id, printful_status, tracking_number, tracking_url")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setOrders((data as Order[]) || []);
        setLoading(false);
      });
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <section className="py-24">
        <div className="container-spirit text-center">
          <div className="animate-pulse text-muted-foreground">Chargement…</div>
        </div>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="py-24">
        <div className="container-spirit text-center max-w-lg mx-auto">
          <LogIn className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
          <h1 className="text-3xl font-display mb-4">Connectez-vous</h1>
          <p className="text-muted-foreground mb-8">
            Connectez-vous pour voir votre historique de commandes.
          </p>
          <Link
            to="/connexion"
            className="inline-flex items-center justify-center rounded-md bg-gold px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90 transition"
          >
            Se connecter
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24">
      <div className="container-spirit max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.4em] text-gold mb-3">Mon compte</p>
          <h1 className="text-3xl md:text-4xl font-display">Mes commandes</h1>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
            <p className="text-muted-foreground mb-6">Aucune commande pour le moment.</p>
            <Link
              to="/boutique"
              className="inline-flex items-center justify-center rounded-md bg-gold px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90 transition"
            >
              Découvrir la boutique
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="rounded-lg border border-border bg-card p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString("fr-FR", {
                      day: "numeric", month: "long", year: "numeric",
                    })}
                  </span>
                  <span className={`text-xs uppercase tracking-widest px-2 py-1 rounded-full ${
                    order.status === "paid" ? "bg-green-500/10 text-green-500" : "bg-gold/10 text-gold"
                  }`}>
                    {order.status === "paid" ? "Payée" : order.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Réf: {order.stripe_session_id.slice(0, 20)}…
                  </span>
                  <span className="text-lg font-medium text-gold">
                    {(order.amount_total / 100).toFixed(2)} {order.currency === "eur" ? "€" : order.currency}
                  </span>
                </div>
                {(order.printful_status || order.tracking_number) && (
                  <div className="mt-3 pt-3 border-t border-border flex flex-wrap items-center gap-3">
                    {order.printful_status && (
                      <span className="text-xs text-muted-foreground">
                        Fabrication : <span className="capitalize">{
                          order.printful_status === "fulfilled" ? "Expédié" :
                          order.printful_status === "inprocess" ? "En production" :
                          order.printful_status === "pending" ? "En attente" :
                          order.printful_status === "canceled" ? "Annulé" :
                          order.printful_status
                        }</span>
                      </span>
                    )}
                    {order.tracking_number && (
                      <span className="text-xs">
                        {order.tracking_url ? (
                          <a href={order.tracking_url} target="_blank" rel="noopener noreferrer" className="text-gold underline hover:opacity-80">
                            Suivi : {order.tracking_number}
                          </a>
                        ) : (
                          <span className="text-muted-foreground">Suivi : {order.tracking_number}</span>
                        )}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}