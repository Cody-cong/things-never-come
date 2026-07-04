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

-- 允许匿名用户（浏览器端）读写商品和分类
-- 注意：生产环境如需限制权限，可改为仅 authenticated 用户或添加 RLS 策略
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous read products"
  ON products FOR SELECT TO anon USING (true);

CREATE POLICY "Allow anonymous write products"
  ON products FOR ALL TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Allow anonymous read categories"
  ON categories FOR SELECT TO anon USING (true);

CREATE POLICY "Allow anonymous write categories"
  ON categories FOR ALL TO anon USING (true) WITH CHECK (true);
