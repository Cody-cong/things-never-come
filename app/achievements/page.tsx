"use client";

import {
  Sparkles,
  Wallet,
  Award,
  Package,
  Trophy,
  Infinity as InfinityIcon,
  LucideIcon,
} from "lucide-react";
import { useOrders } from "@/lib/cart-context";

const DAY_MS = 24 * 60 * 60 * 1000;

interface AchievementDef {
  icon: LucideIcon;
  title: string;
  desc: string;
  unlocked: boolean;
}

export default function AchievementsPage() {
  const { orders } = useOrders();

  const orderCount = orders.length;
  const totalAmount = orders.reduce((s, o) => s + o.totalAmount, 0);
  const earliestTs = orders.length
    ? Math.min(...orders.map((o) => o.createdAt))
    : 0;
  const waitDays = earliestTs
    ? Math.floor((Date.now() - earliestTs) / DAY_MS)
    : 0;

  const achievements: AchievementDef[] = [
    { icon: Sparkles, title: "初心者", desc: "完成首单", unlocked: orderCount >= 1 },
    { icon: Wallet, title: "守财奴", desc: "累计省下 $1000", unlocked: totalAmount >= 1000 },
    { icon: Award, title: "佛系买家", desc: "等待累计 7 天", unlocked: waitDays >= 7 },
    { icon: Package, title: "薛定谔的包裹", desc: "既在路上又不在路上", unlocked: orderCount >= 1 },
    { icon: Trophy, title: "反向消费大师", desc: "省下万亿虚拟资金", unlocked: true },
    { icon: InfinityIcon, title: "永不停歇", desc: "下满 10 单", unlocked: orderCount >= 10 },
  ];

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="mx-auto max-w-site px-6 py-8 md:px-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink">我的成就</h1>
        <span className="text-sm text-muted">
          {unlockedCount}/{achievements.length}
        </span>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {achievements.map((a) => (
          <AchievementCard key={a.title} def={a} />
        ))}
      </div>

      <p className="mt-8 text-center text-sm text-muted">
        成就就像包裹，点亮了也不一定能兑现
      </p>
    </div>
  );
}

function AchievementCard({ def }: { def: AchievementDef }) {
  const { icon: Icon, title, desc, unlocked } = def;
  return (
    <div
      className={`flex flex-col items-center gap-3 rounded-2xl bg-white p-6 text-center shadow-card transition ${
        unlocked ? "" : "opacity-50"
      }`}
    >
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-full ${
          unlocked ? "bg-accent text-white" : "bg-cream text-muted"
        }`}
      >
        <Icon size={24} />
      </div>
      <div>
        <p className="text-base font-semibold text-ink">{title}</p>
        <p className="mt-0.5 text-sm text-muted">{desc}</p>
      </div>
      <span
        className={`rounded-full px-3 py-1 text-xs font-medium ${
          unlocked
            ? "bg-accent-light text-accent"
            : "bg-cream text-muted"
        }`}
      >
        {unlocked ? "已点亮" : "未点亮"}
      </span>
    </div>
  );
}
