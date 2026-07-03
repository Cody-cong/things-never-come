import { Shop, Address, ImageSize } from "./types";

const IMAGE_BASE =
  "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image";

/** Build a generated-image URL for a given SDXL prompt + size. */
export function buildImageUrl(
  prompt: string,
  size: ImageSize = "square"
): string {
  return `${IMAGE_BASE}?prompt=${encodeURIComponent(prompt)}&image_size=${size}`;
}

export const categories = ["数码", "服饰", "家居", "美妆", "食品", "图书"];

/** 当前模拟用户（avatar 留空，前端用图标代替） */
export const mockUser = {
  nickname: "Zara",
  avatar: "",
};

const NICKNAME_KEY = "gnickname";

export function getNickname(): string {
  if (typeof window === "undefined") return mockUser.nickname;
  return localStorage.getItem(NICKNAME_KEY) || mockUser.nickname;
}

export function setNickname(name: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(NICKNAME_KEY, name.trim() || mockUser.nickname);
}

/** shopId → 分类映射，用于给商品补 category 字段 */
export const shopIdToCategory: Record<string, string> = {
  s1: "数码",
  s2: "服饰",
  s3: "家居",
  s4: "美妆",
  s5: "食品",
  s6: "图书",
};

export const defaultAddress: Address = {
  name: "张三",
  phone: "138****8888",
  address: "上海市浦东新区世纪大道 1 号虚拟大厦 28 楼",
};

/** 首页默认位置，当无法获取用户真实区域时使用 */
export const DEFAULT_LOCATION = "trae 创意小镇";

type ShopSeed = Omit<Shop, "coverImage">;

const shopSeed: ShopSeed[] = [
  {
    id: "s1",
    name: "极客数码舱",
    category: "数码",
    rating: 4.8,
    sales: 12300,
    description: "前沿数码好物，科技改变生活（但不负责送到）",
    imagePrompt:
      "a modern tech gadget store interior with headphones smartphones and laptops on display shelves, warm lighting, wide shot",
  },
  {
    id: "s2",
    name: "慵懒衣橱",
    category: "服饰",
    rating: 4.6,
    sales: 9800,
    description: "松弛感穿搭，舒服到自己都忘了下单",
    imagePrompt:
      "a cozy minimalist fashion boutique with neatly folded cotton clothes on wooden shelves, soft daylight",
  },
  {
    id: "s3",
    name: "治愈家居铺",
    category: "家居",
    rating: 4.9,
    sales: 7600,
    description: "把家布置成想赖着不动的样子",
    imagePrompt:
      "a cozy scandinavian living room corner with candles pillows and a ceramic mug on a wooden table, warm tone",
  },
  {
    id: "s4",
    name: "素颜美学馆",
    category: "美妆",
    rating: 4.7,
    sales: 15200,
    description: "less is more，但 more 的部分在路上",
    imagePrompt:
      "an elegant cosmetics store display with skincare bottles and lipsticks on a marble counter, soft pink lighting",
  },
  {
    id: "s5",
    name: "深夜食验室",
    category: "食品",
    rating: 4.8,
    sales: 18900,
    description: "深夜放毒专柜，饥饿时请勿下单",
    imagePrompt:
      "a gourmet food shop with coffee beans chocolate and nuts in glass jars on wooden shelves, warm cozy lighting",
  },
  {
    id: "s6",
    name: "纸页书店",
    category: "图书",
    rating: 4.9,
    sales: 4300,
    description: "纸质书的浪漫，是永远不会到的快递",
    imagePrompt:
      "a cozy independent bookstore with warm reading lamps and books stacked on wooden shelves, atmospheric",
  },
];

export const shops: Shop[] = shopSeed.map((s) => ({
  ...s,
  coverImage: buildImageUrl(s.imagePrompt, "landscape_16_9"),
}));

export function getShopById(id: string): Shop | undefined {
  return shops.find((s) => s.id === id);
}
