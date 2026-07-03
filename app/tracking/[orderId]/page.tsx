"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Package } from "lucide-react";
import { useOrders } from "@/lib/cart-context";
import DeliveryMap from "@/components/tracking/DeliveryMap";
import StatusTimeline from "@/components/tracking/StatusTimeline";
import OrderInfoCard from "@/components/OrderInfoCard";

const DURATION = 30000; // 30s total delivery time

const STATUS_BY_PROGRESS = [
  { threshold: 0.85, label: "即将送达" },
  { threshold: 0.5, label: "配送中" },
  { threshold: 0.25, label: "已取货" },
  { threshold: 0, label: "已接单" },
];

function formatCountdown(ms: number): string {
  const totalSec = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function statusLabel(progress: number): string {
  for (const s of STATUS_BY_PROGRESS) {
    if (progress >= s.threshold) return s.label;
  }
  return "已接单";
}

export default function TrackingPage() {
  const params = useParams();
  const router = useRouter();
  const { orders } = useOrders();
  const orderId = String(params.orderId);
  const order = orders.find((o) => o.id === orderId);

  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const jumpedRef = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!order) return;
    startRef.current = null;
    jumpedRef.current = false;

    const tick = (now: number) => {
      if (startRef.current === null) startRef.current = now;
      const el = now - startRef.current;
      const p = Math.min(el / DURATION, 1);
      setElapsed(el);
      setProgress(p);
      if (p < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else if (!jumpedRef.current) {
        jumpedRef.current = true;
        router.push(`/done/${orderId}`);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [order, orderId, router]);

  // Avoid flashing "not found" before localStorage hydration.
  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="skeleton h-10 w-10 rounded-full" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-8 text-center">
        <Package size={48} className="text-muted" />
        <p className="text-sm text-muted">订单不存在或已被清空</p>
        <button
          onClick={() => router.push("/")}
          className="rounded-full bg-accent px-6 py-2 text-sm font-medium text-white transition active:scale-95"
        >
          回首页
        </button>
      </div>
    );
  }

  const eta = Math.max(0, DURATION - elapsed);

  return (
    <div className="flex min-h-screen flex-col">
      {/* Top bar */}
      <div className="sticky top-0 z-30 flex items-center gap-2 bg-white/90 px-3 py-2.5 backdrop-blur">
        <button
          onClick={() => router.push("/")}
          aria-label="返回首页"
          className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-cream"
        >
          <ChevronLeft size={22} className="text-ink" />
        </button>
        <span className="text-sm font-medium text-ink">快递追踪</span>
      </div>

      {/* Status + ETA card (hero, accent gradient) */}
      <div className="mx-4 mt-3 rounded-3xl bg-gradient-to-br from-accent to-accent-dark p-4 text-white shadow-card">
        <p className="text-xs text-white/80">当前状态</p>
        <p className="mt-0.5 text-base font-semibold">
          {statusLabel(progress)}
        </p>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-[10px] text-white/70">预计送达</span>
          <span className="font-mono text-3xl font-bold tabular-nums">
            {formatCountdown(eta)}
          </span>
        </div>
      </div>

      <DeliveryMap progress={progress} />
      <StatusTimeline progress={progress} />
      <OrderInfoCard order={order} />

      <div className="h-8" />
    </div>
  );
}
