"use client";

import { useEffect, useState } from "react";
import { Check, Loader2, Target } from "lucide-react";
import type { Order } from "@/lib/types";

interface OrderTrackingModalProps {
  order: Order;
  onComplete: () => void;
}

const STEPS = [
  { title: "订单已收到", desc: "系统已收到您虚构的订单，正在假装处理。" },
  { title: "仓库正在备货", desc: "拣货员在货架间穿梭，但什么也没拿。" },
  { title: "骑手什么也没捡到", desc: "骑手已接单，并决定直接略过您的包裹。" },
  { title: "包裹正在配送", desc: "您的商品正在数字世界里光速前进。" },
  { title: "快到了……", desc: "配送员已经到您家门口了，大概。" },
];

const FINAL_MESSAGES = [
  "你的快递员走神了。",
  "包裹决定去环游世界。",
  "它从来就没有出发过。",
  "这是一次完美的虚拟配送。",
];

function randomFinal() {
  return FINAL_MESSAGES[Math.floor(Math.random() * FINAL_MESSAGES.length)];
}

export default function OrderTrackingModal({
  order,
  onComplete,
}: OrderTrackingModalProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [finished, setFinished] = useState(false);
  const [finalMsg] = useState(() => randomFinal());

  useEffect(() => {
    if (finished) return;
    if (activeIndex >= STEPS.length) {
      setFinished(true);
      return;
    }
    const t = setTimeout(() => {
      setActiveIndex((i) => i + 1);
    }, 1500);
    return () => clearTimeout(t);
  }, [activeIndex, finished]);

  const progress = Math.min(100, (activeIndex / STEPS.length) * 100);

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-ink/50 p-4 backdrop-blur-sm sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tracking-title"
    >
      <div className="w-full max-w-md overflow-hidden rounded-3xl bg-cream p-6 shadow-float">
        <div className="mb-6">
          <div className="mb-2 flex justify-between text-xs text-muted">
            <span>订单已下单</span>
            <span>从未到达</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-white">
            <div
              className="h-full rounded-full bg-accent transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <h2
          id="tracking-title"
          className="mb-5 text-center text-lg font-bold text-ink"
        >
          订单追踪
        </h2>

        <div className="space-y-5">
          {STEPS.map((step, idx) => {
            const completed = idx < activeIndex;
            const current = idx === activeIndex && !finished;
            const pending = idx >= activeIndex && !completed && !current;

            return (
              <div key={idx} className="flex items-start gap-3">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors ${
                    completed
                      ? "bg-green-500 text-white"
                      : current
                        ? "bg-accent text-white"
                        : "bg-white text-muted"
                  }`}
                >
                  {completed ? (
                    <Check size={16} />
                  ) : current ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <span className="text-xs">{idx + 1}</span>
                  )}
                </div>
                <div>
                  <p
                    className={`text-sm font-bold ${
                      completed || current ? "text-ink" : "text-muted"
                    }`}
                  >
                    {step.title}
                  </p>
                  <p className="text-xs text-muted">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {finished && (
          <div className="mt-6 rounded-2xl bg-white p-5 text-center shadow-card">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent-light">
              <Target size={28} className="text-accent" />
            </div>
            <h3 className="mt-3 text-lg font-bold text-ink">东西一直没来。</h3>
            <p className="mt-1 text-sm text-muted">
              配送完成。什么也没收到。一切按计划进行。
            </p>
            <p className="mt-3 rounded-xl bg-accent-light/50 px-3 py-2 text-sm text-accent">
              {finalMsg}
            </p>
          </div>
        )}

        <div className="mt-6">
          {finished ? (
            <button
              onClick={onComplete}
              className="w-full rounded-full bg-accent py-3 text-sm font-bold text-white transition hover:bg-accent-dark"
            >
              确认收货
            </button>
          ) : (
            <div className="flex items-center justify-center gap-2 text-xs text-muted">
              <Loader2 size={14} className="animate-spin" />
              配送中…
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
