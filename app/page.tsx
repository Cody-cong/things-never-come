"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { getAllProducts, getProductsByCategory } from "@/lib/product-store";
import { getCategories } from "@/lib/category-store";
import { getNickname } from "@/lib/mock-data";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/types";

const BG_COLORS = ["bg-blush", "bg-mint", "bg-sand", "bg-lavender", "bg-sky", "bg-peach"];

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [cats, setCats] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [nickname, setNickname] = useState("");
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    setCats(getCategories());
    setNickname(getNickname());
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    setProducts(getProductsByCategory(activeCategory));
  }, [activeCategory]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchText.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchText.trim())}`);
    }
  };

  return (
    <div className="flex flex-col pb-24">
      {/* 顶部问候语 */}
      <div className="px-4 pt-4 pb-2">
        <span className="text-xl font-bold text-ink">
          Hi, {nickname} 👋
        </span>
      </div>

      {/* 搜索框 */}
      <div className="px-4 pt-2 pb-3">
        <form
          onSubmit={handleSearch}
          className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-card transition active:scale-[0.99]"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blush">
            <Search size={15} className="text-muted" />
          </div>
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="搜索想要的商品"
            className="flex-1 bg-transparent text-sm text-ink placeholder:text-muted outline-none"
          />
        </form>
      </div>

      {/* 分类标签横滑 */}
      <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 py-2">
        <button
          onClick={() => setActiveCategory("ALL")}
          className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold shadow-card transition active:scale-95 ${
            activeCategory === "ALL"
              ? "bg-accent text-white"
              : "bg-white text-ink font-medium"
          }`}
        >
          全部
        </button>
        {cats.map((c) => (
          <button
            key={c}
            onClick={() => setActiveCategory(c)}
            className={`shrink-0 rounded-full px-4 py-2 text-xs font-medium shadow-card transition active:scale-95 ${
              activeCategory === c
                ? "bg-accent text-white font-semibold"
                : "bg-white text-ink"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* 商品网格 */}
      <section className="mt-2">
        <div className="grid grid-cols-2 gap-3.5 px-4 pb-4">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-2.5 rounded-3xl bg-white p-3 shadow-card"
                >
                  <div className="skeleton aspect-square w-full rounded-2xl" />
                  <div className="skeleton h-4 w-3/4 rounded" />
                  <div className="skeleton h-6 w-20 rounded-full" />
                </div>
              ))
            : products.map((p, idx) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  bg={BG_COLORS[idx % BG_COLORS.length]}
                />
              ))}
        </div>
        {!loading && products.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="text-5xl mb-3">📦</div>
            <p className="text-sm text-muted">该分类暂无商品</p>
          </div>
        )}
      </section>
    </div>
  );
}
