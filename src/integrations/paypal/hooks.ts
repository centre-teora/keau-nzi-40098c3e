/**
 * React Hooks pour PayPal
 * Utilise React Query pour la gestion du cache et des états
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getPayPalClient } from './client';
import type { PayPalPurchaseUnit, PayPalPayer } from './client';

// ==================== QUERY KEYS ====================

export const paypalKeys = {
  all: ['paypal'] as const,
  orders: () => [...paypalKeys.all, 'orders'] as const,
  order: (id: string) => [...paypalKeys.orders(), id] as const,
  captures: () => [...paypalKeys.all, 'captures'] as const,
  capture: (id: string) => [...paypalKeys.captures(), id] as const,
  webhooks: () => [...paypalKeys.all, 'webhooks'] as const,
};

// ==================== ORDER HOOKS ====================

export function useCreatePayPalOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: {
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
    }) => getPayPalClient().createOrder(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paypalKeys.orders() });
    },
  });
}

export function useCreateSimplePayPalOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: {
      amount: string;
      currency: string;
      description?: string;
      return_url?: string;
      cancel_url?: string;
    }) => getPayPalClient().createSimpleOrder(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paypalKeys.orders() });
    },
  });
}

export function usePayPalOrder(orderId: string) {
  return useQuery({
    queryKey: paypalKeys.order(orderId),
    queryFn: () => getPayPalClient().getOrder(orderId),
    enabled: !!orderId,
  });
}

export function useUpdatePayPalOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      updates,
    }: {
      orderId: string;
      updates: Array<{
        op: 'add' | 'replace' | 'remove';
        path: string;
        value?: any;
      }>;
    }) => getPayPalClient().updateOrder(orderId, updates),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: paypalKeys.order(variables.orderId) });
    },
  });
}

export function useCapturePayPalOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => getPayPalClient().captureOrder(orderId),
    onSuccess: (_, orderId) => {
      queryClient.invalidateQueries({ queryKey: paypalKeys.order(orderId) });
      queryClient.invalidateQueries({ queryKey: paypalKeys.orders() });
      queryClient.invalidateQueries({ queryKey: paypalKeys.captures() });
    },
  });
}

export function useAuthorizePayPalOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => getPayPalClient().authorizeOrder(orderId),
    onSuccess: (_, orderId) => {
      queryClient.invalidateQueries({ queryKey: paypalKeys.order(orderId) });
      queryClient.invalidateQueries({ queryKey: paypalKeys.orders() });
    },
  });
}

// ==================== CAPTURE HOOKS ====================

export function usePayPalCapture(captureId: string) {
  return useQuery({
    queryKey: paypalKeys.capture(captureId),
    queryFn: () => getPayPalClient().getCapture(captureId),
    enabled: !!captureId,
  });
}

export function useRefundCapture() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      captureId,
      params,
    }: {
      captureId: string;
      params?: {
        amount?: {
          value: string;
          currency_code: string;
        };
        note_to_payer?: string;
      };
    }) => getPayPalClient().refundCapture(captureId, params),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: paypalKeys.capture(variables.captureId) });
      queryClient.invalidateQueries({ queryKey: paypalKeys.captures() });
    },
  });
}

// ==================== WEBHOOK HOOKS ====================

export function usePayPalWebhooks() {
  return useQuery({
    queryKey: paypalKeys.webhooks(),
    queryFn: () => getPayPalClient().listWebhooks(),
  });
}

export function useCreatePayPalWebhook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: {
      url: string;
      event_types: Array<{ name: string }>;
    }) => getPayPalClient().createWebhook(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paypalKeys.webhooks() });
    },
  });
}

export function useDeletePayPalWebhook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (webhookId: string) => getPayPalClient().deleteWebhook(webhookId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paypalKeys.webhooks() });
    },
  });
}

export function useVerifyPayPalWebhook() {
  return useMutation({
    mutationFn: (params: {
      auth_algo: string;
      cert_url: string;
      transmission_id: string;
      transmission_sig: string;
      transmission_time: string;
      webhook_id: string;
      webhook_event: any;
    }) => getPayPalClient().verifyWebhookSignature(params),
  });
}

// ==================== HELPER HOOKS ====================

/**
 * Hook pour obtenir le Client ID PayPal
 */
export function usePayPalClientId() {
  return getPayPalClient().getClientId();
}
