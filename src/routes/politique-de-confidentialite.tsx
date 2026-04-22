import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/politique-de-confidentialite")({
  head: () => ({
    meta: [
      { title: "Politique de confidentialité — Keau-Nzi" },
      { name: "description", content: "Politique de confidentialité et protection des données personnelles." },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <section className="py-16 md:py-24">
      <div className="container-spirit max-w-3xl mx-auto prose prose-invert prose-gold">
        <h1 className="text-3xl font-display">Politique de confidentialité</h1>
        <div className="divider-gold max-w-xs mt-4 mb-8" />

        <h2>1. Responsable du traitement</h2>
        <p>
          Le responsable du traitement des données collectées est
          [À COMPLÉTER], joignable à contact@keau-nzi.com.
        </p>

        <h2>2. Données collectées</h2>
        <p>Nous collectons les données suivantes :</p>
        <ul>
          <li><strong>Lors d'une commande :</strong> nom, prénom, adresse email, adresse postale de livraison, numéro de téléphone</li>
          <li><strong>Lors d'un message via le formulaire de contact :</strong> nom, email, objet, message</li>
          <li><strong>Navigation :</strong> données de navigation anonymisées (cookies techniques)</li>
        </ul>

        <h2>3. Finalités</h2>
        <p>Vos données sont utilisées pour :</p>
        <ul>
          <li>Traiter et livrer vos commandes via notre partenaire Printful</li>
          <li>Répondre à vos demandes de contact</li>
          <li>Améliorer l'expérience utilisateur du site</li>
          <li>Respecter nos obligations légales</li>
        </ul>

        <h2>4. Partage des données</h2>
        <p>
          Vos données peuvent être partagées avec nos prestataires techniques
          (Stripe pour le paiement, Printful pour la fabrication et livraison).
          Aucune donnée n'est vendue à des tiers.
        </p>

        <h2>5. Durée de conservation</h2>
        <p>
          Les données de commande sont conservées 5 ans (obligation comptable).
          Les données de contact sont conservées 1 an après le dernier échange.
        </p>

        <h2>6. Vos droits (RGPD)</h2>
        <p>
          Conformément au Règlement Général sur la Protection des Données,
          vous disposez des droits suivants :
        </p>
        <ul>
          <li>Droit d'accès à vos données</li>
          <li>Droit de rectification</li>
          <li>Droit à l'effacement</li>
          <li>Droit à la portabilité</li>
          <li>Droit d'opposition au traitement</li>
        </ul>
        <p>
          Pour exercer ces droits, contactez-nous à contact@keau-nzi.com.
          Vous pouvez également adresser une réclamation à la CNIL.
        </p>

        <h2>7. Cookies</h2>
        <p>
          Le site utilise des cookies techniques nécessaires à son
          fonctionnement (panier, session). Aucun cookie publicitaire
          ou de suivi n'est utilisé.
        </p>

        <h2>8. Sécurité</h2>
        <p>
          Nous mettons en œuvre des mesures techniques et organisationnelles
          pour protéger vos données : chiffrement SSL/TLS, stockage sécurisé,
          accès restreint.
        </p>

        <p className="text-sm text-muted-foreground mt-8">
          Dernière mise à jour : avril 2026
        </p>
      </div>
    </section>
  );
}