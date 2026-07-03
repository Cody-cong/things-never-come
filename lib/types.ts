export type ImageSize =
  | "square_hd"
  | "square"
  | "portrait_4_3"
  | "landscape_4_3"
  | "landscape_16_9";

/**
 * 店铺概念已下线，接口保留仅作类型兼容。
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
  specs: string[];
  sales: number;
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

export interface Order {
  id: string;
  items: CartItem[];
  totalAmount: number;
  createdAt: number;
  status: "pending";
}

