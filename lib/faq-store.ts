export interface HomeFaq {
  id: string;
  q: string;
  a: string;
}

const KEY = "gnc_home_faqs_v1";

const DEFAULT_FAQS: HomeFaq[] = [
  {
    id: "f1",
    q: "这里的商品真的不会到吗？",
    a: "是的。things never come 是一个购物模拟器，所有订单都不会真实发货。",
  },
  {
    id: "f2",
    q: "需要付款吗？",
    a: "不需要。结算流程只是模拟，不会扣除任何真实资金。",
  },
  {
    id: "f3",
    q: "为什么我要用这个？",
    a: "适合想过购物瘾又担心剁手的用户，体验购物快感而不用付出代价。",
  },
  {
    id: "f4",
    q: "可以添加自己的商品吗？",
    a: "可以。进入管理后台即可添加、编辑或删除商品与分类。",
  },
];

function read(): HomeFaq[] {
  if (typeof window === "undefined") return DEFAULT_FAQS;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw === null) return DEFAULT_FAQS;
    const list = JSON.parse(raw) as HomeFaq[];
    return Array.isArray(list) ? list : DEFAULT_FAQS;
  } catch {
    return DEFAULT_FAQS;
  }
}

function write(list: HomeFaq[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY, JSON.stringify(list));
  }
}

export function getFaqs(): HomeFaq[] {
  return read();
}

export function addFaq(q: string, a: string): HomeFaq {
  const list = read();
  const faq: HomeFaq = {
    id: `faq_${Date.now()}`,
    q: q.trim(),
    a: a.trim(),
  };
  list.push(faq);
  write(list);
  return faq;
}

export function updateFaq(
  id: string,
  patch: Partial<Pick<HomeFaq, "q" | "a">>
): void {
  const list = read();
  const idx = list.findIndex((f) => f.id === id);
  if (idx < 0) return;
  list[idx] = {
    ...list[idx],
    ...(patch.q !== undefined ? { q: patch.q.trim() } : {}),
    ...(patch.a !== undefined ? { a: patch.a.trim() } : {}),
  };
  write(list);
}

export function deleteFaq(id: string): void {
  const list = read().filter((f) => f.id !== id);
  write(list);
}

export function resetFaqs(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(KEY);
  }
}
