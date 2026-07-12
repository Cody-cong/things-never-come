import type { Order } from "./types";
import { formatPrice } from "./utils";

const API_KEY = process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY ?? "";
const API_URL = "https://api.deepseek.com/chat/completions";
const MODEL = "deepseek-chat";

function buildPrompt(order: Order): string {
  const items = order.items
    .map(
      (i) =>
        `- ${i.name}，单价 ${formatPrice(i.price)}，数量 ${i.quantity}`
    )
    .join("\n");

  return `你是一家“不可能商店（Impossible Store）”的订单审核员。

用户刚刚完成了一笔订单。

你的任务是根据订单内容，生成一段有趣、幽默、一本正经胡说八道的订单评价。

要求：
1. 回复长度控制在 50~120 字。
2. 中文输出。
3. 可以适当夸奖用户，但不要过度吹捧。
4. 可以提及商品之间有趣的组合效果。
5. 不要重复商品介绍。
6. 每次回复风格尽量不同，不要套模板。

订单总金额：${formatPrice(order.totalAmount)}
商品清单：
${items}`;
}

export async function generateOrderReview(order: Order): Promise<string> {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: "system",
            content:
              "你是一家“不可能商店（Impossible Store）”的订单审核员，风格幽默、会一本正经地胡说八道。", 
          },
          { role: "user", content: buildPrompt(order) },
        ],
        temperature: 0.9,
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`DeepSeek API ${response.status}: ${text}`);
    }

    const data = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = data.choices?.[0]?.message?.content?.trim();
    if (!content) throw new Error("DeepSeek 返回空内容");
    return content;
  } catch (err) {
    console.error("[ai-review] 生成评价失败", err);
    return getFallbackReview(order);
  }
}

function getFallbackReview(order: Order): string {
  const total = order.totalAmount;
  const qty = order.items.reduce((s, i) => s + i.quantity, 0);

  if (total >= 1_000_000_000_000) {
    return "富可敌国！这一单下去，马斯克都得找你借钱喝咖啡。建议直接收购网站，以后全场免费。";
  }
  if (total >= 100_000_000) {
    return "出手就是百亿级，老板豪气！快递小哥看到金额，可能会亲自开直升机送货。";
  }
  if (qty >= 20) {
    return "买这么多，是打算开超市吗？购物车已经累到想辞职了。";
  }
  if (order.items.length >= 5) {
    return "雨露均沾式购物，每个商品都别想逃。钱包：我哭了；商家：我笑了。";
  }
  return "精挑细选的一单，买得不多但买得很稳。距离人生巅峰，还差一个「确认收货」。";
}
