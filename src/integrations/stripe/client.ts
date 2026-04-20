/**
 * Client Stripe API
 * Documentation: https://stripe.com/docs/api
 */

const STRIPE_API_VERSION = '2024-12-18.acacia';

interface StripeConfig {
  publishableKey: string;
  secretKey?: string; // Pour les opérations côté serveur uniquement
}

interface StripePaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  client_secret: string;
  payment_method?: string;
  description?: string;
  metadata?: Record<string, string>;
}

interface StripeCustomer {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  metadata?: Record<string, string>;
}

interface StripePrice {
  id: string;
  product: string;
  unit_amount: number;
  currency: string;
  recurring?: {
    interval: 'day' | 'week' | 'month' | 'year';
    interval_count: number;
  };
}

interface StripeCheckoutSession {
  id: string;
  url: string;
  payment_status: string;
  customer?: string;
  amount_total: number;
  currency: string;
}

class StripeClient {
  private publishableKey: string;
  private secretKey?: string;

  constructor(config: StripeConfig) {
    this.publishableKey = config.publishableKey;
    this.secretKey = config.secretKey;
  }

  /**
   * Requête générique à l'API Stripe
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    if (!this.secretKey) {
      throw new Error('Stripe secret key required for API calls');
    }

    const url = `https://api.stripe.com/v1${endpoint}`;
    
    const headers = {
      'Authorization': `Bearer ${this.secretKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Stripe-Version': STRIPE_API_VERSION,
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ 
        error: { message: 'Unknown error' } 
      }));
      throw new Error(`Stripe API Error: ${response.status} - ${error.error?.message || response.statusText}`);
    }

    return response.json();
  }

  /**
   * Convertir un objet en format x-www-form-urlencoded
   */
  private encodeFormData(data: Record<string, any>): string {
    const params = new URLSearchParams();
    
    const addParams = (obj: any, prefix = '') => {
      for (const key in obj) {
        const value = obj[key];
        const paramKey = prefix ? `${prefix}[${key}]` : key;
        
        if (value === null || value === undefined) {
          continue;
        } else if (typeof value === 'object' && !Array.isArray(value)) {
          addParams(value, paramKey);
        } else if (Array.isArray(value)) {
          value.forEach((item, index) => {
            if (typeof item === 'object') {
              addParams(item, `${paramKey}[${index}]`);
            } else {
              params.append(`${paramKey}[]`, String(item));
            }
          });
        } else {
          params.append(paramKey, String(value));
        }
      }
    };
    
    addParams(data);
    return params.toString();
  }

  // ==================== PAYMENT INTENTS ====================

  /**
   * Créer un Payment Intent
   */
  async createPaymentIntent(params: {
    amount: number;
    currency: string;
    payment_method_types?: string[];
    description?: string;
    metadata?: Record<string, string>;
    customer?: string;
  }): Promise<StripePaymentIntent> {
    const body = this.encodeFormData({
      amount: params.amount,
      currency: params.currency,
      payment_method_types: params.payment_method_types || ['card'],
      description: params.description,
      metadata: params.metadata,
      customer: params.customer,
    });

    return this.request<StripePaymentIntent>('/payment_intents', {
      method: 'POST',
      body,
    });
  }

  /**
   * Récupérer un Payment Intent
   */
  async getPaymentIntent(paymentIntentId: string): Promise<StripePaymentIntent> {
    return this.request<StripePaymentIntent>(`/payment_intents/${paymentIntentId}`, {
      method: 'GET',
    });
  }

  /**
   * Confirmer un Payment Intent
   */
  async confirmPaymentIntent(
    paymentIntentId: string,
    params?: {
      payment_method?: string;
      return_url?: string;
    }
  ): Promise<StripePaymentIntent> {
    const body = this.encodeFormData(params || {});

    return this.request<StripePaymentIntent>(`/payment_intents/${paymentIntentId}/confirm`, {
      method: 'POST',
      body,
    });
  }

  /**
   * Annuler un Payment Intent
   */
  async cancelPaymentIntent(paymentIntentId: string): Promise<StripePaymentIntent> {
    return this.request<StripePaymentIntent>(`/payment_intents/${paymentIntentId}/cancel`, {
      method: 'POST',
    });
  }

  // ==================== CUSTOMERS ====================

  /**
   * Créer un client
   */
  async createCustomer(params: {
    email: string;
    name?: string;
    phone?: string;
    metadata?: Record<string, string>;
  }): Promise<StripeCustomer> {
    const body = this.encodeFormData(params);

    return this.request<StripeCustomer>('/customers', {
      method: 'POST',
      body,
    });
  }

  /**
   * Récupérer un client
   */
  async getCustomer(customerId: string): Promise<StripeCustomer> {
    return this.request<StripeCustomer>(`/customers/${customerId}`, {
      method: 'GET',
    });
  }

  /**
   * Mettre à jour un client
   */
  async updateCustomer(
    customerId: string,
    params: Partial<{
      email: string;
      name: string;
      phone: string;
      metadata: Record<string, string>;
    }>
  ): Promise<StripeCustomer> {
    const body = this.encodeFormData(params);

    return this.request<StripeCustomer>(`/customers/${customerId}`, {
      method: 'POST',
      body,
    });
  }

  // ==================== CHECKOUT SESSIONS ====================

  /**
   * Créer une session de checkout
   */
  async createCheckoutSession(params: {
    line_items: Array<{
      price?: string;
      quantity: number;
      price_data?: {
        currency: string;
        unit_amount: number;
        product_data: {
          name: string;
          description?: string;
          images?: string[];
        };
      };
    }>;
    mode: 'payment' | 'subscription' | 'setup';
    success_url: string;
    cancel_url: string;
    customer?: string;
    customer_email?: string;
    metadata?: Record<string, string>;
  }): Promise<StripeCheckoutSession> {
    const body = this.encodeFormData(params);

    return this.request<StripeCheckoutSession>('/checkout/sessions', {
      method: 'POST',
      body,
    });
  }

  /**
   * Récupérer une session de checkout
   */
  async getCheckoutSession(sessionId: string): Promise<StripeCheckoutSession> {
    return this.request<StripeCheckoutSession>(`/checkout/sessions/${sessionId}`, {
      method: 'GET',
    });
  }

  // ==================== PRICES ====================

  /**
   * Lister les prix
   */
  async listPrices(params?: {
    product?: string;
    active?: boolean;
    limit?: number;
  }): Promise<{ data: StripePrice[] }> {
    const queryParams = new URLSearchParams(params as Record<string, string>).toString();
    return this.request<{ data: StripePrice[] }>(`/prices${queryParams ? `?${queryParams}` : ''}`, {
      method: 'GET',
    });
  }

  /**
   * Récupérer un prix
   */
  async getPrice(priceId: string): Promise<StripePrice> {
    return this.request<StripePrice>(`/prices/${priceId}`, {
      method: 'GET',
    });
  }

  // ==================== WEBHOOKS ====================

  /**
   * Vérifier la signature d'un webhook
   */
  verifyWebhookSignature(
    payload: string,
    signature: string,
    webhookSecret: string
  ): boolean {
    // Note: En production, utilisez la bibliothèque officielle Stripe
    // pour une vérification cryptographique appropriée
    console.warn('Webhook signature verification not implemented. Use Stripe SDK in production.');
    return true;
  }

  // ==================== HELPER METHODS ====================

  /**
   * Obtenir la clé publique (pour le frontend)
   */
  getPublishableKey(): string {
    return this.publishableKey;
  }
}

// Instance singleton du client
let stripeClient: StripeClient | null = null;

/**
 * Initialiser le client Stripe
 */
export const initStripeClient = (publishableKey: string, secretKey?: string) => {
  stripeClient = new StripeClient({ publishableKey, secretKey });
  return stripeClient;
};

/**
 * Récupérer l'instance du client Stripe
 */
export const getStripeClient = (): StripeClient => {
  if (!stripeClient) {
    throw new Error('Stripe client not initialized. Call initStripeClient first.');
  }
  return stripeClient;
};

export { StripeClient };
export type { 
  StripeConfig, 
  StripePaymentIntent, 
  StripeCustomer, 
  StripePrice,
  StripeCheckoutSession 
};
