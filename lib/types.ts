export type ImageSize =
  | "square_hd"
  | "square"
  | "portrait_4_3"
  | "landscape_4_3"
  | "landscape_16_9";

export interface Review {
  id: string;
  nickname: string;
  stars: number;
  content: string;
}

/**
 * Shop 接口保留以兼容 mock-data 导出，后续页面不再使用。
 * 新的数据结构以 Product.category 为分类主键。
 */
export interface Shop {
  id: string;
  name: string;
  coverImage: string;
  category: string;
  rating: number;
  sales: number;
  description: string;
  imagePrompt: string;
}

export interface Product {
  id: string;
  shopId: string; // 保留以兼容 CartItem，不再用于导航
  name: string;
  nameEn?: string; // 英文名称（管理端可填写，商品详情页显示在中文名下一行）
  image: string;
  price: number;
  originalPrice?: number;
  category: string; // 分类主键（数码/服饰/家居/美妆/食品/图书）
  hot: boolean; // 是否热门商品
  description: string; // 商品详情段落（幽默呼应主题）
  distanceKm: number; // 距离（公里）
  etaMin: number; // 预计送达（分钟）
  specs: string[];
  rating: number;
  sales: number;
  reviews: Review[];
  imagePrompt: string;
}

export interface CartItem {
  productId: string;
  shopId: string;
  name: string;
  price: number;
  image: string;
  spec: string;
  quantity: number;
}

export type OrderStatus = "pending" | "shipped" | "delivering" | "done";

export interface Order {
  id: string;
  items: CartItem[];
  totalAmount: number;
  createdAt: number;
  status: OrderStatus;
}

export interface Address {
  name: string;
  phone: string;
  address: string;
}
