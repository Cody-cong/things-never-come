"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import type { Product } from "@/lib/types";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/utils";
import ProductImage from "./ProductImage";
import RippleButton from "./RippleButton";

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

  function flyToCart(sourceEl: HTMLElement) {
    const target = document.getElementById("cart-target");
    if (!target) return;

    const src = sourceEl.getBoundingClientRect();
    const dst = target.getBoundingClientRect();

    const el = document.createElement("div");
    el.className =
      "fixed z-[100] flex h-6 w-6 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white shadow-float pointer-events-none";
    el.textContent = `+${quantity}`;
    el.style.left = `${src.left + src.width / 2 - 12}px`;
    el.style.top = `${src.top + src.height / 2 - 12}px`;
    document.body.appendChild(el);

    const dx = dst.left + dst.width / 2 - (src.left + src.width / 2);
    const dy = dst.top + dst.height / 2 - (src.top + src.height / 2);

    el.animate(
      [
        { transform: "translate(0, 0) scale(1)", opacity: 1 },
        {
          transform: `translate(${dx * 0.55}px, ${dy * 0.55}px) scale(1.15)`,
          opacity: 1,
          offset: 0.5,
        },
        { transform: `translate(${dx}px, ${dy}px) scale(0.45)`, opacity: 0.4 },
      ],
      { duration: 680, easing: "cubic-bezier(0.2, 0.75, 0.25, 1)" }
    ).onfinish = () => el.remove();
  }

  function handleAdd(e: React.MouseEvent<HTMLButtonElement>) {
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
    flyToCart(e.currentTarget);
  }

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-card transition-all hover:-translate-y-1 hover:shadow-soft">
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
            <RippleButton
              type="button"
              onClick={(e) => {
                e.preventDefault();
                adjust(-1);
              }}
              rippleColor="rgba(217, 83, 79, 0.18)"
              className="flex h-7 w-7 items-center justify-center rounded-full text-muted transition hover:bg-white hover:text-ink press-spring"
              aria-label="减少数量"
            >
              <Minus size={14} />
            </RippleButton>
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
            <RippleButton
              type="button"
              onClick={(e) => {
                e.preventDefault();
                adjust(1);
              }}
              rippleColor="rgba(217, 83, 79, 0.18)"
              className="flex h-7 w-7 items-center justify-center rounded-full text-muted transition hover:bg-white hover:text-ink press-spring"
              aria-label="增加数量"
            >
              <Plus size={14} />
            </RippleButton>
          </div>
          <RippleButton
            type="button"
            onClick={handleAdd}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-accent py-2 text-sm font-medium text-white transition hover:bg-accent-dark press-spring"
            aria-label="加入购物车"
          >
            <ShoppingCart size={14} />
            <span className="hidden sm:inline">加入购物车</span>
          </RippleButton>
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
