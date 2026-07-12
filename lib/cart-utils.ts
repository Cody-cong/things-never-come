import type { Product } from "./types";
import type { CartItem } from "./types";

export interface LimitCheckResult {
  allowed: boolean;
  message?: string;
}

/**
 * 检查本次购买是否会超出商品限购。
 * @param product 目标商品
 * @param quantityToAdd 本次要加入/增加的数量
 * @param cartItems 当前购物车内容
 */
export function checkPurchaseLimit(
  product: Product,
  quantityToAdd: number,
  cartItems: CartItem[]
): LimitCheckResult {
  const max = product.maxQuantity;
  if (!max || max <= 0) return { allowed: true };

  const currentQty = cartItems
    .filter((i) => i.productId === product.id)
    .reduce((sum, i) => sum + i.quantity, 0);

  if (currentQty + quantityToAdd > max) {
    return {
      allowed: false,
      message: product.limitMessage?.trim() || `该商品每人限购 ${max} 件`,
    };
  }
  return { allowed: true };
}

/**
 * 从源元素飞向购物车图标的动画。
 * @param sourceEl 触发按钮等源 DOM 元素
 * @param quantity 要显示的数量
 * @param options.targetId 目标元素 id，默认 "cart-target"
 */
export function flyToCart(
  sourceEl: HTMLElement | null,
  quantity: number,
  options?: { targetId?: string }
): void {
  const targetId = options?.targetId ?? "cart-target";
  const target = document.getElementById(targetId);
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
