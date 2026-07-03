/**
 * 统一价格格式化：USD，保留两位小数。
 * 例如 299 -> "$299.00"
 */
export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}
