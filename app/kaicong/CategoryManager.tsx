"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";
import {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/category-store";

/**
 * 分类管理视图：添加 / 重命名 / 删除分类。
 * 全部使用内联输入框，不依赖 window.prompt/confirm（预览浏览器不支持）。
 * 注意：删除分类不会删除该分类下的商品，仅移除分类本身。
 */
export default function CategoryManager() {
  const [list, setList] = useState<string[]>([]);
  // 添加分类的内联输入
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  // 重命名的内联输入
  const [editingCat, setEditingCat] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  // 删除确认
  const [confirmingDelete, setConfirmingDelete] = useState<string | null>(null);

  function refresh() {
    setList(getCategories());
  }

  useEffect(() => {
    refresh();
  }, []);

  function handleAdd() {
    const name = newName.trim();
    if (!name) return;
    addCategory(name);
    setNewName("");
    setAdding(false);
    refresh();
  }

  function startRename(cat: string) {
    setEditingCat(cat);
    setEditName(cat);
  }

  function handleRename(oldName: string) {
    const newName = editName.trim();
    if (!newName || newName === oldName) {
      setEditingCat(null);
      return;
    }
    updateCategory(oldName, newName);
    setEditingCat(null);
    setEditName("");
    refresh();
  }

  function handleDelete(name: string) {
    deleteCategory(name);
    setConfirmingDelete(null);
    refresh();
  }

  return (
    <div className="flex flex-col">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-base font-semibold text-ink">分类管理</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAdding(true)}
            className="flex items-center gap-1 rounded-full bg-accent px-3 py-1.5 text-xs font-medium text-white"
          >
            <Plus size={14} />
            添加分类
          </button>
        </div>
      </div>

      <p className="mb-3 text-xs text-muted">共 {list.length} 个分类</p>

      <div className="flex flex-col gap-2.5">
        {/* 添加分类的内联输入框 */}
        {adding && (
          <div className="pastel-card flex items-center gap-2 p-2.5">
            <input
              autoFocus
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAdd();
                if (e.key === "Escape") {
                  setAdding(false);
                  setNewName("");
                }
              }}
              placeholder="新分类名称"
              className="flex-1 rounded-xl border border-blush bg-white px-3 py-2 text-sm text-ink outline-none focus:border-accent"
            />
            <button
              onClick={handleAdd}
              aria-label="确认添加"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-white"
            >
              <Check size={14} />
            </button>
            <button
              onClick={() => {
                setAdding(false);
                setNewName("");
              }}
              aria-label="取消"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-blush text-ink"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {list.map((c) => (
          <div key={c} className="pastel-card flex items-center gap-3 p-2.5">
            {editingCat === c ? (
              <>
                <input
                  autoFocus
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleRename(c);
                    if (e.key === "Escape") setEditingCat(null);
                  }}
                  className="flex-1 rounded-xl border border-blush bg-white px-3 py-2 text-sm text-ink outline-none focus:border-accent"
                />
                <button
                  onClick={() => handleRename(c)}
                  aria-label="确认"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-white"
                >
                  <Check size={14} />
                </button>
                <button
                  onClick={() => setEditingCat(null)}
                  aria-label="取消"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-blush text-ink"
                >
                  <X size={14} />
                </button>
              </>
            ) : confirmingDelete === c ? (
              <>
                <span className="flex-1 text-xs text-ink">
                  确认删除「{c}」？该分类下的商品不会被删除。
                </span>
                <button
                  onClick={() => handleDelete(c)}
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
              </>
            ) : (
              <>
                <span className="chip bg-blush text-ink">{c}</span>
                <div className="flex-1" />
                <button
                  onClick={() => startRename(c)}
                  aria-label="重命名"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-mint text-ink"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => setConfirmingDelete(c)}
                  aria-label="删除"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-blush text-accent-dark"
                >
                  <Trash2 size={14} />
                </button>
              </>
            )}
          </div>
        ))}
        {list.length === 0 && !adding && (
          <p className="py-8 text-center text-xs text-muted">
            暂无分类，点击右上角添加
          </p>
        )}
      </div>
    </div>
  );
}
