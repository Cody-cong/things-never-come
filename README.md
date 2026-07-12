# things never come

一个模拟电商购物全流程的"多巴胺网站"：挑选商品、加入购物车、虚拟下单，商品永远不会到达。适合想过购物瘾又担心剁手的用户，获得消费仪式感但不花真实资金。

灵感来自 [FoodNeverCome](https://foodnevercome.com) 等"多巴胺网站"。

## 在线演示

<https://newsthink.cn/>

## 功能特性

- **首页**：品牌标语、商品搜索、热门商品网格、玩法介绍、FAQ、用户反馈
- **商品浏览**：分类筛选、关键词搜索、商品详情页
- **购物车**：调整数量、删除商品、限购提示、虚拟结算
- **虚拟账单**：结算后生成精美账单，支持打印或保存为 PNG/PDF
- **AI 毒舌点评**：基于 DeepSeek API 生成搞笑订单评价
- **成就系统**：根据单笔订单金额、商品种类数等条件解锁成就
- **个人中心**：设置头像、昵称、收货地址
- **管理后台**：管理商品、分类、FAQ、用户反馈，控制成就启用状态

## 技术栈

- [Next.js 14](https://nextjs.org/)（App Router）
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- React Context + `useReducer`
- [Supabase](https://supabase.com/)（可选，多端数据同步）
- [DeepSeek API](https://platform.deepseek.com/)（可选，AI 点评）

## 快速开始

```bash
npm install
npm run dev
```

开发模式下使用正常 SSR，生产构建使用静态导出（`output: 'export'`），产物输出到 `out` 目录。

## 环境变量

| 变量 | 说明 | 是否必填 |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 项目 URL | 可选 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | 可选 |
| `NEXT_PUBLIC_SUPABASE_WRITE_KEY` | 自定义写入密钥，配合 RLS 策略控制写权限 | 使用 Supabase 时必填 |
| `NEXT_PUBLIC_DEEPSEEK_API_KEY` | DeepSeek API key，用于生成 AI 订单点评 | 可选 |
| `NEXT_PUBLIC_ADMIN_PASSWORD` | 管理后台 `/kaicong` 的登录密码 | 可选 |

> 静态导出站点无法完全隐藏前端环境变量。生产部署请通过 GitHub Secrets 或对应平台注入。

## 数据持久化

- **未配置 Supabase** 时，商品、分类、FAQ、反馈、成就启用状态均存储在浏览器 `localStorage`。
- **配置 Supabase** 后，上述数据会优先同步到云端，离线或失败时自动回退到本地数据。
- **购物车和订单历史**始终使用 `localStorage`，不涉及 Supabase。

当前代码**不会主动添加任何默认/模拟商品**。所有商品都需要通过管理后台自行上架。

Supabase 表结构见 [`supabase/init.sql`](./supabase/init.sql)。首次使用前需要在 Supabase SQL Editor 中执行该脚本，**并把脚本中的 `'kaicong'` 占位符替换为随机强密码**，该密码需与 `NEXT_PUBLIC_SUPABASE_WRITE_KEY` 保持一致。

### 清理旧模拟商品

如果旧版本（7 月 8 日之前）的模拟商品仍残留在云端，导致每次新设备访问都自动出现，可在 Supabase SQL Editor 中执行 [`supabase/cleanup.sql`](./supabase/cleanup.sql) 清空云端商品与分类数据。

## 部署

项目通过 GitHub Actions 自动部署到 GitHub Pages，配置见 [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml)。

推送至 `main` 分支即可触发构建与部署：

```bash
git push origin main
```

## 管理后台

访问 `/kaicong`，输入环境变量中配置的 `NEXT_PUBLIC_ADMIN_PASSWORD` 即可进入管理后台，可进行：

- 商品管理：新增、编辑、删除、批量删除、设置热门
- 分类管理：新增、重命名、删除
- FAQ 管理：新增、编辑、删除、重置为默认
- 用户反馈：查看与删除
- 成就管理：启用/禁用成就

## 项目结构

```
app/                  # Next.js App Router 页面
  kaicong/            # 管理后台页面与组件
  cart/               # 购物车
  category/           # 分类商品列表
  product/            # 商品详情
  receipt/            # 订单账单
  search/             # 商品搜索
  profile/            # 个人中心
components/           # 公共组件（Header、Footer、ProductCard、账单等）
lib/                  # 业务逻辑、状态管理、Supabase 客户端
supabase/             # 数据库初始化 SQL
public/               # 静态资源（内置头像等）
```

## 已知问题与可改进点

### 高优先级（建议尽快修复）

- **敏感环境变量暴露到客户端**：`NEXT_PUBLIC_DEEPSEEK_API_KEY`、`NEXT_PUBLIC_SUPABASE_WRITE_KEY`、`NEXT_PUBLIC_ADMIN_PASSWORD` 均以 `NEXT_PUBLIC_` 前缀打包到静态 JS 中，任何人可从源码提取。DeepSeek 调用建议通过 Next.js API Route / Server Action 代理；管理员鉴权也应在服务端完成。
- **查询参数读取未响应 URL 变化**：`ProductDetailClient`、`CategoryListClient`、`ReceiptClient` 使用 `window.location.search` + `useEffect([])` 读取参数，从 `/product/?id=A` 导航到 `/product/?id=B` 时页面不会重新加载。建议改用 `useSearchParams()` 并把参数加入 Effect 依赖。
- **Store 全量读取性能差**：`product-store`、`category-store` 等的每个 getter 都会触发一次 Supabase 网络请求并回写 `localStorage`。建议引入内存缓存与按需查询（如 `getProductById` 按 ID 查询）。
- **CartContext 导致全树重渲染**：购物车任一变化都会让所有 `useCart()` 消费者重渲染。建议拆分为 `CartStateContext` / `CartActionContext` 或提供 selector。
- **一键清空商品风险**：`deleteAllProducts` 使用 `.delete().neq("id", "")` 清空整表，配合前端写入密钥存在误删/恶意清空风险。

### 中优先级（可维护性与体验）

- **重复代码**：限购检查逻辑在 `ProductCard`、`ProductDetailClient`、`CartPage` 三处重复；`flyToCart` 动画在 `ProductCard` 与 `ProductDetailClient` 中重复。建议抽到 `lib/cart-utils.ts`。
- **搜索页不读取 URL 参数**：`app/search/page.tsx` 的 `keyword` state 没有从 `?q=` 初始化，首页搜索后输入框为空、结果仍是全部商品。
- **硬编码账单号**：`ReceiptContent` 中 Receipt 编号固定为 `#KFCVWO505050`，应使用订单 ID 生成真实编号。
- **DOM 重建造成动画闪烁**：`Header` 与 `BottomNav` 用 `key={totalCount}` 触发徽章动画，但会导致 DOM 重建。
- **ToastProvider value 未 memo**：每次渲染新建 `{ showToast }` 对象，触发所有 `useToast` 消费者重渲染。
- **生产环境残留 `console.log`**：`app/cart/page.tsx` 在结算与成就流程中打印调试信息。
- **格式/颜色重复**：`formatPrice` 在 `lib/utils.ts` 与 `lib/ai-review.ts` 中重复定义；`tailwind.config.ts` 中 `accent` 与 `brand` 颜色完全重复。
- **表单可访问性**：管理后台 `ProductForm` 等表单的 `<label>` 与 `<input>` 未通过 `htmlFor`/`id` 关联。
- **缺少 Error Boundary**：`app/layout.tsx` 未包裹 Error Boundary，任一组件崩溃会导致整站白屏。
- **搜索能力有限**：目前只匹配商品中文名，不支持英文名或分类。

### 已处理或不再相关

- `app/shop/[id]/page.tsx` 是已下线"店铺"概念的遗留文件，目前直接重定向到首页。

## 性能优化建议

| 优化点 | 当前问题 | 建议方案 |
| --- | --- | --- |
| Store 读取 | 每个 getter 都走网络 + localStorage | 增加内存缓存与 TTL；`getProductById` 改为按 ID 查询；`getHotProducts` 在 Supabase 侧用 `.eq("hot", true)` 过滤 |
| Context 重渲染 | Cart/Order 单一 Context | 拆分为 `CartStateContext` + `CartActionContext`，或提供 `useCart(selector)` |
| Toast 通知 | `value={{ showToast }}` 每次新建对象 | 用 `useMemo` 包裹 provider value |
| 商品卡片列表 | 购物车变化时所有卡片重渲染 | 对 `ProductCard` 使用 `React.memo` |
| 搜索大数据集 | 全量加载到前端再过滤 | 商品多时应在 Supabase 做文本搜索/分页；当前至少补全 loading skeleton |
| 图片 | `unoptimized: true` 关闭 Next.js 图片优化 | static export 无法避免；但用户上传的 base64 大图应限制尺寸/质量 |
| 输入数量 | 详情页数量无上限 | 增加 `maxQuantity` 校验或输入上限 |
| 账单图片 | 长账单使用 html-to-image 克隆 DOM | 已做视口外克隆，保持；可评估 canvas 版本进一步降低重排 |

## 免责声明

本站所有交易均为虚拟模拟，不会扣除任何真实资金，也不会真实发货。仅供娱乐。
