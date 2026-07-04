import { supabase, isSupabaseEnabled } from "./supabase";

/**
 * 分类持久层：优先同步到 Supabase（多端互通），未配置或离线时回退到 localStorage。
 */
const KEY = "gnc_categories_v1";

function readLocal(): string[] {
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

function writeLocal(list: string[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY, JSON.stringify(list));
  }
}

async function readRemote(): Promise<string[]> {
  if (!isSupabaseEnabled() || !supabase) return [];
  const { data, error } = await supabase
    .from("categories")
    .select("name")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []).map((row) => String(row.name));
}

async function syncRemote(list: string[]): Promise<void> {
  if (!isSupabaseEnabled() || !supabase) return;

  // 增量同步：读取远程现有分类，删除多余的，插入新增的，保留不变的。
  // 比“先删光再全量插入”更安全，可降低并发覆盖导致的数据丢失风险。
  const remoteNames = await readRemote();
  const localSet = new Set(list);
  const remoteSet = new Set(remoteNames);

  const toDelete = remoteNames.filter((name) => !localSet.has(name));
  const toInsert = list.filter((name) => !remoteSet.has(name));

  if (toDelete.length > 0) {
    const { error } = await supabase
      .from("categories")
      .delete()
      .in("name", toDelete);
    if (error) throw error;
  }

  if (toInsert.length > 0) {
    const { error } = await supabase
      .from("categories")
      .insert(toInsert.map((name) => ({ name })));
    if (error) throw error;
  }
}

async function readAll(): Promise<string[]> {
  if (isSupabaseEnabled()) {
    try {
      const list = await readRemote();
      writeLocal(list);
      return list;
    } catch (e) {
      console.warn("[category-store] 读取 Supabase 失败，回退到 localStorage", e);
    }
  }
  return readLocal();
}

async function writeAll(list: string[]): Promise<void> {
  writeLocal(list);
  try {
    await syncRemote(list);
  } catch (e) {
    console.warn("[category-store] 同步分类到 Supabase 失败", e);
  }
}

/** 返回当前生效的全部分类 */
export async function getCategories(): Promise<string[]> {
  return readAll();
}

/** 新增分类：去重、非空才加，写入云端和本地 */
export async function addCategory(name: string): Promise<void> {
  const trimmed = name.trim();
  if (!trimmed) return;
  const list = await readAll();
  if (list.includes(trimmed)) return;
  list.push(trimmed);
  await writeAll(list);
}

/** 重命名分类：把 oldName 替换为 newName，写入云端和本地 */
export async function updateCategory(oldName: string, newName: string): Promise<void> {
  const trimmed = newName.trim();
  if (!trimmed || trimmed === oldName) return;
  const list = await readAll();
  const idx = list.indexOf(oldName);
  if (idx < 0) return;
  if (list.includes(trimmed)) return;
  list[idx] = trimmed;
  await writeAll(list);
}

/** 删除分类：按名称过滤掉，写入云端和本地 */
export async function deleteCategory(name: string): Promise<void> {
  const list = (await readAll()).filter((c) => c !== name);
  await writeAll(list);
}
