"use client";

import { Check } from "lucide-react";

interface StatusTimelineProps {
  progress: number; // 0 -> 1
}

interface Node {
  label: string;
  desc: string;
  threshold: number;
}

const NODES: Node[] = [
  { label: "已接单", desc: "订单已提交，系统已接单", threshold: 0 },
  { label: "已取货", desc: "商家备货完成，已出库", threshold: 0.25 },
  { label: "配送中", desc: "快递员正在赶来的路上", threshold: 0.5 },
  { label: "即将送达", desc: "马上就到（真的吗）", threshold: 0.85 },
];

export default function StatusTimeline({ progress }: StatusTimelineProps) {
  return (
    <div className="mx-4 mt-3 pastel-card p-3">
      <h2 className="mb-3 text-xs font-medium text-muted">配送进度</h2>

      <div className="flex flex-col">
        {NODES.map((node, idx) => {
          const active = progress >= node.threshold;
          const isLast = idx === NODES.length - 1;
          const nextActive =
            !isLast && progress >= NODES[idx + 1].threshold;

          return (
            <div key={node.label} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full transition-colors ${
                    active
                      ? "bg-accent text-white"
                      : "bg-cream text-muted"
                  }`}
                >
                  {active ? (
                    <Check size={14} />
                  ) : (
                    <span className="text-[10px]">{idx + 1}</span>
                  )}
                </div>
                {!isLast && (
                  <div
                    className={`w-0.5 ${
                      nextActive ? "bg-accent" : "bg-cream"
                    }`}
                    style={{ height: 28, marginTop: 2, marginBottom: 2 }}
                  />
                )}
              </div>

              <div className="flex-1">
                <p
                  className={`text-sm font-medium ${
                    active ? "text-ink" : "text-muted"
                  }`}
                >
                  {node.label}
                </p>
                <p className="text-[10px] text-muted">{node.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
