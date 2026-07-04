"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import { useCart, useOrders } from "@/lib/cart-context";
import { formatPrice } from "@/lib/utils";
import ProductImage from "@/components/ProductImage";
import ReceiptModal from "@/components/receipt/ReceiptModal";
import type { Order } from "@/lib/types";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalAmount, clearCart } = useCart();
  const { addOrder } = useOrders();
  const [lastOrder, setLastOrder] = useState<Order | null>(null);

  if (items.length === 0 && !lastOrder) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-site flex-col items-center justify-center px-6 py-20 text-center md:px-8">
        <p className="text-muted">购物车是空的，先去挑点永远收不到的好物吧</p>
        <button
          onClick={() => router.push("/")}
          className="mt-4 rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-white transition hover:bg-accent-dark"
        >
          去逛逛
        </button>
      </div>
    );
  }

  function handleSubmit() {
    const order: Order = {
      id: `GNC${Date.now()}`,
      items: items.map((i) => ({ ...i })),
      totalAmount,
      createdAt: Date.now(),
      status: "pending",
    };
    addOrder(order);
    clearCart();
    setLastOrder(order);
  }

  return (
    <div className="mx-auto max-w-site px-6 py-8 md:px-8">
      <h1 className="text-2xl font-bold text-ink">确认订单</h1>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-5 lg:col-span-2">
          <div className="rounded-2xl bg-white p-5 shadow-card">
            <h2 className="mb-3 text-sm font-bold text-ink">
              商品清单 ({items.length})
            </h2>
            <div className="flex flex-col gap-3">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.spec}`}
                  className="flex items-center gap-3"
                >
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-cream">
                    <ProductImage
                      src={item.image}
                      alt={item.name}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-ink">{item.name}</p>
                    <span className="mt-1 inline-block rounded-full bg-cream px-2.5 py-0.5 text-xs text-muted">
                      {item.spec}
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-medium text-ink">{formatPrice(item.price)}</span>
                    <span className="text-xs text-muted">x{item.quantity}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="h-fit rounded-2xl bg-white p-5 shadow-card">
          <h2 className="mb-3 text-sm font-bold text-ink">费用明细</h2>
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">商品总额</span>
              <span className="text-ink">{formatPrice(totalAmount)}</span>
            </div>
            <div className="mt-2 flex justify-between border-t border-cream pt-3">
              <span className="font-medium text-ink">实付</span>
              <span className="text-xl font-bold text-accent">
                {formatPrice(totalAmount)}
              </span>
            </div>
          </div>
          <button
            onClick={handleSubmit}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-accent py-3 text-sm font-bold text-white transition hover:bg-accent-dark"
          >
            提交订单
            <Sparkles size={16} />
          </button>
          <p className="mt-3 text-center text-xs text-muted">
            不会扣除真实资金，纯模拟结算。
          </p>
        </div>
      </div>

      {lastOrder && (
        <ReceiptModal
          order={lastOrder}
          onClose={() => setLastOrder(null)}
        />
      )}
    </div>
  );
}
