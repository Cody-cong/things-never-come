"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ChevronLeft,
  CheckCircle2,
  Wallet,
  ShoppingCart,
  Clock,
  Leaf,
  Package,
} from "lucide-react";
import { useOrders } from "@/lib/cart-context";
import OrderInfoCard from "@/components/OrderInfoCard";

interface Stat {
  icon: typeof Wallet;
  value: string;
  label: string;
  desc: string;
}

export default function DonePage() {
  const params = useParams();
  const router = useRouter();
  const { orders } = useOrders();
  const orderId = String(params.orderId);
  const order = orders.find((o) => o.id === orderId);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="skeleton h-10 w-10 rounded-full" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-8 text-center">
        <Package size={48} className="text-muted" />
        <p className="text-sm text-muted">订单不存在或已被清空</p>
        <button
          onClick={() => router.push("/")}
          className="rounded-full bg-accent px-6 py-2 text-sm font-medium text-white transition active:scale-95"
        >
          回首页
        </button>
      </div>
    );
  }

  const totalAmount = order.totalAmount;
  const itemCount = order.items.length;
  const savedTime = itemCount * 3;
  const carbon = Math.ceil(totalAmount / 10);

  const stats: Stat[] = [
    {
      icon: Wallet,
      value: `$${totalAmount.toFixed(2)}`,
      label: "省下金额",
      desc: "这笔钱安安稳稳留在你账户里",
    },
    {
      icon: ShoppingCart,
      value: `${itemCount} 件`,
      label: "避免冲动消费",
      desc: "购物车清空，欲望也清空了",
    },
    {
      icon: Clock,
      value: `约 ${savedTime} 分钟`,
      label: "节省决策时间",
      desc: "不用纠结要不要退换货",
    },
    {
      icon: Leaf,
      value: `${carbon} kg`,
      label: "虚拟碳足迹减少",
      desc: "虚拟快递，真实环保",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      {/* Top bar */}
      <div className="sticky top-0 z-30 flex items-center gap-2 bg-white/90 px-3 py-2.5 backdrop-blur">
        <button
          onClick={() => router.push("/")}
          aria-label="返回首页"
          className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-cream"
        >
          <ChevronLeft size={22} className="text-ink" />
        </button>
        <span className="text-sm font-medium text-ink">送达结算</span>
      </div>

      {/* Hero */}
      <div className="flex flex-col items-center gap-1 bg-gradient-to-b from-accent-light/60 to-transparent px-6 pt-8 pb-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-mint">
          <CheckCircle2 size={48} className="text-emerald-500" />
        </div>
        <h1 className="mt-2 text-2xl font-bold text-ink">您的商品已送达</h1>
        <p className="text-sm italic text-muted">（并没有）</p>
      </div>

      {/* Stats grid 2x2 */}
      <div className="mx-4 grid grid-cols-2 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="pastel-card p-3">
            <s.icon size={18} className="text-accent" />
            <p className="mt-2 text-lg font-bold text-ink">{s.value}</p>
            <p className="text-[11px] font-medium text-ink/80">{s.label}</p>
            <p className="mt-0.5 text-[10px] leading-relaxed text-muted">
              {s.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Order summary */}
      <OrderInfoCard order={order} />

      {/* Action buttons */}
      <div className="mx-4 mt-4 mb-8 flex gap-3">
        <button
          onClick={() => router.push("/")}
          className="flex-1 rounded-full bg-accent py-3 text-sm font-medium text-white transition active:scale-95"
        >
          再来一单
        </button>
        <button
          onClick={() => router.push("/orders")}
          className="flex-1 rounded-full border border-cream bg-white py-3 text-sm font-medium text-ink transition active:scale-95"
        >
          查看订单
        </button>
      </div>
    </div>
  );
}
