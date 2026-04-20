/**
 * Types TypeScript pour l'API Printful
 * Documentation: https://developers.printful.com/docs/
 */

// ==================== PRODUCT TYPES ====================

export interface PrintfulProduct {
  id: number;
  main_category_id: number;
  type: string;
  type_name: string;
  title: string;
  brand: string | null;
  model: string;
  image: string;
  variant_count: number;
  currency: string;
  files: PrintfulFile[];
  options: PrintfulOption[];
  dimensions: PrintfulDimensions | null;
  is_discontinued: boolean;
  description: string;
}

export interface PrintfulProductVariant {
  id: number;
  product_id: number;
  name: string;
  size: string;
  color: string;
  color_code: string;
  color_code2: string | null;
  image: string;
  price: string;
  in_stock: boolean;
  availability_regions: Record<string, string>;
  availability_status: PrintfulAvailabilityStatus[];
  material: PrintfulMaterial[];
}

export interface PrintfulFile {
  id: string;
  type: string;
  title: string;
  additional_price: string | null;
}

export interface PrintfulOption {
  id: string;
  title: string;
  type: string;
  values: Record<string, string>;
  additional_price: string | null;
  additional_price_breakdown: Record<string, string>;
}

export interface PrintfulDimensions {
  front: string;
}

export interface PrintfulAvailabilityStatus {
  region: string;
  status: string;
}

export interface PrintfulMaterial {
  name: string;
  percentage: number;
}

// ==================== SYNC PRODUCT TYPES ====================

export interface PrintfulSyncProduct {
  id: number;
  external_id: string;
  name: string;
  variants: number;
  synced: number;
  thumbnail_url: string;
  is_ignored: boolean;
}

export interface PrintfulSyncProductFull {
  id: number;
  external_id: string;
  name: string;
  variants: PrintfulSyncVariant[];
  synced: number;
  thumbnail_url: string;
  is_ignored: boolean;
}

export interface PrintfulSyncVariant {
  id: number;
  external_id: string;
  sync_product_id: number;
  name: string;
  synced: boolean;
  variant_id: number;
  main_category_id: number;
  warehouse_product_variant_id: number | null;
  retail_price: string;
  sku: string;
  currency: string;
  product: PrintfulVariantProduct;
  files: PrintfulSyncVariantFile[];
  options: PrintfulSyncVariantOption[];
  is_ignored: boolean;
}

export interface PrintfulVariantProduct {
  variant_id: number;
  product_id: number;
  image: string;
  name: string;
}

export interface PrintfulSyncVariantFile {
  id: number;
  type: string;
  hash: string | null;
  url: string | null;
  filename: string;
  mime_type: string | null;
  size: number;
  width: number | null;
  height: number | null;
  dpi: number | null;
  status: string;
  created: number;
  thumbnail_url: string | null;
  preview_url: string | null;
  visible: boolean;
  is_temporary: boolean;
}

export interface PrintfulSyncVariantOption {
  id: string;
  value: string;
}

// ==================== ORDER TYPES ====================

export interface PrintfulOrder {
  id: number;
  external_id: string;
  store: number;
  status: PrintfulOrderStatus;
  shipping: string;
  created: number;
  updated: number;
  recipient: PrintfulRecipient;
  items: PrintfulOrderItem[];
  branding_items: unknown[];
  incomplete_items: PrintfulIncompleteItem[];
  costs: PrintfulCosts;
  retail_costs: PrintfulRetailCosts;
  pricing_breakdown: PrintfulPricingBreakdown[];
  shipments: PrintfulShipment[];
  gift: PrintfulGift | null;
  packing_slip: PrintfulPackingSlip | null;
}

export type PrintfulOrderStatus =
  | 'draft'
  | 'pending'
  | 'failed'
  | 'canceled'
  | 'onhold'
  | 'inprocess'
  | 'partial'
  | 'fulfilled';

export interface PrintfulRecipient {
  name: string;
  company: string | null;
  address1: string;
  address2: string | null;
  city: string;
  state_code: string;
  state_name: string;
  country_code: string;
  country_name: string;
  zip: string;
  phone: string | null;
  email: string;
  tax_number: string | null;
}

export interface PrintfulOrderItem {
  id: number;
  external_id: string;
  variant_id: number;
  sync_variant_id: number | null;
  external_variant_id: string | null;
  warehouse_product_variant_id: number | null;
  quantity: number;
  price: string;
  retail_price: string;
  name: string;
  product: PrintfulOrderItemProduct;
  files: PrintfulOrderItemFile[];
  options: PrintfulOrderItemOption[];
  sku: string | null;
  discontinued: boolean;
  out_of_stock: boolean;
}

export interface PrintfulOrderItemProduct {
  variant_id: number;
  product_id: number;
  image: string;
  name: string;
}

export interface PrintfulOrderItemFile {
  id: number;
  type: string;
  hash: string | null;
  url: string | null;
  filename: string;
  mime_type: string | null;
  size: number;
  width: number | null;
  height: number | null;
  dpi: number | null;
  status: string;
  created: number;
  thumbnail_url: string | null;
  preview_url: string | null;
  visible: boolean;
}

export interface PrintfulOrderItemOption {
  id: string;
  value: string;
}

export interface PrintfulIncompleteItem {
  name: string;
  quantity: number;
  sync_variant_id: number;
  external_variant_id: string;
  external_line_item_id: string;
  reason: string;
}

export interface PrintfulCosts {
  currency: string;
  subtotal: string;
  discount: string;
  shipping: string;
  digitization: string;
  additional_fee: string;
  fulfillment_fee: string;
  retail_delivery_fee: string;
  tax: string;
  vat: string;
  total: string;
}

export interface PrintfulRetailCosts {
  currency: string;
  subtotal: string;
  discount: string;
  shipping: string;
  tax: string;
  total: string;
}

export interface PrintfulPricingBreakdown {
  customer_pays: string;
  printful_price: string;
  profit: string;
  currency_symbol: string;
}

export interface PrintfulShipment {
  id: number;
  carrier: string;
  service: string;
  tracking_number: string;
  tracking_url: string;
  created: number;
  ship_date: string;
  shipped_at: number;
  reshipment: boolean;
  items: PrintfulShipmentItem[];
}

export interface PrintfulShipmentItem {
  item_id: number;
  quantity: number;
  printed: number;
  picked: number;
}

export interface PrintfulGift {
  subject: string;
  message: string;
}

export interface PrintfulPackingSlip {
  email: string;
  phone: string;
  message: string;
  logo_url: string;
  store_name: string;
  custom_order_id: string;
}

// ==================== CREATE ORDER TYPES ====================

export interface PrintfulCreateOrderRequest {
  external_id?: string;
  label?: string;
  shipping?: string;
  recipient: PrintfulRecipient;
  items: PrintfulCreateOrderItem[];
  retail_costs?: Partial<PrintfulRetailCosts>;
  gift?: PrintfulGift;
  packing_slip?: PrintfulPackingSlip;
}

export interface PrintfulCreateOrderItem {
  sync_variant_id?: number;
  external_variant_id?: string;
  variant_id?: number;
  warehouse_product_variant_id?: number;
  quantity: number;
  retail_price?: string;
  name?: string;
  files?: Array<{
    url: string;
    type?: string;
    options?: PrintfulOrderItemOption[];
  }>;
  options?: PrintfulOrderItemOption[];
  sku?: string;
}

// ==================== SHIPPING TYPES ====================

export interface PrintfulShippingRate {
  id: string;
  name: string;
  rate: string;
  currency: string;
  minDeliveryDays: number;
  maxDeliveryDays: number;
}

export interface PrintfulShippingRateRequest {
  recipient: PrintfulRecipient;
  items: PrintfulShippingRateItem[];
  currency?: string;
  locale?: string;
}

export interface PrintfulShippingRateItem {
  variant_id?: number;
  external_variant_id?: string;
  quantity: number;
  value?: string;
}

// ==================== FILE TYPES ====================

export interface PrintfulFileUploadRequest {
  url: string;
  filename?: string;
  visible?: boolean;
}

export interface PrintfulFileLibraryFile {
  id: number;
  type: string;
  hash: string | null;
  url: string;
  filename: string;
  mime_type: string;
  size: number;
  width: number;
  height: number;
  dpi: number | null;
  status: string;
  created: number;
  thumbnail_url: string;
  preview_url: string;
  visible: boolean;
}

// ==================== WEBHOOK TYPES ====================

export interface PrintfulWebhook {
  id: number;
  url: string;
  types: string[];
  secret: string;
}

export interface PrintfulWebhookCreateRequest {
  url: string;
  types: string[];
}

export type PrintfulWebhookType =
  | 'package_shipped'
  | 'package_returned'
  | 'order_failed'
  | 'order_canceled'
  | 'product_synced'
  | 'order_put_hold'
  | 'order_remove_hold';

// ==================== STORE TYPES ====================

export interface PrintfulStoreInfo {
  id: number;
  name: string;
  type: string;
  website: string;
  currency: string;
  created: number;
  packing_slip: {
    email: string;
    phone: string;
    message: string;
    logo_url: string;
  };
}

// ==================== API RESPONSE TYPES ====================

export interface PrintfulApiResponse<T> {
  code: number;
  result: T;
  extra?: unknown;
  paging?: {
    total: number;
    offset: number;
    limit: number;
  };
}

export interface PrintfulApiError {
  code: number;
  error: {
    reason: string;
    message: string;
  };
}
