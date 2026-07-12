import { supabase, isSupabaseEnabled } from "./supabase";
import {
  ACHIEVEMENTS,
  checkSingleAchievement,
  type Achievement,
} from "./achievements";
import { readLocal, writeLocal, isValidArray } from "./storage-utils";
import type { Order } from "./types";

export type { Achievement };

/**
 * 成就启用状态持久层。
 *
 * 成就本身的判定逻辑是代码内建的（ ACHIEVEMENTS ），管理端只能控制
 * 哪些成就是"启用"的；被禁用的成就不会再在购物车结算或成就展示中出现。
 * 状态优先同步到 Supabase，未配置或离线时回退到 localStorage。
 *
 * 性能优化：
 * - 同一次页面生命周期内对启用状态做内存缓存，避免重复请求。
 */
const KEY = "gnc_achievements_enabled_v2";

const DEFAULT_ENABLED_IDS = new Set(ACHIEVEMENTS.map((a) => a.id));

let cache: Set<string> | null = null;

function parseLocalEnabled(): Set<string> {
  const value = readLocal<unknown>(KEY, Array.from(DEFAULT_ENABLED_IDS));
  if (isValidArray<string>(value)) {
    return new Set(value.filter((id): id is string => typeof id === "string"));
  }
  return new Set(DEFAULT_ENABLED_IDS);
}

async function readRemote(): Promise<Set<string> | null> {
  if (!isSupabaseEnabled() || !supabase) return null;
  const { data, error } = await supabase
    .from("achievement_settings")
    .select("id, enabled");
  if (error) throw error;
  if (!data || data.length === 0) return null;
  return new Set(
    data.filter((row) => row.enabled).map((row) => String(row.id))
  );
}

async function writeRemoteRow(id: string, enabled: boolean): Promise<void> {
  if (!isSupabaseEnabled() || !supabase) return;
  const { error } = await supabase
    .from("achievement_settings")
    .upsert({ id, enabled }, { onConflict: "id" });
  if (error) throw error;
}

async function removeRemote(id: string): Promise<void> {
  if (!isSupabaseEnabled() || !supabase) return;
  const { error } = await supabase.from("achievement_settings").delete().eq("id", id);
  if (error) throw error;
}

async function clearRemote(): Promise<void> {
  if (!isSupabaseEnabled() || !supabase) return;
  const { error } = await supabase.from("achievement_settings").delete().neq("id", "");
  if (error) throw error;
}

async function readEnabledIds(): Promise<Set<string>> {
  if (cache) return cache;

  const local = parseLocalEnabled();
  if (!isSupabaseEnabled()) return local;

  try {
    const remote = await readRemote();

    // 云端为空时，把默认全部启用作为初始数据上传到云端。
    if (remote === null) {
      await Promise.all(
        ACHIEVEMENTS.map((a) => writeRemoteRow(a.id, true))
      );
      cache = new Set(DEFAULT_ENABLED_IDS);
      return new Set(DEFAULT_ENABLED_IDS);
    }

    writeLocal(KEY, Array.from(remote));
    cache = remote;
    return remote;
  } catch (e) {
    console.warn("[achievement-store] 读取 Supabase 失败，回退到 localStorage", e);
    return local;
  }
}

/** 返回当前启用的全部成就（保持定义顺序） */
export async function getAchievements(): Promise<Achievement[]> {
  const enabled = await readEnabledIds();
  return ACHIEVEMENTS.filter((a) => enabled.has(a.id));
}

/** 返回本次订单解锁的已启用成就列表（保持定义顺序） */
export async function checkAchievements(order: Order): Promise<Achievement[]> {
  const enabled = await readEnabledIds();
  return ACHIEVEMENTS.filter(
    (a) => enabled.has(a.id) && checkSingleAchievement(a, order)
  );
}

/** 基于全部历史订单判断已启用的成就是否曾解锁（用于成就列表页） */
export async function getUnlockedAchievements(orders: Order[]): Promise<Set<string>> {
  const enabled = await readEnabledIds();
  const unlocked = new Set<string>();
  for (const o of orders) {
    for (const a of ACHIEVEMENTS) {
      if (enabled.has(a.id) && checkSingleAchievement(a, o)) {
        unlocked.add(a.id);
      }
    }
  }
  return unlocked;
}

/** 获取当前已启用的成就 ID 集合 */
export async function getEnabledAchievementIds(): Promise<Set<string>> {
  return readEnabledIds();
}

/** 设置已启用的成就 ID 集合 */
export async function setEnabledAchievementIds(ids: Set<string>): Promise<void> {
  const valid = new Set(Array.from(ids).filter((id) => DEFAULT_ENABLED_IDS.has(id)));
  writeLocal(KEY, Array.from(valid));
  cache = valid;
  try {
    await Promise.all(
      ACHIEVEMENTS.map((a) => writeRemoteRow(a.id, valid.has(a.id)))
    );
  } catch (e) {
    console.warn("[achievement-store] 同步启用状态到 Supabase 失败", e);
  }
}

/** 禁用一个成就（管理端"删除"） */
export async function disableAchievement(id: string): Promise<void> {
  if (!DEFAULT_ENABLED_IDS.has(id)) return;
  const ids = await readEnabledIds();
  ids.delete(id);
  await setEnabledAchievementIds(ids);
}

/** 启用一个成就 */
export async function enableAchievement(id: string): Promise<void> {
  if (!DEFAULT_ENABLED_IDS.has(id)) return;
  const ids = await readEnabledIds();
  ids.add(id);
  await setEnabledAchievementIds(ids);
}

/** 重置为默认全部启用 */
export async function resetAchievements(): Promise<void> {
  writeLocal(KEY, Array.from(DEFAULT_ENABLED_IDS));
  cache = new Set(DEFAULT_ENABLED_IDS);
  try {
    await clearRemote();
    await Promise.all(
      ACHIEVEMENTS.map((a) => writeRemoteRow(a.id, true))
    );
  } catch (e) {
    console.warn("[achievement-store] 重置成就同步到 Supabase 失败", e);
  }
}
