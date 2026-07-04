import type { Product } from "./types";
import { supabase, isSupabaseEnabled, rowToProduct, productToRow } from "./supabase";

/**
 * 商品持久层：优先同步到 Supabase（多端互通），未配置或离线时回退到 localStorage。
 */
const KEY = "gnc_products_v1";

/** 管理端可编辑字段子集 */
export interface ProductInput {
  name: string;
  nameEn?: string;
  image: string;
  price: number;
  originalPrice?: number;
  category: string;
  description: string;
  specs?: string[];
  hot?: boolean;
  maxQuantity?: number;
  limitMessage?: string;
}

function readLocal(): Product[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (raw === null) return [];
    const list = JSON.parse(raw) as Product[];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

function writeLocal(list: Product[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(list));
}

async function readRemote(): Promise<Product[]> {
  if (!isSupabaseEnabled() || !supabase) return [];
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(rowToProduct);
}

async function writeRemote(product: Product): Promise<void> {
  if (!isSupabaseEnabled() || !supabase) return;
  const { error } = await supabase
    .from("products")
    .upsert(productToRow(product), { onConflict: "id" });
  if (error) throw error;
}

async function removeRemote(id: string): Promise<void> {
  if (!isSupabaseEnabled() || !supabase) return;
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
}

async function readAll(): Promise<Product[]> {
  if (isSupabaseEnabled()) {
    try {
      const list = await readRemote();
      writeLocal(list);
      return list;
    } catch (e) {
      console.warn("[product-store] 读取 Supabase 失败，回退到 localStorage", e);
    }
  }
  return readLocal();
}

async function writeAll(list: Product[]): Promise<void> {
  writeLocal(list);
}

/** 返回当前生效的全部商品 */
export async function getAllProducts(): Promise<Product[]> {
  return readAll();
}

/** 按 id 查询商品 */
export async function getProductById(id: string): Promise<Product | undefined> {
  if (isSupabaseEnabled() && supabase) {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data ? rowToProduct(data) : undefined;
    } catch (e) {
      console.warn("[product-store] 按 ID 读取 Supabase 失败，回退到 localStorage", e);
    }
  }
  return readLocal().find((p) => p.id === id);
}

/** 返回热门商品（hot = true） */
export async function getHotProducts(): Promise<Product[]> {
  if (isSupabaseEnabled() && supabase) {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("hot", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map(rowToProduct);
    } catch (e) {
      console.warn("[product-store] 读取热门商品失败，回退到 localStorage", e);
    }
  }
  return readLocal().filter((p) => p.hot);
}

/** 按分类查询商品，category 为 "ALL" 时返回全部 */
export async function getProductsByCategory(category: string): Promise<Product[]> {
  if (isSupabaseEnabled() && supabase) {
    try {
      const query = supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      const { data, error } =
        category === "ALL" ? await query : await query.eq("category", category);
      if (error) throw error;
      return (data ?? []).map(rowToProduct);
    } catch (e) {
      console.warn("[product-store] 按分类读取失败，回退到 localStorage", e);
    }
  }
  const list = readLocal();
  if (category === "ALL") return list;
  return list.filter((p) => p.category === category);
}

/** 新增商品：生成 id，合并默认值，写入云端和本地，返回新商品 */
export async function addProduct(input: ProductInput): Promise<Product> {
  const localList = await readAll();
  const product: Product = {
    id: `p${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    shopId: "admin",
    name: input.name,
    nameEn: input.nameEn?.trim() || undefined,
    image: input.image,
    price: input.price,
    originalPrice: input.originalPrice,
    category: input.category,
    hot: input.hot ?? false,
    description: input.description,
    specs: input.specs ?? ["默认"],
    sales: 0,
    imagePrompt: "",
    maxQuantity: input.maxQuantity,
    limitMessage: input.limitMessage?.trim() || undefined,
  };
  localList.push(product);
  await writeAll(localList);
  try {
    await writeRemote(product);
  } catch (e) {
    console.warn("[product-store] 新增商品同步到 Supabase 失败", e);
  }
  return product;
}

/** 更新商品：合并 patch 中提供的字段，写入云端和本地 */
export async function updateProduct(
  id: string,
  patch: Partial<ProductInput>
): Promise<void> {
  const localList = await readAll();
  const idx = localList.findIndex((p) => p.id === id);
  if (idx < 0) return;
  localList[idx] = { ...localList[idx], ...patch };
  await writeAll(localList);
  try {
    await writeRemote(localList[idx]);
  } catch (e) {
    console.warn("[product-store] 更新商品同步到 Supabase 失败", e);
  }
}

/** 删除商品：按 id 过滤掉，写入云端和本地 */
export async function deleteProduct(id: string): Promise<void> {
  const localList = (await readAll()).filter((p) => p.id !== id);
  await writeAll(localList);
  try {
    await removeRemote(id);
  } catch (e) {
    console.warn("[product-store] 删除商品同步到 Supabase 失败", e);
  }
}

/** 一键删除所有商品：写入空数组并清空云端 */
export async function deleteAllProducts(): Promise<void> {
  await writeAll([]);
  if (isSupabaseEnabled() && supabase) {
    try {
      const { error } = await supabase.from("products").delete().neq("id", "");
      if (error) throw error;
    } catch (e) {
      console.warn("[product-store] 清空 Supabase 商品失败", e);
    }
  }
}
