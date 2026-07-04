-- 在 Supabase 控制台 -> SQL Editor -> New query 中粘贴并运行

-- 商品表
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  shop_id TEXT NOT NULL DEFAULT 'admin',
  name TEXT NOT NULL,
  name_en TEXT,
  image TEXT NOT NULL,
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  category TEXT NOT NULL,
  hot BOOLEAN NOT NULL DEFAULT FALSE,
  description TEXT NOT NULL,
  specs TEXT[] NOT NULL DEFAULT ARRAY['默认'],
  sales INTEGER NOT NULL DEFAULT 0,
  image_prompt TEXT NOT NULL DEFAULT '',
  max_quantity INTEGER,
  limit_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 分类表
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- FAQ 表
CREATE TABLE IF NOT EXISTS faqs (
  id TEXT PRIMARY KEY,
  q TEXT NOT NULL,
  a TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 用户反馈表
CREATE TABLE IF NOT EXISTS feedbacks (
  id TEXT PRIMARY KEY,
  content TEXT NOT NULL,
  created_at BIGINT NOT NULL
);

-- 允许匿名用户（浏览器端）读写商品、分类、FAQ 和反馈
-- 注意：生产环境如需限制权限，可改为仅 authenticated 用户或添加 RLS 策略
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedbacks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous read products"
  ON products FOR SELECT TO anon USING (true);

CREATE POLICY "Allow anonymous write products"
  ON products FOR ALL TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Allow anonymous read categories"
  ON categories FOR SELECT TO anon USING (true);

CREATE POLICY "Allow anonymous write categories"
  ON categories FOR ALL TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Allow anonymous read faqs"
  ON faqs FOR SELECT TO anon USING (true);

CREATE POLICY "Allow anonymous write faqs"
  ON faqs FOR ALL TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Allow anonymous read feedbacks"
  ON feedbacks FOR SELECT TO anon USING (true);

CREATE POLICY "Allow anonymous write feedbacks"
  ON feedbacks FOR ALL TO anon USING (true) WITH CHECK (true);
