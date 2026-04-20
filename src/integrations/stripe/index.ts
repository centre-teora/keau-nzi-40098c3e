/**
 * Module d'intégration Stripe
 * Export de tous les composants nécessaires
 */

export { StripeClient, initStripeClient, getStripeClient } from './client';
export type {
  StripeConfig,
  StripePaymentIntent,
  StripeCustomer,
  StripePrice,
  StripeCheckoutSession,
} from './client';
export * from './hooks';
