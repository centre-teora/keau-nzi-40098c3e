/**
 * React Hooks pour Stripe
 * Utilise React Query pour la gestion du cache et des états
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getStripeClient } from './client';

// ==================== QUERY KEYS ====================

export const stripeKeys = {
  all: ['stripe'] as const,
  customers: () => [...stripeKeys.all, 'customers'] as const,
  customer: (id: string) => [...stripeKeys.customers(), id] as const,
  paymentIntents: () => [...stripeKeys.all, 'payment-intents'] as const,
  paymentIntent: (id: string) => [...stripeKeys.paymentIntents(), id] as const,
  prices: () => [...stripeKeys.all, 'prices'] as const,
  price: (id: string) => [...stripeKeys.prices(), id] as const,
  checkoutSessions: () => [...stripeKeys.all, 'checkout-sessions'] as const,
  checkoutSession: (id: string) => [...stripeKeys.checkoutSessions(), id] as const,
};

// ==================== PAYMENT INTENT HOOKS ====================

export function useCreatePaymentIntent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: {
      amount: number;
      currency: string;
      payment_method_types?: string[];
      description?: string;
      metadata?: Record<string, string>;
      customer?: string;
    }) => getStripeClient().createPaymentIntent(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: stripeKeys.paymentIntents() });
    },
  });
}

export function usePaymentIntent(paymentIntentId: string) {
  return useQuery({
    queryKey: stripeKeys.paymentIntent(paymentIntentId),
    queryFn: () => getStripeClient().getPaymentIntent(paymentIntentId),
    enabled: !!paymentIntentId,
  });
}

export function useConfirmPaymentIntent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      paymentIntentId,
      params,
    }: {
      paymentIntentId: string;
      params?: {
        payment_method?: string;
        return_url?: string;
      };
    }) => getStripeClient().confirmPaymentIntent(paymentIntentId, params),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: stripeKeys.paymentIntent(variables.paymentIntentId),
      });
    },
  });
}

export function useCancelPaymentIntent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (paymentIntentId: string) => getStripeClient().cancelPaymentIntent(paymentIntentId),
    onSuccess: (_, paymentIntentId) => {
      queryClient.invalidateQueries({ queryKey: stripeKeys.paymentIntent(paymentIntentId) });
      queryClient.invalidateQueries({ queryKey: stripeKeys.paymentIntents() });
    },
  });
}

// ==================== CUSTOMER HOOKS ====================

export function useCreateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: {
      email: string;
      name?: string;
      phone?: string;
      metadata?: Record<string, string>;
    }) => getStripeClient().createCustomer(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: stripeKeys.customers() });
    },
  });
}

export function useCustomer(customerId: string) {
  return useQuery({
    queryKey: stripeKeys.customer(customerId),
    queryFn: () => getStripeClient().getCustomer(customerId),
    enabled: !!customerId,
  });
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      customerId,
      params,
    }: {
      customerId: string;
      params: Partial<{
        email: string;
        name: string;
        phone: string;
        metadata: Record<string, string>;
      }>;
    }) => getStripeClient().updateCustomer(customerId, params),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: stripeKeys.customer(variables.customerId) });
      queryClient.invalidateQueries({ queryKey: stripeKeys.customers() });
    },
  });
}

// ==================== CHECKOUT SESSION HOOKS ====================

export function useCreateCheckoutSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: {
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
    }) => getStripeClient().createCheckoutSession(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: stripeKeys.checkoutSessions() });
    },
  });
}

export function useCheckoutSession(sessionId: string) {
  return useQuery({
    queryKey: stripeKeys.checkoutSession(sessionId),
    queryFn: () => getStripeClient().getCheckoutSession(sessionId),
    enabled: !!sessionId,
  });
}

// ==================== PRICE HOOKS ====================

export function usePrices(params?: {
  product?: string;
  active?: boolean;
  limit?: number;
}) {
  return useQuery({
    queryKey: [...stripeKeys.prices(), params],
    queryFn: () => getStripeClient().listPrices(params),
  });
}

export function usePrice(priceId: string) {
  return useQuery({
    queryKey: stripeKeys.price(priceId),
    queryFn: () => getStripeClient().getPrice(priceId),
    enabled: !!priceId,
  });
}

// ==================== HELPER HOOKS ====================

/**
 * Hook pour obtenir la clé publique Stripe
 */
export function useStripePublishableKey() {
  return getStripeClient().getPublishableKey();
}
