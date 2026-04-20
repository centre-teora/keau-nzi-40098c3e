/**
 * Client Printful API
 * Documentation: https://developers.printful.com/docs/
 */

const PRINTFUL_API_BASE_URL = 'https://api.printful.com';

interface PrintfulConfig {
  apiKey: string;
}

class PrintfulClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(config: PrintfulConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = PRINTFUL_API_BASE_URL;
  }

  /**
   * Méthode générique pour les requêtes à l'API Printful
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(`Printful API Error: ${response.status} - ${error.message || response.statusText}`);
    }

    const data = await response.json();
    return data.result as T;
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, body: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, body: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // ==================== STORE METHODS ====================

  /**
   * Récupérer les informations du store
   */
  async getStoreInfo() {
    return this.get('/store');
  }

  // ==================== PRODUCT METHODS ====================

  /**
   * Récupérer la liste des produits du catalogue Printful
   */
  async getCatalogProducts(params?: { category_id?: number; limit?: number; offset?: number }) {
    const queryParams = new URLSearchParams(params as Record<string, string>).toString();
    return this.get(`/products${queryParams ? `?${queryParams}` : ''}`);
  }

  /**
   * Récupérer un produit spécifique du catalogue
   */
  async getCatalogProduct(productId: number) {
    return this.get(`/products/${productId}`);
  }

  /**
   * Récupérer les variantes d'un produit
   */
  async getProductVariants(productId: number) {
    return this.get(`/products/${productId}`);
  }

  // ==================== SYNC PRODUCT METHODS ====================

  /**
   * Récupérer tous les produits synchronisés du store
   */
  async getSyncProducts(params?: { status?: string; limit?: number; offset?: number }) {
    const queryParams = new URLSearchParams(params as Record<string, string>).toString();
    return this.get(`/sync/products${queryParams ? `?${queryParams}` : ''}`);
  }

  /**
   * Récupérer un produit synchronisé spécifique
   */
  async getSyncProduct(productId: number) {
    return this.get(`/sync/products/${productId}`);
  }

  /**
   * Créer un nouveau produit synchronisé
   */
  async createSyncProduct(productData: unknown) {
    return this.post('/sync/products', productData);
  }

  /**
   * Mettre à jour un produit synchronisé
   */
  async updateSyncProduct(productId: number, productData: unknown) {
    return this.put(`/sync/products/${productId}`, productData);
  }

  /**
   * Supprimer un produit synchronisé
   */
  async deleteSyncProduct(productId: number) {
    return this.delete(`/sync/products/${productId}`);
  }

  // ==================== ORDER METHODS ====================

  /**
   * Récupérer toutes les commandes
   */
  async getOrders(params?: { status?: string; limit?: number; offset?: number }) {
    const queryParams = new URLSearchParams(params as Record<string, string>).toString();
    return this.get(`/orders${queryParams ? `?${queryParams}` : ''}`);
  }

  /**
   * Récupérer une commande spécifique
   */
  async getOrder(orderId: string | number) {
    return this.get(`/orders/${orderId}`);
  }

  /**
   * Créer une nouvelle commande
   */
  async createOrder(orderData: unknown) {
    return this.post('/orders', orderData);
  }

  /**
   * Confirmer une commande
   */
  async confirmOrder(orderId: string | number) {
    return this.post(`/orders/${orderId}/confirm`, {});
  }

  /**
   * Annuler une commande
   */
  async cancelOrder(orderId: string | number) {
    return this.delete(`/orders/${orderId}`);
  }

  /**
   * Estimer les coûts d'une commande
   */
  async estimateOrderCosts(orderData: unknown) {
    return this.post('/orders/estimate-costs', orderData);
  }

  // ==================== SHIPPING METHODS ====================

  /**
   * Récupérer les taux d'expédition
   */
  async getShippingRates(shippingData: unknown) {
    return this.post('/shipping/rates', shippingData);
  }

  // ==================== FILE LIBRARY METHODS ====================

  /**
   * Récupérer tous les fichiers de la bibliothèque
   */
  async getFiles(params?: { limit?: number; offset?: number }) {
    const queryParams = new URLSearchParams(params as Record<string, string>).toString();
    return this.get(`/files${queryParams ? `?${queryParams}` : ''}`);
  }

  /**
   * Récupérer un fichier spécifique
   */
  async getFile(fileId: number) {
    return this.get(`/files/${fileId}`);
  }

  /**
   * Uploader un fichier
   */
  async uploadFile(fileData: { url: string; filename?: string; visible?: boolean }) {
    return this.post('/files', fileData);
  }

  // ==================== WEBHOOK METHODS ====================

  /**
   * Récupérer les webhooks configurés
   */
  async getWebhooks() {
    return this.get('/webhooks');
  }

  /**
   * Créer un webhook
   */
  async createWebhook(webhookData: { url: string; types: string[] }) {
    return this.post('/webhooks', webhookData);
  }

  /**
   * Supprimer un webhook
   */
  async deleteWebhook(webhookId: number) {
    return this.delete(`/webhooks/${webhookId}`);
  }
}

// Instance singleton du client
let printfulClient: PrintfulClient | null = null;

/**
 * Initialiser le client Printful
 */
export const initPrintfulClient = (apiKey: string) => {
  printfulClient = new PrintfulClient({ apiKey });
  return printfulClient;
};

/**
 * Récupérer l'instance du client Printful
 */
export const getPrintfulClient = (): PrintfulClient => {
  if (!printfulClient) {
    throw new Error('Printful client not initialized. Call initPrintfulClient first.');
  }
  return printfulClient;
};

export { PrintfulClient };
export type { PrintfulConfig };
