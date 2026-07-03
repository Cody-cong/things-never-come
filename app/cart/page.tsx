"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingCart, Sparkles } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/utils";
import ProductImage from "@/components/ProductImage";

export default function CartPage() {
  const router = useRouter();
  const { items, totalAmount, updateQty, removeItem } = useCart();

  if (items.length === 0) {
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
                href={`/product/${item.productId}`}
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
                    href={`/product/${item.productId}`}
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
                        onClick={() =>
                          updateQty(item.productId, item.spec, item.quantity + 1)
                        }
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
            onClick={() => router.push("/checkout")}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-accent py-3 text-sm font-bold text-white transition hover:bg-accent-dark"
          >
            去结算
            <Sparkles size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
