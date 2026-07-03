"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingCart, Sparkles } from "lucide-react";
import { useCart } from "@/lib/cart-context";

export default function CartPage() {
  const router = useRouter();
  const { items, totalAmount, updateQty, removeItem } = useCart();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-5 px-8 pt-28 text-center">
        <div className="relative">
          <div className="absolute -inset-4 rounded-full bg-blush/50 blur-xl" />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-white shadow-float">
            <ShoppingCart size={40} className="text-accent" />
          </div>
          <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-peach">
            <Sparkles size={16} className="text-accent" />
          </div>
        </div>
        <div>
          <p className="text-lg font-bold text-ink">购物车空空如也</p>
        </div>
        <Link
          href="/"
          className="rounded-full bg-accent px-8 py-3 text-sm font-bold text-white shadow-card transition active:scale-95"
        >
          去逛逛好物
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col pb-36">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-cream/90 px-5 py-4 backdrop-blur-md">
        <h1 className="text-xl font-bold text-ink">
          购物车 🛒 <span className="text-accent">({items.length})</span>
        </h1>
      </div>

      {/* Items list */}
      <div className="flex flex-col gap-3 px-4 pt-2">
        {items.map((item, idx) => {
          const bgColors = ["bg-blush", "bg-mint", "bg-sand", "bg-lavender"];
          const bg = bgColors[idx % bgColors.length];
          return (
            <div
              key={`${item.productId}-${item.spec}`}
              className="flex gap-3 rounded-3xl bg-white p-3.5 shadow-card"
            >
              {/* Image */}
              <Link
                href={`/product/${item.productId}`}
                className={`relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl ${bg}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </Link>

              {/* Info */}
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-2">
                  <Link
                    href={`/product/${item.productId}`}
                    className="line-clamp-2 text-sm font-semibold text-ink"
                  >
                    {item.name}
                  </Link>
                  <button
                    onClick={() => removeItem(item.productId, item.spec)}
                    aria-label="删除"
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blush/50 text-muted transition hover:bg-accent/10 hover:text-accent"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <span className="mt-1 inline-block w-fit rounded-full bg-sand px-2.5 py-1 text-[11px] font-medium text-ink/70">
                  {item.spec}
                </span>
                <div className="mt-auto flex items-end justify-between pt-2">
                  <span className="text-lg font-bold text-accent">
                    ${item.price}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted">
                      小计 ${(item.price * item.quantity).toFixed(2)}
                    </span>
                    <div className="inline-flex items-center gap-1 rounded-full bg-blush/60 px-1 py-0.5">
                      <button
                        onClick={() =>
                          updateQty(item.productId, item.spec, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                        aria-label="减少数量"
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-ink shadow-sm transition active:scale-90 disabled:opacity-30"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="min-w-[22px] text-center text-sm font-bold text-ink">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQty(item.productId, item.spec, item.quantity + 1)
                        }
                        aria-label="增加数量"
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-ink shadow-sm transition active:scale-90"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom checkout bar */}
      <div className="fixed bottom-16 left-1/2 z-30 w-full max-w-[430px] -translate-x-1/2 border-t border-blush/50 bg-white/95 px-5 py-3.5 backdrop-blur-md">
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-xs text-muted">合计</span>
            <span className="text-2xl font-bold text-accent">
              ${totalAmount.toFixed(2)}
            </span>
          </div>
          <button
            onClick={() => router.push("/checkout")}
            className="flex items-center gap-2 rounded-full bg-accent px-8 py-3.5 text-sm font-bold text-white shadow-card transition active:scale-95"
          >
            去结算
            <Sparkles size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
