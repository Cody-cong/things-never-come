"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Package, Printer, Home } from "lucide-react";
import { useOrders } from "@/lib/cart-context";
import { formatPrice } from "@/lib/utils";
import ProductImage from "@/components/ProductImage";

function formatTime(ts: number): string {
  const d = new Date(ts);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

interface ReceiptClientProps {
  orderId: string;
}

export default function ReceiptClient({ orderId }: ReceiptClientProps) {
  const router = useRouter();
  const { orders } = useOrders();
  const order = orders.find((o) => o.id === orderId);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="skeleton h-10 w-10 rounded-full" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-site flex-col items-center justify-center px-6 py-20 text-center md:px-8">
        <Package size={48} className="text-muted" />
        <p className="mt-4 text-muted">订单不存在或已被清空</p>
        <button
          onClick={() => router.push("/")}
          className="mt-4 rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-white transition hover:bg-accent-dark"
        >
          回首页
        </button>
      </div>
    );
  }

  function handlePrint() {
    window.print();
  }

  const totalQty = order.items.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="mx-auto max-w-site px-6 py-8 md:px-8">
      <div className="mx-auto max-w-xl">
        <div className="mb-6 flex items-center justify-between no-print">
          <h1 className="text-2xl font-bold text-ink">订单账单</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-accent-dark"
            >
              <Printer size={16} />
              保存账单
            </button>
            <button
              onClick={() => router.push("/")}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-card transition hover:shadow-soft"
              aria-label="回首页"
            >
              <Home size={18} className="text-ink" />
            </button>
          </div>
        </div>

        <div className="receipt-paper relative overflow-hidden rounded-2xl bg-white p-8 shadow-card md:p-10">
          {/* 装饰背景 */}
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-accent-light/40" />
          <div className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-cream" />

          <div className="relative">
            <div className="text-center">
              <p className="text-xl font-bold text-ink">things never come</p>
              <p className="mt-1 text-xs text-muted">
                一个假装购物的模拟器 · 不发货 · 不付款
              </p>
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
                    <ProductImage
                      src={item.image}
                      alt={item.name}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-ink">{item.name}</p>
                    <p className="text-xs text-muted">{item.spec}</p>
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
              <p className="text-sm font-medium text-ink">
                感谢您的“购买”
              </p>
              <p className="mt-1 text-xs text-muted">
                商品永远不会发货，但快乐真实存在。
              </p>
            </div>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-muted no-print">
          点击「保存账单」即可通过浏览器打印或导出为 PDF。
        </p>
      </div>
    </div>
  );
}
