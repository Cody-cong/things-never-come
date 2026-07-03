"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Search, Sparkles } from "lucide-react";
import { getAllProducts } from "@/lib/product-store";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/types";

export default function SearchPage() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [keyword, setKeyword] = useState("");
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    setProducts(getAllProducts());
    inputRef.current?.focus();
  }, []);

  const results = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    if (!kw) return products;
    return products.filter((p) => p.name.toLowerCase().includes(kw));
  }, [keyword, products]);

  const showAll = keyword.trim() === "";

  return (
    <div className="flex flex-col pb-24">
      {/* Top bar with input */}
      <div className="sticky top-0 z-30 flex items-center gap-3 bg-cream/90 px-4 py-3.5 backdrop-blur-md">
        <button
          onClick={() => router.back()}
          aria-label="返回"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-card transition active:scale-95"
        >
          <ChevronLeft size={22} className="text-ink" />
        </button>
        <div className="flex flex-1 items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-card">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blush">
            <Search size={15} className="text-muted" />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="搜索商品"
            className="flex-1 bg-transparent text-sm text-ink placeholder:text-muted focus:outline-none"
          />
          <Sparkles size={16} className="text-accent/50" />
        </div>
      </div>

      {/* Result area */}
      <div className="px-4 pt-3">
        {results.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
            <div className="relative">
              <div className="absolute -inset-3 rounded-full bg-blush/50 blur-lg" />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-card">
                <Search size={28} className="text-muted" />
              </div>
            </div>
            <p className="text-sm font-medium text-muted">没有找到相关商品</p>
            <p className="text-xs text-muted/80">换个关键词试试吧 ✨</p>
          </div>
        ) : (
          <>
            {showAll && (
              <p className="mb-3 text-xs text-muted">💡 输入关键词搜索</p>
            )}
            {!showAll && (
              <p className="mb-3 text-xs text-muted">
                找到 <span className="font-semibold text-accent">{results.length}</span> 件相关商品
              </p>
            )}
            <div className="grid grid-cols-2 gap-3.5">
              {results.map((p, idx) => {
                const bgColors = ["bg-blush", "bg-mint", "bg-sand", "bg-lavender", "bg-sky", "bg-peach"];
                const bg = bgColors[idx % bgColors.length];
                return <ProductCard key={p.id} product={p} bg={bg} />;
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
