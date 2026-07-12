"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { getAllProducts } from "@/lib/product-store";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/types";

const PAGE_SIZE = 12;

export default function SearchPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [keyword, setKeyword] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("q") ?? "";
    setKeyword(q);
    async function load() {
      const all = await getAllProducts();
      setProducts(all);
    }
    load();
    inputRef.current?.focus();
  }, []);

  const results = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    if (!kw) return products;
    return products.filter((p) => p.name.toLowerCase().includes(kw));
  }, [keyword, products]);

  const showAll = keyword.trim() === "";
  const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const pageResults = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return results.slice(start, start + PAGE_SIZE);
  }, [results, page]);

  // 关键词变化时回到第一页
  useEffect(() => {
    setPage(1);
  }, [keyword]);

  return (
    <div className="mx-auto max-w-site px-6 py-8 md:px-8">
      <h1 className="text-2xl font-bold text-ink">搜索商品</h1>

      <div className="mt-6 flex max-w-md items-center gap-3 rounded-full bg-white px-2 py-2 shadow-card">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-light">
          <Search size={18} className="text-accent" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="输入关键词搜索"
          aria-label="搜索商品"
          className="flex-1 bg-transparent text-sm text-ink placeholder:text-muted outline-none"
        />
        <Sparkles size={16} className="mr-3 text-accent/50" />
      </div>

      <div className="mt-8">
        {results.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
            <div className="relative">
              <div className="absolute -inset-3 rounded-full bg-accent-light/50 blur-lg" />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-card">
                <Search size={28} className="text-muted" />
              </div>
            </div>
            <p className="text-sm font-medium text-muted">没有找到相关商品</p>
            <p className="text-xs text-muted/80">换个关键词试试吧</p>
          </div>
        ) : (
          <>
            {showAll && (
              <p className="mb-4 text-sm text-muted">输入关键词搜索</p>
            )}
            {!showAll && (
              <p className="mb-4 text-sm text-muted">
                找到 <span className="font-semibold text-accent">{results.length}</span> 件相关商品
              </p>
            )}
            <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
              {pageResults.map((p, idx) => (
                <ProductCard key={p.id} product={p} priority={idx < 4} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  aria-label="上一页"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-card text-ink transition hover:bg-cream disabled:opacity-40"
                >
                  <ChevronLeft size={18} />
                </button>
                <span className="text-sm text-muted">
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  aria-label="下一页"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-card text-ink transition hover:bg-cream disabled:opacity-40"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
