"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, RotateCcw, Check, X } from "lucide-react";
import {
  getFaqs,
  addFaq,
  updateFaq,
  deleteFaq,
  resetFaqs,
  type HomeFaq,
} from "@/lib/faq-store";

export default function FaqManager() {
  const [list, setList] = useState<HomeFaq[]>([]);
  const [adding, setAdding] = useState(false);
  const [newQ, setNewQ] = useState("");
  const [newA, setNewA] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editQ, setEditQ] = useState("");
  const [editA, setEditA] = useState("");
  const [confirmingDelete, setConfirmingDelete] = useState<string | null>(null);
  const [confirmingReset, setConfirmingReset] = useState(false);

  const [saving, setSaving] = useState(false);

  async function refresh() {
    setList(await getFaqs());
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleAdd() {
    if (saving) return;
    const q = newQ.trim();
    const a = newA.trim();
    if (!q || !a) return;
    setSaving(true);
    try {
      await addFaq(q, a);
      setNewQ("");
      setNewA("");
      setAdding(false);
      await refresh();
    } finally {
      setSaving(false);
    }
  }

  function startEdit(f: HomeFaq) {
    setEditingId(f.id);
    setEditQ(f.q);
    setEditA(f.a);
  }

  async function handleSaveEdit(id: string) {
    if (saving) return;
    const q = editQ.trim();
    const a = editA.trim();
    if (!q || !a) return;
    setSaving(true);
    try {
      await updateFaq(id, { q, a });
      setEditingId(null);
      await refresh();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (saving) return;
    setSaving(true);
    try {
      await deleteFaq(id);
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
      await resetFaqs();
      setConfirmingReset(false);
      await refresh();
    } finally {
      setSaving(false);
    }
  }

  const inputCls =
    "w-full rounded-xl border border-blush bg-white px-3 py-2 text-sm text-ink outline-none focus:border-accent";
  const textareaCls = `${inputCls} resize-none`;

  return (
    <div className="flex flex-col">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-base font-semibold text-ink">常见问题管理</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setConfirmingReset(true)}
            className="flex items-center gap-1 rounded-full border border-blush px-3 py-1.5 text-xs text-ink"
          >
            <RotateCcw size={12} />
            重置 FAQ
          </button>
          <button
            onClick={() => setAdding(true)}
            className="flex items-center gap-1 rounded-full bg-accent px-3 py-1.5 text-xs font-medium text-white"
          >
            <Plus size={14} />
            添加 FAQ
          </button>
        </div>
      </div>

      <p className="mb-3 text-xs text-muted">共 {list.length} 条问答</p>

      <div className="flex flex-col gap-2.5">
        {confirmingReset && (
          <div className="pastel-card flex items-center gap-2 p-2.5">
            <span className="flex-1 text-xs text-ink">
              确认重置 FAQ？将恢复到初始 4 条问答。
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

        {adding && (
          <div className="pastel-card flex flex-col gap-2 p-2.5">
            <input
              autoFocus
              type="text"
              value={newQ}
              onChange={(e) => setNewQ(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setAdding(false);
                  setNewQ("");
                  setNewA("");
                }
              }}
              placeholder="问题"
              className={inputCls}
            />
            <textarea
              value={newA}
              onChange={(e) => setNewA(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setAdding(false);
                  setNewQ("");
                  setNewA("");
                }
              }}
              placeholder="回答"
              rows={2}
              className={textareaCls}
            />
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={handleAdd}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-white"
                aria-label="确认添加"
              >
                <Check size={14} />
              </button>
              <button
                onClick={() => {
                  setAdding(false);
                  setNewQ("");
                  setNewA("");
                }}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-blush text-ink"
                aria-label="取消"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        )}

        {list.map((f) => (
          <div key={f.id} className="pastel-card flex flex-col gap-2 p-2.5">
            {editingId === f.id ? (
              <>
                <input
                  autoFocus
                  type="text"
                  value={editQ}
                  onChange={(e) => setEditQ(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") setEditingId(null);
                  }}
                  className={inputCls}
                />
                <textarea
                  value={editA}
                  onChange={(e) => setEditA(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") setEditingId(null);
                  }}
                  rows={2}
                  className={textareaCls}
                />
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleSaveEdit(f.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-white"
                    aria-label="确认"
                  >
                    <Check size={14} />
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-blush text-ink"
                    aria-label="取消"
                  >
                    <X size={14} />
                  </button>
                </div>
              </>
            ) : confirmingDelete === f.id ? (
              <div className="flex items-center gap-2">
                <span className="flex-1 text-xs text-ink">
                  确认删除这条问答？
                </span>
                <button
                  onClick={() => handleDelete(f.id)}
                  className="rounded-full bg-accent px-3 py-1.5 text-xs font-medium text-white"
                >
                  删除
                </button>
                <button
                  onClick={() => setConfirmingDelete(null)}
                  className="rounded-full border border-blush px-3 py-1.5 text-xs text-ink"
                >
                  取消
                </button>
              </div>
            ) : (
              <>
                <p className="text-sm font-medium text-ink">{f.q}</p>
                <p className="text-xs leading-relaxed text-muted">{f.a}</p>
                <div className="flex items-center justify-end gap-1.5">
                  <button
                    onClick={() => startEdit(f)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-mint text-ink"
                    aria-label="编辑"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => setConfirmingDelete(f.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-blush text-accent-dark"
                    aria-label="删除"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}

        {list.length === 0 && !adding && (
          <p className="py-8 text-center text-xs text-muted">
            暂无 FAQ，点击右上角添加
          </p>
        )}
      </div>
    </div>
  );
}
