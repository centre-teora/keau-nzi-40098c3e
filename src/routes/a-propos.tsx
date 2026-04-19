import { createFileRoute } from "@tanstack/react-router";
import meditationImg from "@/assets/about-meditation.jpg";

export const Route = createFileRoute("/a-propos")({
  head: () => ({
    meta: [
      { title: "À propos — Lumiā · Notre mission spirituelle" },
      {
        name: "description",
        content:
          "Lumiā : faire des objets du quotidien des supports d'éveil. Notre mission, nos valeurs, notre engagement éthique.",
      },
      { property: "og:title", content: "À propos de Lumiā" },
      { property: "og:description", content: "Notre mission : aligner matière et sacré." },
      { property: "og:image", content: meditationImg },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <article className="py-16 md:py-24">
      <div className="container-spirit max-w-3xl">
        <header className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.4em] text-gold mb-3">Notre essence</p>
          <h1 className="text-4xl md:text-5xl font-display">L'origine de Lumiā</h1>
          <div className="divider-gold mt-8 max-w-xs mx-auto" />
        </header>

        <div className="rounded-lg overflow-hidden border border-border mb-12">
          <img
            src={meditationImg}
            alt="Méditation devant une Fleur de Vie dorée"
            width={1024}
            height={1024}
            loading="lazy"
            className="w-full h-auto"
          />
        </div>

        <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground leading-relaxed text-lg">
          <p>
            Lumiā est née d'une <span className="text-gold">intuition</span> : et
            si les objets que nous touchons chaque jour pouvaient devenir des
            supports d'éveil ?
          </p>
          <p>
            Notre mission est simple : <strong className="text-foreground">
            faire entrer la géométrie sacrée dans la matière du quotidien.</strong>
            La Fleur de Vie base 12 — symbole vibratoire millénaire d'unité
            cosmique — devient ici le cœur de chaque pièce. Elle ancre, elle
            rayonne, elle aligne.
          </p>

          <h2 className="text-2xl md:text-3xl font-display text-foreground mt-12">
            Nos engagements
          </h2>
          <ul className="space-y-3 list-none pl-0">
            <li>
              <span className="text-gold">✦</span> <strong className="text-foreground">
              Production à la demande</strong> via Printful — zéro surstock, impact réduit.
            </li>
            <li>
              <span className="text-gold">✦</span> <strong className="text-foreground">
              Encres écologiques</strong> et matières durables.
            </li>
            <li>
              <span className="text-gold">✦</span> <strong className="text-foreground">
              Conception française</strong>, fabrication éthique en Europe et en
              Amérique du Nord.
            </li>
            <li>
              <span className="text-gold">✦</span> <strong className="text-foreground">
              Une pièce achetée = une intention semée</strong> : nous reversons une
              part à des projets de reforestation.
            </li>
          </ul>

          <h2 className="text-2xl md:text-3xl font-display text-foreground mt-12">
            Pour qui ?
          </h2>
          <p>
            Pour celles et ceux qui pratiquent le yoga, la méditation, le
            reiki — ou simplement pour les âmes en quête de beauté et de sens.
            Pour offrir un objet rare. Pour s'offrir un espace sacré.
          </p>

          <p className="text-center text-2xl font-display text-gradient-gold mt-12">
            "Là où la matière rejoint le sacré."
          </p>
        </div>
      </div>
    </article>
  );
}
