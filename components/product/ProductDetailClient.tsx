"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShoppingCart, Plus, Minus, Check, ChevronLeft } from "lucide-react";
import { getProductById } from "@/lib/product-store";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/utils";
import dynamic from "next/dynamic";
import ProductImage from "@/components/ProductImage";
import RippleButton from "@/components/RippleButton";
import type { Product } from "@/lib/types";

const LimitAlertModal = dynamic(() => import("@/components/LimitAlertModal"), {
  ssr: false,
});

function flyToCart(sourceEl: HTMLElement | null, quantity: number) {
  const target = document.getElementById("cart-target");
  if (!target || !sourceEl) return;

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

export default function ProductDetailClient() {
  const router = useRouter();
  const { items, addItem } = useCart();
  const [id, setId] = useState("");
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [spec, setSpec] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [limitAlert, setLimitAlert] = useState<{ show: boolean; message: string }>({
    show: false,
    message: "",
  });
  const addBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const productId = new URLSearchParams(window.location.search).get("id") ?? "";
    setId(productId);
    async function load() {
      const p = await getProductById(productId);
      setProduct(p ?? null);
      if (p) setSpec(p.specs[0] ?? "");
      setLoading(false);
    }
    load();
  }, []);

  const handleAdd = () => {
    if (!product) return;
    const max = product.maxQuantity;
    if (max && max > 0) {
      const currentQty = items
        .filter((i) => i.productId === product.id)
        .reduce((sum, i) => sum + i.quantity, 0);
      if (currentQty + quantity > max) {
        setLimitAlert({
          show: true,
          message:
            product.limitMessage?.trim() || `该商品每人限购 ${max} 件`,
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
    setAdded(true);
    setQuantity(1);
    flyToCart(addBtnRef.current, quantity);
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
        className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-card transition hover:shadow-soft press-spring"
        aria-label="返回"
      >
        <ChevronLeft size={20} className="text-ink" />
      </button>

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-cream">
          <ProductImage
            src={product.image}
            alt={product.name}
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
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
          <p className="mt-1 text-sm text-muted">{product.nameEn}</p>
          <div className="mt-6">
            <h2 className="mb-3 text-sm font-bold text-ink">规格</h2>
            <div
              className="flex flex-wrap gap-2"
              role="radiogroup"
              aria-label="商品规格"
            >
              {product.specs.map((s) => (
                <button
                  key={s}
                  onClick={() => setSpec(s)}
                  role="radio"
                  aria-checked={spec === s}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition press-spring ${
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
            <h2 className="mb-3 text-sm font-bold text-ink">数量</h2>
            <div
              className="inline-flex items-center gap-1 rounded-full bg-cream px-1 py-0.5"
              role="group"
              aria-label="购买数量"
            >
              <RippleButton
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                aria-label="减少数量"
                rippleColor="rgba(217, 83, 79, 0.18)"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-ink shadow-sm transition hover:bg-cream press-spring disabled:opacity-30"
              >
                <Minus size={16} />
              </RippleButton>
              <input
                type="text"
                inputMode="numeric"
                value={quantity}
                onChange={(e) => {
                  const v = parseInt(e.target.value.replace(/\D/g, ""), 10);
                  setQuantity(isNaN(v) || v < 1 ? 1 : v);
                }}
                className="w-8 bg-transparent text-center text-sm font-bold text-ink outline-none"
                aria-label="购买数量"
              />
              <RippleButton
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="增加数量"
                rippleColor="rgba(217, 83, 79, 0.18)"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-ink shadow-sm transition hover:bg-cream press-spring"
              >
                <Plus size={16} />
              </RippleButton>
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
            <RippleButton
              ref={addBtnRef}
              onClick={handleAdd}
              disabled={added}
              className={`flex flex-1 items-center justify-center gap-2 rounded-full py-3 text-sm font-bold text-white transition press-spring ${
                added
                  ? "bg-accent-dark cursor-not-allowed"
                  : "bg-accent hover:bg-accent-dark"
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
            </RippleButton>
          </div>
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
