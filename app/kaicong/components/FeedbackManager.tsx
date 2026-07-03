"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { getFeedbacks, deleteFeedback, type Feedback } from "@/lib/feedback-store";

function formatTime(ts: number): string {
  const d = new Date(ts);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export default function FeedbackManager() {
  const [list, setList] = useState<Feedback[]>([]);
  const [confirming, setConfirming] = useState<string | null>(null);

  function refresh() {
    setList(getFeedbacks());
  }

  useEffect(() => {
    refresh();
  }, []);

  function handleDelete(id: string) {
    deleteFeedback(id);
    setConfirming(null);
    refresh();
  }

  return (
    <div className="flex flex-col">
      <p className="mb-3 text-xs text-muted">共 {list.length} 条反馈</p>

      <div className="flex flex-col gap-2.5">
        {list.map((f) => (
          <div key={f.id} className="pastel-card flex flex-col gap-2 p-3">
            {confirming === f.id ? (
              <div className="flex items-center gap-2">
                <span className="flex-1 text-xs text-ink">确认删除这条反馈？</span>
                <button
                  onClick={() => handleDelete(f.id)}
                  className="rounded-full bg-accent px-3 py-1.5 text-xs font-medium text-white"
                >
                  删除
                </button>
                <button
                  onClick={() => setConfirming(null)}
                  className="rounded-full border border-blush px-3 py-1.5 text-xs text-ink"
                >
                  取消
                </button>
              </div>
            ) : (
              <>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink">
                  {f.content}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted">{formatTime(f.createdAt)}</span>
                  <button
                    onClick={() => setConfirming(f.id)}
                    aria-label="删除"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-blush text-accent-dark"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}

        {list.length === 0 && (
          <p className="py-8 text-center text-xs text-muted">暂无用户反馈</p>
        )}
      </div>
    </div>
  );
}
