"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import type { Product } from "@/lib/types";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/utils";
import ProductImage from "./ProductImage";

const LimitAlertModal = dynamic(() => import("./LimitAlertModal"), {
  ssr: false,
});

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const { items, addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [limitAlert, setLimitAlert] = useState<{ show: boolean; message: string }>({
    show: false,
    message: "",
  });

  const spec = product.specs[0] ?? "默认";

  function adjust(delta: number) {
    setQuantity((q) => Math.max(1, q + delta));
  }

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const max = product.maxQuantity;
    if (max && max > 0) {
      const currentQty = items
        .filter((i) => i.productId === product.id)
        .reduce((sum, i) => sum + i.quantity, 0);
      if (currentQty + quantity > max) {
        setLimitAlert({
          show: true,
          message: product.limitMessage?.trim() || `该商品每人限购 ${max} 件`,
        });
        return;
      }
    }
    addItem({
      productId: product.id,
      shopId: product.shopId,
      name: product.name,
      price: product.price,
      image: product.image,
      spec,
      quantity,
    });
    setQuantity(1);
  }

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-card transition hover:shadow-soft">
      <Link href={`/product/?id=${product.id}`} className="block">
        <div className="relative aspect-square w-full overflow-hidden bg-cream">
          <ProductImage
            src={product.image}
            alt={product.name}
            lazy={!priority}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </Link>
      <div className="flex flex-col gap-1.5 p-4">
        <Link href={`/product/?id=${product.id}`} className="block">
          <p className="line-clamp-1 text-[15px] font-semibold text-ink transition group-hover:text-accent">
            {product.name}
          </p>
          <p className="line-clamp-1 text-xs text-muted">{product.nameEn}</p>
        </Link>
        <span className="text-base font-bold text-accent">
          {formatPrice(product.price)}
        </span>

        <div className="mt-1 flex items-center gap-2">
          <div className="flex items-center rounded-full border border-cream bg-cream/50">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                adjust(-1);
              }}
              className="flex h-7 w-7 items-center justify-center rounded-full text-muted transition hover:bg-white hover:text-ink"
              aria-label="减少数量"
            >
              <Minus size={14} />
            </button>
            <input
              type="number"
              inputMode="numeric"
              min={1}
              value={quantity}
              onChange={(e) => {
                const v = parseInt(e.target.value, 10);
                setQuantity(isNaN(v) || v < 1 ? 1 : v);
              }}
              className="w-7 bg-transparent text-center text-sm font-medium text-ink outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              aria-label="购买数量"
            />
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                adjust(1);
              }}
              className="flex h-7 w-7 items-center justify-center rounded-full text-muted transition hover:bg-white hover:text-ink"
              aria-label="增加数量"
            >
              <Plus size={14} />
            </button>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-accent py-2 text-sm font-medium text-white transition hover:bg-accent-dark active:scale-95"
            aria-label="加入购物车"
          >
            <ShoppingCart size={14} />
            <span className="hidden sm:inline">加入购物车</span>
          </button>
        </div>
      </div>

      {limitAlert.show && (
        <LimitAlertModal
          message={limitAlert.message}
          onClose={() => setLimitAlert({ show: false, message: "" })}
        />
      )}
    </div>
  );
}
