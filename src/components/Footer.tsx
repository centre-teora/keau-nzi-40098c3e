import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border">
      <div className="container-spirit py-12 grid gap-10 md:grid-cols-3">
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
          <p className="text-sm text-muted-foreground">contact@lumia-shop.com</p>
          <p className="text-sm text-muted-foreground mt-2">Production & livraison via Printful</p>
        </div>
      </div>
      <div className="divider-gold opacity-40" />
      <div className="container-spirit py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Keau-Nzi — Tous droits réservés. Fait avec intention.
      </div>
    </footer>
  );
}
