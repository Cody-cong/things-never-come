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

- `app/shop/[id]/page.tsx` 是已下线"店铺"概念的遗留文件，目前直接重定向到首页。
- 商品限购检查逻辑在 `ProductCard`、`ProductDetailClient`、`CartPage` 中重复出现，可抽取为公共 Hook。
- `formatPrice` 在 `lib/utils.ts` 与 `lib/ai-review.ts` 中重复定义。
- `tailwind.config.ts` 中 `accent` 与 `brand` 颜色完全重复。
- 搜索目前只匹配商品中文名，不支持英文名或分类。

## 免责声明

本站所有交易均为虚拟模拟，不会扣除任何真实资金，也不会真实发货。仅供娱乐。
