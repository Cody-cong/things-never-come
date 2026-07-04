import { supabase, isSupabaseEnabled } from "./supabase";

export interface HomeFaq {
  id: string;
  q: string;
  a: string;
}

/**
 * FAQ 持久层：优先同步到 Supabase（多端互通），未配置或离线时回退到 localStorage。
 */
const KEY = "gnc_home_faqs_v1";

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

function readLocal(): HomeFaq[] {
  if (typeof window === "undefined") return DEFAULT_FAQS;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw === null) return DEFAULT_FAQS;
    const list = JSON.parse(raw) as HomeFaq[];
    return Array.isArray(list) ? list : DEFAULT_FAQS;
  } catch {
    return DEFAULT_FAQS;
  }
}

function writeLocal(list: HomeFaq[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY, JSON.stringify(list));
  }
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
  if (isSupabaseEnabled()) {
    try {
      const list = await readRemote();
      writeLocal(list);
      // 远端为空且本地也是默认值时，保持默认值显示（首次使用）
      if (list.length === 0) return readLocal();
      return list;
    } catch (e) {
      console.warn("[faq-store] 读取 Supabase 失败，回退到 localStorage", e);
    }
  }
  return readLocal();
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
  writeLocal(list);
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
  writeLocal(list);
  try {
    await writeRemoteRow(list[idx], idx);
  } catch (e) {
    console.warn("[faq-store] 更新 FAQ 同步到 Supabase 失败", e);
  }
}

/** 删除 FAQ */
export async function deleteFaq(id: string): Promise<void> {
  const list = (await readAll()).filter((f) => f.id !== id);
  writeLocal(list);
  try {
    await removeRemote(id);
    // 重新写入剩余 FAQ 以更新 position
    await Promise.all(list.map((f, i) => writeRemoteRow(f, i)));
  } catch (e) {
    console.warn("[faq-store] 删除 FAQ 同步到 Supabase 失败", e);
  }
}

/** 重置 FAQ 为默认 4 条 */
export async function resetFaqs(): Promise<void> {
  writeLocal(DEFAULT_FAQS);
  try {
    await clearRemote();
    await Promise.all(
      DEFAULT_FAQS.map((f, i) => writeRemoteRow(f, i))
    );
  } catch (e) {
    console.warn("[faq-store] 重置 FAQ 同步到 Supabase 失败", e);
  }
}
