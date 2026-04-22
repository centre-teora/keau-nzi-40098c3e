import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/cgv")({
  head: () => ({
    meta: [
      { title: "Conditions Générales de Vente — Keau-Nzi" },
      { name: "description", content: "CGV du site Keau-Nzi.com — Conditions de commande, livraison et retours." },
    ],
  }),
  component: CGVPage,
});

function CGVPage() {
  return (
    <section className="py-16 md:py-24">
      <div className="container-spirit max-w-3xl mx-auto prose prose-invert prose-gold">
        <h1 className="text-3xl font-display">Conditions Générales de Vente</h1>
        <div className="divider-gold max-w-xs mt-4 mb-8" />

        <h2>1. Objet</h2>
        <p>
          Les présentes Conditions Générales de Vente (CGV) régissent les ventes
          de produits effectuées sur le site keau-nzi.com, édité par [À COMPLÉTER].
        </p>

        <h2>2. Produits</h2>
        <p>
          Les produits proposés sont des articles de bien-être imprimés à la
          demande (tapis de yoga, serviettes) via notre partenaire Printful.
          Les visuels et descriptions sont aussi fidèles que possible, mais de
          légères variations peuvent survenir du fait de l'impression à la demande.
        </p>

        <h2>3. Prix</h2>
        <p>
          Les prix sont indiqués en euros (€) toutes taxes comprises (TTC).
          Les frais de livraison sont calculés et affichés lors du paiement.
          Keau-Nzi se réserve le droit de modifier ses prix à tout moment.
        </p>

        <h2>4. Commande</h2>
        <p>
          La commande est validée après confirmation du paiement par notre
          prestataire Stripe. Un email de confirmation est envoyé à l'adresse
          fournie. Keau-Nzi se réserve le droit de refuser une commande en
          cas de motif légitime.
        </p>

        <h2>5. Paiement</h2>
        <p>
          Le paiement s'effectue par carte bancaire via Stripe.
          Les transactions sont sécurisées et chiffrées. Aucune donnée
          bancaire n'est stockée sur nos serveurs.
        </p>

        <h2>6. Livraison</h2>
        <p>
          Les produits sont fabriqués à la demande et expédiés par Printful.
          Les délais de livraison estimés sont de 5 à 15 jours ouvrés selon
          la destination. Keau-Nzi ne saurait être tenu responsable de retards
          dus au transporteur ou à des événements de force majeure.
        </p>
        <p>
          <strong>Zones de livraison :</strong> France métropolitaine, Belgique,
          Suisse, Luxembourg, Canada, Allemagne, Espagne, Italie, Portugal,
          Pays-Bas, Royaume-Uni.
        </p>

        <h2>7. Droit de rétractation</h2>
        <p>
          Conformément à l'article L221-28 du Code de la consommation, les
          produits fabriqués sur mesure ou personnalisés ne bénéficient pas du
          droit de rétractation. Nos produits étant imprimés à la demande,
          ils entrent dans cette catégorie. En cas de défaut de fabrication,
          veuillez nous contacter à contact@keau-nzi.com sous 14 jours.
        </p>

        <h2>8. Réclamations</h2>
        <p>
          Pour toute réclamation, contactez-nous à contact@keau-nzi.com.
          Nous nous engageons à répondre sous 48 heures ouvrées.
        </p>

        <h2>9. Données personnelles</h2>
        <p>
          Consultez notre{" "}
          <a href="/politique-de-confidentialite" className="text-gold hover:underline">
            Politique de confidentialité
          </a>{" "}
          pour tout savoir sur le traitement de vos données.
        </p>

        <h2>10. Droit applicable</h2>
        <p>
          Les présentes CGV sont soumises au droit français. Tout litige sera
          de la compétence des tribunaux français.
        </p>
      </div>
    </section>
  );
}