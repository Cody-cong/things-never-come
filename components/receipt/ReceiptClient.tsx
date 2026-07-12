"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Package, Download, Home } from "lucide-react";
import { useOrdersState } from "@/lib/cart-context";
import { useClientSearchParams } from "@/lib/use-client-search-params";
import { saveReceiptAsImage } from "@/lib/save-receipt-image";
import ReceiptContent from "./ReceiptContent";

export default function ReceiptClient() {
  const router = useRouter();
  const { orders } = useOrdersState();
  const searchParams = useClientSearchParams();
  const orderId = searchParams.get("orderId") ?? "";
  const [mounted, setMounted] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const order = orders.find((o) => o.id === orderId);

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

  async function handleSaveImage() {
    if (!receiptRef.current || saving) return;
    setSaving(true);
    try {
      await saveReceiptAsImage(
        receiptRef.current,
        `账单-${order?.id ?? "unknown"}.png`,
      );
    } catch (e) {
      console.error("[receipt] save image failed", e);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-4rem)] max-w-site items-start justify-center px-4 py-6 pb-20 md:px-8 md:py-8 md:pb-8">
      <div className="mx-auto max-w-md">
        <div className="mb-4 flex items-center justify-between no-print md:mb-6">
          <h1 className="text-2xl font-bold text-ink">订单账单</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveImage}
              disabled={saving}
              className="flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Download size={16} />
              {saving ? "保存中…" : "保存图片"}
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

        <div ref={receiptRef}>
          <ReceiptContent order={order} />
        </div>

        <p className="mt-4 text-center text-xs text-muted no-print">
          点击「保存图片」即可将账单保存到相册。
        </p>
      </div>
    </div>
  );
}
