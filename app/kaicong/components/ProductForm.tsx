"use client";

import { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { getCategories } from "@/lib/category-store";
import {
  addProduct,
  updateProduct,
  type ProductInput,
} from "@/lib/product-store";
import type { Product } from "@/lib/types";
import ImageUploadField from "./ImageUploadField";

interface FormState {
  image: string;
  name: string;
  nameEn: string;
  price: string;
  description: string;
  category: string;
  hot: boolean;
  maxQuantity: string;
  limitMessage: string;
  specs: string;
}

const EMPTY_FORM: FormState = {
  image: "",
  name: "",
  nameEn: "",
  price: "",
  description: "",
  category: "",
  hot: false,
  maxQuantity: "",
  limitMessage: "",
  specs: "默认",
};

function toForm(p: Product): FormState {
  return {
    image: p.image,
    name: p.name,
    nameEn: p.nameEn ?? "",
    price: String(p.price),
    description: p.description,
    category: p.category,
    hot: p.hot,
    maxQuantity: p.maxQuantity ? String(p.maxQuantity) : "",
    limitMessage: p.limitMessage ?? "",
    specs: p.specs.join(","),
  };
}

/** 商品新增/编辑表单。initial 为 null 表示新增，否则编辑该商品。 */
export default function ProductForm({
  initial,
  onCancel,
  onSaved,
}: {
  initial: Product | null;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const isEdit = !!initial;
  const [form, setForm] = useState<FormState>(
    initial ? toForm(initial) : EMPTY_FORM
  );
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [cats, setCats] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const list = await getCategories();
      setCats(list);
      setForm((f) =>
        list.includes(f.category) || !list.length
          ? f
          : { ...f, category: list[0] }
      );
    }
    load();
  }, []);

  function update(field: keyof FormState, value: string | boolean) {
    setForm((f) => ({ ...f, [field]: value }));
    // 用户开始修改时清除对应字段错误
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.image.trim()) next.image = "请上传商品图片";
    if (!form.name.trim()) next.name = "请填写商品名称";
    if (!form.nameEn.trim()) next.nameEn = "请填写商品英文名称";
    const price = Number(form.price);
    if (!form.price.trim() || !price || price <= 0) next.price = "请填写有效价格";
    if (!form.category) next.category = "请先添加并选择一个分类";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSave() {
    if (saving || !validate()) return;
    setSaving(true);
    try {
      const price = Number(form.price);
      const maxQuantityNum = form.maxQuantity.trim()
        ? Number(form.maxQuantity.trim())
        : undefined;
      const specs = form.specs
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const input: ProductInput = {
        name: form.name.trim(),
        nameEn: form.nameEn.trim(),
        image: form.image.trim(),
        price,
        category: form.category,
        description: form.description.trim(),
        hot: form.hot,
        maxQuantity:
          maxQuantityNum !== undefined && maxQuantityNum > 0
            ? maxQuantityNum
            : undefined,
        limitMessage: form.limitMessage.trim() || undefined,
        specs: specs.length > 0 ? specs : ["默认"],
      };
      if (isEdit && initial) {
        await updateProduct(initial.id, input);
      } else {
        await addProduct(input);
      }
      onSaved();
    } catch (e) {
      alert(`保存失败：${e instanceof Error ? e.message : String(e)}\n请检查 Supabase 写入密钥是否配置正确。`);
    } finally {
      setSaving(false);
    }
  }

  const inputCls =
    "w-full rounded-2xl border border-blush bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-accent";
  const labelCls = "mb-1 block text-xs text-muted";
  const errorCls = "mt-1 text-xs text-accent";

  return (
    <div className="flex flex-col px-4 pt-5 pb-24">
      <div className="mb-4 flex items-center gap-2">
        <button
          onClick={onCancel}
          aria-label="返回"
          className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-blush"
        >
          <ChevronLeft size={22} className="text-ink" />
        </button>
        <h1 className="text-base font-semibold text-ink">
          {isEdit ? "编辑商品" : "添加商品"}
        </h1>
      </div>

      {/* 商品图片上传（canvas 压缩后存 data URL） */}
      <ImageUploadField
        value={form.image}
        onChange={(v) => update("image", v)}
      />
      {errors.image && <p className={errorCls}>{errors.image}</p>}

      <label className={`mt-3 ${labelCls}`}>中文名称</label>
      <input
        type="text"
        value={form.name}
        onChange={(e) => update("name", e.target.value)}
        placeholder="商品中文名称"
        className={inputCls}
      />
      {errors.name && <p className={errorCls}>{errors.name}</p>}

      <label className={`mt-3 ${labelCls}`}>英文名称</label>
      <input
        type="text"
        value={form.nameEn}
        onChange={(e) => update("nameEn", e.target.value)}
        placeholder="商品英文名称"
        className={inputCls}
      />
      {errors.nameEn && <p className={errorCls}>{errors.nameEn}</p>}

      <label className={`mt-3 ${labelCls}`}>价格（USD）</label>
      <input
        type="number"
        value={form.price}
        onChange={(e) => update("price", e.target.value)}
        placeholder="0"
        className={inputCls}
      />
      {errors.price && <p className={errorCls}>{errors.price}</p>}

      <label className={`mt-3 ${labelCls}`}>商品描述</label>
      <textarea
        value={form.description}
        onChange={(e) => update("description", e.target.value)}
        placeholder="商品详情段落"
        rows={3}
        className={`${inputCls} resize-none`}
      />

      <label className={`mt-3 ${labelCls}`}>分类</label>
      <select
        value={form.category}
        onChange={(e) => update("category", e.target.value)}
        className={inputCls}
      >
        <option value="" disabled>
          {cats.length ? "请选择分类" : "暂无分类，请先去分类管理添加"}
        </option>
        {cats.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      {errors.category && <p className={errorCls}>{errors.category}</p>}

      <label className={`mt-3 ${labelCls}`}>规格（用英文逗号分隔）</label>
      <input
        type="text"
        value={form.specs}
        onChange={(e) => update("specs", e.target.value)}
        placeholder="例如：默认, 大号, 小号"
        className={inputCls}
      />

      <label className={`mt-3 ${labelCls}`}>购买数量上限</label>
      <input
        type="number"
        min={1}
        value={form.maxQuantity}
        onChange={(e) => update("maxQuantity", e.target.value)}
        placeholder="留空表示不限制"
        className={inputCls}
      />

      <label className={`mt-3 ${labelCls}`}>达到上限提醒语</label>
      <input
        type="text"
        value={form.limitMessage}
        onChange={(e) => update("limitMessage", e.target.value)}
        placeholder="例如：每人限购 5 件哦"
        className={inputCls}
      />

      <label className={`mt-3 ${labelCls}`}>首页热门</label>
      <button
        type="button"
        onClick={() => update("hot", !form.hot)}
        className={`flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition ${
          form.hot
            ? "bg-accent text-white"
            : "border border-blush bg-white text-ink"
        }`}
      >
        <span
          className={`flex h-4 w-4 items-center justify-center rounded-full border ${
            form.hot ? "border-white" : "border-muted"
          }`}
        >
          {form.hot && <span className="h-2 w-2 rounded-full bg-white" />}
        </span>
        {form.hot ? "已加入首页热门" : "未加入首页热门"}
      </button>

      <div className="mt-5 flex gap-3">
        <button
          onClick={onCancel}
          disabled={saving}
          className="flex-1 rounded-full border border-blush py-2.5 text-sm font-medium text-ink disabled:opacity-50"
        >
          取消
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex-[2] rounded-full bg-accent py-2.5 text-sm font-medium text-white transition press-spring disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "保存中…" : "保存"}
        </button>
      </div>
    </div>
  );
}
