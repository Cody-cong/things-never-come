"use client";

import { useEffect, useRef } from "react";
import { Trophy, ArrowRight } from "lucide-react";
import Confetti from "./Confetti";
import type { Achievement } from "@/lib/achievements";

interface AchievementModalProps {
  achievement: Achievement;
  /** 剩余未展示的成就数（含当前这个） */
  remaining: number;
  onConfirm: () => void;
}

export default function AchievementModal({
  achievement,
  remaining,
  onConfirm,
}: AchievementModalProps) {
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    confirmRef.current?.focus();
  }, []);

  return (
    <>
      <Confetti />
      <div
        className="fixed inset-0 z-[75] flex items-center justify-center bg-ink/50 p-4 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="achievement-title"
      >
        <div className="w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-float">
          {/* 顶部装饰渐变 */}
          <div className="bg-gradient-to-br from-accent to-accent-dark px-6 py-8 text-center">
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
              <Trophy size={32} className="text-white" />
            </div>
            <p className="text-xs font-medium uppercase tracking-widest text-white/80">
              Achievement Unlocked
            </p>
          </div>

          {/* 成就内容 */}
          <div className="px-6 py-6 text-center">
            <div className="text-5xl">{achievement.icon}</div>
            <h2
              id="achievement-title"
              className="mt-3 text-2xl font-extrabold text-ink"
            >
              {achievement.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {achievement.desc}
            </p>

            {remaining > 1 && (
              <p className="mt-3 text-xs text-accent">
                还有 {remaining - 1} 个成就等你解锁
              </p>
            )}

            <button
              ref={confirmRef}
              onClick={onConfirm}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-accent py-3 text-sm font-bold text-white transition hover:bg-accent-dark"
            >
              {remaining > 1 ? "继续" : "太棒了"}
              {remaining > 1 && <ArrowRight size={16} />}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
