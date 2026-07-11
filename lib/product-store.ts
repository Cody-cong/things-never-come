import type { Product } from "./types";
import { supabase, isSupabaseEnabled, rowToProduct, productToRow } from "./supabase";
import { readLocal, writeLocal, isValidArray } from "./storage-utils";

/**
 * 商品持久层：优先同步到 Supabase（多端互通），未配置或离线时回退到 localStorage。
 *
 * 同步策略：
 * - 当 Supabase 可用且读取成功时，以云端为单一事实来源，并用云端数据覆盖本地缓存，
 *   防止其他设备/浏览器残留的旧数据被重新同步回云端。
 * - 未配置 Supabase 或读取失败时，回退到 localStorage。
 * - 新增/更新/删除会同时操作本地和云端，云端失败只发警告不阻塞界面。
 */
const KEY = "gnc_products_v1";

/** 管理端可编辑字段子集 */
export interface ProductInput {
  name: string;
  nameEn: string;
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

function parseLocalProducts(): { list: Product[]; isEmptyByUser: boolean } {
  if (typeof window === "undefined") return { list: [], isEmptyByUser: false };
  const raw = window.localStorage.getItem(KEY);
  if (raw === null) return { list: [], isEmptyByUser: false };
  try {
    const value = JSON.parse(raw) as unknown;
    return isValidArray<Product>(value)
      ? { list: value, isEmptyByUser: value.length === 0 }
      : { list: [], isEmptyByUser: true };
  } catch {
    return { list: [], isEmptyByUser: true };
  }
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
  const { list: local } = parseLocalProducts();
  if (!isSupabaseEnabled()) return local;

  try {
    const remote = await readRemote();

    // Supabase 为单一事实来源。只要配置并读取成功，就使用云端数据并覆盖本地，
    // 避免本地旧数据（包括其他设备/浏览器残留数据）被重新同步回云端。
    writeLocal(KEY, remote);
    return remote;
  } catch (e) {
    console.warn("[product-store] 读取 Supabase 失败，回退到 localStorage", e);
    return local;
  }
}

/** 返回当前生效的全部商品 */
export async function getAllProducts(): Promise<Product[]> {
  return readAll();
}

/** 按 id 查询商品 */
export async function getProductById(id: string): Promise<Product | undefined> {
  const list = await readAll();
  return list.find((p) => p.id === id);
}

/** 返回热门商品（hot = true） */
export async function getHotProducts(): Promise<Product[]> {
  const list = await readAll();
  return list.filter((p) => p.hot);
}

/** 按分类查询商品，category 为 "ALL" 时返回全部 */
export async function getProductsByCategory(category: string): Promise<Product[]> {
  const list = await readAll();
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
    nameEn: input.nameEn.trim(),
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
  writeLocal(KEY, localList);
  await writeRemote(product);
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
  writeLocal(KEY, localList);
  await writeRemote(localList[idx]);
}

/** 删除商品：按 id 过滤掉，写入云端和本地 */
export async function deleteProduct(id: string): Promise<void> {
  const localList = (await readAll()).filter((p) => p.id !== id);
  writeLocal(KEY, localList);
  await removeRemote(id);
}

/** 批量删除商品：按 id 列表过滤掉，写入云端和本地 */
export async function deleteProducts(ids: string[]): Promise<void> {
  const idSet = new Set(ids);
  const localList = (await readAll()).filter((p) => !idSet.has(p.id));
  writeLocal(KEY, localList);
  if (isSupabaseEnabled() && supabase) {
    const { error } = await supabase.from("products").delete().in("id", ids);
    if (error) throw error;
  }
}

/** 一键删除所有商品：写入空数组并清空云端 */
export async function deleteAllProducts(): Promise<void> {
  writeLocal(KEY, []);
  if (isSupabaseEnabled() && supabase) {
    const { error } = await supabase.from("products").delete().neq("id", "");
    if (error) throw error;
  }
}
