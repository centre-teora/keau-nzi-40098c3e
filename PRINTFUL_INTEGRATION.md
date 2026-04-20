# Intégration API Printful

Ce module fournit une intégration complète avec l'API Printful pour votre application React + TypeScript.

## 📋 Table des matières

- [Installation](#installation)
- [Configuration](#configuration)
- [Utilisation](#utilisation)
- [API Client](#api-client)
- [React Hooks](#react-hooks)
- [Exemples](#exemples)

## 🚀 Installation

### 1. Obtenir votre clé API Printful

1. Connectez-vous à votre compte Printful
2. Allez dans **Settings** → **Stores**
3. Sélectionnez votre store
4. Naviguez vers l'onglet **API**
5. Générez une nouvelle clé API ou copiez la clé existante

### 2. Configuration des variables d'environnement

Ajoutez votre clé API dans le fichier `.env` :

```bash
VITE_PRINTFUL_API_KEY="votre_cle_api_printful"
```

⚠️ **Important** : Ne committez JAMAIS votre fichier `.env` avec des vraies clés API !

## 🔧 Configuration

### Initialisation du client

Initialisez le client Printful au démarrage de votre application :

```typescript
// src/main.tsx ou src/App.tsx
import { initPrintfulClient } from '@/integrations/printful';

const apiKey = import.meta.env.VITE_PRINTFUL_API_KEY;

if (!apiKey) {
  console.error('VITE_PRINTFUL_API_KEY non définie');
} else {
  initPrintfulClient(apiKey);
}
```

## 💻 Utilisation

### Option 1 : Utiliser le client directement

```typescript
import { getPrintfulClient } from '@/integrations/printful';

async function fetchProducts() {
  try {
    const client = getPrintfulClient();
    const products = await client.getCatalogProducts();
    console.log(products);
  } catch (error) {
    console.error('Erreur:', error);
  }
}
```

### Option 2 : Utiliser les hooks React (recommandé)

```typescript
import { usePrintfulCatalogProducts } from '@/integrations/printful/hooks';

function ProductList() {
  const { data, isLoading, error } = usePrintfulCatalogProducts();

  if (isLoading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error.message}</div>;

  return (
    <div>
      {data?.map((product) => (
        <div key={product.id}>{product.title}</div>
      ))}
    </div>
  );
}
```

## 📚 API Client

### Store

```typescript
const client = getPrintfulClient();

// Récupérer les infos du store
const storeInfo = await client.getStoreInfo();
```

### Produits du catalogue

```typescript
// Liste des produits
const products = await client.getCatalogProducts({ limit: 20 });

// Produit spécifique
const product = await client.getCatalogProduct(71);

// Variantes d'un produit
const variants = await client.getProductVariants(71);
```

### Produits synchronisés (Sync Products)

```typescript
// Liste des produits sync
const syncProducts = await client.getSyncProducts();

// Produit sync spécifique
const syncProduct = await client.getSyncProduct(123);

// Créer un produit sync
const newProduct = await client.createSyncProduct({
  sync_product: {
    name: 'Mon T-Shirt',
    thumbnail: 'https://...',
  },
  sync_variants: [
    {
      variant_id: 4012,
      retail_price: '29.99',
      files: [
        {
          url: 'https://...',
        },
      ],
    },
  ],
});

// Mettre à jour
await client.updateSyncProduct(123, productData);

// Supprimer
await client.deleteSyncProduct(123);
```

### Commandes

```typescript
// Liste des commandes
const orders = await client.getOrders({ status: 'pending' });

// Commande spécifique
const order = await client.getOrder('@12345');

// Créer une commande
const newOrder = await client.createOrder({
  recipient: {
    name: 'Jean Dupont',
    address1: '123 Rue Example',
    city: 'Paris',
    state_code: 'IDF',
    country_code: 'FR',
    zip: '75001',
  },
  items: [
    {
      sync_variant_id: 123456,
      quantity: 1,
    },
  ],
});

// Estimer les coûts
const costs = await client.estimateOrderCosts(orderData);

// Confirmer une commande
await client.confirmOrder('@12345');

// Annuler une commande
await client.cancelOrder('@12345');
```

### Expédition

```typescript
// Calculer les frais d'expédition
const rates = await client.getShippingRates({
  recipient: {
    /* ... */
  },
  items: [
    /* ... */
  ],
});
```

### Bibliothèque de fichiers

```typescript
// Liste des fichiers
const files = await client.getFiles();

// Upload un fichier
const uploadedFile = await client.uploadFile({
  url: 'https://example.com/image.png',
  filename: 'mon-design.png',
  visible: true,
});
```

### Webhooks

```typescript
// Liste des webhooks
const webhooks = await client.getWebhooks();

// Créer un webhook
const webhook = await client.createWebhook({
  url: 'https://monsite.com/webhook',
  types: ['package_shipped', 'order_failed'],
});

// Supprimer un webhook
await client.deleteWebhook(123);
```

## 🎣 React Hooks

Tous les hooks utilisent React Query pour la gestion du cache et des états.

### Hooks de lecture (Query)

```typescript
// Store
const { data, isLoading, error } = usePrintfulStore();

// Produits
const { data } = usePrintfulCatalogProducts({ limit: 20 });
const { data } = usePrintfulCatalogProduct(71);

// Sync Products
const { data } = usePrintfulSyncProducts();
const { data } = usePrintfulSyncProduct(123);

// Commandes
const { data } = usePrintfulOrders({ status: 'pending' });
const { data } = usePrintfulOrder('@12345');

// Fichiers
const { data } = usePrintfulFiles();
const { data } = usePrintfulFile(123);

// Webhooks
const { data } = usePrintfulWebhooks();
```

### Hooks de mutation

```typescript
// Créer un sync product
const createProduct = useCreateSyncProduct();
createProduct.mutate(productData, {
  onSuccess: (data) => console.log('Créé:', data),
  onError: (error) => console.error('Erreur:', error),
});

// Mettre à jour un sync product
const updateProduct = useUpdateSyncProduct();
updateProduct.mutate({ productId: 123, productData });

// Supprimer un sync product
const deleteProduct = useDeleteSyncProduct();
deleteProduct.mutate(123);

// Créer une commande
const createOrder = useCreateOrder();
createOrder.mutate(orderData);

// Confirmer une commande
const confirmOrder = useConfirmOrder();
confirmOrder.mutate('@12345');

// Annuler une commande
const cancelOrder = useCancelOrder();
cancelOrder.mutate('@12345');

// Estimer les coûts
const estimateCosts = useEstimateOrderCosts();
estimateCosts.mutate(orderData);

// Calculer les frais d'expédition
const getShippingRates = useGetShippingRates();
getShippingRates.mutate(shippingData);

// Upload un fichier
const uploadFile = useUploadFile();
uploadFile.mutate({ url: 'https://...', filename: 'design.png' });

// Créer un webhook
const createWebhook = useCreateWebhook();
createWebhook.mutate({ url: 'https://...', types: ['package_shipped'] });

// Supprimer un webhook
const deleteWebhook = useDeleteWebhook();
deleteWebhook.mutate(123);
```

## 📖 Exemples complets

### Exemple 1 : Liste de produits avec filtre

```typescript
import { usePrintfulSyncProducts } from '@/integrations/printful/hooks';
import { useState } from 'react';

function ProductCatalog() {
  const [status, setStatus] = useState<string>('all');
  const { data, isLoading } = usePrintfulSyncProducts({
    status: status === 'all' ? undefined : status,
  });

  return (
    <div>
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="all">Tous</option>
        <option value="synced">Synchronisés</option>
        <option value="unsynced">Non synchronisés</option>
      </select>

      {isLoading ? (
        <p>Chargement...</p>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {data?.map((product) => (
            <div key={product.id} className="border p-4">
              <img src={product.thumbnail_url} alt={product.name} />
              <h3>{product.name}</h3>
              <p>{product.variants} variantes</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

### Exemple 2 : Créer une commande

```typescript
import { useCreateOrder, useEstimateOrderCosts } from '@/integrations/printful/hooks';
import { useState } from 'react';

function CreateOrderForm() {
  const createOrder = useCreateOrder();
  const estimateCosts = useEstimateOrderCosts();

  const [orderData, setOrderData] = useState({
    recipient: {
      name: '',
      address1: '',
      city: '',
      state_code: '',
      country_code: 'FR',
      zip: '',
      email: '',
    },
    items: [
      {
        sync_variant_id: 0,
        quantity: 1,
      },
    ],
  });

  const handleEstimate = async () => {
    estimateCosts.mutate(orderData, {
      onSuccess: (data) => {
        console.log('Coûts estimés:', data);
      },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    createOrder.mutate(orderData, {
      onSuccess: (data) => {
        console.log('Commande créée:', data);
        alert('Commande créée avec succès !');
      },
      onError: (error) => {
        console.error('Erreur:', error);
        alert('Erreur lors de la création de la commande');
      },
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Vos champs de formulaire */}
      <button type="button" onClick={handleEstimate}>
        Estimer les coûts
      </button>
      <button type="submit" disabled={createOrder.isPending}>
        {createOrder.isPending ? 'Création...' : 'Créer la commande'}
      </button>
    </form>
  );
}
```

## 🔗 Ressources

- [Documentation officielle Printful API](https://developers.printful.com/docs/)
- [Guide de démarrage rapide](https://developers.printful.com/docs/#section/Quick-Start-Guide)
- [Types d'événements webhook](https://developers.printful.com/docs/#tag/Webhooks)

## 🤝 Support

Pour toute question ou problème :

1. Consultez la [documentation Printful](https://developers.printful.com/docs/)
2. Vérifiez que votre clé API est correcte
3. Assurez-vous que votre compte Printful est actif
