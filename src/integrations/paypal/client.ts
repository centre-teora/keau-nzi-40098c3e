/**
 * Client PayPal API
 * Documentation: https://developer.paypal.com/docs/api/overview/
 */

const PAYPAL_API_BASE_URL_SANDBOX = 'https://api-m.sandbox.paypal.com';
const PAYPAL_API_BASE_URL_LIVE = 'https://api-m.paypal.com';

interface PayPalConfig {
  clientId: string;
  clientSecret: string;
  mode: 'sandbox' | 'live';
}

interface PayPalAccessToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

interface PayPalOrder {
  id: string;
  status: string;
  intent: string;
  purchase_units: PayPalPurchaseUnit[];
  payer?: PayPalPayer;
  create_time: string;
  update_time: string;
  links: PayPalLink[];
}

interface PayPalPurchaseUnit {
  reference_id?: string;
  amount: {
    currency_code: string;
    value: string;
    breakdown?: {
      item_total?: { currency_code: string; value: string };
      shipping?: { currency_code: string; value: string };
      tax_total?: { currency_code: string; value: string };
    };
  };
  description?: string;
  items?: PayPalItem[];
  shipping?: {
    name?: { full_name: string };
    address?: PayPalAddress;
  };
}

interface PayPalItem {
  name: string;
  unit_amount: {
    currency_code: string;
    value: string;
  };
  quantity: string;
  description?: string;
  sku?: string;
  category?: 'DIGITAL_GOODS' | 'PHYSICAL_GOODS';
}

interface PayPalAddress {
  address_line_1?: string;
  address_line_2?: string;
  admin_area_2?: string; // City
  admin_area_1?: string; // State
  postal_code?: string;
  country_code: string;
}

interface PayPalPayer {
  email_address?: string;
  name?: {
    given_name: string;
    surname: string;
  };
  address?: PayPalAddress;
}

interface PayPalLink {
  href: string;
  rel: string;
  method: string;
}

interface PayPalCapture {
  id: string;
  status: string;
  amount: {
    currency_code: string;
    value: string;
  };
}

class PayPalClient {
  private clientId: string;
  private clientSecret: string;
  private baseUrl: string;
  private accessToken: string | null = null;
  private tokenExpiresAt: number = 0;

  constructor(config: PayPalConfig) {
    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret;
    this.baseUrl = config.mode === 'live' 
      ? PAYPAL_API_BASE_URL_LIVE 
      : PAYPAL_API_BASE_URL_SANDBOX;
  }

  /**
   * Obtenir un token d'accès OAuth
   */
  private async getAccessToken(): Promise<string> {
    // Vérifier si le token existant est toujours valide
    if (this.accessToken && Date.now() < this.tokenExpiresAt) {
      return this.accessToken;
    }

    const auth = btoa(`${this.clientId}:${this.clientSecret}`);
    
    const response = await fetch(`${this.baseUrl}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(`PayPal Auth Error: ${response.status} - ${error.message || response.statusText}`);
    }

    const data: PayPalAccessToken = await response.json();
    this.accessToken = data.access_token;
    // Expiration avec une marge de sécurité de 5 minutes
    this.tokenExpiresAt = Date.now() + (data.expires_in - 300) * 1000;
    
    return this.accessToken;
  }

  /**
   * Requête générique à l'API PayPal
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = await this.getAccessToken();
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ 
        message: 'Unknown error' 
      }));
      throw new Error(
        `PayPal API Error: ${response.status} - ${error.message || error.name || response.statusText}`
      );
    }

    // Certaines requêtes (comme les captures) peuvent retourner 201 sans corps
    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  // ==================== ORDERS ====================

  /**
   * Créer une commande PayPal
   */
  async createOrder(params: {
    intent?: 'CAPTURE' | 'AUTHORIZE';
    purchase_units: PayPalPurchaseUnit[];
    payer?: PayPalPayer;
    application_context?: {
      brand_name?: string;
      locale?: string;
      landing_page?: 'LOGIN' | 'BILLING' | 'NO_PREFERENCE';
      shipping_preference?: 'GET_FROM_FILE' | 'NO_SHIPPING' | 'SET_PROVIDED_ADDRESS';
      user_action?: 'CONTINUE' | 'PAY_NOW';
      return_url?: string;
      cancel_url?: string;
    };
  }): Promise<PayPalOrder> {
    return this.request<PayPalOrder>('/v2/checkout/orders', {
      method: 'POST',
      body: JSON.stringify({
        intent: params.intent || 'CAPTURE',
        purchase_units: params.purchase_units,
        payer: params.payer,
        application_context: params.application_context,
      }),
    });
  }

  /**
   * Récupérer les détails d'une commande
   */
  async getOrder(orderId: string): Promise<PayPalOrder> {
    return this.request<PayPalOrder>(`/v2/checkout/orders/${orderId}`, {
      method: 'GET',
    });
  }

  /**
   * Mettre à jour une commande
   */
  async updateOrder(
    orderId: string,
    updates: Array<{
      op: 'add' | 'replace' | 'remove';
      path: string;
      value?: any;
    }>
  ): Promise<void> {
    return this.request<void>(`/v2/checkout/orders/${orderId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  /**
   * Capturer le paiement d'une commande
   */
  async captureOrder(orderId: string): Promise<PayPalOrder> {
    return this.request<PayPalOrder>(`/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
    });
  }

  /**
   * Autoriser une commande (sans capture immédiate)
   */
  async authorizeOrder(orderId: string): Promise<PayPalOrder> {
    return this.request<PayPalOrder>(`/v2/checkout/orders/${orderId}/authorize`, {
      method: 'POST',
    });
  }

  // ==================== PAYMENTS ====================

  /**
   * Afficher les détails d'une capture
   */
  async getCapture(captureId: string): Promise<PayPalCapture> {
    return this.request<PayPalCapture>(`/v2/payments/captures/${captureId}`, {
      method: 'GET',
    });
  }

  /**
   * Rembourser une capture
   */
  async refundCapture(
    captureId: string,
    params?: {
      amount?: {
        value: string;
        currency_code: string;
      };
      note_to_payer?: string;
    }
  ): Promise<any> {
    return this.request(`/v2/payments/captures/${captureId}/refund`, {
      method: 'POST',
      body: JSON.stringify(params || {}),
    });
  }

  // ==================== WEBHOOKS ====================

  /**
   * Créer un webhook
   */
  async createWebhook(params: {
    url: string;
    event_types: Array<{ name: string }>;
  }): Promise<any> {
    return this.request('/v1/notifications/webhooks', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  /**
   * Lister les webhooks
   */
  async listWebhooks(): Promise<{ webhooks: any[] }> {
    return this.request('/v1/notifications/webhooks', {
      method: 'GET',
    });
  }

  /**
   * Supprimer un webhook
   */
  async deleteWebhook(webhookId: string): Promise<void> {
    return this.request(`/v1/notifications/webhooks/${webhookId}`, {
      method: 'DELETE',
    });
  }

  /**
   * Vérifier la signature d'un webhook
   */
  async verifyWebhookSignature(params: {
    auth_algo: string;
    cert_url: string;
    transmission_id: string;
    transmission_sig: string;
    transmission_time: string;
    webhook_id: string;
    webhook_event: any;
  }): Promise<{ verification_status: string }> {
    return this.request('/v1/notifications/verify-webhook-signature', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  // ==================== HELPER METHODS ====================

  /**
   * Obtenir le Client ID (pour le frontend)
   */
  getClientId(): string {
    return this.clientId;
  }

  /**
   * Créer une commande simple (helper)
   */
  async createSimpleOrder(params: {
    amount: string;
    currency: string;
    description?: string;
    return_url?: string;
    cancel_url?: string;
  }): Promise<PayPalOrder> {
    return this.createOrder({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: params.currency,
            value: params.amount,
          },
          description: params.description,
        },
      ],
      application_context: {
        return_url: params.return_url,
        cancel_url: params.cancel_url,
        user_action: 'PAY_NOW',
      },
    });
  }
}

// Instance singleton du client
let paypalClient: PayPalClient | null = null;

/**
 * Initialiser le client PayPal
 */
export const initPayPalClient = (
  clientId: string,
  clientSecret: string,
  mode: 'sandbox' | 'live' = 'sandbox'
) => {
  paypalClient = new PayPalClient({ clientId, clientSecret, mode });
  return paypalClient;
};

/**
 * Récupérer l'instance du client PayPal
 */
export const getPayPalClient = (): PayPalClient => {
  if (!paypalClient) {
    throw new Error('PayPal client not initialized. Call initPayPalClient first.');
  }
  return paypalClient;
};

export { PayPalClient };
export type {
  PayPalConfig,
  PayPalOrder,
  PayPalPurchaseUnit,
  PayPalItem,
  PayPalPayer,
  PayPalAddress,
  PayPalCapture,
  PayPalLink,
};
