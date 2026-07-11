"use client";

import { useMemo } from "react";
import { formatPrice } from "@/lib/utils";
import type { Order } from "@/lib/types";

const WEEKDAYS = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function formatDateWithWeekday(ts: number): string {
  const d = new Date(ts);
  return `${d.getFullYear()}年${pad(d.getMonth() + 1)}月${pad(d.getDate())}日 ${WEEKDAYS[d.getDay()]}`;
}

function getMood(review?: string): { icon: string; label: string } {
  if (!review) return { icon: "🦖", label: "棒呆了" };
  const text = review.toLowerCase();
  if (text.includes("惨") || text.includes("亏") || text.includes("后悔")) {
    return { icon: "🥲", label: "有点惨" };
  }
  if (text.includes("赚") || text.includes("值") || text.includes("不错")) {
    return { icon: "😎", label: "赚了" };
  }
  return { icon: "🦖", label: "棒呆了" };
}

interface ReceiptContentProps {
  order: Order;
}

export default function ReceiptContent({ order }: ReceiptContentProps) {
  const items = Array.isArray(order?.items) ? order.items : [];
  const totalQty = items.reduce((s, i) => s + (Number(i.quantity) || 0), 0);
  const totalAmount = Number(order?.totalAmount) || 0;
  const mood = useMemo(() => getMood(order.aiReview), [order.aiReview]);

  return (
    <div className="receipt-paper receipt-font relative mx-auto max-w-md bg-[#F9F5E9] px-6 pb-10 pt-10 text-ink shadow-card">
      <div className="receipt-zigzag-top absolute left-0 right-0 top-0 h-3" />

      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-ink">
          Receipt
        </h1>
      </div>

      <div className="mt-8 space-y-1.5 text-xs">
        <div className="flex justify-between">
          <span className="uppercase text-muted">Date</span>
          <span className="font-medium">{formatDateWithWeekday(order.createdAt)}</span>
        </div>
        <div className="flex justify-between">
          <span className="uppercase text-muted">Receipt</span>
          <span className="font-medium">#KFCVWO505050</span>
        </div>
      </div>

      <div className="my-6 border-b border-dashed border-ink/20" />

      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-ink text-left">
            <th className="w-8 pb-1.5 font-medium uppercase">#</th>
            <th className="pb-1.5 font-medium uppercase">商品</th>
            <th className="pb-1.5 text-right font-medium uppercase">Qty</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-dashed divide-ink/10">
          {items.map((item, idx) => (
            <tr
              key={`${item.productId}-${item.spec}`}
              className="align-top"
            >
              <td className="py-3 font-medium">
                {String(idx + 1).padStart(2, "0")}
              </td>
              <td className="py-3">
                <p className="font-medium">{item.name}</p>
                <p className="mt-0.5 text-[10px] text-muted">
                  · {item.spec && item.spec !== "默认" ? `${item.spec} ` : ""}
                  {formatPrice(item.price)}
                </p>
              </td>
              <td className="py-3 text-right font-medium">
                ×{item.quantity}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="my-6 border-b border-dashed border-ink/20" />

      <div className="text-center">
        <p className="text-[10px] text-muted">店员评价</p>
        <p className="mt-1 text-sm font-bold">
          {order.aiReview || "开心每一天"}
        </p>
      </div>

      <div className="my-6 border-t-2 border-ink" />

      <div className="space-y-1 text-xs">
        <div className="flex justify-between">
          <span className="uppercase">Item Groups</span>
          <span className="font-medium">{items.length}</span>
        </div>
        <div className="flex justify-between">
          <span className="uppercase">Total Entries</span>
          <span className="font-medium">{totalQty}</span>
        </div>
        <div className="flex justify-between pt-2 text-sm font-bold">
          <span className="uppercase">Total</span>
          <span>{formatPrice(totalAmount)}</span>
        </div>
      </div>

      <div className="my-6 border-b border-dashed border-ink/20" />

      <div className="text-center">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted">
          Today&apos;s Mood
        </p>
        <div className="mt-3 text-5xl">{mood.icon}</div>
        <p className="mt-2 text-sm font-bold">{mood.label}</p>
      </div>

      <div className="mt-8 text-center text-[10px] font-bold uppercase tracking-[0.15em] text-muted">
        things never come • keep the moment
      </div>

      <div className="receipt-zigzag-bottom absolute bottom-0 left-0 right-0 h-3" />
    </div>
  );
}
