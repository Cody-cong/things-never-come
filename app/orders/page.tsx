"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ClipboardList, Package } from "lucide-react";
import { useOrders } from "@/lib/cart-context";
import type { Order } from "@/lib/types";

const TABS = ["订单", "物流", "待评价"] as const;
type Tab = (typeof TABS)[number];

function formatTime(ts: number): string {
  const d = new Date(ts);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

export default function OrdersPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="skeleton h-10 w-10 rounded-full" />
        </div>
      }
    >
      <OrdersContent />
    </Suspense>
  );
}

function OrdersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { orders } = useOrders();

  const statusParam = searchParams.get("status") as Tab | null;
  const activeTab: Tab = TABS.includes(statusParam as Tab)
    ? (statusParam as Tab)
    : "订单";

  // 永不送达：订单/物流 tab 显示全部订单（都在路上），待评价 tab 永远为空
  const visibleOrders = activeTab === "待评价" ? [] : orders;

  return (
    <div className="flex flex-col pb-20">
      {/* Top bar */}
      <div className="sticky top-0 z-30 flex items-center gap-2 bg-white/90 px-3 py-2.5 backdrop-blur">
        <button
          onClick={() => router.back()}
          aria-label="返回"
          className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-cream"
        >
          <ChevronLeft size={22} className="text-ink" />
        </button>
        <span className="text-sm font-medium text-ink">我的订单</span>
      </div>

      {/* Tabs */}
      <div className="sticky top-[44px] z-20 flex gap-2 bg-white/90 px-4 py-2 backdrop-blur">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => router.replace(`/orders?status=${tab}`)}
            className={`flex-1 rounded-full py-1.5 text-xs font-medium transition ${
              activeTab === tab
                ? "bg-accent text-white"
                : "bg-cream text-muted"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Empty state */}
      {visibleOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 px-8 pt-24 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent-light">
            {activeTab === "待评价" ? (
              <ClipboardList size={36} className="text-accent" />
            ) : (
              <Package size={36} className="text-accent" />
            )}
          </div>
          <div>
            <p className="text-base font-semibold text-ink">
              {activeTab === "待评价" ? "还没有可评价的订单" : "还没有订单"}
            </p>
            <p className="mt-1 text-xs text-muted">
              {activeTab === "待评价"
                ? "货都没到，评价什么呢"
                : "去下一单永远不到的快递吧"}
            </p>
          </div>
          <Link
            href="/"
            className="rounded-full bg-accent px-6 py-2 text-sm font-medium text-white transition active:scale-95"
          >
            去逛逛
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3 px-4 pt-2">
          {visibleOrders.map((order) => (
            <OrderCard key={order.id} order={order} tab={activeTab} />
          ))}
        </div>
      )}
    </div>
  );
}

function OrderCard({ order, tab }: { order: Order; tab: Tab }) {
  const preview = order.items.slice(0, 3);
  const totalQty = order.items.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="pastel-card p-3">
      {/* Top: id + time + status */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-xs font-medium text-ink">
            {order.id}
          </span>
          <span className="text-[10px] text-muted">
            {formatTime(order.createdAt)}
          </span>
        </div>
        <span className="shrink-0 rounded-full bg-accent-light px-2 py-0.5 text-[10px] font-medium text-accent">
          配送中
        </span>
      </div>

      {/* Items preview */}
      <div className="mt-2.5 flex flex-col gap-2">
        {preview.map((item) => (
          <div
            key={`${item.productId}-${item.spec}`}
            className="flex items-center gap-2.5"
          >
            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-cream">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image}
                alt={item.name}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
            <p className="line-clamp-1 flex-1 text-xs text-ink">{item.name}</p>
            <span className="shrink-0 text-[11px] text-muted">
              x{item.quantity}
            </span>
          </div>
        ))}
        {order.items.length > 3 && (
          <p className="text-[11px] text-muted">
            等{order.items.length}件商品
          </p>
        )}
      </div>

      {/* Bottom: total + actions */}
      <div className="mt-2.5 flex items-center justify-between border-t border-cream pt-2.5">
        <span className="text-xs text-muted">
          共{totalQty}件 合计
          <span className="ml-1 text-sm font-semibold text-accent">
            ${order.totalAmount.toFixed(2)}
          </span>
        </span>
        <div className="flex items-center gap-2">
          {tab === "物流" && (
            <Link
              href={`/tracking/${order.id}`}
              className="rounded-full border border-accent px-4 py-1 text-xs font-medium text-accent transition active:scale-95"
            >
              查看物流
            </Link>
          )}
          <Link
            href="/"
            className="rounded-full border border-accent px-4 py-1 text-xs font-medium text-accent transition active:scale-95"
          >
            再次购买
          </Link>
        </div>
      </div>
    </div>
  );
}
