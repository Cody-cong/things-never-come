"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, MapPin, ChevronRight, Check, X } from "lucide-react";
import { useCart, useOrders } from "@/lib/cart-context";
import { defaultAddress } from "@/lib/mock-data";
import type { Address, Order } from "@/lib/types";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalAmount, clearCart } = useCart();
  const { addOrder } = useOrders();
  const [address, setAddress] = useState<Address>(defaultAddress);
  const [editingAddress, setEditingAddress] = useState(false);
  const [draft, setDraft] = useState<Address>(defaultAddress);

  function startEditAddress() {
    setDraft(address);
    setEditingAddress(true);
  }

  function saveAddress() {
    setAddress(draft);
    setEditingAddress(false);
  }

  // Empty cart: direct access guard
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 px-8 pt-24 text-center">
        <p className="text-sm text-muted">
          购物车是空的，先去挑点永远收不到的好物吧
        </p>
        <button
          onClick={() => router.push("/")}
          className="rounded-full bg-accent px-6 py-2 text-sm font-medium text-white transition active:scale-95"
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
    // 不强制跳物流：直接到订单页"订单"tab，让用户看到刚下的订单。
    // 物流信息改为从"我的 → 物流"tab 查看。
    router.push("/orders?status=订单");
  }

  return (
    <div className="flex flex-col pb-32">
      {/* Top bar */}
      <div className="sticky top-0 z-30 flex items-center gap-2 bg-white/90 px-3 py-2.5 backdrop-blur">
        <button
          onClick={() => router.back()}
          aria-label="返回"
          className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-cream"
        >
          <ChevronLeft size={22} className="text-ink" />
        </button>
        <span className="text-sm font-medium text-ink">确认订单</span>
      </div>

      {/* Address card */}
      <div className="mx-4 mt-3 pastel-card p-3">
        {editingAddress ? (
          <div className="flex flex-col gap-2.5">
            <div className="flex items-start gap-2.5">
              <MapPin size={18} className="mt-0.5 shrink-0 text-accent" />
              <div className="min-w-0 flex-1 space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={draft.name}
                    onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                    placeholder="收件人"
                    className="flex-1 rounded-xl border border-blush bg-white px-3 py-2 text-sm text-ink outline-none focus:border-accent"
                  />
                  <input
                    type="text"
                    value={draft.phone}
                    onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
                    placeholder="手机号"
                    className="flex-1 rounded-xl border border-blush bg-white px-3 py-2 text-sm text-ink outline-none focus:border-accent"
                  />
                </div>
                <textarea
                  value={draft.address}
                  onChange={(e) => setDraft({ ...draft, address: e.target.value })}
                  placeholder="收货地址"
                  rows={2}
                  className="w-full resize-none rounded-xl border border-blush bg-white px-3 py-2 text-xs text-ink outline-none focus:border-accent"
                />
              </div>
              <div className="flex shrink-0 flex-col gap-1.5">
                <button
                  onClick={saveAddress}
                  aria-label="保存"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-white"
                >
                  <Check size={14} />
                </button>
                <button
                  onClick={() => setEditingAddress(false)}
                  aria-label="取消"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-blush text-ink"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-2.5">
            <MapPin size={18} className="mt-0.5 shrink-0 text-accent" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-ink">
                  {address.name}
                </span>
                <span className="text-xs text-muted">{address.phone}</span>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-ink/80">
                {address.address}
              </p>
            </div>
            <button
              onClick={startEditAddress}
              aria-label="修改地址"
              className="flex shrink-0 items-center text-xs text-muted"
            >
              修改
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Items summary */}
      <div className="mx-4 mt-3 pastel-card p-3">
        <h2 className="mb-2 text-xs font-medium text-muted">
          商品清单 ({items.length})
        </h2>
        <div className="flex flex-col gap-2.5">
          {items.map((item) => (
            <div
              key={`${item.productId}-${item.spec}`}
              className="flex items-center gap-2.5"
            >
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-cream">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-1 text-xs font-medium text-ink">
                  {item.name}
                </p>
                <span className="mt-0.5 inline-block rounded-full bg-cream px-2 py-0.5 text-[10px] text-muted">
                  {item.spec}
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xs font-medium text-ink">
                  ${item.price}
                </span>
                <span className="text-[10px] text-muted">x{item.quantity}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fee breakdown */}
      <div className="mx-4 mt-3 pastel-card p-3">
        <h2 className="mb-2 text-xs font-medium text-muted">费用明细</h2>
        <div className="flex flex-col gap-1.5 text-xs">
          <div className="flex justify-between">
            <span className="text-muted">商品总额</span>
            <span className="text-ink">${totalAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">运费（虚拟）</span>
            <span className="text-ink">$0.00</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">优惠（虚拟）</span>
            <span className="text-ink">$0.00</span>
          </div>
          <div className="mt-1 flex justify-between border-t border-cream pt-2">
            <span className="font-medium text-ink">实付</span>
            <span className="text-base font-bold text-accent">
              ${totalAmount.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom submit bar */}
      <div className="sticky bottom-14 z-30 flex items-center justify-between gap-3 border-t border-cream bg-white/95 px-4 py-2.5 backdrop-blur">
        <div className="flex flex-col">
          <span className="text-[10px] text-muted">实付</span>
          <span className="text-lg font-bold text-accent">
            ${totalAmount.toFixed(2)}
          </span>
        </div>
        <button
          onClick={handleSubmit}
          className="rounded-full bg-accent px-8 py-2.5 text-sm font-medium text-white transition active:scale-95"
        >
          提交订单
        </button>
      </div>
    </div>
  );
}
