import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border">
      <div className="container-spirit py-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 className="text-2xl text-gradient-gold font-display mb-3">Keau-Nzi</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Objets sacrés pour aligner le corps, l'esprit et l'âme.
            Géométrie sacrée. Production éthique.
          </p>
        </div>
        <div>
          <h4 className="text-sm uppercase tracking-widest text-gold mb-4">Navigation</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/" className="hover:text-gold">Accueil</Link></li>
            <li><Link to="/boutique" className="hover:text-gold">Boutique</Link></li>
            <li><Link to="/a-propos" className="hover:text-gold">À propos</Link></li>
            <li><Link to="/contact" className="hover:text-gold">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm uppercase tracking-widest text-gold mb-4">Contact</h4>
          <p className="text-sm text-muted-foreground">contact@keau-nzi.com</p>
          <p className="text-sm text-muted-foreground mt-2">Production & livraison via Printful</p>
        </div>
        <div>
          <h4 className="text-sm uppercase tracking-widest text-gold mb-4">Informations</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/mentions-legales" className="hover:text-gold">Mentions légales</Link></li>
            <li><Link to="/cgv" className="hover:text-gold">CGV</Link></li>
            <li><Link to="/politique-de-confidentialite" className="hover:text-gold">Confidentialité</Link></li>
          </ul>
        </div>
      </div>
      <div className="divider-gold opacity-40" />
      <div className="container-spirit py-6 text-center text-xs text-muted-foreground flex flex-wrap justify-center gap-x-4 gap-y-1">
        <span>
        © {new Date().getFullYear()} Keau-Nzi — Tous droits réservés. Fait avec intention.
        </span>
      </div>
    </footer>
  );
}
