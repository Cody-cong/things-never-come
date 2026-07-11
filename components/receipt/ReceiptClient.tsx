"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Package, Printer, Home } from "lucide-react";
import { useOrders } from "@/lib/cart-context";
import ReceiptContent from "./ReceiptContent";

export default function ReceiptClient() {
  const router = useRouter();
  const { orders } = useOrders();
  const [orderId, setOrderId] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setOrderId(new URLSearchParams(window.location.search).get("orderId") ?? "");
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

  function handlePrint() {
    window.print();
  }

  return (
    <div className="mx-auto max-w-site px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto max-w-md">
        <div className="mb-4 flex items-center justify-between no-print md:mb-6">
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

        <ReceiptContent order={order} />

        <p className="mt-4 text-center text-xs text-muted no-print">
          点击「保存账单」即可通过浏览器打印或导出为 PDF。
        </p>
      </div>
    </div>
  );
}
