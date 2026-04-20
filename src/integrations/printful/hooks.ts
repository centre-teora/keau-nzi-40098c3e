/**
 * React Hooks pour l'API Printful
 * Utilise React Query pour la gestion du cache et des états
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPrintfulClient } from './client';
import type {
  PrintfulCreateOrderRequest,
  PrintfulCreateOrderItem,
  PrintfulShippingRateRequest,
  PrintfulWebhookCreateRequest,
  PrintfulFileUploadRequest,
} from './types';

// ==================== QUERY KEYS ====================

export const printfulKeys = {
  all: ['printful'] as const,
  store: () => [...printfulKeys.all, 'store'] as const,
  products: () => [...printfulKeys.all, 'products'] as const,
  product: (id: number) => [...printfulKeys.products(), id] as const,
  syncProducts: () => [...printfulKeys.all, 'sync-products'] as const,
  syncProduct: (id: number) => [...printfulKeys.syncProducts(), id] as const,
  orders: () => [...printfulKeys.all, 'orders'] as const,
  order: (id: string | number) => [...printfulKeys.orders(), id] as const,
  files: () => [...printfulKeys.all, 'files'] as const,
  file: (id: number) => [...printfulKeys.files(), id] as const,
  webhooks: () => [...printfulKeys.all, 'webhooks'] as const,
};

// ==================== STORE HOOKS ====================

export function usePrintfulStore() {
  return useQuery({
    queryKey: printfulKeys.store(),
    queryFn: () => getPrintfulClient().getStoreInfo(),
  });
}

// ==================== CATALOG PRODUCT HOOKS ====================

export function usePrintfulCatalogProducts(params?: {
  category_id?: number;
  limit?: number;
  offset?: number;
}) {
  return useQuery({
    queryKey: [...printfulKeys.products(), params],
    queryFn: () => getPrintfulClient().getCatalogProducts(params),
  });
}

export function usePrintfulCatalogProduct(productId: number) {
  return useQuery({
    queryKey: printfulKeys.product(productId),
    queryFn: () => getPrintfulClient().getCatalogProduct(productId),
    enabled: !!productId,
  });
}

// ==================== SYNC PRODUCT HOOKS ====================

export function usePrintfulSyncProducts(params?: {
  status?: string;
  limit?: number;
  offset?: number;
}) {
  return useQuery({
    queryKey: [...printfulKeys.syncProducts(), params],
    queryFn: () => getPrintfulClient().getSyncProducts(params),
  });
}

export function usePrintfulSyncProduct(productId: number) {
  return useQuery({
    queryKey: printfulKeys.syncProduct(productId),
    queryFn: () => getPrintfulClient().getSyncProduct(productId),
    enabled: !!productId,
  });
}

export function useCreateSyncProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productData: unknown) =>
      getPrintfulClient().createSyncProduct(productData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: printfulKeys.syncProducts() });
    },
  });
}

export function useUpdateSyncProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, productData }: { productId: number; productData: unknown }) =>
      getPrintfulClient().updateSyncProduct(productId, productData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: printfulKeys.syncProduct(variables.productId) });
      queryClient.invalidateQueries({ queryKey: printfulKeys.syncProducts() });
    },
  });
}

export function useDeleteSyncProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: number) => getPrintfulClient().deleteSyncProduct(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: printfulKeys.syncProducts() });
    },
  });
}

// ==================== ORDER HOOKS ====================

export function usePrintfulOrders(params?: {
  status?: string;
  limit?: number;
  offset?: number;
}) {
  return useQuery({
    queryKey: [...printfulKeys.orders(), params],
    queryFn: () => getPrintfulClient().getOrders(params),
  });
}

export function usePrintfulOrder(orderId: string | number) {
  return useQuery({
    queryKey: printfulKeys.order(orderId),
    queryFn: () => getPrintfulClient().getOrder(orderId),
    enabled: !!orderId,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderData: PrintfulCreateOrderRequest) =>
      getPrintfulClient().createOrder(orderData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: printfulKeys.orders() });
    },
  });
}

export function useConfirmOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string | number) => getPrintfulClient().confirmOrder(orderId),
    onSuccess: (_, orderId) => {
      queryClient.invalidateQueries({ queryKey: printfulKeys.order(orderId) });
      queryClient.invalidateQueries({ queryKey: printfulKeys.orders() });
    },
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string | number) => getPrintfulClient().cancelOrder(orderId),
    onSuccess: (_, orderId) => {
      queryClient.invalidateQueries({ queryKey: printfulKeys.order(orderId) });
      queryClient.invalidateQueries({ queryKey: printfulKeys.orders() });
    },
  });
}

export function useEstimateOrderCosts() {
  return useMutation({
    mutationFn: (orderData: PrintfulCreateOrderRequest) =>
      getPrintfulClient().estimateOrderCosts(orderData),
  });
}

// ==================== SHIPPING HOOKS ====================

export function useGetShippingRates() {
  return useMutation({
    mutationFn: (shippingData: PrintfulShippingRateRequest) =>
      getPrintfulClient().getShippingRates(shippingData),
  });
}

// ==================== FILE LIBRARY HOOKS ====================

export function usePrintfulFiles(params?: { limit?: number; offset?: number }) {
  return useQuery({
    queryKey: [...printfulKeys.files(), params],
    queryFn: () => getPrintfulClient().getFiles(params),
  });
}

export function usePrintfulFile(fileId: number) {
  return useQuery({
    queryKey: printfulKeys.file(fileId),
    queryFn: () => getPrintfulClient().getFile(fileId),
    enabled: !!fileId,
  });
}

export function useUploadFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (fileData: PrintfulFileUploadRequest) =>
      getPrintfulClient().uploadFile(fileData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: printfulKeys.files() });
    },
  });
}

// ==================== WEBHOOK HOOKS ====================

export function usePrintfulWebhooks() {
  return useQuery({
    queryKey: printfulKeys.webhooks(),
    queryFn: () => getPrintfulClient().getWebhooks(),
  });
}

export function useCreateWebhook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (webhookData: PrintfulWebhookCreateRequest) =>
      getPrintfulClient().createWebhook(webhookData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: printfulKeys.webhooks() });
    },
  });
}

export function useDeleteWebhook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (webhookId: number) => getPrintfulClient().deleteWebhook(webhookId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: printfulKeys.webhooks() });
    },
  });
}
