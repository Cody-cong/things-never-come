import type { Order } from "./types";

export interface Achievement {
  id: string;
  icon: string;
  title: string;
  desc: string;
  /** 判断本次订单是否解锁该成就 */
  check: (order: Order) => boolean;
}

/**
 * 成就定义：基于"本次购物"（单笔订单）判定
 */
export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "small_goal",
    icon: "🎯",
    title: "完成小目标",
    desc: "本次购物花费了一亿美元",
    check: (o) => o.totalAmount >= 100_000_000,
  },
  {
    id: "magnate",
    icon: "💎",
    title: "神豪",
    desc: "本次消费≈马斯克身价",
    check: (o) => o.totalAmount >= 1_000_000_000_000,
  },
  {
    id: "card_swiper",
    icon: "💳",
    title: "刷卡无感者",
    desc: "本次购物的商品种类达到了15个以上",
    check: (o) => new Set(o.items.map((i) => i.productId)).size >= 15,
  },
];

/** 返回本次订单解锁的成就列表（保持定义顺序） */
export function checkAchievements(order: Order): Achievement[] {
  return ACHIEVEMENTS.filter((a) => a.check(order));
}

/** 基于全部历史订单判断成就是否曾解锁（用于成就列表页） */
export function getUnlockedAchievements(orders: Order[]): Set<string> {
  const unlocked = new Set<string>();
  for (const o of orders) {
    for (const a of checkAchievements(o)) {
      unlocked.add(a.id);
    }
  }
  return unlocked;
}
