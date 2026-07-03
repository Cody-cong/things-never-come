"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Star, MapPin, Clock, ShoppingCart, Plus, Check } from "lucide-react";
import { getProductById } from "@/lib/product-store";
import { useCart } from "@/lib/cart-context";
import type { Product } from "@/lib/types";

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [spec, setSpec] = useState("");
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const p = getProductById(params?.id ?? "");
    setProduct(p ?? null);
    if (p) setSpec(p.specs[0] ?? "");
    setLoading(false);
  }, [params?.id]);

  const handleAdd = () => {
    if (!product) return;
    addItem({
      productId: product.id,
      shopId: product.shopId,
      name: product.name,
      price: product.price,
      image: product.image,
      spec,
      quantity: 1,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col gap-4 p-4">
        <div className="skeleton h-10 w-10 rounded-full" />
        <div className="skeleton aspect-square w-full rounded-3xl" />
        <div className="skeleton h-6 w-2/3 rounded" />
        <div className="skeleton h-10 w-32 rounded-full" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-8 text-center">
        <p className="text-sm font-medium text-ink">商品不见了</p>
        <p className="text-xs text-muted">它可能跟着包裹一起消失了</p>
        <button
          onClick={() => router.replace("/")}
          className="mt-2 rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-white shadow-card"
        >
          回首页
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col pb-24">
      {/* 顶部返回栏 */}
      <div className="sticky top-0 z-30 flex items-center bg-cream/90 px-4 py-3.5 backdrop-blur-md">
        <button
          onClick={() => router.back()}
          aria-label="返回"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-card transition active:scale-95"
        >
          <ChevronLeft size={22} className="text-ink" />
        </button>
      </div>

      {/* 商品大图 */}
      <div className="relative aspect-square w-full overflow-hidden bg-blush">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover"
        />
        {product.hot && (
          <span className="absolute left-4 top-4 rounded-full bg-accent px-3 py-1 text-[10px] font-bold text-white shadow-card">
            热门
          </span>
        )}
      </div>

      {/* 商品信息卡 */}
      <div className="rounded-t-3xl bg-cream px-4 pb-4 pt-5 -mt-4 relative z-10">
        <div className="flex items-end gap-2">
          <span className="text-2xl font-bold text-accent">¥{product.price}</span>
          {product.originalPrice && (
            <span className="mb-1 text-sm text-muted line-through">
              ¥{product.originalPrice}
            </span>
          )}
        </div>
        <h1 className="mt-1.5 text-lg font-bold text-ink">{product.name}</h1>
        {product.nameEn && (
          <p className="text-xs text-muted">{product.nameEn}</p>
        )}
        <div className="mt-2 flex items-center gap-3 text-xs text-muted">
          <span className="inline-flex items-center gap-1">
            <Star size={12} className="fill-accent text-accent" />
            {product.rating}
          </span>
          <span>已售 {product.sales}</span>
          <span className="inline-flex items-center gap-1">
            <MapPin size={12} />
            {product.distanceKm}km
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock size={12} />
            {product.etaMin}分钟
          </span>
        </div>
      </div>

      {/* 规格选择 */}
      <div className="px-4 pb-4">
        <h2 className="mb-2 text-sm font-bold text-ink">规格</h2>
        <div className="flex flex-wrap gap-2">
          {product.specs.map((s) => (
            <button
              key={s}
              onClick={() => setSpec(s)}
              className={`rounded-full px-4 py-2 text-xs font-medium transition active:scale-95 ${
                spec === s
                  ? "bg-accent text-white shadow-card"
                  : "bg-white text-ink shadow-card"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* 商品描述 */}
      <div className="px-4 pb-4">
        <h2 className="mb-2 text-sm font-bold text-ink">商品详情</h2>
        <p className="text-sm leading-relaxed text-muted">{product.description}</p>
      </div>

      {/* 评价 */}
      {product.reviews.length > 0 && (
        <div className="px-4 pb-4">
          <h2 className="mb-2 text-sm font-bold text-ink">
            评价 ({product.reviews.length})
          </h2>
          <div className="flex flex-col gap-3">
            {product.reviews.map((r) => (
              <div key={r.id} className="rounded-2xl bg-white p-3.5 shadow-card">
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-xs font-semibold text-ink">{r.nickname}</span>
                  <span className="inline-flex items-center gap-0.5">
                    {Array.from({ length: r.stars }).map((_, i) => (
                      <Star key={i} size={10} className="fill-accent text-accent" />
                    ))}
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-muted">{r.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 底部加购栏 */}
      <div className="fixed inset-x-0 bottom-0 z-40 mx-auto flex max-w-[430px] items-center gap-3 border-t border-blush/50 bg-white/95 px-4 py-3 backdrop-blur-md">
        <Link
          href="/cart"
          className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-cream shadow-card"
        >
          <ShoppingCart size={22} className="text-ink" />
        </Link>
        <button
          onClick={handleAdd}
          className={`flex flex-1 items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-bold text-white shadow-card transition active:scale-[0.98] ${
            added ? "bg-accent-dark" : "bg-accent"
          }`}
        >
          {added ? (
            <>
              <Check size={18} />
              已加入购物车
            </>
          ) : (
            <>
              <Plus size={18} />
              加入购物车
            </>
          )}
        </button>
      </div>
    </div>
  );
}
