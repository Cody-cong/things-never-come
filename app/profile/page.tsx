"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  User,
  Wallet,
  ClipboardList,
  Truck,
  Star,
  Settings,
  MapPin,
  Award,
  ChevronRight,
  LucideIcon,
} from "lucide-react";
import { useOrders } from "@/lib/cart-context";
import { mockUser, getNickname } from "@/lib/mock-data";

/** 幽默固定余额：1 万亿美元（反正花不出去） */
const WALLET_BALANCE = "$1,000,000,000,000";

export default function ProfilePage() {
  const { orders } = useOrders();
  const [toast, setToast] = useState<string | null>(null);
  const [nickname, setNickname] = useState(mockUser.nickname);

  const showToast = useCallback((msg: string) => setToast(msg), []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 1500);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    setNickname(getNickname());
  }, []);

  const orderCount = orders.length; // 订单总数
  const reviewCount = 0; // 永不送达，无可评价

  const menus: { icon: LucideIcon; label: string; href?: string }[] = [
    { icon: Award, label: "我的成就", href: "/achievements" },
    { icon: MapPin, label: "收货地址" },
    { icon: Settings, label: "设置", href: "/settings" },
  ];

  return (
    <div className="flex flex-col pb-20">
      {/* 顶部头像区：柔粉彩渐变 */}
      <div className="bg-gradient-to-b from-blush to-cream px-5 pt-10 pb-8">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-white shadow-card">
            <User size={32} strokeWidth={2} />
          </div>
          <div className="min-w-0">
            <p className="text-lg font-semibold text-ink">
              {nickname}
            </p>
          </div>
        </div>
      </div>

      {/* 我的钱包卡片：固定万亿余额 */}
      <div className="-mt-4 px-4">
        <div className="pastel-card flex items-center gap-3 p-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-accent-light text-accent">
            <Wallet size={22} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted">余额</p>
            <p className="mt-0.5 text-2xl font-bold text-accent">
              {WALLET_BALANCE}
            </p>
          </div>
        </div>
      </div>

      {/* 订单与物流入口：三列 */}
      <div className="mt-3 px-4">
        <div className="pastel-card p-4">
          <p className="mb-3 text-xs font-medium text-muted">订单与物流</p>
          <div className="grid grid-cols-3 gap-3">
            <OrderEntry
              href="/orders?status=订单"
              icon={ClipboardList}
              label="订单"
              count={orderCount}
            />
            <OrderEntry
              href="/orders?status=物流"
              icon={Truck}
              label="物流"
              count={orderCount}
            />
            <OrderEntry
              href="/orders?status=待评价"
              icon={Star}
              label="待评价"
              count={reviewCount}
            />
          </div>
        </div>
      </div>

      {/* 菜单列表 */}
      <div className="mt-3 px-4">
        <div className="pastel-card overflow-hidden">
          {menus.map(({ icon: Icon, label, href }, idx) => {
            const inner = (
              <>
                <Icon size={18} className="text-accent" />
                <span className="flex-1 text-left text-sm text-ink">
                  {label}
                </span>
                <ChevronRight size={16} className="text-muted" />
              </>
            );
            const cls = `flex w-full items-center gap-3 px-4 py-3.5 transition active:bg-cream ${
              idx > 0 ? "border-t border-cream" : ""
            }`;
            return href ? (
              <Link key={label} href={href} className={cls}>
                {inner}
              </Link>
            ) : (
              <button
                key={label}
                onClick={() => showToast("功能建设中")}
                className={cls}
              >
                {inner}
              </button>
            );
          })}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="pointer-events-none fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-2xl bg-ink/80 px-4 py-2 text-xs text-white">
          {toast}
        </div>
      )}
    </div>
  );
}

function OrderEntry({
  href,
  icon: Icon,
  label,
  count,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
  count: number;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center gap-1.5 rounded-2xl bg-cream py-3 transition active:scale-[0.97]"
    >
      <div className="relative">
        <Icon size={24} className="text-accent" />
        {count > 0 && (
          <span className="absolute -right-2 -top-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold leading-none text-white">
            {count > 99 ? "99+" : count}
          </span>
        )}
      </div>
      <span className="text-xs text-ink">{label}</span>
    </Link>
  );
}
