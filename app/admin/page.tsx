"use client";

import { useEffect, useState } from "react";
import { Plus, RotateCcw, Pencil, Trash2 } from "lucide-react";
import {
  getAllProducts,
  deleteProduct,
  deleteAllProducts,
  resetProducts,
} from "@/lib/product-store";
import type { Product } from "@/lib/types";
import ProductForm from "./ProductForm";
import CategoryManager from "./CategoryManager";

export default function AdminPage() {
  const [list, setList] = useState<Product[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  // editing: null = 列表模式；"new" = 新增；Product = 编辑该商品
  const [editing, setEditing] = useState<Product | "new" | null>(null);
  // view: 顶部 tab，"products" = 商品管理，"categories" = 分类管理
  const [view, setView] = useState<"products" | "categories">("products");

  useEffect(() => {
    setList(getAllProducts());
  }, [refreshKey]);

  function refresh() {
    setRefreshKey((k) => k + 1);
  }

  function handleDelete(p: Product) {
    if (window.confirm(`确认删除「${p.name}」？`)) {
      deleteProduct(p.id);
      refresh();
    }
  }

  function handleReset() {
    if (window.confirm("确认重置所有商品数据？将恢复到初始 36 个商品。")) {
      resetProducts();
      refresh();
    }
  }

  function handleDeleteAll() {
    if (window.confirm("确认删除所有商品？此操作不可恢复。")) {
      deleteAllProducts();
      refresh();
    }
  }

  // 表单模式（新增/编辑）：显示表单，隐藏列表
  if (editing !== null) {
    return (
      <ProductForm
        initial={editing === "new" ? null : editing}
        onCancel={() => setEditing(null)}
        onSaved={() => {
          setEditing(null);
          refresh();
        }}
      />
    );
  }

  // 列表模式
  return (
    <div className="flex flex-col px-4 pt-5 pb-24">
      {/* Tab 切换：商品管理 / 分类管理 */}
      <div className="mb-4 flex gap-2 rounded-full bg-blush p-1">
        <button
          onClick={() => setView("products")}
          className={`flex-1 rounded-full py-1.5 text-xs font-medium transition ${
            view === "products" ? "bg-accent text-white" : "text-ink"
          }`}
        >
          商品管理
        </button>
        <button
          onClick={() => setView("categories")}
          className={`flex-1 rounded-full py-1.5 text-xs font-medium transition ${
            view === "categories" ? "bg-accent text-white" : "text-ink"
          }`}
        >
          分类管理
        </button>
      </div>

      {view === "categories" ? (
        <CategoryManager />
      ) : (
        <>
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-base font-semibold text-ink">商品管理</h1>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDeleteAll}
                className="flex items-center gap-1 rounded-full border border-blush px-3 py-1.5 text-xs text-accent-dark"
              >
                <Trash2 size={12} />
                全部删除
              </button>
              <button
                onClick={handleReset}
                className="flex items-center gap-1 rounded-full border border-blush px-3 py-1.5 text-xs text-ink"
              >
                <RotateCcw size={12} />
                重置数据
              </button>
              <button
                onClick={() => setEditing("new")}
                className="flex items-center gap-1 rounded-full bg-accent px-3 py-1.5 text-xs font-medium text-white"
              >
                <Plus size={14} />
                添加商品
              </button>
            </div>
          </div>

          <p className="mb-3 text-xs text-muted">共 {list.length} 个商品</p>

          <div className="flex flex-col gap-2.5">
            {list.map((p) => (
              <div
                key={p.id}
                className="pastel-card flex items-center gap-3 p-2.5"
              >
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-sand">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.image}
                    alt={p.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">
                    {p.name}
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="chip bg-blush text-ink">{p.category}</span>
                    <span className="text-sm font-semibold text-accent">
                      ${p.price}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <button
                    onClick={() => setEditing(p)}
                    aria-label="编辑"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-mint text-ink"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(p)}
                    aria-label="删除"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-blush text-accent-dark"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
