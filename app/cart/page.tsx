"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingCart, Sparkles } from "lucide-react";
import { useCart, useOrders } from "@/lib/cart-context";
import { getProductById } from "@/lib/product-store";
import { formatPrice } from "@/lib/utils";
import { checkAchievements, type Achievement } from "@/lib/achievements";
import ProductImage from "@/components/ProductImage";
import LimitAlertModal from "@/components/LimitAlertModal";
import ReceiptModal from "@/components/receipt/ReceiptModal";
import AchievementModal from "@/components/AchievementModal";
import { useState } from "react";
import type { Order } from "@/lib/types";

export default function CartPage() {
  const router = useRouter();
  const { items, totalAmount, updateQty, removeItem, clearCart } = useCart();
  const { addOrder } = useOrders();
  const [limitAlert, setLimitAlert] = useState<{ show: boolean; message: string }>({
    show: false,
    message: "",
  });
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [achievementQueue, setAchievementQueue] = useState<Achievement[]>([]);

  async function handleCheckout() {
    if (submitting || items.length === 0) return;
    setSubmitting(true);
    try {
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
    } catch (e) {
      console.error("[cart] checkout failed", e);
    } finally {
      setSubmitting(false);
    }
  }

  function handleReceiptClose() {
    const order = lastOrder;
    setLastOrder(null);
    if (order) {
      const unlocked = checkAchievements(order);
      if (unlocked.length > 0) {
        setAchievementQueue(unlocked);
        return;
      }
    }
    if (order) {
      router.push(`/receipt/?orderId=${order.id}`);
    }
  }

  function handleAchievementConfirm() {
    setAchievementQueue((prev) => {
      const next = prev.slice(1);
      if (next.length === 0 && lastOrder) {
        router.push(`/receipt/?orderId=${lastOrder.id}`);
      }
      return next;
    });
  }

  if (items.length === 0 && !lastOrder) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-site flex-col items-center justify-center px-6 py-20 text-center md:px-8">
        <div className="relative">
          <div className="absolute -inset-4 rounded-full bg-accent-light/50 blur-xl" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-soft">
            <ShoppingCart size={36} className="text-accent" />
          </div>
        </div>
        <p className="mt-6 text-xl font-bold text-ink">购物车空空如也</p>
        <p className="mt-1 text-sm text-muted">假装购物也要先加点东西</p>
        <Link
          href="/"
          className="mt-6 rounded-full bg-accent px-8 py-3 text-sm font-bold text-white transition hover:bg-accent-dark"
        >
          去逛逛好物
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-site px-6 py-8 md:px-8">
      <h1 className="text-2xl font-bold text-ink">
        购物车 <span className="text-accent">({items.length})</span>
      </h1>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          {items.map((item) => (
            <div
              key={`${item.productId}-${item.spec}`}
              className="flex gap-4 rounded-2xl bg-white p-4 shadow-card"
            >
              <Link
                href={`/product/?id=${item.productId}`}
                className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-cream"
              >
                <ProductImage
                  src={item.image}
                  alt={item.name}
                />
              </Link>

              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-2">
                  <Link
                    href={`/product/?id=${item.productId}`}
                    className="line-clamp-2 text-base font-semibold text-ink"
                  >
                    {item.name}
                  </Link>
                  <button
                    onClick={() => removeItem(item.productId, item.spec)}
                    aria-label="删除"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cream text-muted transition hover:bg-accent-light hover:text-accent"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <span className="mt-1 inline-block w-fit rounded-full bg-cream px-3 py-1 text-xs font-medium text-ink/70">
                  {item.spec}
                </span>
                <div className="mt-auto flex items-end justify-between pt-3">
                  <span className="text-lg font-bold text-accent">
                    {formatPrice(item.price)}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="inline-flex items-center gap-1 rounded-full bg-cream px-1 py-0.5">
                      <button
                        onClick={() =>
                          updateQty(item.productId, item.spec, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                        aria-label="减少数量"
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-ink shadow-sm transition hover:bg-cream active:scale-90 disabled:opacity-30"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="min-w-[26px] text-center text-sm font-bold text-ink">
                        {item.quantity}
                      </span>
                      <button
                        onClick={async () => {
                          const product = await getProductById(item.productId);
                          const max = product?.maxQuantity;
                          if (max && max > 0) {
                            const currentQty = items
                              .filter((i) => i.productId === item.productId)
                              .reduce((sum, i) => sum + i.quantity, 0);
                            if (currentQty + 1 > max) {
                              setLimitAlert({
                                show: true,
                                message:
                                  product?.limitMessage?.trim() ||
                                  `该商品每人限购 ${max} 件`,
                              });
                              return;
                            }
                          }
                          updateQty(item.productId, item.spec, item.quantity + 1);
                        }}
                        aria-label="增加数量"
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-ink shadow-sm transition hover:bg-cream active:scale-90"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="h-fit rounded-2xl bg-white p-5 shadow-card">
          <p className="text-sm text-muted">合计</p>
          <p className="mt-1 text-3xl font-bold text-accent">
            {formatPrice(totalAmount)}
          </p>
          <p className="mt-2 text-xs text-muted">
            不会扣除真实资金，纯模拟结算。
          </p>
          <button
            onClick={handleCheckout}
            disabled={submitting || items.length === 0}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-accent py-3 text-sm font-bold text-white transition hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? (
              "结算中…"
            ) : (
              <>
                立即结算
                <Sparkles size={16} />
              </>
            )}
          </button>
        </div>
      </div>

      {limitAlert.show && (
        <LimitAlertModal
          message={limitAlert.message}
          onClose={() => setLimitAlert({ show: false, message: "" })}
        />
      )}

      {lastOrder && (
        <ReceiptModal
          order={lastOrder}
          onClose={handleReceiptClose}
        />
      )}

      {achievementQueue.length > 0 && (
        <AchievementModal
          achievement={achievementQueue[0]}
          remaining={achievementQueue.length}
          onConfirm={handleAchievementConfirm}
        />
      )}
    </div>
  );
}
