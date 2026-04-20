/**
 * Module d'intégration PayPal
 * Export de tous les composants nécessaires
 */

export { PayPalClient, initPayPalClient, getPayPalClient } from './client';
export type {
  PayPalConfig,
  PayPalOrder,
  PayPalPurchaseUnit,
  PayPalItem,
  PayPalPayer,
  PayPalAddress,
  PayPalCapture,
  PayPalLink,
} from './client';
export * from './hooks';
