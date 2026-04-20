/**
 * Client PayPal — types et Client ID uniquement (côté navigateur)
 * Les opérations nécessitant le secret sont dans paypal.functions.ts
 */

export interface PayPalOrder {
  id: string;
  status: string;
  intent: string;
  purchase_units: PayPalPurchaseUnit[];
  payer?: PayPalPayer;
  create_time: string;
  update_time: string;
  links: PayPalLink[];
}

export interface PayPalPurchaseUnit {
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

export interface PayPalItem {
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

export interface PayPalAddress {
  address_line_1?: string;
  address_line_2?: string;
  admin_area_2?: string; // City
  admin_area_1?: string; // State
  postal_code?: string;
  country_code: string;
}

export interface PayPalPayer {
  email_address?: string;
  name?: {
    given_name: string;
    surname: string;
  };
  address?: PayPalAddress;
}

export interface PayPalLink {
  href: string;
  rel: string;
  method: string;
}

export interface PayPalCapture {
  id: string;
  status: string;
  amount: {
    currency_code: string;
    value: string;
  };
}
