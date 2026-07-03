import { categories as baseCategories } from "./mock-data";

/**
 * 分类持久层：管理端编辑的商品分类存 localStorage，
 * 前台读取时优先用 localStorage 列表，无则回退到 mock-data 基础分类。
 */
const KEY = "gnc_categories_v1";

/** 客户端读取：localStorage 有就用 localStorage 列表，否则用 baseCategories。
 *  注意：空列表是合法状态（用户删除了所有分类），不应回退到基础分类。
 *  只有 localStorage 完全没有 key（首次使用）或解析失败时才回退。
 */
function read(): string[] {
  if (typeof window === "undefined") return baseCategories;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw === null) return baseCategories;
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list : baseCategories;
  } catch {
    return baseCategories;
  }
}

function write(list: string[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY, JSON.stringify(list));
  }
}

/** 返回当前生效的全部分类（localStorage 优先，回退基础分类） */
export function getCategories(): string[] {
  return read();
}

/** 新增分类：去重、非空才加，写入 localStorage */
export function addCategory(name: string): void {
  const trimmed = name.trim();
  if (!trimmed) return;
  const list = read();
  if (list.includes(trimmed)) return;
  list.push(trimmed);
  write(list);
}

/** 重命名分类：把 oldName 替换为 newName，写入 localStorage */
export function updateCategory(oldName: string, newName: string): void {
  const trimmed = newName.trim();
  if (!trimmed || trimmed === oldName) return;
  const list = read();
  const idx = list.indexOf(oldName);
  if (idx < 0) return;
  if (list.includes(trimmed)) return;
  list[idx] = trimmed;
  write(list);
}

/** 删除分类：按名称过滤掉，写入 localStorage */
export function deleteCategory(name: string): void {
  const list = read().filter((c) => c !== name);
  write(list);
}

/** 重置分类：清空 localStorage，回退到基础分类 */
export function resetCategories(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(KEY);
  }
}
