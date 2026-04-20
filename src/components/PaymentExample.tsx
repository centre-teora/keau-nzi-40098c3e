/**
 * Composant exemple pour les paiements Stripe et PayPal
 */

import { useState } from 'react';
import { useCreatePaymentIntent, useCreateCheckoutSession } from '@/integrations/stripe/hooks';
import { useCreateSimplePayPalOrder, useCapturePayPalOrder } from '@/integrations/paypal/hooks';

export function PaymentExample() {
  const [amount, setAmount] = useState(29.99);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal'>('stripe');

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">Exemple de paiement</h1>

      {/* Sélection du montant */}
      <div className="bg-white p-6 rounded-lg shadow">
        <label className="block text-sm font-medium mb-2">Montant à payer</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
          className="w-full px-4 py-2 border rounded-lg"
          step="0.01"
          min="0.01"
        />
      </div>

      {/* Sélection du mode de paiement */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Choisir le mode de paiement</h2>
        <div className="flex gap-4">
          <button
            onClick={() => setPaymentMethod('stripe')}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition ${
              paymentMethod === 'stripe'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            💳 Carte bancaire (Stripe)
          </button>
          <button
            onClick={() => setPaymentMethod('paypal')}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition ${
              paymentMethod === 'paypal'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            🅿️ PayPal
          </button>
        </div>
      </div>

      {/* Composant de paiement */}
      {paymentMethod === 'stripe' ? (
        <StripePaymentSection amount={amount} />
      ) : (
        <PayPalPaymentSection amount={amount} />
      )}
    </div>
  );
}

// ==================== STRIPE SECTION ====================

function StripePaymentSection({ amount }: { amount: number }) {
  const createPaymentIntent = useCreatePaymentIntent();
  const createCheckoutSession = useCreateCheckoutSession();

  const handlePaymentIntent = () => {
    createPaymentIntent.mutate(
      {
        amount: Math.round(amount * 100), // Convertir en centimes
        currency: 'eur',
        description: 'Test de paiement',
        payment_method_types: ['card'],
      },
      {
        onSuccess: (paymentIntent) => {
          console.log('Payment Intent créé:', paymentIntent);
          alert(`Payment Intent créé avec succès!\nID: ${paymentIntent.id}\nClient Secret: ${paymentIntent.client_secret}`);
        },
        onError: (error) => {
          console.error('Erreur Stripe:', error);
          alert(`Erreur: ${error.message}`);
        },
      }
    );
  };

  const handleCheckoutSession = () => {
    createCheckoutSession.mutate(
      {
        mode: 'payment',
        line_items: [
          {
            price_data: {
              currency: 'eur',
              unit_amount: Math.round(amount * 100),
              product_data: {
                name: 'Produit de test',
                description: 'Ceci est un produit de test',
              },
            },
            quantity: 1,
          },
        ],
        success_url: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${window.location.origin}/cancel`,
      },
      {
        onSuccess: (session) => {
          console.log('Checkout Session créée:', session);
          // Rediriger vers Stripe Checkout
          window.location.href = session.url;
        },
        onError: (error) => {
          console.error('Erreur Stripe:', error);
          alert(`Erreur: ${error.message}`);
        },
      }
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow space-y-4">
      <h2 className="text-xl font-semibold">Paiement Stripe</h2>
      <p className="text-gray-600">Montant: {amount.toFixed(2)}€</p>

      <div className="space-y-3">
        <button
          onClick={handlePaymentIntent}
          disabled={createPaymentIntent.isPending}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition"
        >
          {createPaymentIntent.isPending ? 'Création...' : 'Créer Payment Intent'}
        </button>

        <button
          onClick={handleCheckoutSession}
          disabled={createCheckoutSession.isPending}
          className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 disabled:bg-gray-400 transition"
        >
          {createCheckoutSession.isPending ? 'Redirection...' : 'Payer via Stripe Checkout'}
        </button>
      </div>

      {createPaymentIntent.error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{createPaymentIntent.error.message}</p>
        </div>
      )}

      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          💡 <strong>Carte de test Stripe:</strong>
          <br />
          Numéro: 4242 4242 4242 4242
          <br />
          CVV: 123 | Date: 12/34
        </p>
      </div>
    </div>
  );
}

// ==================== PAYPAL SECTION ====================

function PayPalPaymentSection({ amount }: { amount: number }) {
  const createOrder = useCreateSimplePayPalOrder();
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);

  const handleCreateOrder = () => {
    createOrder.mutate(
      {
        amount: amount.toFixed(2),
        currency: 'EUR',
        description: 'Test de paiement PayPal',
        return_url: `${window.location.origin}/paypal-success`,
        cancel_url: `${window.location.origin}/paypal-cancel`,
      },
      {
        onSuccess: (order) => {
          console.log('Commande PayPal créée:', order);
          setCurrentOrderId(order.id);

          // Trouver le lien d'approbation
          const approveLink = order.links.find((link) => link.rel === 'approve');

          if (approveLink) {
            alert(`Commande créée!\nID: ${order.id}\nRedirection vers PayPal...`);
            // Rediriger vers PayPal pour le paiement
            window.location.href = approveLink.href;
          } else {
            alert('Erreur: Lien d\'approbation non trouvé');
          }
        },
        onError: (error) => {
          console.error('Erreur PayPal:', error);
          alert(`Erreur: ${error.message}`);
        },
      }
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow space-y-4">
      <h2 className="text-xl font-semibold">Paiement PayPal</h2>
      <p className="text-gray-600">Montant: {amount.toFixed(2)}€</p>

      <button
        onClick={handleCreateOrder}
        disabled={createOrder.isPending}
        className="w-full bg-yellow-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-yellow-600 disabled:bg-gray-400 transition"
      >
        {createOrder.isPending ? 'Création...' : 'Payer avec PayPal'}
      </button>

      {currentOrderId && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">
            ✅ Commande créée: {currentOrderId}
          </p>
        </div>
      )}

      {createOrder.error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{createOrder.error.message}</p>
        </div>
      )}

      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800">
          💡 <strong>Mode Sandbox activé</strong>
          <br />
          Utilisez vos comptes de test PayPal pour payer
          <br />
          Créez-les sur: developer.paypal.com/dashboard/accounts
        </p>
      </div>
    </div>
  );
}

// ==================== SUCCESS / CANCEL PAGES ====================

export function PaymentSuccess() {
  const searchParams = new URLSearchParams(window.location.search);
  const sessionId = searchParams.get('session_id');

  return (
    <div className="max-w-2xl mx-auto p-6 text-center">
      <div className="bg-green-50 border border-green-200 rounded-lg p-8">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-3xl font-bold text-green-800 mb-2">Paiement réussi !</h1>
        <p className="text-green-700">Votre paiement a été traité avec succès.</p>
        {sessionId && (
          <p className="text-sm text-green-600 mt-4">Session ID: {sessionId}</p>
        )}
      </div>
    </div>
  );
}

export function PaymentCancel() {
  return (
    <div className="max-w-2xl mx-auto p-6 text-center">
      <div className="bg-red-50 border border-red-200 rounded-lg p-8">
        <div className="text-6xl mb-4">❌</div>
        <h1 className="text-3xl font-bold text-red-800 mb-2">Paiement annulé</h1>
        <p className="text-red-700">Vous avez annulé le paiement.</p>
        <button
          onClick={() => (window.location.href = '/')}
          className="mt-6 bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700"
        >
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
}
