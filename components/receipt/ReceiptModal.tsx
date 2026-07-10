"use client";

import { useEffect, useRef, useState } from "react";
import { Download, X, FileText } from "lucide-react";
import ReceiptContent from "./ReceiptContent";
import type { Order } from "@/lib/types";

interface ReceiptModalProps {
  order: Order;
  onClose: () => void;
}

export default function ReceiptModal({ order, onClose }: ReceiptModalProps) {
  const receiptRef = useRef<HTMLDivElement>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  async function handleSaveImage() {
    if (!receiptRef.current || saving) return;
    setSaving(true);
    try {
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(receiptRef.current, {
        pixelRatio: 2,
        quality: 0.95,
      });
      const link = document.createElement("a");
      link.download = `账单-${order.id}.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      window.print();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="receipt-modal-overlay fixed inset-0 z-[70] flex min-h-dvh items-end justify-center bg-ink/50 p-4 backdrop-blur-sm sm:items-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="receipt-title"
    >
      <div
        className="receipt-modal-panel flex w-full max-w-xl flex-col overflow-hidden rounded-3xl bg-cream p-4 shadow-float sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="receipt-modal-header mb-4 flex shrink-0 items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-light">
              <FileText size={18} className="text-accent" />
            </div>
            <div>
              <h2 id="receipt-title" className="text-lg font-bold text-ink">
                账单已生成
              </h2>
              <p className="text-xs text-muted">订单提交成功，请查收</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-card transition hover:shadow-soft"
            aria-label="关闭"
          >
            <X size={16} className="text-ink" />
          </button>
        </div>

        <div ref={receiptRef} className="min-h-0 overflow-y-auto">
          <ReceiptContent order={order} />
        </div>

        <div className="receipt-modal-footer mt-4 flex shrink-0 items-center gap-3 pb-safe no-print">
          <button
            onClick={handleSaveImage}
            disabled={saving}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-accent py-2.5 text-sm font-bold text-white transition hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download size={16} />
            {saving ? "保存中…" : "保存图片"}
          </button>
          <button
            onClick={onClose}
            className="flex flex-1 items-center justify-center rounded-full bg-white py-2.5 text-sm font-bold text-ink shadow-card transition hover:shadow-soft"
          >
            完成
          </button>
        </div>
      </div>
    </div>
  );
}
