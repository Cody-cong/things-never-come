import { Product } from "./types";
import { buildImageUrl } from "./mock-data";

type ProductSeed = Omit<Product, "image">;

const seeds: ProductSeed[] = [
  /* ---------- s1 极客数码舱 ---------- */
  {
    id: "p1-1", shopId: "s1", name: "无线蓝牙耳机", nameEn: "Wireless Bluetooth Earphones", price: 299, originalPrice: 499,
    specs: ["午夜黑", "云朵白"], sales: 2341,
    imagePrompt: "wireless bluetooth headphones in black on a clean white background, minimalist product photography",
    category: "数码", hot: true,
    description: "这款耳机音质纯净得像你对到货的期待——纯粹而遥远。下单后它将踏上漫长的旅程，也许永远不会抵达，但它带来的购物快感已经送达。",
  },
  {
    id: "p1-2", shopId: "s1", name: "智能运动手表", nameEn: "Smart Sports Watch", price: 599, originalPrice: 899,
    specs: ["46mm"], sales: 1820,
    imagePrompt: "a smart sports watch with black sport band on white background, product photography",
    category: "数码", hot: false,
    description: "能测心率、能记步数，唯独测不到包裹的位置。戴上它，你会发现自己每天为等快递而心率飙升。",
  },
  {
    id: "p1-3", shopId: "s1", name: "机械键盘", nameEn: "Mechanical Keyboard", price: 389,
    specs: ["红轴", "茶轴"], sales: 980,
    imagePrompt: "a compact mechanical keyboard with white keycaps on white background, product photography",
    category: "数码", hot: false,
    description: "敲击手感一绝，每一声都在提醒你：包裹还在路上。买它，让自己在等待中至少能码出几句安慰。",
  },
  {
    id: "p1-4", shopId: "s1", name: "便携充电宝", nameEn: "Portable Power Bank", price: 129, originalPrice: 199,
    specs: ["10000mAh"], sales: 4102,
    imagePrompt: "a slim portable power bank in white on white background, minimalist product photography",
    category: "数码", hot: false,
    description: "10000mAh 的电量，足以撑到你放弃等货的那一天。它永远不会到，但你的电量焦虑会先到。",
  },
  {
    id: "p1-5", shopId: "s1", name: "手机稳定器", nameEn: "Smartphone Gimbal Stabilizer", price: 459,
    specs: ["标准版"], sales: 612,
    imagePrompt: "a smartphone gimbal stabilizer in gray on white background, product photography",
    category: "数码", hot: false,
    description: "防抖效果一流，唯独防不住物流的颠簸。稳定器很稳，物流很不稳，这就是生活的平衡。",
  },
  {
    id: "p1-6", shopId: "s1", name: "桌面蓝牙音箱", nameEn: "Desktop Bluetooth Speaker", price: 349, originalPrice: 599,
    specs: ["深空灰"], sales: 1330,
    imagePrompt: "a small desktop bluetooth speaker in dark gray on white background, product photography",
    category: "数码", hot: false,
    description: "低音浑厚，足以掩盖你叹息等货的声音。音箱没到，你的桌面已经空出一块给它了。",
  },

  /* ---------- s2 慵懒衣橱 ---------- */
  {
    id: "p2-1", shopId: "s2", name: "纯棉圆领T恤", nameEn: "Cotton Crewneck T-Shirt", price: 89, originalPrice: 159,
    specs: ["米白", "燕麦", "M", "L"], sales: 5600,
    imagePrompt: "a folded plain cotton t-shirt in beige on white background, minimalist product photography",
    category: "服饰", hot: true,
    description: "面料柔软到让你忘记下单这回事。等它到的过程中，你已经过了三个季节，但多巴胺已经送达。",
  },
  {
    id: "p2-2", shopId: "s2", name: "宽松直筒牛仔裤", nameEn: "Relaxed Straight Jeans", price: 199, originalPrice: 329,
    specs: ["浅蓝", "深蓝", "30", "32"], sales: 2200,
    imagePrompt: "a pair of folded light blue denim jeans on white background, product photography",
    category: "服饰", hot: false,
    description: "版型显瘦，等货的过程更显瘦。裤子还在路上，你的腰围已经先变化了一圈。",
  },
  {
    id: "p2-3", shopId: "s2", name: "针织开衫", nameEn: "Knit Cardigan", price: 159,
    specs: ["奶咖", "雾灰", "M"], sales: 1340,
    imagePrompt: "a folded knit cardigan in oat color on white background, cozy product photography",
    category: "服饰", hot: false,
    description: "软糯包裹感，连快递都懒得动。穿上它，你会觉得自己被温柔地困在等待里。",
  },
  {
    id: "p2-4", shopId: "s2", name: "帆布托特包", nameEn: "Canvas Tote Bag", price: 69, originalPrice: 99,
    specs: ["卡其"], sales: 3300,
    imagePrompt: "a canvas tote bag in khaki on white background, minimalist product photography",
    category: "服饰", hot: false,
    description: "容量大到能装下你所有的等待。环保到连塑料袋都不用——因为根本没发货。",
  },
  {
    id: "p2-5", shopId: "s2", name: "运动卫裤", nameEn: "Sweatpants", price: 139,
    specs: ["炭黑", "L"], sales: 1890,
    imagePrompt: "folded gray sweatpants on white background, minimalist product photography",
    category: "服饰", hot: false,
    description: "居家等快递的绝佳伴侣。舒服到你不想出门，正好，因为也没东西可收。",
  },
  {
    id: "p2-6", shopId: "s2", name: "渔夫帽", nameEn: "Bucket Hat", price: 49, originalPrice: 79,
    specs: ["米色"], sales: 2750,
    imagePrompt: "a beige bucket hat on white background, product photography",
    category: "服饰", hot: false,
    description: "遮阳效果好，可惜帽子没到时太阳已经下山。低调到连物流都查无此帽。",
  },

  /* ---------- s3 治愈家居铺 ---------- */
  {
    id: "p3-1", shopId: "s3", name: "香薰蜡烛", nameEn: "Scented Candle", price: 59, originalPrice: 89,
    specs: ["雪松", "白茶"], sales: 4100,
    imagePrompt: "a scented candle in a glass jar on white background, cozy product photography",
    category: "家居", hot: true,
    description: "点燃它，等待也变得仪式感十足。蜡烛没到，你已经用手机照明看完了三本书。",
  },
  {
    id: "p3-2", shopId: "s3", name: "北欧抱枕套", nameEn: "Nordic Pillow Cover", price: 39,
    specs: ["45x45cm"], sales: 2600,
    imagePrompt: "a nordic style pillow cover in muted tones on white background, product photography",
    category: "家居", hot: false,
    description: "颜值在线，物流离线。配色温柔得像老板的承诺一样美好而虚幻。",
  },
  {
    id: "p3-3", shopId: "s3", name: "陶瓷马克杯", nameEn: "Ceramic Mug", price: 45, originalPrice: 69,
    specs: ["奶白"], sales: 5200,
    imagePrompt: "a ceramic mug in matte cream color on white background, minimalist product photography",
    category: "家居", hot: false,
    description: "手感温润，物流冰冷。杯子没到，你已经喝干了三个月的一次性杯。",
  },
  {
    id: "p3-4", shopId: "s3", name: "棉麻桌布", nameEn: "Cotton Linen Tablecloth", price: 79,
    specs: ["140x70cm"], sales: 980,
    imagePrompt: "a folded linen table runner in natural color on white background, product photography",
    category: "家居", hot: false,
    description: "质感细腻，桌子等它等得积了灰。素雅到物流都查无此布。",
  },
  {
    id: "p3-5", shopId: "s3", name: "床头小夜灯", nameEn: "Bedside Night Lamp", price: 99, originalPrice: 149,
    specs: ["暖光"], sales: 1870,
    imagePrompt: "a small warm white bedside night lamp on white background, cozy product photography",
    category: "家居", hot: false,
    description: "暖光治愈，可惜灯没到时你已经学会在黑暗中坚强。温馨的灯，冷酷的物流。",
  },
  {
    id: "p3-6", shopId: "s3", name: "实木相框", nameEn: "Solid Wood Photo Frame", price: 29,
    specs: ["A4"], sales: 3400,
    imagePrompt: "a natural wood photo frame on white background, minimalist product photography",
    category: "家居", hot: false,
    description: "极简设计，连包裹也简化没了。相框没到，回忆都凉了。",
  },

  /* ---------- s4 素颜美学馆 ---------- */
  {
    id: "p4-1", shopId: "s4", name: "保湿面霜", nameEn: "Moisturizing Face Cream", price: 159, originalPrice: 239,
    specs: ["50ml"], sales: 6800,
    imagePrompt: "a white skincare cream jar on white background, clean product photography",
    category: "美妆", hot: true,
    description: "保湿一流，脸却没等到货先干成沙漠。成分透明，物流成分成谜。",
  },
  {
    id: "p4-2", shopId: "s4", name: "哑光口红", nameEn: "Matte Lipstick", price: 79, originalPrice: 119,
    specs: ["豆沙", "正红"], sales: 8900,
    imagePrompt: "a matte lipstick tube in dusty rose color on white background, product photography",
    category: "美妆", hot: false,
    description: "颜色美到等得嘴唇都褪色。显白，物流黑到查不到。",
  },
  {
    id: "p4-3", shopId: "s4", name: "温和卸妆水", nameEn: "Gentle Micellar Water", price: 69,
    specs: ["500ml"], sales: 4300,
    imagePrompt: "a bottle of clear micellar cleansing water on white background, product photography",
    category: "美妆", hot: false,
    description: "温和卸妆，包裹卸得没影。等货等到你都素颜出门了。",
  },
  {
    id: "p4-4", shopId: "s4", name: "手工精油皂", nameEn: "Handmade Essential Oil Soap", price: 39, originalPrice: 59,
    specs: ["薰衣草"], sales: 5500,
    imagePrompt: "a handmade lavender soap bar on white background, product photography",
    category: "美妆", hot: false,
    description: "香味治愈，等得身上都腌入味了。泡沫绵密，物流像泡沫一样虚。",
  },
  {
    id: "p4-5", shopId: "s4", name: "精华安瓶", nameEn: "Serum Ampoule", price: 199, originalPrice: 329,
    specs: ["30ml"], sales: 2100,
    imagePrompt: "a glass serum ampoule bottle on white background, premium product photography",
    category: "美妆", hot: false,
    description: "急救好物，等它等到你更需要急救。价格贵妇，物流乞丐。",
  },
  {
    id: "p4-6", shopId: "s4", name: "定妆喷雾", nameEn: "Setting Spray", price: 89,
    specs: ["100ml"], sales: 3600,
    imagePrompt: "a setting spray bottle on white background, product photography",
    category: "美妆", hot: false,
    description: "定妆持久，包裹持久不到。喷雾细腻，物流粗犷。",
  },

  /* ---------- s5 深夜食验室 ---------- */
  {
    id: "p5-1", shopId: "s5", name: "手冲咖啡豆", nameEn: "Pour-Over Coffee Beans", price: 89, originalPrice: 129,
    specs: ["中度烘焙", "250g"], sales: 7200,
    imagePrompt: "a bag of roasted coffee beans on white background, product photography",
    category: "食品", hot: true,
    description: "香气浓郁，等豆等到你戒了咖啡。风味复杂，物流更复杂。",
  },
  {
    id: "p5-2", shopId: "s5", name: "黑巧克力礼盒", nameEn: "Dark Chocolate Gift Box", price: 69,
    specs: ["9颗装"], sales: 4900,
    imagePrompt: "a box of dark chocolate pieces on white background, product photography",
    category: "食品", hot: false,
    description: "微苦高级，等货等得更苦。深夜下单，深夜都没等到。",
  },
  {
    id: "p5-3", shopId: "s5", name: "日式抹茶粉", nameEn: "Japanese Matcha Powder", price: 59, originalPrice: 89,
    specs: ["30g"], sales: 3300,
    imagePrompt: "a bowl of green matcha powder on white background, product photography",
    category: "食品", hot: false,
    description: "颜色翠绿，物流黄了。做拿铁绝，等得你喝了三个月速溶。",
  },
  {
    id: "p5-4", shopId: "s5", name: "混合每日坚果", nameEn: "Mixed Daily Nuts", price: 49, originalPrice: 79,
    specs: ["30袋装"], sales: 8800,
    imagePrompt: "a bag of mixed nuts and dried fruits on white background, product photography",
    category: "食品", hot: false,
    description: "每日坚果，等货等到变成每年坚果。蛋白足，耐心更足。",
  },
  {
    id: "p5-5", shopId: "s5", name: "蜂蜜柚子茶", nameEn: "Honey Yuzu Tea", price: 39,
    specs: ["500g"], sales: 2600,
    imagePrompt: "a jar of honey yuzu tea on white background, product photography",
    category: "食品", hot: false,
    description: "酸甜可口，物流酸得掉牙。冬天下单，夏天到也不嫌晚（没到）。",
  },
  {
    id: "p5-6", shopId: "s5", name: "香辣牛肉干", nameEn: "Spicy Beef Jerky", price: 45, originalPrice: 69,
    specs: ["200g"], sales: 6100,
    imagePrompt: "spicy beef jerky strips on white background, product photography",
    category: "食品", hot: false,
    description: "越嚼越香，物流越等越长。下酒绝配，酒喝完货没到。",
  },

  /* ---------- s6 纸页书店 ---------- */
  {
    id: "p6-1", shopId: "s6", name: "《孤独的算法》", nameEn: "The Lonely Algorithm", price: 48,
    specs: ["平装"], sales: 1200,
    imagePrompt: "a novel book cover on white background, minimalist product photography",
    category: "图书", hot: true,
    description: "文笔好到等书等到你自己写了一本。孤独的算法，孤独的物流。",
  },
  {
    id: "p6-2", shopId: "s6", name: "《深夜食堂手记》", nameEn: "Midnight Diner Notes", price: 42,
    specs: ["平装"], sales: 890,
    imagePrompt: "an essay collection book on white background, product photography",
    category: "图书", hot: false,
    description: "看饿了，书还没到先饿了三个月。文字温暖，物流冰冷。",
  },
  {
    id: "p6-3", shopId: "s6", name: "绘本《云朵邮局》", nameEn: "Picture Book: Cloud Post Office", price: 36,
    specs: ["精装"], sales: 2100,
    imagePrompt: "a children picture book on white background, product photography",
    category: "图书", hot: false,
    description: "画风治愈，快递从不治愈。云朵会飘，包裹不会。",
  },
  {
    id: "p6-4", shopId: "s6", name: "城市摄影画册", nameEn: "City Photography Album", price: 88, originalPrice: 128,
    specs: ["精装"], sales: 540,
    imagePrompt: "a photography art book on white background, product photography",
    category: "图书", hot: false,
    description: "画质震撼，物流震撼地慢。看完想出门，出门回来货还没到。",
  },
  {
    id: "p6-5", shopId: "s6", name: "诗集《雨的形状》", nameEn: "Poetry: The Shape of Rain", price: 32,
    specs: ["平装"], sales: 760,
    imagePrompt: "a poetry book on white background, minimalist product photography",
    category: "图书", hot: false,
    description: "句子很美，物流很丧。雨都停了，书还在云上。",
  },
  {
    id: "p6-6", shopId: "s6", name: "设计灵感手册", nameEn: "Design Inspiration Handbook", price: 58,
    specs: ["平装"], sales: 1020,
    imagePrompt: "a design inspiration handbook on white background, product photography",
    category: "图书", hot: false,
    description: "灵感爆棚，等货等到灵感枯竭。创意满满，物流空空。",
  },
];

export const products: Product[] = seeds.map((p) => ({
  ...p,
  image: buildImageUrl(p.imagePrompt, "square"),
}));
