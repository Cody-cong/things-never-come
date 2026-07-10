-- 清空云端商品与分类数据
-- 在 Supabase 控制台 -> SQL Editor -> New query 中粘贴并运行
-- 注意：此操作不可逆，请确认不再需要这些旧数据后再执行

-- 清空商品表
delete from public.products;

-- 清空分类表
delete from public.categories;

-- 如果需要同时清空 FAQ 和反馈，取消下面两行的注释
-- delete from public.faqs;
-- delete from public.feedbacks;
