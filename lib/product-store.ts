import type { Product } from "./types";
import { supabase, isSupabaseEnabled, rowToProduct, productToRow } from "./supabase";
import { readLocal, writeLocal, isValidArray } from "./storage-utils";

/**
 * 商品持久层：优先同步到 Supabase（多端互通），未配置或离线时回退到 localStorage。
 *
 * 同步策略：
 * - 读取时合并本地与云端，本地数据不会被云端覆盖。
 * - 本地有而云端没有的商品会自动补回云端（修复历史数据）。
 * - 新增/更新/删除会同时操作本地和云端，云端失败只发警告不阻塞界面。
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

function parseLocalProducts(): Product[] {
  const value = readLocal<unknown>(KEY, []);
  return isValidArray<Product>(value) ? value : [];
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
  const local = parseLocalProducts();
  if (!isSupabaseEnabled()) return local;

  try {
    const remote = await readRemote();
    const remoteMap = new Map(remote.map((p) => [p.id, p]));
    const localMap = new Map(local.map((p) => [p.id, p]));

    // 合并：以本地为基准，补充云端独有的商品，避免本地数据被覆盖。
    const merged = [...local];
    for (const p of remote) {
      if (!localMap.has(p.id)) merged.push(p);
    }

    writeLocal(KEY, merged);

    // 把本地有但云端没有的商品并行补回云端（修复之前同步失败的数据）。
    const missing = merged.filter((p) => !remoteMap.has(p.id));
    if (missing.length > 0) {
      await Promise.all(
        missing.map((p) =>
          writeRemote(p).catch((e) => {
            console.warn("[product-store] 补同步商品失败", p.id, e);
          })
        )
      );
    }

    return merged;
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
  writeLocal(KEY, localList);
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
  writeLocal(KEY, localList);
  try {
    await writeRemote(localList[idx]);
  } catch (e) {
    console.warn("[product-store] 更新商品同步到 Supabase 失败", e);
  }
}

/** 删除商品：按 id 过滤掉，写入云端和本地 */
export async function deleteProduct(id: string): Promise<void> {
  const localList = (await readAll()).filter((p) => p.id !== id);
  writeLocal(KEY, localList);
  try {
    await removeRemote(id);
  } catch (e) {
    console.warn("[product-store] 删除商品同步到 Supabase 失败", e);
  }
}

/** 一键删除所有商品：写入空数组并清空云端 */
export async function deleteAllProducts(): Promise<void> {
  writeLocal(KEY, []);
  if (isSupabaseEnabled() && supabase) {
    try {
      const { error } = await supabase.from("products").delete().neq("id", "");
      if (error) throw error;
    } catch (e) {
      console.warn("[product-store] 清空 Supabase 商品失败", e);
    }
  }
}
