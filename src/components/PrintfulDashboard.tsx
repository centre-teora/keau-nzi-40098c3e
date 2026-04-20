/**
 * Exemple de composant utilisant l'intégration Printful
 * Ce composant démontre comment utiliser les hooks React Query
 */

import { useState } from 'react';
import {
  usePrintfulStore,
  usePrintfulSyncProducts,
  usePrintfulOrders,
  useCreateOrder,
} from '@/integrations/printful/hooks';
import type { PrintfulCreateOrderRequest } from '@/integrations/printful/types';

export function PrintfulDashboard() {
  const [activeTab, setActiveTab] = useState<'store' | 'products' | 'orders'>('store');

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Tableau de bord Printful</h1>

      {/* Tabs */}
      <div className="flex gap-4 border-b">
        <button
          onClick={() => setActiveTab('store')}
          className={`pb-2 px-4 ${
            activeTab === 'store' ? 'border-b-2 border-blue-500 font-semibold' : ''
          }`}
        >
          Store
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-2 px-4 ${
            activeTab === 'products' ? 'border-b-2 border-blue-500 font-semibold' : ''
          }`}
        >
          Produits
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-2 px-4 ${
            activeTab === 'orders' ? 'border-b-2 border-blue-500 font-semibold' : ''
          }`}
        >
          Commandes
        </button>
      </div>

      {/* Content */}
      {activeTab === 'store' && <StoreInfo />}
      {activeTab === 'products' && <ProductsList />}
      {activeTab === 'orders' && <OrdersList />}
    </div>
  );
}

// ==================== STORE INFO ====================

function StoreInfo() {
  const { data: store, isLoading, error } = usePrintfulStore();

  if (isLoading) return <div>Chargement des informations du store...</div>;
  if (error) return <div className="text-red-500">Erreur: {error.message}</div>;
  if (!store) return <div>Aucune information disponible</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4">Informations du Store</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-gray-600">Nom</p>
          <p className="font-semibold">{store.name}</p>
        </div>
        <div>
          <p className="text-gray-600">Type</p>
          <p className="font-semibold">{store.type}</p>
        </div>
        <div>
          <p className="text-gray-600">Site web</p>
          <p className="font-semibold">{store.website || 'Non renseigné'}</p>
        </div>
        <div>
          <p className="text-gray-600">Devise</p>
          <p className="font-semibold">{store.currency}</p>
        </div>
      </div>
    </div>
  );
}

// ==================== PRODUCTS LIST ====================

function ProductsList() {
  const { data: products, isLoading, error } = usePrintfulSyncProducts({ limit: 20 });

  if (isLoading) return <div>Chargement des produits...</div>;
  if (error) return <div className="text-red-500">Erreur: {error.message}</div>;
  if (!products || products.length === 0) return <div>Aucun produit trouvé</div>;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Produits synchronisés</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow overflow-hidden">
            <img
              src={product.thumbnail_url}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
              <div className="flex justify-between text-sm text-gray-600">
                <span>{product.variants} variantes</span>
                <span className={product.synced ? 'text-green-600' : 'text-orange-600'}>
                  {product.synced ? '✓ Synchronisé' : '⚠ Non synchronisé'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==================== ORDERS LIST ====================

function OrdersList() {
  const { data: orders, isLoading, error } = usePrintfulOrders({ limit: 20 });

  if (isLoading) return <div>Chargement des commandes...</div>;
  if (error) return <div className="text-red-500">Erreur: {error.message}</div>;
  if (!orders || orders.length === 0) {
    return (
      <div>
        <h2 className="text-2xl font-semibold mb-4">Commandes</h2>
        <p>Aucune commande trouvée</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Commandes récentes</h2>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {order.external_id || order.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.recipient.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.costs.total} {order.costs.currency}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(order.created * 1000).toLocaleDateString('fr-FR')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Helper function pour les couleurs de statut
function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-800',
    pending: 'bg-yellow-100 text-yellow-800',
    failed: 'bg-red-100 text-red-800',
    canceled: 'bg-red-100 text-red-800',
    onhold: 'bg-orange-100 text-orange-800',
    inprocess: 'bg-blue-100 text-blue-800',
    partial: 'bg-purple-100 text-purple-800',
    fulfilled: 'bg-green-100 text-green-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}

// ==================== CREATE ORDER EXAMPLE ====================

export function CreateOrderExample() {
  const createOrder = useCreateOrder();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateOrder = () => {
    setIsCreating(true);

    const orderData: PrintfulCreateOrderRequest = {
      external_id: `ORDER-${Date.now()}`,
      recipient: {
        name: 'Jean Dupont',
        address1: '123 Rue de la Paix',
        city: 'Paris',
        state_code: 'IDF',
        country_code: 'FR',
        zip: '75001',
        email: 'jean.dupont@example.com',
        phone: '+33612345678',
      },
      items: [
        {
          sync_variant_id: 123456, // Remplacer par un vrai ID de variante
          quantity: 1,
          retail_price: '29.99',
        },
      ],
    };

    createOrder.mutate(orderData, {
      onSuccess: (data) => {
        console.log('Commande créée:', data);
        alert('Commande créée avec succès !');
        setIsCreating(false);
      },
      onError: (error) => {
        console.error('Erreur:', error);
        alert(`Erreur: ${error.message}`);
        setIsCreating(false);
      },
    });
  };

  return (
    <div className="p-4">
      <h3 className="text-xl font-semibold mb-4">Créer une commande test</h3>
      <button
        onClick={handleCreateOrder}
        disabled={isCreating}
        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {isCreating ? 'Création en cours...' : 'Créer une commande test'}
      </button>
      {createOrder.error && (
        <p className="mt-4 text-red-500">Erreur: {createOrder.error.message}</p>
      )}
    </div>
  );
}
