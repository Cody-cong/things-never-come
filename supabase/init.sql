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

-- 成就启用状态表（成就逻辑内建于代码，此表仅控制是否启用）
CREATE TABLE IF NOT EXISTS achievement_settings (
  id TEXT PRIMARY KEY,
  enabled BOOLEAN NOT NULL DEFAULT TRUE
);

-- 允许匿名用户（浏览器端）读取所有表
-- 写入操作需要请求头携带正确的 x-write-key，与 NEXT_PUBLIC_SUPABASE_WRITE_KEY 一致
-- 注意：静态导出站点无法完全隐藏前端密钥，如需更高安全性请使用服务端中间件
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedbacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievement_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow anonymous read products" ON products;
DROP POLICY IF EXISTS "Allow anonymous write products" ON products;
DROP POLICY IF EXISTS "Allow anonymous read categories" ON categories;
DROP POLICY IF EXISTS "Allow anonymous write categories" ON categories;
DROP POLICY IF EXISTS "Allow anonymous read faqs" ON faqs;
DROP POLICY IF EXISTS "Allow anonymous write faqs" ON faqs;
DROP POLICY IF EXISTS "Allow anonymous read feedbacks" ON feedbacks;
DROP POLICY IF EXISTS "Allow anonymous write feedbacks" ON feedbacks;
DROP POLICY IF EXISTS "Allow anonymous read achievement_settings" ON achievement_settings;
DROP POLICY IF EXISTS "Allow anonymous write achievement_settings" ON achievement_settings;

-- 写入密钥占位符：运行前请把下方所有 'kaicong' 替换为随机强密码，
-- 并在 GitHub Secrets 中设置 NEXT_PUBLIC_SUPABASE_WRITE_KEY 为相同值。
CREATE POLICY "Allow anonymous read products"
  ON products FOR SELECT TO anon USING (true);

CREATE POLICY "Allow anonymous write products"
  ON products FOR ALL TO anon
  USING (current_setting('request.headers', true)::json ->> 'x-write-key' = 'kaicong')
  WITH CHECK (current_setting('request.headers', true)::json ->> 'x-write-key' = 'kaicong');

CREATE POLICY "Allow anonymous read categories"
  ON categories FOR SELECT TO anon USING (true);

CREATE POLICY "Allow anonymous write categories"
  ON categories FOR ALL TO anon
  USING (current_setting('request.headers', true)::json ->> 'x-write-key' = 'kaicong')
  WITH CHECK (current_setting('request.headers', true)::json ->> 'x-write-key' = 'kaicong');

CREATE POLICY "Allow anonymous read faqs"
  ON faqs FOR SELECT TO anon USING (true);

CREATE POLICY "Allow anonymous write faqs"
  ON faqs FOR ALL TO anon
  USING (current_setting('request.headers', true)::json ->> 'x-write-key' = 'kaicong')
  WITH CHECK (current_setting('request.headers', true)::json ->> 'x-write-key' = 'kaicong');

CREATE POLICY "Allow anonymous read feedbacks"
  ON feedbacks FOR SELECT TO anon USING (true);

CREATE POLICY "Allow anonymous write feedbacks"
  ON feedbacks FOR ALL TO anon
  USING (current_setting('request.headers', true)::json ->> 'x-write-key' = 'kaicong')
  WITH CHECK (current_setting('request.headers', true)::json ->> 'x-write-key' = 'kaicong');

CREATE POLICY "Allow anonymous read achievement_settings"
  ON achievement_settings FOR SELECT TO anon USING (true);

CREATE POLICY "Allow anonymous write achievement_settings"
  ON achievement_settings FOR ALL TO anon
  USING (current_setting('request.headers', true)::json ->> 'x-write-key' = 'kaicong')
  WITH CHECK (current_setting('request.headers', true)::json ->> 'x-write-key' = 'kaicong');
