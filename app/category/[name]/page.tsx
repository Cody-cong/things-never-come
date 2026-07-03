"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ArrowRight } from "lucide-react";
import { getProductsByCategory } from "@/lib/product-store";
import type { Product } from "@/lib/types";

export default function CategoryListPage() {
  const params = useParams<{ name: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState<Product[]>([]);

  const name = decodeURIComponent(params?.name ?? "");
  const title = name === "ALL" ? "全部商品" : name;

  useEffect(() => {
    setList(getProductsByCategory(name));
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, [name]);

  return (
    <div className="flex flex-col pb-24">
      {/* Top bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between bg-cream/90 px-4 py-3.5 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.back()}
            aria-label="返回"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-card transition active:scale-95"
          >
            <ChevronLeft size={22} className="text-ink" />
          </button>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-ink">{title}</span>
            {!loading && (
              <span className="text-[11px] text-muted">共 {list.length} 件好物</span>
            )}
          </div>
        </div>
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-2 gap-3.5 px-4 pt-2">
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
          : list.map((p, idx) => {
              const bgColors = ["bg-blush", "bg-mint", "bg-sand", "bg-lavender", "bg-sky", "bg-peach"];
              const bg = bgColors[idx % bgColors.length];
              return (
                <Link
                  key={p.id}
                  href={`/product/${p.id}`}
                  className="group flex flex-col gap-2.5 rounded-3xl bg-white p-3 shadow-card transition active:scale-[0.97]"
                >
                  <div className={`relative aspect-square w-full overflow-hidden rounded-2xl ${bg}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.image}
                      alt={p.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute left-2 top-2 h-1.5 w-1.5 rounded-full bg-white/60" />
                    <div className="absolute right-3 top-4 h-1 w-1 rounded-full bg-white/50" />
                  </div>
                  <p className="line-clamp-1 text-sm font-semibold text-ink">
                    {p.name}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-accent">
                      ${p.price}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2.5 py-1 text-[10px] font-medium text-accent">
                      去看看
                      <ArrowRight size={10} />
                    </span>
                  </div>
                </Link>
              );
            })}
      </div>
    </div>
  );
}
