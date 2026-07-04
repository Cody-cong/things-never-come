import { supabase, isSupabaseEnabled } from "./supabase";

export interface Feedback {
  id: string;
  content: string;
  createdAt: number;
}

/**
 * 反馈持久层：优先同步到 Supabase（多端互通），未配置或离线时回退到 localStorage。
 */
const KEY = "gnc_feedback_v1";

function readLocal(): Feedback[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (raw === null) return [];
    const list = JSON.parse(raw) as Feedback[];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

function writeLocal(list: Feedback[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY, JSON.stringify(list));
  }
}

async function readRemote(): Promise<Feedback[]> {
  if (!isSupabaseEnabled() || !supabase) return [];
  const { data, error } = await supabase
    .from("feedbacks")
    .select("id, content, created_at")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((row) => ({
    id: String(row.id),
    content: String(row.content),
    createdAt: Number(row.created_at),
  }));
}

async function writeRemoteRow(item: Feedback): Promise<void> {
  if (!isSupabaseEnabled() || !supabase) return;
  const { error } = await supabase.from("feedbacks").upsert(
    {
      id: item.id,
      content: item.content,
      created_at: item.createdAt,
    },
    { onConflict: "id" }
  );
  if (error) throw error;
}

async function removeRemote(id: string): Promise<void> {
  if (!isSupabaseEnabled() || !supabase) return;
  const { error } = await supabase.from("feedbacks").delete().eq("id", id);
  if (error) throw error;
}

async function readAll(): Promise<Feedback[]> {
  if (isSupabaseEnabled()) {
    try {
      const list = await readRemote();
      writeLocal(list);
      return list;
    } catch (e) {
      console.warn("[feedback-store] 读取 Supabase 失败，回退到 localStorage", e);
    }
  }
  return readLocal();
}

/** 返回全部反馈，按时间倒序 */
export async function getFeedbacks(): Promise<Feedback[]> {
  const list = await readAll();
  return list.sort((a, b) => b.createdAt - a.createdAt);
}

/** 新增反馈 */
export async function addFeedback(content: string): Promise<Feedback> {
  const item: Feedback = {
    id: `fb_${Date.now()}`,
    content: content.trim(),
    createdAt: Date.now(),
  };
  const list = [item, ...readLocal()];
  writeLocal(list);
  try {
    await writeRemoteRow(item);
  } catch (e) {
    console.warn("[feedback-store] 新增反馈同步到 Supabase 失败", e);
  }
  return item;
}

/** 删除反馈 */
export async function deleteFeedback(id: string): Promise<void> {
  const list = readLocal().filter((f) => f.id !== id);
  writeLocal(list);
  try {
    await removeRemote(id);
  } catch (e) {
    console.warn("[feedback-store] 删除反馈同步到 Supabase 失败", e);
  }
}
