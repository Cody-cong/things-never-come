"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingCart, Sparkles } from "lucide-react";
import {
  useCartState,
  useCartActions,
  useOrdersActions,
} from "@/lib/cart-context";
import { getProductById } from "@/lib/product-store";
import { formatPrice } from "@/lib/utils";
import { checkPurchaseLimit } from "@/lib/cart-utils";
import {
  checkAchievements,
  type Achievement,
} from "@/lib/achievement-store";
import dynamic from "next/dynamic";
import ProductImage from "@/components/ProductImage";
import RippleButton from "@/components/RippleButton";
import { useState, useRef, useEffect } from "react";
import { generateOrderReview } from "@/lib/ai-review";
import type { Order } from "@/lib/types";

const LimitAlertModal = dynamic(() => import("@/components/LimitAlertModal"), {
  ssr: false,
});
const ReceiptModal = dynamic(
  () => import("@/components/receipt/ReceiptModal"),
  { ssr: false }
);
const OrderTrackingModal = dynamic(
  () => import("@/components/OrderTrackingModal"),
  { ssr: false }
);
const AchievementModal = dynamic(
  () => import("@/components/AchievementModal"),
  { ssr: false }
);

export default function CartPage() {
  const router = useRouter();
  const { items, totalAmount } = useCartState();
  const { updateQty, removeItem, clearCart } = useCartActions();
  const { addOrder, updateOrder } = useOrdersActions();
  const [limitAlert, setLimitAlert] = useState<{ show: boolean; message: string }>({
    show: false,
    message: "",
  });
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [achievementQueue, setAchievementQueue] = useState<Achievement[]>([]);
  const lastOrderRef = useRef<Order | null>(null);

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
      lastOrderRef.current = order;
      setShowReceipt(false);
      setLastOrder(order);

      // 异步生成 AI 搞笑评价，完成后持久化到订单
      generateOrderReview(order).then((review) => {
        const updated = { ...order, aiReview: review };
        updateOrder(updated);
        lastOrderRef.current = updated;
        setLastOrder(updated);
      });
    } catch (e) {
      console.error("[cart] checkout failed", e);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleReceiptClose() {
    const order = lastOrderRef.current;
    setShowReceipt(false);
    setLastOrder(null);
    if (order) {
      const unlocked = await checkAchievements(order);
      if (unlocked.length > 0) {
        setAchievementQueue(unlocked);
        return;
      }
      router.push(`/receipt/?orderId=${order.id}`);
    }
  }

  function handleAchievementConfirm() {
    setAchievementQueue((prev) => {
      const next = prev.slice(1);
      if (next.length === 0) {
        const order = lastOrderRef.current;
        if (order) {
          router.push(`/receipt/?orderId=${order.id}`);
        }
      }
      return next;
    });
  }

  const showingAchievement = achievementQueue.length > 0;

  if (items.length === 0 && !lastOrder && !showingAchievement) {
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
          className="mt-6 inline-block rounded-full bg-accent px-8 py-3 text-sm font-bold text-white transition hover:bg-accent-dark press-spring"
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
                  sizes="96px"
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
                  <RippleButton
                    onClick={() => removeItem(item.productId, item.spec)}
                    aria-label="删除"
                    rippleColor="rgba(217, 83, 79, 0.15)"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cream text-muted transition hover:bg-accent-light hover:text-accent press-spring"
                  >
                    <Trash2 size={14} />
                  </RippleButton>
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
                      <RippleButton
                        onClick={() =>
                          updateQty(item.productId, item.spec, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                        aria-label="减少数量"
                        rippleColor="rgba(217, 83, 79, 0.18)"
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-ink shadow-sm transition hover:bg-cream press-spring disabled:opacity-30"
                      >
                        <Minus size={14} />
                      </RippleButton>
                      <span className="min-w-[26px] text-center text-sm font-bold text-ink">
                        {item.quantity}
                      </span>
                      <RippleButton
                        onClick={async () => {
                          const product = await getProductById(item.productId);
                          if (!product) {
                            updateQty(item.productId, item.spec, item.quantity + 1);
                            return;
                          }
                          const check = checkPurchaseLimit(product, 1, items);
                          if (!check.allowed) {
                            setLimitAlert({
                              show: true,
                              message: check.message || "",
                            });
                            return;
                          }
                          updateQty(item.productId, item.spec, item.quantity + 1);
                        }}
                        aria-label="增加数量"
                        rippleColor="rgba(217, 83, 79, 0.18)"
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-ink shadow-sm transition hover:bg-cream press-spring"
                      >
                        <Plus size={14} />
                      </RippleButton>
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
          <RippleButton
            onClick={handleCheckout}
            disabled={submitting || items.length === 0}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-accent py-3 text-sm font-bold text-white transition hover:bg-accent-dark press-spring disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? (
              "结算中…"
            ) : (
              <>
                立即结算
                <Sparkles size={16} />
              </>
            )}
          </RippleButton>
        </div>
      </div>

      {limitAlert.show && (
        <LimitAlertModal
          message={limitAlert.message}
          onClose={() => setLimitAlert({ show: false, message: "" })}
        />
      )}

      {lastOrder && !showReceipt && (
        <OrderTrackingModal
          order={lastOrder}
          onComplete={() => setShowReceipt(true)}
        />
      )}

      {lastOrder && showReceipt && (
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
