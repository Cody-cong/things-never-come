import { supabase, isSupabaseEnabled } from "./supabase";
import { readLocal, writeLocal, isValidArray } from "./storage-utils";

/**
 * 分类持久层：优先同步到 Supabase（多端互通），未配置或离线时回退到 localStorage。
 *
 * 同步策略：
 * - 读取时合并本地与云端，本地数据不会被云端覆盖。
 * - 本地有而云端没有的分类会自动补回云端。
 * - 新增/更新/删除会同时操作本地和云端，云端失败只发警告不阻塞界面。
 * - 不会删除云端独有的分类，避免多设备/多管理员场景下误删他人数据。
 */
const KEY = "gnc_categories_v1";

function parseLocalCategories(): string[] {
  const value = readLocal<unknown>(KEY, []);
  return isValidArray<string>(value) ? value.filter((c) => typeof c === "string") : [];
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

  const remoteNames = await readRemote();
  const remoteSet = new Set(remoteNames);
  const toInsert = list.filter((name) => !remoteSet.has(name));

  if (toInsert.length > 0) {
    const { error } = await supabase
      .from("categories")
      .insert(toInsert.map((name) => ({ name })));
    if (error) throw error;
  }
}

async function readAll(): Promise<string[]> {
  const local = parseLocalCategories();
  if (!isSupabaseEnabled()) return local;

  try {
    const remote = await readRemote();
    // 合并本地与云端，保留顺序：本地在前，补充云端独有的。
    const merged = Array.from(new Set([...local, ...remote]));
    writeLocal(KEY, merged);
    await syncRemote(merged);
    return merged;
  } catch (e) {
    console.warn("[category-store] 读取 Supabase 失败，回退到 localStorage", e);
    return local;
  }
}

async function writeAll(list: string[]): Promise<void> {
  writeLocal(KEY, list);
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
