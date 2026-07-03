/**
 * 分类持久层：管理端编辑的分类存 localStorage，初始无任何预设分类。
 */
const KEY = "gnc_categories_v1";

/** 客户端读取：localStorage 有就用 localStorage 列表，否则为空数组 */
function read(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (raw === null) return [];
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

function write(list: string[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY, JSON.stringify(list));
  }
}

/** 返回当前生效的全部分类 */
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
