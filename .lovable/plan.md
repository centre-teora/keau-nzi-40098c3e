

# Mise à jour de la clé API Printful et vérification du flux de commande

## Problème
Les paiements Stripe passent correctement mais Printful ne reçoit jamais les commandes. La clé API Printful doit être mise à jour et le flux complet doit être vérifié.

## Étapes

### 1. Mettre à jour le secret PRINTFUL_API_KEY
Remplacer la valeur actuelle du secret `PRINTFUL_API_KEY` par la nouvelle clé fournie (`s3MEViTYEQID12QlhB9VqgtW6gZuIUBwFBXwyUDWz0PW3Uj4kV1sNIyR5S3Hag8T`).

### 2. Tester la connexion Printful
Appeler l'API Printful (`/store`) avec la nouvelle clé pour vérifier qu'elle fonctionne et qu'elle est bien liée au bon magasin.

### 3. Vérifier le déploiement du webhook de paiement
S'assurer que la fonction edge `payments-webhook` est bien déployée et accessible. Consulter les logs pour identifier pourquoi Stripe ne l'atteint pas.

### 4. Redéployer la fonction `payments-webhook`
Forcer un redéploiement pour garantir que la fonction est en ligne avec la bonne clé API.

### 5. Tester le flux complet
Appeler manuellement la fonction webhook avec un payload simulé pour confirmer que la commande Printful est bien créée.

## Détails techniques

- **Secret mis à jour** : `PRINTFUL_API_KEY` dans les secrets du backend
- **Fonction edge** : `supabase/functions/payments-webhook/index.ts` — contient la logique `createPrintfulOrder`
- **Endpoint Printful** : `POST https://api.printful.com/orders`
- **Aucune modification de code** prévue sauf si les tests révèlent un bug

