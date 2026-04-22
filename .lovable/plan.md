

## Probleme identifie

L'erreur Stripe est claire : **`ui_mode: "embedded"` n'est plus supporte par Stripe**. L'API exige maintenant `ui_mode: "embedded_page"`.

Le message exact retourne par Stripe :
> "The ui_mode value `embedded` is no longer supported. Use `embedded_page` instead."

## Plan de correction

### 1. Mettre a jour le serveur API (`src/routes/api/public/create-checkout.ts`)

Remplacer `ui_mode: "embedded"` par `ui_mode: "embedded_page"` dans l'appel `stripe.checkout.sessions.create()`.

### 2. Mettre a jour la edge function (`supabase/functions/create-checkout/index.ts`)

Meme correction : remplacer `ui_mode: "embedded"` par `ui_mode: "embedded_page"`.

### Fichiers modifies

| Fichier | Modification |
|---------|-------------|
| `src/routes/api/public/create-checkout.ts` | `ui_mode: "embedded"` → `"embedded_page"` |
| `supabase/functions/create-checkout/index.ts` | `ui_mode: "embedded"` → `"embedded_page"` |

C'est un changement minimal (une ligne par fichier) qui devrait resoudre le probleme immediatement.

