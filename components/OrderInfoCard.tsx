import type { Order } from "@/lib/types";

interface OrderInfoCardProps {
  order: Order;
}

/**
 * Compact order summary card shared by /tracking and /done pages.
 * Shows order id, up to 2 item thumbnails with name & qty,
 * an "等N件商品" hint for overflow, and the total amount.
 */
export default function OrderInfoCard({ order }: OrderInfoCardProps) {
  const visibleItems = order.items.slice(0, 2);
  const extraCount = Math.max(order.items.length - visibleItems.length, 0);
  const totalQuantity = order.items.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="mx-4 mt-3 pastel-card p-3">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-xs font-medium text-muted">订单信息</h2>
        <span className="text-[10px] text-muted">单号 {order.id}</span>
      </div>

      <div className="flex flex-col gap-2">
        {visibleItems.map((item) => (
          <div
            key={`${item.productId}-${item.spec}`}
            className="flex items-center gap-2.5"
          >
            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-cream">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image}
                alt={item.name}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
            <p className="min-w-0 flex-1 line-clamp-1 text-xs font-medium text-ink">
              {item.name}
            </p>
            <span className="text-[10px] text-muted">x{item.quantity}</span>
          </div>
        ))}
      </div>

      {extraCount > 0 && (
        <p className="mt-2 text-[10px] text-muted">
          等{order.items.length}件商品 · 共{totalQuantity}个
        </p>
      )}

      <div className="mt-2 flex items-center justify-between border-t border-cream pt-2">
        <span className="text-xs text-muted">合计</span>
        <span className="text-sm font-bold text-accent">
          ${order.totalAmount.toFixed(2)}
        </span>
      </div>
    </div>
  );
}
