# 🚀 Guide de démarrage rapide - API Printful

## ✅ Ce qui a été configuré

J'ai créé une intégration complète de l'API Printful pour votre projet React + TypeScript. Voici ce qui est prêt :

### 📁 Fichiers créés :

```
src/integrations/printful/
├── client.ts          # Client API avec toutes les méthodes Printful
├── types.ts           # Types TypeScript complets
├── hooks.ts           # React Hooks avec React Query
└── index.ts           # Exports principaux

src/components/
└── PrintfulDashboard.tsx  # Composant exemple d'utilisation

Documentation/
├── PRINTFUL_INTEGRATION.md  # Documentation complète
└── .env.example            # Template des variables d'environnement
```

## 🔑 Prochaines étapes

### 1. Obtenir votre clé API Printful

1. Connectez-vous sur [Printful.com](https://www.printful.com/)
2. Allez dans **Settings** → **Stores**
3. Sélectionnez votre store
4. Onglet **API** → Générez une clé API
5. Copiez la clé générée

### 2. Configurer la clé dans .env

Ouvrez le fichier `.env` et remplacez :

```bash
VITE_PRINTFUL_API_KEY="YOUR_PRINTFUL_API_KEY_HERE"
```

Par :

```bash
VITE_PRINTFUL_API_KEY="votre_vraie_clé_api"
```

### 3. Initialiser le client dans votre app

Ajoutez cette initialisation dans votre fichier principal (probablement `src/main.tsx` ou `src/router.tsx`) :

```typescript
import { initPrintfulClient } from '@/integrations/printful';

// Initialiser Printful
const printfulApiKey = import.meta.env.VITE_PRINTFUL_API_KEY;
if (printfulApiKey) {
  initPrintfulClient(printfulApiKey);
} else {
  console.warn('⚠️ VITE_PRINTFUL_API_KEY non configurée');
}
```

### 4. Utiliser dans vos composants

```typescript
import { usePrintfulSyncProducts } from '@/integrations/printful/hooks';

function MesProduits() {
  const { data, isLoading } = usePrintfulSyncProducts();

  if (isLoading) return <div>Chargement...</div>;

  return (
    <div>
      {data?.map((product) => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
}
```

## 📚 Fonctionnalités disponibles

✅ **Gestion des produits**
- Récupérer le catalogue Printful
- Gérer vos produits synchronisés
- Créer/modifier/supprimer des produits

✅ **Gestion des commandes**
- Créer des commandes
- Suivre les commandes
- Confirmer/annuler
- Estimer les coûts

✅ **Expédition**
- Calculer les frais d'expédition
- Obtenir les taux de livraison

✅ **Fichiers**
- Upload de designs
- Gestion de la bibliothèque

✅ **Webhooks**
- Recevoir les notifications Printful
- Gérer les événements

## 🎯 Exemple complet

Regardez le fichier `src/components/PrintfulDashboard.tsx` pour un exemple fonctionnel complet avec :
- Affichage des infos du store
- Liste des produits
- Liste des commandes
- Création d'une commande test

## 📖 Documentation complète

Consultez `PRINTFUL_INTEGRATION.md` pour :
- Tous les hooks disponibles
- Exemples de code
- Guide de l'API
- Gestion des erreurs

## 🔒 Sécurité

⚠️ **Important** :
- Ne committez JAMAIS votre fichier `.env` avec des vraies clés API
- Le fichier `.env` devrait déjà être dans `.gitignore`
- Utilisez `.env.example` comme template pour votre équipe

## 🆘 Besoin d'aide ?

1. Vérifiez que votre clé API est valide
2. Consultez les logs de la console pour les erreurs
3. Regardez la documentation Printful : https://developers.printful.com/docs/

## ✨ Prêt à utiliser !

Une fois la clé API configurée, vous pouvez :
1. Démarrer votre serveur dev : `npm run dev`
2. Importer et utiliser les hooks dans vos composants
3. Créer votre interface e-commerce avec Printful

Bon développement ! 🚀
