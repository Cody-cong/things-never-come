import { Product } from "./types";
import { buildImageUrl } from "./mock-data";

type ProductSeed = Omit<Product, "image">;

const seeds: ProductSeed[] = [
  /* ---------- s1 极客数码舱 ---------- */
  {
    id: "p1-1", shopId: "s1", name: "无线蓝牙耳机", nameEn: "Wireless Bluetooth Earphones", price: 299, originalPrice: 499,
    specs: ["午夜黑", "云朵白"], rating: 4.8, sales: 2341,
    imagePrompt: "wireless bluetooth headphones in black on a clean white background, minimalist product photography",
    category: "数码", hot: true, distanceKm: 12, etaMin: 45,
    description: "这款耳机音质纯净得像你对到货的期待——纯粹而遥远。下单后它将踏上漫长的旅程，也许永远不会抵达，但它带来的购物快感已经送达。",
    reviews: [
      { id: "r1-1-1", nickname: "数码控", stars: 5, content: "音质惊艳，物流慢得像树懒散步" },
      { id: "r1-1-2", nickname: "等待者", stars: 4, content: "包裹可能在太平洋漂流，先给好评" },
    ],
  },
  {
    id: "p1-2", shopId: "s1", name: "智能运动手表", nameEn: "Smart Sports Watch", price: 599, originalPrice: 899,
    specs: ["46mm"], rating: 4.7, sales: 1820,
    imagePrompt: "a smart sports watch with black sport band on white background, product photography",
    category: "数码", hot: false, distanceKm: 18, etaMin: 60,
    description: "能测心率、能记步数，唯独测不到包裹的位置。戴上它，你会发现自己每天为等快递而心率飙升。",
    reviews: [
      { id: "r1-2-1", nickname: "手腕党", stars: 5, content: "功能齐全，就是永远在发货中" },
      { id: "r1-2-2", nickname: "佛系买家", stars: 5, content: "等的过程让我学会了冥想" },
    ],
  },
  {
    id: "p1-3", shopId: "s1", name: "机械键盘", nameEn: "Mechanical Keyboard", price: 389,
    specs: ["红轴", "茶轴"], rating: 4.9, sales: 980,
    imagePrompt: "a compact mechanical keyboard with white keycaps on white background, product photography",
    category: "数码", hot: false, distanceKm: 15, etaMin: 55,
    description: "敲击手感一绝，每一声都在提醒你：包裹还在路上。买它，让自己在等待中至少能码出几句安慰。",
    reviews: [
      { id: "r1-3-1", nickname: "码字工", stars: 5, content: "手感一绝，键盘到了我手却没到" },
      { id: "r1-3-2", nickname: "夜猫", stars: 4, content: "快递小哥说他在另一个次元迷路了" },
    ],
  },
  {
    id: "p1-4", shopId: "s1", name: "便携充电宝", nameEn: "Portable Power Bank", price: 129, originalPrice: 199,
    specs: ["10000mAh"], rating: 4.6, sales: 4102,
    imagePrompt: "a slim portable power bank in white on white background, minimalist product photography",
    category: "数码", hot: false, distanceKm: 22, etaMin: 75,
    description: "10000mAh 的电量，足以撑到你放弃等货的那一天。它永远不会到，但你的电量焦虑会先到。",
    reviews: [
      { id: "r1-4-1", nickname: "电量焦虑", stars: 5, content: "容量真实，比我的耐心先耗尽" },
      { id: "r1-4-2", nickname: "路人甲", stars: 4, content: "三个月没到，我已经换了手机" },
    ],
  },
  {
    id: "p1-5", shopId: "s1", name: "手机稳定器", nameEn: "Smartphone Gimbal Stabilizer", price: 459,
    specs: ["标准版"], rating: 4.7, sales: 612,
    imagePrompt: "a smartphone gimbal stabilizer in gray on white background, product photography",
    category: "数码", hot: false, distanceKm: 10, etaMin: 40,
    description: "防抖效果一流，唯独防不住物流的颠簸。稳定器很稳，物流很不稳，这就是生活的平衡。",
    reviews: [
      { id: "r1-5-1", nickname: "vlogger", stars: 5, content: "防抖很好，防不到货" },
      { id: "r1-5-2", nickname: "稳定不了", stars: 4, content: "稳定器很稳，物流很不稳" },
    ],
  },
  {
    id: "p1-6", shopId: "s1", name: "桌面蓝牙音箱", nameEn: "Desktop Bluetooth Speaker", price: 349, originalPrice: 599,
    specs: ["深空灰"], rating: 4.8, sales: 1330,
    imagePrompt: "a small desktop bluetooth speaker in dark gray on white background, product photography",
    category: "数码", hot: false, distanceKm: 20, etaMin: 70,
    description: "低音浑厚，足以掩盖你叹息等货的声音。音箱没到，你的桌面已经空出一块给它了。",
    reviews: [
      { id: "r1-6-1", nickname: "耳朵", stars: 5, content: "低音浑厚，等货等得我耳朵起茧" },
      { id: "r1-6-2", nickname: "桌面控", stars: 5, content: "永远在途中的浪漫，谢谢老板" },
    ],
  },

  /* ---------- s2 慵懒衣橱 ---------- */
  {
    id: "p2-1", shopId: "s2", name: "纯棉圆领T恤", nameEn: "Cotton Crewneck T-Shirt", price: 89, originalPrice: 159,
    specs: ["米白", "燕麦", "M", "L"], rating: 4.7, sales: 5600,
    imagePrompt: "a folded plain cotton t-shirt in beige on white background, minimalist product photography",
    category: "服饰", hot: true, distanceKm: 14, etaMin: 50,
    description: "面料柔软到让你忘记下单这回事。等它到的过程中，你已经过了三个季节，但多巴胺已经送达。",
    reviews: [
      { id: "r2-1-1", nickname: "穿搭小白", stars: 5, content: "面料舒服，等得我都换季了" },
      { id: "r2-1-2", nickname: "慢时尚", stars: 4, content: "真正的慢时尚，慢到下一个春天" },
    ],
  },
  {
    id: "p2-2", shopId: "s2", name: "宽松直筒牛仔裤", nameEn: "Relaxed Straight Jeans", price: 199, originalPrice: 329,
    specs: ["浅蓝", "深蓝", "30", "32"], rating: 4.6, sales: 2200,
    imagePrompt: "a pair of folded light blue denim jeans on white background, product photography",
    category: "服饰", hot: false, distanceKm: 16, etaMin: 58,
    description: "版型显瘦，等货的过程更显瘦。裤子还在路上，你的腰围已经先变化了一圈。",
    reviews: [
      { id: "r2-2-1", nickname: "裤腿党", stars: 5, content: "版型好，物流像在坐慢车" },
      { id: "r2-2-2", nickname: "显瘦", stars: 4, content: "瘦了等衣服的过程瘦的" },
    ],
  },
  {
    id: "p2-3", shopId: "s2", name: "针织开衫", nameEn: "Knit Cardigan", price: 159,
    specs: ["奶咖", "雾灰", "M"], rating: 4.8, sales: 1340,
    imagePrompt: "a folded knit cardigan in oat color on white background, cozy product photography",
    category: "服饰", hot: false, distanceKm: 11, etaMin: 42,
    description: "软糯包裹感，连快递都懒得动。穿上它，你会觉得自己被温柔地困在等待里。",
    reviews: [
      { id: "r2-3-1", nickname: "秋意", stars: 5, content: "软糯，包裹没到心已暖" },
      { id: "r2-3-2", nickname: "懒人", stars: 5, content: "懒人专属，连快递都懒得起送" },
    ],
  },
  {
    id: "p2-4", shopId: "s2", name: "帆布托特包", nameEn: "Canvas Tote Bag", price: 69, originalPrice: 99,
    specs: ["卡其"], rating: 4.5, sales: 3300,
    imagePrompt: "a canvas tote bag in khaki on white background, minimalist product photography",
    category: "服饰", hot: false, distanceKm: 24, etaMin: 80,
    description: "容量大到能装下你所有的等待。环保到连塑料袋都不用——因为根本没发货。",
    reviews: [
      { id: "r2-4-1", nickname: "通勤族", stars: 5, content: "容量大，能装下所有等待" },
      { id: "r2-4-2", nickname: "环保", stars: 4, content: "环保到连塑料袋都不用（因为没发货）" },
    ],
  },
  {
    id: "p2-5", shopId: "s2", name: "运动卫裤", nameEn: "Sweatpants", price: 139,
    specs: ["炭黑", "L"], rating: 4.6, sales: 1890,
    imagePrompt: "folded gray sweatpants on white background, minimalist product photography",
    category: "服饰", hot: false, distanceKm: 13, etaMin: 48,
    description: "居家等快递的绝佳伴侣。舒服到你不想出门，正好，因为也没东西可收。",
    reviews: [
      { id: "r2-5-1", nickname: "居家派", stars: 5, content: "舒服，居家等快递首选" },
      { id: "r2-5-2", nickname: "腿长", stars: 4, content: "裤长合适，等货期足够长" },
    ],
  },
  {
    id: "p2-6", shopId: "s2", name: "渔夫帽", nameEn: "Bucket Hat", price: 49, originalPrice: 79,
    specs: ["米色"], rating: 4.4, sales: 2750,
    imagePrompt: "a beige bucket hat on white background, product photography",
    category: "服饰", hot: false, distanceKm: 19, etaMin: 65,
    description: "遮阳效果好，可惜帽子没到时太阳已经下山。低调到连物流都查无此帽。",
    reviews: [
      { id: "r2-6-1", nickname: "遮阳", stars: 5, content: "帽子没到，太阳已经下山了" },
      { id: "r2-6-2", nickname: "低调", stars: 4, content: "低调到连物流都查不到" },
    ],
  },

  /* ---------- s3 治愈家居铺 ---------- */
  {
    id: "p3-1", shopId: "s3", name: "香薰蜡烛", nameEn: "Scented Candle", price: 59, originalPrice: 89,
    specs: ["雪松", "白茶"], rating: 4.9, sales: 4100,
    imagePrompt: "a scented candle in a glass jar on white background, cozy product photography",
    category: "家居", hot: true, distanceKm: 9, etaMin: 35,
    description: "点燃它，等待也变得仪式感十足。蜡烛没到，你已经用手机照明看完了三本书。",
    reviews: [
      { id: "r3-1-1", nickname: "氛围感", stars: 5, content: "味道治愈，等待更治愈" },
      { id: "r3-1-2", nickname: "夜读", stars: 5, content: "蜡烛没到，我已经用手机照明看完三本书" },
    ],
  },
  {
    id: "p3-2", shopId: "s3", name: "北欧抱枕套", nameEn: "Nordic Pillow Cover", price: 39,
    specs: ["45x45cm"], rating: 4.7, sales: 2600,
    imagePrompt: "a nordic style pillow cover in muted tones on white background, product photography",
    category: "家居", hot: false, distanceKm: 17, etaMin: 62,
    description: "颜值在线，物流离线。配色温柔得像老板的承诺一样美好而虚幻。",
    reviews: [
      { id: "r3-2-1", nickname: "沙发土豆", stars: 5, content: "颜值在线，物流离线" },
      { id: "r3-2-2", nickname: "配色控", stars: 4, content: "配色温柔，像老板的承诺一样虚" },
    ],
  },
  {
    id: "p3-3", shopId: "s3", name: "陶瓷马克杯", nameEn: "Ceramic Mug", price: 45, originalPrice: 69,
    specs: ["奶白"], rating: 4.8, sales: 5200,
    imagePrompt: "a ceramic mug in matte cream color on white background, minimalist product photography",
    category: "家居", hot: false, distanceKm: 21, etaMin: 72,
    description: "手感温润，物流冰冷。杯子没到，你已经喝干了三个月的一次性杯。",
    reviews: [
      { id: "r3-3-1", nickname: "咖啡因", stars: 5, content: "杯子没到，我喝了三个月一次性杯" },
      { id: "r3-3-2", nickname: "手感党", stars: 5, content: "手感温润，物流冰冷" },
    ],
  },
  {
    id: "p3-4", shopId: "s3", name: "棉麻桌布", nameEn: "Cotton Linen Tablecloth", price: 79,
    specs: ["140x70cm"], rating: 4.6, sales: 980,
    imagePrompt: "a folded linen table runner in natural color on white background, product photography",
    category: "家居", hot: false, distanceKm: 23, etaMin: 78,
    description: "质感细腻，桌子等它等得积了灰。素雅到物流都查无此布。",
    reviews: [
      { id: "r3-4-1", nickname: "餐桌美学", stars: 5, content: "质感好，桌等它等得积灰" },
      { id: "r3-4-2", nickname: "素雅", stars: 4, content: "素雅到物流都查无此布" },
    ],
  },
  {
    id: "p3-5", shopId: "s3", name: "床头小夜灯", nameEn: "Bedside Night Lamp", price: 99, originalPrice: 149,
    specs: ["暖光"], rating: 4.8, sales: 1870,
    imagePrompt: "a small warm white bedside night lamp on white background, cozy product photography",
    category: "家居", hot: false, distanceKm: 8, etaMin: 32,
    description: "暖光治愈，可惜灯没到时你已经学会在黑暗中坚强。温馨的灯，冷酷的物流。",
    reviews: [
      { id: "r3-5-1", nickname: "怕黑", stars: 5, content: "灯没到，我学会了在黑暗中坚强" },
      { id: "r3-5-2", nickname: "温馨", stars: 5, content: "温馨的灯，冷酷的物流" },
    ],
  },
  {
    id: "p3-6", shopId: "s3", name: "实木相框", nameEn: "Solid Wood Photo Frame", price: 29,
    specs: ["A4"], rating: 4.5, sales: 3400,
    imagePrompt: "a natural wood photo frame on white background, minimalist product photography",
    category: "家居", hot: false, distanceKm: 25, etaMin: 88,
    description: "极简设计，连包裹也简化没了。相框没到，回忆都凉了。",
    reviews: [
      { id: "r3-6-1", nickname: "回忆杀", stars: 5, content: "相框没到，回忆都凉了" },
      { id: "r3-6-2", nickname: "极简", stars: 4, content: "极简到包裹也简化没了" },
    ],
  },

  /* ---------- s4 素颜美学馆 ---------- */
  {
    id: "p4-1", shopId: "s4", name: "保湿面霜", nameEn: "Moisturizing Face Cream", price: 159, originalPrice: 239,
    specs: ["50ml"], rating: 4.7, sales: 6800,
    imagePrompt: "a white skincare cream jar on white background, clean product photography",
    category: "美妆", hot: true, distanceKm: 14, etaMin: 52,
    description: "保湿一流，脸却没等到货先干成沙漠。成分透明，物流成分成谜。",
    reviews: [
      { id: "r4-1-1", nickname: "干皮", stars: 5, content: "保湿一流，脸没等到货先干成沙漠" },
      { id: "r4-1-2", nickname: "成分党", stars: 5, content: "成分好，物流成分成谜" },
    ],
  },
  {
    id: "p4-2", shopId: "s4", name: "哑光口红", nameEn: "Matte Lipstick", price: 79, originalPrice: 119,
    specs: ["豆沙", "正红"], rating: 4.6, sales: 8900,
    imagePrompt: "a matte lipstick tube in dusty rose color on white background, product photography",
    category: "美妆", hot: false, distanceKm: 18, etaMin: 64,
    description: "颜色美到等得嘴唇都褪色。显白，物流黑到查不到。",
    reviews: [
      { id: "r4-2-1", nickname: "唇色", stars: 5, content: "颜色美，等得我嘴唇都褪色了" },
      { id: "r4-2-2", nickname: "显白", stars: 4, content: "显白，物流黑到查不到" },
    ],
  },
  {
    id: "p4-3", shopId: "s4", name: "温和卸妆水", nameEn: "Gentle Micellar Water", price: 69,
    specs: ["500ml"], rating: 4.5, sales: 4300,
    imagePrompt: "a bottle of clear micellar cleansing water on white background, product photography",
    category: "美妆", hot: false, distanceKm: 12, etaMin: 46,
    description: "温和卸妆，包裹卸得没影。等货等到你都素颜出门了。",
    reviews: [
      { id: "r4-3-1", nickname: "素颜", stars: 5, content: "温和，等货等到我都素颜出门了" },
      { id: "r4-3-2", nickname: "懒人", stars: 4, content: "卸得干净，包裹卸得没影" },
    ],
  },
  {
    id: "p4-4", shopId: "s4", name: "手工精油皂", nameEn: "Handmade Essential Oil Soap", price: 39, originalPrice: 59,
    specs: ["薰衣草"], rating: 4.7, sales: 5500,
    imagePrompt: "a handmade lavender soap bar on white background, product photography",
    category: "美妆", hot: false, distanceKm: 16, etaMin: 56,
    description: "香味治愈，等得身上都腌入味了。泡沫绵密，物流像泡沫一样虚。",
    reviews: [
      { id: "r4-4-1", nickname: "香气", stars: 5, content: "香味治愈，等得我身上都腌入味了" },
      { id: "r4-4-2", nickname: "泡泡", stars: 5, content: "泡沫绵密，物流像泡沫一样虚" },
    ],
  },
  {
    id: "p4-5", shopId: "s4", name: "精华安瓶", nameEn: "Serum Ampoule", price: 199, originalPrice: 329,
    specs: ["30ml"], rating: 4.8, sales: 2100,
    imagePrompt: "a glass serum ampoule bottle on white background, premium product photography",
    category: "美妆", hot: false, distanceKm: 20, etaMin: 68,
    description: "急救好物，等它等到你更需要急救。价格贵妇，物流乞丐。",
    reviews: [
      { id: "r4-5-1", nickname: "熬夜党", stars: 5, content: "急救好物，等它等到我更熬了" },
      { id: "r4-5-2", nickname: "贵妇", stars: 4, content: "价格贵妇，物流乞丐" },
    ],
  },
  {
    id: "p4-6", shopId: "s4", name: "定妆喷雾", nameEn: "Setting Spray", price: 89,
    specs: ["100ml"], rating: 4.6, sales: 3600,
    imagePrompt: "a setting spray bottle on white background, product photography",
    category: "美妆", hot: false, distanceKm: 15, etaMin: 54,
    description: "定妆持久，包裹持久不到。喷雾细腻，物流粗犷。",
    reviews: [
      { id: "r4-6-1", nickname: "脱妆", stars: 5, content: "定妆持久，包裹持久不到" },
      { id: "r4-6-2", nickname: "雾面", stars: 4, content: "喷雾细腻，物流粗犷" },
    ],
  },

  /* ---------- s5 深夜食验室 ---------- */
  {
    id: "p5-1", shopId: "s5", name: "手冲咖啡豆", nameEn: "Pour-Over Coffee Beans", price: 89, originalPrice: 129,
    specs: ["中度烘焙", "250g"], rating: 4.9, sales: 7200,
    imagePrompt: "a bag of roasted coffee beans on white background, product photography",
    category: "食品", hot: true, distanceKm: 10, etaMin: 38,
    description: "香气浓郁，等豆等到你戒了咖啡。风味复杂，物流更复杂。",
    reviews: [
      { id: "r5-1-1", nickname: "咖啡因依赖", stars: 5, content: "香气浓郁，等豆等到我戒了咖啡" },
      { id: "r5-1-2", nickname: "手冲党", stars: 5, content: "风味复杂，物流更复杂" },
    ],
  },
  {
    id: "p5-2", shopId: "s5", name: "黑巧克力礼盒", nameEn: "Dark Chocolate Gift Box", price: 69,
    specs: ["9颗装"], rating: 4.7, sales: 4900,
    imagePrompt: "a box of dark chocolate pieces on white background, product photography",
    category: "食品", hot: false, distanceKm: 22, etaMin: 76,
    description: "微苦高级，等货等得更苦。深夜下单，深夜都没等到。",
    reviews: [
      { id: "r5-2-1", nickname: "甜度", stars: 5, content: "微苦高级，等货等得更苦" },
      { id: "r5-2-2", nickname: "深夜", stars: 4, content: "深夜下单，深夜都没等到" },
    ],
  },
  {
    id: "p5-3", shopId: "s5", name: "日式抹茶粉", nameEn: "Japanese Matcha Powder", price: 59, originalPrice: 89,
    specs: ["30g"], rating: 4.8, sales: 3300,
    imagePrompt: "a bowl of green matcha powder on white background, product photography",
    category: "食品", hot: false, distanceKm: 13, etaMin: 50,
    description: "颜色翠绿，物流黄了。做拿铁绝，等得你喝了三个月速溶。",
    reviews: [
      { id: "r5-3-1", nickname: "抹茶控", stars: 5, content: "颜色翠绿，物流黄了" },
      { id: "r5-3-2", nickname: "拿铁", stars: 5, content: "做拿铁绝，等得我喝了三个月速溶" },
    ],
  },
  {
    id: "p5-4", shopId: "s5", name: "混合每日坚果", nameEn: "Mixed Daily Nuts", price: 49, originalPrice: 79,
    specs: ["30袋装"], rating: 4.6, sales: 8800,
    imagePrompt: "a bag of mixed nuts and dried fruits on white background, product photography",
    category: "食品", hot: false, distanceKm: 19, etaMin: 66,
    description: "每日坚果，等货等到变成每年坚果。蛋白足，耐心更足。",
    reviews: [
      { id: "r5-4-1", nickname: "零食党", stars: 5, content: "每日坚果，等货等到变成每年坚果" },
      { id: "r5-4-2", nickname: "健身", stars: 4, content: "蛋白足，耐心更足" },
    ],
  },
  {
    id: "p5-5", shopId: "s5", name: "蜂蜜柚子茶", nameEn: "Honey Yuzu Tea", price: 39,
    specs: ["500g"], rating: 4.5, sales: 2600,
    imagePrompt: "a jar of honey yuzu tea on white background, product photography",
    category: "食品", hot: false, distanceKm: 17, etaMin: 60,
    description: "酸甜可口，物流酸得掉牙。冬天下单，夏天到也不嫌晚（没到）。",
    reviews: [
      { id: "r5-5-1", nickname: "润喉", stars: 5, content: "酸甜可口，物流酸得掉牙" },
      { id: "r5-5-2", nickname: "冬季", stars: 4, content: "冬天下单，夏天到也不嫌晚（没到）" },
    ],
  },
  {
    id: "p5-6", shopId: "s5", name: "香辣牛肉干", nameEn: "Spicy Beef Jerky", price: 45, originalPrice: 69,
    specs: ["200g"], rating: 4.7, sales: 6100,
    imagePrompt: "spicy beef jerky strips on white background, product photography",
    category: "食品", hot: false, distanceKm: 11, etaMin: 44,
    description: "越嚼越香，物流越等越长。下酒绝配，酒喝完货没到。",
    reviews: [
      { id: "r5-6-1", nickname: "辣党", stars: 5, content: "越嚼越香，物流越等越长" },
      { id: "r5-6-2", nickname: "下酒", stars: 5, content: "下酒绝配，酒喝完货没到" },
    ],
  },

  /* ---------- s6 纸页书店 ---------- */
  {
    id: "p6-1", shopId: "s6", name: "《孤独的算法》", nameEn: "The Lonely Algorithm", price: 48,
    specs: ["平装"], rating: 4.9, sales: 1200,
    imagePrompt: "a novel book cover on white background, minimalist product photography",
    category: "图书", hot: true, distanceKm: 24, etaMin: 82,
    description: "文笔好到等书等到你自己写了一本。孤独的算法，孤独的物流。",
    reviews: [
      { id: "r6-1-1", nickname: "夜读", stars: 5, content: "文笔好，等书等到我自己写了一本" },
      { id: "r6-1-2", nickname: "书虫", stars: 5, content: "孤独的算法，孤独的物流" },
    ],
  },
  {
    id: "p6-2", shopId: "s6", name: "《深夜食堂手记》", nameEn: "Midnight Diner Notes", price: 42,
    specs: ["平装"], rating: 4.8, sales: 890,
    imagePrompt: "an essay collection book on white background, product photography",
    category: "图书", hot: false, distanceKm: 15, etaMin: 55,
    description: "看饿了，书还没到先饿了三个月。文字温暖，物流冰冷。",
    reviews: [
      { id: "r6-2-1", nickname: "食客", stars: 5, content: "看饿了，书还没到先饿了三个月" },
      { id: "r6-2-2", nickname: "散文控", stars: 5, content: "文字温暖，物流冰冷" },
    ],
  },
  {
    id: "p6-3", shopId: "s6", name: "绘本《云朵邮局》", nameEn: "Picture Book: Cloud Post Office", price: 36,
    specs: ["精装"], rating: 4.9, sales: 2100,
    imagePrompt: "a children picture book on white background, product photography",
    category: "图书", hot: false, distanceKm: 9, etaMin: 36,
    description: "画风治愈，快递从不治愈。云朵会飘，包裹不会。",
    reviews: [
      { id: "r6-3-1", nickname: "童心", stars: 5, content: "画风治愈，快递从不治愈" },
      { id: "r6-3-2", nickname: "云朵", stars: 5, content: "云朵会飘，包裹不会" },
    ],
  },
  {
    id: "p6-4", shopId: "s6", name: "城市摄影画册", nameEn: "City Photography Album", price: 88, originalPrice: 128,
    specs: ["精装"], rating: 4.7, sales: 540,
    imagePrompt: "a photography art book on white background, product photography",
    category: "图书", hot: false, distanceKm: 21, etaMin: 74,
    description: "画质震撼，物流震撼地慢。看完想出门，出门回来货还没到。",
    reviews: [
      { id: "r6-4-1", nickname: "光影", stars: 5, content: "画质震撼，物流震撼地慢" },
      { id: "r6-4-2", nickname: "旅行", stars: 4, content: "看完想出门，出门回来货还没到" },
    ],
  },
  {
    id: "p6-5", shopId: "s6", name: "诗集《雨的形状》", nameEn: "Poetry: The Shape of Rain", price: 32,
    specs: ["平装"], rating: 4.8, sales: 760,
    imagePrompt: "a poetry book on white background, minimalist product photography",
    category: "图书", hot: false, distanceKm: 18, etaMin: 62,
    description: "句子很美，物流很丧。雨都停了，书还在云上。",
    reviews: [
      { id: "r6-5-1", nickname: "诗意", stars: 5, content: "句子很美，物流很丧" },
      { id: "r6-5-2", nickname: "雨天", stars: 5, content: "雨都停了，书还在云上" },
    ],
  },
  {
    id: "p6-6", shopId: "s6", name: "设计灵感手册", nameEn: "Design Inspiration Handbook", price: 58,
    specs: ["平装"], rating: 4.6, sales: 1020,
    imagePrompt: "a design inspiration handbook on white background, product photography",
    category: "图书", hot: false, distanceKm: 16, etaMin: 58,
    description: "灵感爆棚，等货等到灵感枯竭。创意满满，物流空空。",
    reviews: [
      { id: "r6-6-1", nickname: "设计师", stars: 5, content: "灵感爆棚，等货等到灵感枯竭" },
      { id: "r6-6-2", nickname: "创意", stars: 4, content: "创意满满，物流空空" },
    ],
  },
];

export const products: Product[] = seeds.map((p) => ({
  ...p,
  image: buildImageUrl(p.imagePrompt, "square"),
}));

export function getProductsByShop(shopId: string): Product[] {
  return products.filter((p) => p.shopId === shopId);
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

/** 返回热门商品（hot = true） */
export function getHotProducts(): Product[] {
  return products.filter((p) => p.hot);
}

/** 按分类查询商品，category 为 "ALL" 时返回全部 */
export function getProductsByCategory(category: string): Product[] {
  if (category === "ALL") return products;
  return products.filter((p) => p.category === category);
}
