import { createClient } from "@supabase/supabase-js";
import type { Product } from "./types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase =
  supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey)
    : undefined;

export function isSupabaseEnabled(): boolean {
  return !!supabase;
}

/** 把数据库行转换成应用内 Product 类型 */
export function rowToProduct(row: Record<string, unknown>): Product {
  return {
    id: String(row.id),
    shopId: String(row.shop_id ?? "admin"),
    name: String(row.name),
    nameEn: row.name_en ? String(row.name_en) : undefined,
    image: String(row.image),
    price: Number(row.price),
    originalPrice: row.original_price ? Number(row.original_price) : undefined,
    category: String(row.category),
    hot: Boolean(row.hot),
    description: String(row.description),
    specs: Array.isArray(row.specs) ? row.specs.map(String) : ["默认"],
    sales: Number(row.sales ?? 0),
    imagePrompt: String(row.image_prompt ?? ""),
    maxQuantity: row.max_quantity ? Number(row.max_quantity) : undefined,
    limitMessage: row.limit_message
      ? String(row.limit_message)
      : undefined,
  };
}

/** 把 Product 类型转换成数据库行 */
export function productToRow(product: Product): Record<string, unknown> {
  return {
    id: product.id,
    shop_id: product.shopId,
    name: product.name,
    name_en: product.nameEn ?? null,
    image: product.image,
    price: product.price,
    original_price: product.originalPrice ?? null,
    category: product.category,
    hot: product.hot,
    description: product.description,
    specs: product.specs,
    sales: product.sales,
    image_prompt: product.imagePrompt,
    max_quantity: product.maxQuantity ?? null,
    limit_message: product.limitMessage ?? null,
  };
}
