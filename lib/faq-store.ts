import { supabase, isSupabaseEnabled } from "./supabase";
import { readLocal, writeLocal, isValidArray } from "./storage-utils";

export interface HomeFaq {
  id: string;
  q: string;
  a: string;
}

/**
 * FAQ 持久层：优先同步到 Supabase（多端互通），未配置或离线时回退到 localStorage。
 *
 * 同步策略：
 * - 读取时以云端为准，但不会清空本地默认值（首次使用）。
 * - 如果云端为空且本地有默认值，会把默认值上传到云端作为初始数据。
 * - 管理端编辑后，所有客户端都会拉取到最新云端数据。
 *
 * 性能优化：
 * - 同一次页面生命周期内对 `readAll` 结果做内存缓存，避免重复请求。
 */
const KEY = "gnc_home_faqs_v1";

let cache: HomeFaq[] | null = null;

const DEFAULT_FAQS: HomeFaq[] = [
  {
    id: "f1",
    q: "这里的商品真的不会到吗？",
    a: "是的。things never come 是一个购物模拟器，所有订单都不会真实发货。",
  },
  {
    id: "f2",
    q: "需要付款吗？",
    a: "不需要。结算流程只是模拟，不会扣除任何真实资金。",
  },
  {
    id: "f3",
    q: "为什么我要用这个？",
    a: "适合想过购物瘾又担心剁手的用户，体验购物快感而不用付出代价。",
  },
  {
    id: "f4",
    q: "可以添加自己的商品吗？",
    a: "可以。进入管理后台即可添加、编辑或删除商品与分类。",
  },
];

function parseLocalFaqs(): HomeFaq[] {
  const value = readLocal<unknown>(KEY, DEFAULT_FAQS);
  return isValidArray<HomeFaq>(value) ? value : DEFAULT_FAQS;
}

async function readRemote(): Promise<HomeFaq[]> {
  if (!isSupabaseEnabled() || !supabase) return [];
  const { data, error } = await supabase
    .from("faqs")
    .select("id, q, a")
    .order("position", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []).map((row) => ({
    id: String(row.id),
    q: String(row.q),
    a: String(row.a),
  }));
}

async function writeRemoteRow(faq: HomeFaq, position: number): Promise<void> {
  if (!isSupabaseEnabled() || !supabase) return;
  const { error } = await supabase.from("faqs").upsert(
    {
      id: faq.id,
      q: faq.q,
      a: faq.a,
      position,
    },
    { onConflict: "id" }
  );
  if (error) throw error;
}

async function removeRemote(id: string): Promise<void> {
  if (!isSupabaseEnabled() || !supabase) return;
  const { error } = await supabase.from("faqs").delete().eq("id", id);
  if (error) throw error;
}

async function clearRemote(): Promise<void> {
  if (!isSupabaseEnabled() || !supabase) return;
  const { error } = await supabase.from("faqs").delete().neq("id", "");
  if (error) throw error;
}

async function readAll(): Promise<HomeFaq[]> {
  if (cache) return cache;

  const local = parseLocalFaqs();
  if (!isSupabaseEnabled()) return local;

  try {
    const remote = await readRemote();

    // 云端为空且本地有默认值时，把默认值作为初始数据上传到云端。
    if (remote.length === 0 && local.length > 0) {
      await Promise.all(local.map((f, i) => writeRemoteRow(f, i)));
      cache = local;
      return local;
    }

    // 否则以云端为准，并把最新数据缓存到本地。
    writeLocal(KEY, remote);
    cache = remote;
    return remote;
  } catch (e) {
    console.warn("[faq-store] 读取 Supabase 失败，回退到 localStorage", e);
    return local;
  }
}

/** 返回当前生效的全部 FAQ */
export async function getFaqs(): Promise<HomeFaq[]> {
  return readAll();
}

/** 新增 FAQ */
export async function addFaq(q: string, a: string): Promise<HomeFaq> {
  const faq: HomeFaq = {
    id: `faq_${Date.now()}`,
    q: q.trim(),
    a: a.trim(),
  };
  const list = await readAll();
  list.push(faq);
  writeLocal(KEY, list);
  cache = list;
  try {
    await writeRemoteRow(faq, list.length - 1);
  } catch (e) {
    console.warn("[faq-store] 新增 FAQ 同步到 Supabase 失败", e);
  }
  return faq;
}

/** 更新 FAQ */
export async function updateFaq(
  id: string,
  patch: Partial<Pick<HomeFaq, "q" | "a">>
): Promise<void> {
  const list = await readAll();
  const idx = list.findIndex((f) => f.id === id);
  if (idx < 0) return;
  list[idx] = {
    ...list[idx],
    ...(patch.q !== undefined ? { q: patch.q.trim() } : {}),
    ...(patch.a !== undefined ? { a: patch.a.trim() } : {}),
  };
  writeLocal(KEY, list);
  cache = list;
  try {
    await writeRemoteRow(list[idx], idx);
  } catch (e) {
    console.warn("[faq-store] 更新 FAQ 同步到 Supabase 失败", e);
  }
}

/** 删除 FAQ */
export async function deleteFaq(id: string): Promise<void> {
  const list = (await readAll()).filter((f) => f.id !== id);
  writeLocal(KEY, list);
  cache = list;
  try {
    await removeRemote(id);
    await Promise.all(list.map((f, i) => writeRemoteRow(f, i)));
  } catch (e) {
    console.warn("[faq-store] 删除 FAQ 同步到 Supabase 失败", e);
  }
}

/** 重置 FAQ 为默认 4 条 */
export async function resetFaqs(): Promise<void> {
  writeLocal(KEY, DEFAULT_FAQS);
  cache = DEFAULT_FAQS;
  try {
    await clearRemote();
    await Promise.all(DEFAULT_FAQS.map((f, i) => writeRemoteRow(f, i)));
  } catch (e) {
    console.warn("[faq-store] 重置 FAQ 同步到 Supabase 失败", e);
  }
}
