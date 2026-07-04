"use client";

import { useOrders } from "@/lib/cart-context";
import { ACHIEVEMENTS, getUnlockedAchievements } from "@/lib/achievements";

export default function AchievementsPage() {
  const { orders } = useOrders();
  const unlocked = getUnlockedAchievements(orders);
  const unlockedCount = unlocked.size;

  return (
    <div className="mx-auto max-w-site px-6 py-8 md:px-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink">我的成就</h1>
        <span className="text-sm text-muted">
          {unlockedCount}/{ACHIEVEMENTS.length}
        </span>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ACHIEVEMENTS.map((a) => {
          const isUnlocked = unlocked.has(a.id);
          return (
            <div
              key={a.id}
              className={`flex flex-col items-center gap-3 rounded-2xl bg-white p-6 text-center shadow-card transition ${
                isUnlocked ? "" : "opacity-50"
              }`}
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full text-2xl ${
                  isUnlocked ? "bg-accent-light" : "bg-cream"
                }`}
              >
                {a.icon}
              </div>
              <div>
                <p className="text-base font-semibold text-ink">{a.title}</p>
                <p className="mt-0.5 text-sm text-muted">{a.desc}</p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  isUnlocked
                    ? "bg-accent-light text-accent"
                    : "bg-cream text-muted"
                }`}
              >
                {isUnlocked ? "已点亮" : "未点亮"}
              </span>
            </div>
          );
        })}
      </div>

      <p className="mt-8 text-center text-sm text-muted">
        成就就像包裹，点亮了也不一定能兑现
      </p>
    </div>
  );
}
