import { createServerFn } from "@tanstack/react-start";
import { printfulApi } from "./server";

export interface ShopProduct {
  id: number;
  slug: string;
  name: string;
  thumbnail: string;
  price: number;
  currency: string;
  variantId: number;
  syncVariantId: number;
}

const slugify = (input: string) =>
  input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);

export const listShopProducts = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ products: ShopProduct[]; error: string | null }> => {
    try {
      const sync = await printfulApi.listSyncProducts();
      const detailed = await Promise.all(
        sync
          .filter((p) => !p.is_ignored)
          .map(async (p) => {
            try {
              const full = await printfulApi.getSyncProduct(p.id);
              const firstVariant = full.sync_variants[0];
              if (!firstVariant) return null;
              const product: ShopProduct = {
                id: p.id,
                slug: `${slugify(p.name)}-${p.id}`,
                name: p.name,
                thumbnail: p.thumbnail_url || firstVariant.product.image,
                price: parseFloat(firstVariant.retail_price) || 0,
                currency: firstVariant.currency || "EUR",
                variantId: firstVariant.variant_id,
                syncVariantId: firstVariant.id,
              };
              return product;
            } catch {
              return null;
            }
          }),
      );

      return {
        products: detailed.filter((p): p is ShopProduct => p !== null),
        error: null,
      };
    } catch (error) {
      console.error("Printful sync error:", error);
      return {
        products: [],
        error:
          error instanceof Error
            ? error.message
            : "Impossible de joindre Printful pour le moment.",
      };
    }
  },
);

export const getShopProduct = createServerFn({ method: "GET" })
  .inputValidator((input: { slug: string }) => input)
  .handler(
    async ({
      data,
    }): Promise<{
      product:
        | (ShopProduct & {
            description: string;
            variants: Array<{
              id: number;
              name: string;
              price: number;
              currency: string;
            }>;
          })
        | null;
      error: string | null;
    }> => {
      try {
        const idMatch = data.slug.match(/-(\d+)$/);
        if (!idMatch) return { product: null, error: "Produit introuvable." };
        const id = parseInt(idMatch[1], 10);
        const full = await printfulApi.getSyncProduct(id);
        const firstVariant = full.sync_variants[0];
        if (!firstVariant) return { product: null, error: "Produit sans variante." };

        return {
          product: {
            id: full.sync_product.id,
            slug: data.slug,
            name: full.sync_product.name,
            thumbnail: full.sync_product.thumbnail_url || firstVariant.product.image,
            price: parseFloat(firstVariant.retail_price) || 0,
            currency: firstVariant.currency || "EUR",
            variantId: firstVariant.variant_id,
            syncVariantId: firstVariant.id,
            description: firstVariant.product.name,
            variants: full.sync_variants.map((v) => ({
              id: v.id,
              name: v.name,
              price: parseFloat(v.retail_price) || 0,
              currency: v.currency || "EUR",
            })),
          },
          error: null,
        };
      } catch (error) {
        console.error("Printful product fetch error:", error);
        return {
          product: null,
          error:
            error instanceof Error
              ? error.message
              : "Impossible de charger le produit.",
        };
      }
    },
  );
