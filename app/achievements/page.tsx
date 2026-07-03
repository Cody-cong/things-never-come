"use client";

import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  Sparkles,
  Wallet,
  Award,
  Package,
  Trophy,
  Infinity as InfinityIcon,
  LucideIcon,
} from "lucide-react";
import { useOrders } from "@/lib/cart-context";

/** 一天毫秒数 */
const DAY_MS = 24 * 60 * 60 * 1000;

interface AchievementDef {
  icon: LucideIcon;
  title: string;
  desc: string;
  /** 点亮条件：true=已获得 */
  unlocked: boolean;
  /** 卡片底色（blush/mint/sand 交替） */
  surface: string;
}

export default function AchievementsPage() {
  const router = useRouter();
  const { orders } = useOrders();

  const orderCount = orders.length;
  const totalAmount = orders.reduce((s, o) => s + o.totalAmount, 0);
  // 最早订单距今天数（无订单则 0）
  const earliestTs = orders.length
    ? Math.min(...orders.map((o) => o.createdAt))
    : 0;
  const waitDays = earliestTs
    ? Math.floor((Date.now() - earliestTs) / DAY_MS)
    : 0;

  const achievements: AchievementDef[] = [
    {
      icon: Sparkles,
      title: "初心者",
      desc: "完成首单",
      unlocked: orderCount >= 1,
      surface: "bg-blush",
    },
    {
      icon: Wallet,
      title: "守财奴",
      desc: "累计省下 $1000",
      unlocked: totalAmount >= 1000,
      surface: "bg-mint",
    },
    {
      icon: Award,
      title: "佛系买家",
      desc: "等待累计 7 天",
      unlocked: waitDays >= 7,
      surface: "bg-sand",
    },
    {
      icon: Package,
      title: "薛定谔的包裹",
      desc: "既在路上又不在路上",
      unlocked: orderCount >= 1,
      surface: "bg-blush",
    },
    {
      icon: Trophy,
      title: "反向消费大师",
      desc: "钱包余额突破万亿",
      unlocked: true, // 钱包固定 1 万亿，永久点亮
      surface: "bg-mint",
    },
    {
      icon: InfinityIcon,
      title: "永不停歇",
      desc: "下满 10 单",
      unlocked: orderCount >= 10,
      surface: "bg-sand",
    },
  ];

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="flex flex-col pb-20">
      {/* 顶部返回 + 标题 */}
      <div className="sticky top-0 z-30 flex items-center gap-2 bg-white/90 px-3 py-2.5 backdrop-blur">
        <button
          onClick={() => router.back()}
          aria-label="返回"
          className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-cream"
        >
          <ChevronLeft size={22} className="text-ink" />
        </button>
        <span className="text-sm font-medium text-ink">我的成就</span>
        <span className="ml-auto text-xs text-muted">
          {unlockedCount}/{achievements.length}
        </span>
      </div>

      {/* 成就网格：2 列 */}
      <div className="grid grid-cols-2 gap-3 px-4 pt-3">
        {achievements.map((a) => (
          <AchievementCard key={a.title} def={a} />
        ))}
      </div>

      {/* 底部幽默文案 */}
      <p className="mt-6 px-8 text-center text-[11px] leading-relaxed text-muted">
        成就就像包裹，点亮了也不一定能兑现
      </p>
    </div>
  );
}

function AchievementCard({ def }: { def: AchievementDef }) {
  const { icon: Icon, title, desc, unlocked, surface } = def;
  return (
    <div
      className={`flex flex-col items-center gap-2 rounded-2xl ${surface} p-4 text-center transition ${
        unlocked ? "" : "opacity-50"
      }`}
    >
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-full ${
          unlocked ? "bg-accent text-white" : "bg-white/60 text-muted"
        }`}
      >
        <Icon size={24} />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-ink">{title}</p>
        <p className="mt-0.5 text-[11px] leading-tight text-muted">{desc}</p>
      </div>
      <span
        className={`mt-0.5 rounded-full px-2 py-0.5 text-[10px] font-medium ${
          unlocked
            ? "bg-accent-light text-accent"
            : "bg-white/60 text-muted"
        }`}
      >
        {unlocked ? "已点亮" : "未点亮"}
      </span>
    </div>
  );
}
