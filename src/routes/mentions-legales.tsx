import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/mentions-legales")({
  head: () => ({
    meta: [
      { title: "Mentions légales — Keau-Nzi" },
      { name: "description", content: "Mentions légales du site Keau-Nzi.com" },
    ],
  }),
  component: MentionsLegales,
});

function MentionsLegales() {
  return (
    <section className="py-16 md:py-24">
      <div className="container-spirit max-w-3xl mx-auto prose prose-invert prose-gold">
        <h1 className="text-3xl font-display">Mentions légales</h1>
        <div className="divider-gold max-w-xs mt-4 mb-8" />

        <h2>Éditeur du site</h2>
        <p>
          <strong>Raison sociale :</strong> [À COMPLÉTER]<br />
          <strong>Forme juridique :</strong> [À COMPLÉTER — ex: Micro-entreprise, SARL, SAS]<br />
          <strong>SIRET :</strong> [À COMPLÉTER]<br />
          <strong>Adresse du siège :</strong> [À COMPLÉTER]<br />
          <strong>Directeur de la publication :</strong> [À COMPLÉTER]<br />
          <strong>Email :</strong> contact@keau-nzi.com<br />
          <strong>Téléphone :</strong> [À COMPLÉTER]
        </p>

        <h2>Hébergement</h2>
        <p>
          Le site keau-nzi.com est hébergé par Lovable (Cloudflare, Inc.),
          101 Townsend Street, San Francisco, CA 94107, États-Unis.
        </p>

        <h2>Propriété intellectuelle</h2>
        <p>
          L'ensemble du contenu du site (textes, images, logos, graphismes,
          icônes, photographies) est la propriété exclusive de Keau-Nzi ou
          de ses partenaires. Toute reproduction, même partielle, est
          interdite sans autorisation écrite préalable.
        </p>

        <h2>Responsabilité</h2>
        <p>
          Keau-Nzi s'efforce de fournir des informations exactes et à jour.
          Toutefois, nous ne garantissons pas l'exhaustivité ni l'exactitude
          de ces informations. L'utilisation du site se fait sous la
          responsabilité de l'utilisateur.
        </p>

        <h2>Droit applicable</h2>
        <p>
          Le présent site et son utilisation sont soumis au droit français.
          En cas de litige, les tribunaux français seront seuls compétents.
        </p>
      </div>
    </section>
  );
}