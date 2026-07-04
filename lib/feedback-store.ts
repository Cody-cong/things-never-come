import { supabase, isSupabaseEnabled } from "./supabase";
import { readLocal, writeLocal, isValidArray } from "./storage-utils";

export interface Feedback {
  id: string;
  content: string;
  createdAt: number;
}

/**
 * 反馈持久层：优先同步到 Supabase（多端互通），未配置或离线时回退到 localStorage。
 *
 * 同步策略：
 * - 读取时合并本地与云端，本地数据不会被云端覆盖。
 * - 本地有而云端没有的反馈会自动补回云端（修复历史数据）。
 * - 新增/删除会同时操作本地和云端，云端失败只发警告不阻塞界面。
 */
const KEY = "gnc_feedback_v1";

function parseLocalFeedbacks(): Feedback[] {
  const value = readLocal<unknown>(KEY, []);
  return isValidArray<Feedback>(value) ? value : [];
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
  const local = parseLocalFeedbacks();
  if (!isSupabaseEnabled()) return local;

  try {
    const remote = await readRemote();
    const remoteMap = new Map(remote.map((f) => [f.id, f]));
    const localMap = new Map(local.map((f) => [f.id, f]));

    // 合并：以本地为基准，补充云端独有的反馈，避免本地数据被覆盖。
    const merged = [...local];
    for (const f of remote) {
      if (!localMap.has(f.id)) {
        merged.push(f);
      }
    }

    // 去重并排序
    const unique = Array.from(new Map(merged.map((f) => [f.id, f])).values());
    unique.sort((a, b) => b.createdAt - a.createdAt);
    writeLocal(KEY, unique);

    // 把本地有但云端没有的反馈并行补回云端（修复之前同步失败的数据）。
    const missing = unique.filter((f) => !remoteMap.has(f.id));
    if (missing.length > 0) {
      await Promise.all(
        missing.map((f) =>
          writeRemoteRow(f).catch((e) => {
            console.warn("[feedback-store] 补同步反馈失败", f.id, e);
          })
        )
      );
    }

    return unique;
  } catch (e) {
    console.warn("[feedback-store] 读取 Supabase 失败，回退到 localStorage", e);
    return local;
  }
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
  const list = [item, ...parseLocalFeedbacks()];
  writeLocal(KEY, list);
  try {
    await writeRemoteRow(item);
  } catch (e) {
    console.warn("[feedback-store] 新增反馈同步到 Supabase 失败", e);
  }
  return item;
}

/** 删除反馈 */
export async function deleteFeedback(id: string): Promise<void> {
  const list = parseLocalFeedbacks().filter((f) => f.id !== id);
  writeLocal(KEY, list);
  try {
    await removeRemote(id);
  } catch (e) {
    console.warn("[feedback-store] 删除反馈同步到 Supabase 失败", e);
  }
}
