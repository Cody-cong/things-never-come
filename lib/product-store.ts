import type { Product } from "./types";

/**
 * 商品持久层：管理端编辑结果存 localStorage，初始无任何预设商品。
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
}

/** 客户端读取：localStorage 有就用 localStorage 全量列表，否则为空数组 */
function readAll(): Product[] {
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

function writeAll(list: Product[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(list));
}

/** 返回当前生效的全部商品 */
export function getAllProducts(): Product[] {
  return readAll();
}

/** 按 id 查询商品 */
export function getProductById(id: string): Product | undefined {
  return readAll().find((p) => p.id === id);
}

/** 返回热门商品（hot = true） */
export function getHotProducts(): Product[] {
  return readAll().filter((p) => p.hot);
}

/** 按分类查询商品，category 为 "ALL" 时返回全部 */
export function getProductsByCategory(category: string): Product[] {
  const list = readAll();
  if (category === "ALL") return list;
  return list.filter((p) => p.category === category);
}

/** 新增商品：生成 id，合并默认值，写入 localStorage，返回新商品 */
export function addProduct(input: ProductInput): Product {
  const list = readAll();
  const product: Product = {
    id: `p${Date.now()}`,
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
  };
  list.push(product);
  writeAll(list);
  return product;
}

/** 更新商品：合并 patch 中提供的字段，写入 localStorage */
export function updateProduct(id: string, patch: Partial<ProductInput>): void {
  const list = readAll();
  const idx = list.findIndex((p) => p.id === id);
  if (idx < 0) return;
  list[idx] = { ...list[idx], ...patch };
  writeAll(list);
}

/** 删除商品：按 id 过滤掉，写入 localStorage */
export function deleteProduct(id: string): void {
  const list = readAll().filter((p) => p.id !== id);
  writeAll(list);
}

/** 一键删除所有商品：写入空数组 */
export function deleteAllProducts(): void {
  if (typeof window === "undefined") return;
  writeAll([]);
}
