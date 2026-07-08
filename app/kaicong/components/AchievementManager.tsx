"use client";

import { useEffect, useState } from "react";
import { Trash2, RotateCcw, Trophy } from "lucide-react";
import { ACHIEVEMENTS, type Achievement } from "@/lib/achievements";
import {
  getEnabledAchievementIds,
  disableAchievement,
  resetAchievements,
} from "@/lib/achievement-store";

export default function AchievementManager() {
  const [enabledIds, setEnabledIds] = useState<Set<string> | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState<string | null>(null);
  const [confirmingReset, setConfirmingReset] = useState(false);
  const [saving, setSaving] = useState(false);

  async function refresh() {
    setEnabledIds(await getEnabledAchievementIds());
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleDelete(id: string) {
    if (saving) return;
    setSaving(true);
    try {
      await disableAchievement(id);
      setConfirmingDelete(null);
      await refresh();
    } finally {
      setSaving(false);
    }
  }

  async function handleReset() {
    if (saving) return;
    setSaving(true);
    try {
      await resetAchievements();
      setConfirmingReset(false);
      await refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-base font-semibold text-ink">成就管理</h1>
        <button
          onClick={() => setConfirmingReset(true)}
          className="flex items-center gap-1 rounded-full border border-blush px-3 py-1.5 text-xs text-ink"
        >
          <RotateCcw size={12} />
          重置成就
        </button>
      </div>

      <p className="mb-3 text-xs text-muted">
        {enabledIds === null ? (
          "加载中…"
        ) : (
          <>共 {ACHIEVEMENTS.length} 条成就，已启用 {enabledIds.size} 条</>
        )}
      </p>

      <div className="flex flex-col gap-2.5">
        {enabledIds === null && (
          <p className="py-8 text-center text-xs text-muted">正在读取成就状态…</p>
        )}

        {confirmingReset && (
          <div className="pastel-card flex items-center gap-2 p-2.5">
            <span className="flex-1 text-xs text-ink">
              确认重置成就？将恢复所有默认成就。
            </span>
            <button
              onClick={handleReset}
              className="rounded-full bg-accent px-3 py-1.5 text-xs font-medium text-white"
            >
              确认
            </button>
            <button
              onClick={() => setConfirmingReset(false)}
              className="rounded-full border border-blush px-3 py-1.5 text-xs text-ink"
            >
              取消
            </button>
          </div>
        )}

        {enabledIds !== null &&
          ACHIEVEMENTS.map((a) => (
            <AchievementRow
              key={a.id}
              achievement={a}
              enabled={enabledIds.has(a.id)}
              confirmingDelete={confirmingDelete === a.id}
              saving={saving}
              onConfirmDelete={() => setConfirmingDelete(a.id)}
              onCancelDelete={() => setConfirmingDelete(null)}
              onDelete={() => handleDelete(a.id)}
            />
          ))}
      </div>
    </div>
  );
}

function AchievementRow({
  achievement,
  enabled,
  confirmingDelete,
  saving,
  onConfirmDelete,
  onCancelDelete,
  onDelete,
}: {
  achievement: Achievement;
  enabled: boolean;
  confirmingDelete: boolean;
  saving: boolean;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      className={`pastel-card flex items-center gap-3 p-3 ${
        enabled ? "" : "opacity-50"
      }`}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-mint text-xl">
        {achievement.icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-2 text-sm font-medium text-ink">
          {achievement.title}
          {!enabled && (
            <span className="rounded-full bg-ink/10 px-2 py-0.5 text-[10px] text-muted">
              已禁用
            </span>
          )}
        </p>
        <p className="mt-0.5 text-xs leading-relaxed text-muted">
          {achievement.desc}
        </p>
      </div>

      {confirmingDelete ? (
        <div className="flex shrink-0 items-center gap-1.5">
          <button
            onClick={onDelete}
            disabled={saving}
            className="rounded-full bg-accent px-3 py-1.5 text-xs font-medium text-white"
          >
            删除
          </button>
          <button
            onClick={onCancelDelete}
            className="rounded-full border border-blush px-3 py-1.5 text-xs text-ink"
          >
            取消
          </button>
        </div>
      ) : enabled ? (
        <button
          onClick={onConfirmDelete}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blush text-accent-dark"
          aria-label="删除"
        >
          <Trash2 size={14} />
        </button>
      ) : (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink/5 text-muted">
          <Trophy size={14} />
        </div>
      )}
    </div>
  );
}
