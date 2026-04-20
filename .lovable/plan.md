
## Garder Lovable Cloud — aucune action nécessaire

Tu as choisi l'option 1 : on garde Lovable Cloud comme système de base de données. **Rien à modifier dans le code.**

### Ce qui reste en place

- **Table `contact_messages`** — stocke les messages envoyés depuis `/contact`
- **Table `reviews`** — stocke les avis clients affichés via le composant `ReviewList`
- **Authentification, stockage de fichiers, edge functions** — disponibles si besoin futur
- **Intégrations Printful, Stripe, PayPal** — continuent de fonctionner avec le backend actuel

### Ce que ça veut dire pour toi

- Tu n'as **jamais** besoin d'aller sur un site externe
- Pas de clés API à gérer manuellement
- Tout reste pilotable depuis l'éditeur Lovable
- Les données déjà collectées (messages, avis) restent intactes

### Aucune modification de fichier

Aucun fichier ne sera touché. Le projet continue exactement comme avant.

### Et après ?

Si tu veux exploiter davantage Lovable Cloud, voici des extensions naturelles pour Keau-Nzi :
- **Dashboard admin** pour lire les messages de contact et modérer les avis
- **Système de commandes** lié à Printful (historique client, suivi de livraison)
- **Compte client** avec authentification (favoris, historique d'achats)
- **Newsletter** avec table `subscribers` et formulaire d'inscription
