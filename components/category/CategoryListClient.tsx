"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getProductsByCategory } from "@/lib/product-store";
import { getCategories } from "@/lib/category-store";
import { useClientSearchParams } from "@/lib/use-client-search-params";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/types";

export default function CategoryListClient() {
  const router = useRouter();
  const searchParams = useClientSearchParams();
  const initialName = searchParams.get("name") ?? "ALL";
  const [name, setName] = useState(initialName);
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState<Product[]>([]);
  const [cats, setCats] = useState<string[]>([]);

  const loadCategory = useCallback(async (categoryName: string) => {
    setLoading(true);
    const [categories, products] = await Promise.all([
      getCategories(),
      getProductsByCategory(categoryName),
    ]);
    setCats(categories);
    setList(products);
    setLoading(false);
  }, []);

  useEffect(() => {
    const categoryName = searchParams.get("name") ?? "ALL";
    setName(categoryName);
    loadCategory(categoryName);
  }, [searchParams, loadCategory]);

  function switchCategory(next: string) {
    setName(next);
    router.push(`/category/?name=${encodeURIComponent(next)}`, {
      scroll: false,
    });
    loadCategory(next);
  }

  return (
    <div className="mx-auto max-w-site px-6 py-8 md:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink">商品</h1>
        {!loading && (
          <p className="mt-1 text-sm text-muted">共 {list.length} 件好物</p>
        )}
      </div>

      <div
        className="mb-8 flex flex-wrap items-center gap-2"
        role="group"
        aria-label="商品分类筛选"
      >
        <button
          onClick={() => switchCategory("ALL")}
          aria-pressed={name === "ALL"}
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            name === "ALL"
              ? "bg-accent text-white"
              : "bg-cream text-ink hover:bg-accent-light hover:text-accent"
          }`}
        >
          全部
        </button>
        {cats.map((c) => (
          <button
            key={c}
            onClick={() => switchCategory(c)}
            aria-pressed={name === c}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              name === c
                ? "bg-accent text-white"
                : "bg-cream text-ink hover:bg-accent-light hover:text-accent"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-card"
              >
                <div className="skeleton aspect-square w-full" />
                <div className="flex flex-col gap-2 p-4">
                  <div className="skeleton h-4 w-3/4 rounded" />
                  <div className="skeleton h-5 w-20 rounded" />
                </div>
              </div>
            ))
          : list.map((p, idx) => (
              <ProductCard key={p.id} product={p} priority={idx < 4} />
            ))}
      </div>

      {!loading && list.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="text-5xl mb-3">📦</div>
          <p className="text-muted">该分类暂无商品</p>
        </div>
      )}
    </div>
  );
}
