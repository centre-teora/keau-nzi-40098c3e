import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, ShoppingBag, User, LogOut } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/hooks/use-auth";
import logo from "@/assets/logo.png";

const links = [
  { to: "/", label: "Accueil" },
  { to: "/boutique", label: "Boutique" },
  { to: "/a-propos", label: "À propos" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border">
      <div className="container-spirit flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src={logo}
            alt="Keau-Nzi"
            width={48}
            height={48}
            className="h-12 w-auto transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-sm tracking-wide text-muted-foreground hover:text-gold transition-colors"
              activeProps={{ className: "text-gold" }}
            >
              {l.label}
            </Link>
          ))}
          {user ? (
            <>
              <Link
                to="/mes-commandes"
                className="text-sm tracking-wide text-muted-foreground hover:text-gold transition-colors"
                activeProps={{ className: "text-gold" }}
              >
                Mes commandes
              </Link>
              <button
                onClick={signOut}
                className="text-muted-foreground hover:text-gold transition-colors"
                title="Se déconnecter"
              >
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <Link
              to="/connexion"
              className="text-muted-foreground hover:text-gold transition-colors"
              title="Se connecter"
            >
              <User size={20} />
            </Link>
          )}
          <CartIcon />
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          {user ? (
            <button onClick={signOut} className="p-2 text-muted-foreground hover:text-gold transition-colors">
              <LogOut size={18} />
            </button>
          ) : (
            <Link to="/connexion" className="p-2 text-muted-foreground hover:text-gold transition-colors">
              <User size={18} />
            </Link>
          )}
          <CartIcon />
          <button className="text-gold p-2" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="md:hidden border-t border-border bg-background/95">
          <div className="container-spirit py-4 flex flex-col gap-4">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="text-base text-muted-foreground hover:text-gold"
                activeProps={{ className: "text-gold" }}
              >
                {l.label}
              </Link>
            ))}
            {user && (
              <Link
                to="/mes-commandes"
                onClick={() => setOpen(false)}
                className="text-base text-muted-foreground hover:text-gold"
                activeProps={{ className: "text-gold" }}
              >
                Mes commandes
              </Link>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}

function CartIcon() {
  const { totalItems } = useCart();
  return (
    <Link to="/panier" className="relative p-2 text-muted-foreground hover:text-gold transition-colors">
      <ShoppingBag size={20} />
      {totalItems > 0 && (
        <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-gold text-primary-foreground text-xs rounded-full flex items-center justify-center font-medium">
          {totalItems}
        </span>
      )}
    </Link>
  );
}
