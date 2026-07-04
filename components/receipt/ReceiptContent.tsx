"use client";

import ProductImage from "@/components/ProductImage";
import { formatPrice } from "@/lib/utils";
import type { Order } from "@/lib/types";

function formatTime(ts: number): string {
  const d = new Date(ts);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

interface ReceiptContentProps {
  order: Order;
}

export default function ReceiptContent({ order }: ReceiptContentProps) {
  const totalQty = order.items.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="receipt-paper relative overflow-hidden rounded-2xl bg-white p-6 shadow-card sm:p-8 md:p-10">
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-accent-light/40" />
      <div className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-cream" />

      <div className="relative">
        <div className="text-center">
          <p className="text-xl font-bold text-ink">things never come</p>
        </div>

        <div className="mt-8 border-b-2 border-dashed border-cream pb-6">
          <div className="flex justify-between text-sm">
            <span className="text-muted">单号</span>
            <span className="font-medium text-ink">{order.id}</span>
          </div>
          <div className="mt-2 flex justify-between text-sm">
            <span className="text-muted">时间</span>
            <span className="font-medium text-ink">
              {formatTime(order.createdAt)}
            </span>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {order.items.map((item) => (
            <div
              key={`${item.productId}-${item.spec}`}
              className="flex items-center gap-3"
            >
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-cream">
                <ProductImage src={item.image} alt={item.name} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-ink">{item.name}</p>
              </div>
              <div className="text-right text-sm">
                <p className="font-medium text-ink">
                  {formatPrice(item.price)}
                </p>
                <p className="text-xs text-muted">x{item.quantity}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 border-t-2 border-dashed border-cream pt-6">
          <div className="flex justify-between text-sm">
            <span className="text-muted">商品件数</span>
            <span className="font-medium text-ink">{totalQty} 件</span>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-cream pt-4">
            <span className="text-base font-bold text-ink">合计</span>
            <span className="text-2xl font-bold text-accent">
              {formatPrice(order.totalAmount)}
            </span>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm font-medium text-ink">感谢你的购买</p>
        </div>
      </div>
    </div>
  );
}
