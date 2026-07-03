"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Flame, ChevronLeft } from "lucide-react";
import {
  getAllProducts,
  deleteProduct,
  deleteAllProducts,
  updateProduct,
} from "@/lib/product-store";
import { formatPrice } from "@/lib/utils";
import ProductImage from "@/components/ProductImage";
import type { Product } from "@/lib/types";
import ProductForm from "../ProductForm";

export default function ProductManager() {
  const [list, setList] = useState<Product[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [editing, setEditing] = useState<Product | "new" | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState<string | null>(null);
  const [confirmingDeleteAll, setConfirmingDeleteAll] = useState(false);

  useEffect(() => {
    setList(getAllProducts());
  }, [refreshKey]);

  function refresh() {
    setRefreshKey((k) => k + 1);
  }

  function handleDelete(id: string) {
    deleteProduct(id);
    setConfirmingDelete(null);
    refresh();
  }

  function handleDeleteAll() {
    deleteAllProducts();
    setConfirmingDeleteAll(false);
    refresh();
  }

  function handleToggleHot(p: Product) {
    updateProduct(p.id, { hot: !p.hot });
    refresh();
  }

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

  return (
    <div className="flex flex-col">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link
            href="/kaicong"
            aria-label="返回"
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-blush"
          >
            <ChevronLeft size={22} className="text-ink" />
          </Link>
          <h1 className="text-base font-semibold text-ink">商品管理</h1>
        </div>
        <div className="flex items-center gap-2">
          {confirmingDeleteAll ? (
            <>
              <span className="text-xs text-ink">确认全部删除？</span>
              <button
                onClick={handleDeleteAll}
                className="rounded-full bg-accent px-3 py-1.5 text-xs font-medium text-white"
              >
                确认
              </button>
              <button
                onClick={() => setConfirmingDeleteAll(false)}
                className="rounded-full border border-blush px-3 py-1.5 text-xs text-ink"
              >
                取消
              </button>
            </>
          ) : (
            <button
              onClick={() => setConfirmingDeleteAll(true)}
              className="flex items-center gap-1 rounded-full border border-blush px-3 py-1.5 text-xs text-accent-dark"
            >
              <Trash2 size={12} />
              全部删除
            </button>
          )}
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
        {confirmingDelete && (
          <div className="pastel-card flex items-center gap-2 p-2.5">
            <span className="flex-1 text-xs text-ink">
              确认删除该商品？此操作不可恢复。
            </span>
            <button
              onClick={() => handleDelete(confirmingDelete)}
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
        )}
        {list.map((p) => (
          <div
            key={p.id}
            className="pastel-card flex items-center gap-3 p-2.5"
          >
            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-sand">
              <ProductImage
                src={p.image}
                alt={p.name}
                containerClassName="h-14 w-14"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-ink">{p.name}</p>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <span className="chip bg-blush text-ink">{p.category}</span>
                <span className="text-sm font-semibold text-accent">
                  {formatPrice(p.price)}
                </span>
                {p.hot && (
                  <span className="chip bg-accent-light text-accent">热门</span>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => handleToggleHot(p)}
                aria-label={p.hot ? "取消热门" : "设为热门"}
                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                  p.hot ? "bg-accent text-white" : "bg-mint text-ink"
                }`}
              >
                <Flame size={14} />
              </button>
              <button
                onClick={() => setEditing(p)}
                aria-label="编辑"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-cream text-ink"
              >
                <Pencil size={14} />
              </button>
              <button
                onClick={() => setConfirmingDelete(p.id)}
                aria-label="删除"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-blush text-accent-dark"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
