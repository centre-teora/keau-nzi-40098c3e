# 💳 Intégrations Stripe & PayPal

## 🎯 Vue d'ensemble

Ce projet intègre **Stripe** et **PayPal** pour gérer les paiements en ligne de manière sécurisée et professionnelle.

---

## 🔐 Configuration Stripe

### 1️⃣ Créer un compte Stripe

1. Allez sur [https://dashboard.stripe.com/register](https://dashboard.stripe.com/register)
2. Créez votre compte Stripe
3. Activez votre compte (vérification email, etc.)

### 2️⃣ Obtenir vos clés API

1. Connectez-vous au [Stripe Dashboard](https://dashboard.stripe.com/)
2. Allez dans **Developers** → **API Keys**
3. Vous verrez deux types de clés :
   - **Publishable key** (pk_test_...) - Utilisée côté client (frontend)
   - **Secret key** (sk_test_...) - Utilisée côté serveur (backend)

⚠️ **Important** : 
- Les clés **test** (test_) sont pour le développement
- Les clés **live** (live_) sont pour la production
- Ne partagez JAMAIS votre clé secrète publiquement !

### 3️⃣ Configurer dans .env

```bash
VITE_STRIPE_PUBLISHABLE_KEY="pk_test_votre_cle_publique"
VITE_STRIPE_SECRET_KEY="sk_test_votre_cle_secrete"
```

### 4️⃣ Initialiser Stripe dans votre app

```typescript
import { initStripeClient } from '@/integrations/stripe';

const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const secretKey = import.meta.env.VITE_STRIPE_SECRET_KEY;

if (publishableKey && secretKey) {
  initStripeClient(publishableKey, secretKey);
  console.log('✅ Stripe initialisé');
}
```

### 5️⃣ Utilisation dans vos composants

```typescript
import { useCreatePaymentIntent } from '@/integrations/stripe/hooks';

function Checkout() {
  const createPayment = useCreatePaymentIntent();

  const handlePay = () => {
    createPayment.mutate({
      amount: 2999, // 29.99€ en centimes
      currency: 'eur',
      description: 'Achat produit XYZ',
    }, {
      onSuccess: (paymentIntent) => {
        console.log('Payment Intent créé:', paymentIntent.id);
        // Rediriger vers la page de paiement
      }
    });
  };

  return <button onClick={handlePay}>Payer 29.99€</button>;
}
```

---

## 💰 Configuration PayPal

### 1️⃣ Créer un compte PayPal Developer

1. Allez sur [https://developer.paypal.com/](https://developer.paypal.com/)
2. Connectez-vous avec votre compte PayPal (ou créez-en un)
3. Accédez au [Dashboard](https://developer.paypal.com/dashboard/)

### 2️⃣ Créer une application

1. Dans le Dashboard, allez dans **Apps & Credentials**
2. Cliquez sur **Create App**
3. Donnez un nom à votre app (ex: "Keau-Nzi-Shop")
4. Sélectionnez **Merchant** comme type d'application
5. Cliquez sur **Create App**

### 3️⃣ Obtenir vos identifiants

Une fois l'app créée, vous verrez :
- **Client ID** - Identifiant public
- **Secret** - Clé secrète (cliquez sur "Show" pour la voir)

⚠️ **Sandbox vs Live** :
- **Sandbox** : Environnement de test (argent fictif)
- **Live** : Environnement de production (vrai argent)

### 4️⃣ Configurer dans .env

```bash
VITE_PAYPAL_CLIENT_ID="votre_client_id"
VITE_PAYPAL_CLIENT_SECRET="votre_client_secret"
VITE_PAYPAL_MODE="sandbox" # ou "live" pour la production
```

### 5️⃣ Initialiser PayPal dans votre app

```typescript
import { initPayPalClient } from '@/integrations/paypal';

const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;
const clientSecret = import.meta.env.VITE_PAYPAL_CLIENT_SECRET;
const mode = import.meta.env.VITE_PAYPAL_MODE as 'sandbox' | 'live';

if (clientId && clientSecret) {
  initPayPalClient(clientId, clientSecret, mode);
  console.log('✅ PayPal initialisé en mode', mode);
}
```

### 6️⃣ Utilisation dans vos composants

```typescript
import { useCreateSimplePayPalOrder } from '@/integrations/paypal/hooks';

function PayPalCheckout() {
  const createOrder = useCreateSimplePayPalOrder();

  const handlePayPal = () => {
    createOrder.mutate({
      amount: '29.99',
      currency: 'EUR',
      description: 'Achat produit XYZ',
      return_url: 'https://votresite.com/success',
      cancel_url: 'https://votresite.com/cancel',
    }, {
      onSuccess: (order) => {
        // Trouver le lien d'approbation
        const approveLink = order.links.find(link => link.rel === 'approve');
        if (approveLink) {
          window.location.href = approveLink.href;
        }
      }
    });
  };

  return <button onClick={handlePayPal}>Payer avec PayPal</button>;
}
```

---

## 🔗 Liens utiles

### Stripe
- 📚 [Documentation API](https://stripe.com/docs/api)
- 🎨 [Dashboard](https://dashboard.stripe.com/)
- 🧪 [Cartes de test](https://stripe.com/docs/testing)
- 💬 [Support](https://support.stripe.com/)

### PayPal
- 📚 [Documentation API](https://developer.paypal.com/docs/api/overview/)
- 🎨 [Developer Dashboard](https://developer.paypal.com/dashboard/)
- 🧪 [Sandbox Accounts](https://developer.paypal.com/dashboard/accounts)
- 💬 [Support](https://developer.paypal.com/support/)

---

## 🧪 Tester les paiements

### Stripe - Cartes de test

```
Carte réussie : 4242 4242 4242 4242
CVV : n'importe quel 3 chiffres
Date : n'importe quelle date future
```

Autres cartes de test :
- **Décliné** : 4000 0000 0000 0002
- **3D Secure requis** : 4000 0025 0000 3155

### PayPal - Comptes sandbox

1. Allez sur [https://developer.paypal.com/dashboard/accounts](https://developer.paypal.com/dashboard/accounts)
2. Créez un compte **Personal** (acheteur)
3. Créez un compte **Business** (vendeur)
4. Utilisez ces comptes pour tester vos paiements

Email de test : `sb-xxxxx@personal.example.com`  
Mot de passe : Celui que vous avez défini

---

## 💡 Exemples d'utilisation

### Exemple 1 : Page de paiement simple avec choix

```typescript
import { useCreatePaymentIntent } from '@/integrations/stripe/hooks';
import { useCreateSimplePayPalOrder } from '@/integrations/paypal/hooks';

function PaymentPage() {
  const stripePayment = useCreatePaymentIntent();
  const paypalPayment = useCreateSimplePayPalOrder();

  const amount = 29.99;

  const payWithStripe = () => {
    stripePayment.mutate({
      amount: Math.round(amount * 100), // Convertir en centimes
      currency: 'eur',
    });
  };

  const payWithPayPal = () => {
    paypalPayment.mutate({
      amount: amount.toFixed(2),
      currency: 'EUR',
      return_url: window.location.origin + '/success',
      cancel_url: window.location.origin + '/cancel',
    }, {
      onSuccess: (order) => {
        const approveUrl = order.links.find(l => l.rel === 'approve')?.href;
        if (approveUrl) window.location.href = approveUrl;
      }
    });
  };

  return (
    <div>
      <h2>Payer {amount}€</h2>
      <button onClick={payWithStripe}>Payer par carte (Stripe)</button>
      <button onClick={payWithPayPal}>Payer avec PayPal</button>
    </div>
  );
}
```

### Exemple 2 : Checkout Stripe avec session

```typescript
import { useCreateCheckoutSession } from '@/integrations/stripe/hooks';

function StripeCheckout() {
  const createSession = useCreateCheckoutSession();

  const handleCheckout = () => {
    createSession.mutate({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'eur',
            unit_amount: 2999, // 29.99€
            product_data: {
              name: 'Mon Produit',
              description: 'Description du produit',
              images: ['https://...'],
            },
          },
          quantity: 1,
        },
      ],
      success_url: window.location.origin + '/success',
      cancel_url: window.location.origin + '/cancel',
    }, {
      onSuccess: (session) => {
        window.location.href = session.url;
      }
    });
  };

  return <button onClick={handleCheckout}>Commander</button>;
}
```

---

## 🔒 Sécurité

### ⚠️ Règles importantes :

1. **Ne committez JAMAIS vos clés API** dans Git
2. Utilisez toujours `.env` pour les stocker
3. Les clés **secrètes** ne doivent JAMAIS être exposées au frontend
4. Utilisez les clés **test** en développement
5. Passez aux clés **live** uniquement en production

### ✅ Bonnes pratiques :

- Validez toujours les montants côté serveur
- Vérifiez les signatures des webhooks
- Loguez tous les paiements
- Mettez en place des limites de montant
- Surveillez les transactions suspectes

---

## 🎉 C'est prêt !

Vos intégrations Stripe et PayPal sont maintenant configurées. Vous pouvez :

1. ✅ Accepter des paiements par carte bancaire (Stripe)
2. ✅ Accepter des paiements PayPal
3. ✅ Créer des sessions de checkout
4. ✅ Gérer les remboursements
5. ✅ Suivre les transactions

**Besoin d'aide ?** Consultez la documentation complète ou contactez le support des plateformes.
