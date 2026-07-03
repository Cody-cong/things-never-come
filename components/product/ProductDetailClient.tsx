"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShoppingCart, Plus, Check, ChevronLeft } from "lucide-react";
import { getProductById } from "@/lib/product-store";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/utils";
import ProductImage from "@/components/ProductImage";
import type { Product } from "@/lib/types";

interface ProductDetailClientProps {
  id: string;
}

export default function ProductDetailClient({ id }: ProductDetailClientProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [spec, setSpec] = useState("");
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const p = getProductById(id);
    setProduct(p ?? null);
    if (p) setSpec(p.specs[0] ?? "");
    setLoading(false);
  }, [id]);

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
      <div className="mx-auto max-w-site px-6 py-8 md:px-8">
        <div className="skeleton h-10 w-10 rounded-full" />
        <div className="mt-6 grid gap-8 lg:grid-cols-2">
          <div className="skeleton aspect-square w-full rounded-2xl" />
          <div className="flex flex-col gap-4">
            <div className="skeleton h-8 w-2/3 rounded" />
            <div className="skeleton h-10 w-32 rounded-full" />
            <div className="skeleton h-24 w-full rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-site flex-col items-center justify-center px-6 text-center md:px-8">
        <p className="text-lg font-medium text-ink">商品不见了</p>
        <p className="mt-2 text-sm text-muted">它可能跟着包裹一起消失了</p>
        <button
          onClick={() => router.replace("/")}
          className="mt-6 rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-dark"
        >
          回首页
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-site px-6 py-8 md:px-8">
      <button
        onClick={() => router.back()}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-card transition hover:shadow-soft"
        aria-label="返回"
      >
        <ChevronLeft size={20} className="text-ink" />
      </button>

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-cream">
          <ProductImage
            src={product.image}
            alt={product.name}
          />
          {product.hot && (
            <span className="absolute left-4 top-4 rounded-full bg-accent px-3 py-1 text-xs font-bold text-white">
              热门
            </span>
          )}
        </div>

        <div className="flex flex-col">
          <div className="flex items-end gap-3">
            <span className="text-3xl font-bold text-accent">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="mb-1 text-base text-muted line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          <h1 className="mt-3 text-2xl font-bold text-ink md:text-3xl">{product.name}</h1>
          {product.nameEn && (
            <p className="mt-1 text-sm text-muted">{product.nameEn}</p>
          )}
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted">
            <span>已售 {product.sales}</span>
          </div>

          <div className="mt-6">
            <h2 className="mb-3 text-sm font-bold text-ink">规格</h2>
            <div className="flex flex-wrap gap-2">
              {product.specs.map((s) => (
                <button
                  key={s}
                  onClick={() => setSpec(s)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    spec === s
                      ? "bg-accent text-white"
                      : "bg-white text-ink shadow-card hover:bg-cream"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <h2 className="mb-2 text-sm font-bold text-ink">商品详情</h2>
            <p className="text-sm leading-relaxed text-muted">{product.description}</p>
          </div>

          <div className="mt-8 flex items-center gap-3">
            <Link
              href="/cart"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-card transition hover:shadow-soft"
            >
              <ShoppingCart size={20} className="text-ink" />
            </Link>
            <button
              onClick={handleAdd}
              className={`flex flex-1 items-center justify-center gap-2 rounded-full py-3 text-sm font-bold text-white transition ${
                added ? "bg-accent-dark" : "bg-accent hover:bg-accent-dark"
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
      </div>

    </div>
  );
}
