"use client";

import { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { categories as baseCategories } from "@/lib/mock-data";
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
  distanceKm: string;
  etaMin: string;
  description: string;
  category: string;
}

const EMPTY_FORM: FormState = {
  image: "",
  name: "",
  nameEn: "",
  price: "",
  distanceKm: "",
  etaMin: "",
  description: "",
  category: baseCategories[0] ?? "数码",
};

function toForm(p: Product): FormState {
  return {
    image: p.image,
    name: p.name,
    nameEn: p.nameEn ?? "",
    price: String(p.price),
    distanceKm: String(p.distanceKm),
    etaMin: String(p.etaMin),
    description: p.description,
    category: p.category,
  };
}

const NUM_FIELDS: { field: keyof FormState; label: string }[] = [
  { field: "price", label: "价格（元）" },
  { field: "distanceKm", label: "送达路程（km）" },
  { field: "etaMin", label: "送达时间（分钟）" },
];

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
  // 分类列表：初始用 baseCategories 保证 hydration 一致，挂载后读 localStorage
  const [cats, setCats] = useState<string[]>(baseCategories);

  useEffect(() => {
    const list = getCategories();
    setCats(list);
    // 若当前选中分类已不在列表（如被删除），修正为第一项
    setForm((f) =>
      list.includes(f.category) || !list.length
        ? f
        : { ...f, category: list[0] }
    );
  }, []);

  function update(field: keyof FormState, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleSave() {
    if (!form.image.trim()) {
      window.alert("请上传商品图片");
      return;
    }
    if (!form.name.trim()) {
      window.alert("请填写商品名称");
      return;
    }
    if (!form.nameEn.trim()) {
      window.alert("请填写商品英文名称");
      return;
    }
    const price = Number(form.price);
    if (!price || price <= 0) {
      window.alert("请填写有效价格");
      return;
    }
    const distanceKm = Number(form.distanceKm);
    const etaMin = Number(form.etaMin);
    const input: ProductInput = {
      name: form.name.trim(),
      nameEn: form.nameEn.trim(),
      image: form.image.trim(),
      price,
      category: form.category,
      description: form.description.trim(),
      distanceKm: distanceKm > 0 ? distanceKm : 10,
      etaMin: etaMin > 0 ? etaMin : 45,
    };
    if (isEdit && initial) {
      updateProduct(initial.id, input);
    } else {
      addProduct(input);
    }
    onSaved();
  }

  const inputCls =
    "w-full rounded-2xl border border-blush bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-accent";
  const labelCls = "mb-1 block text-xs text-muted";

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

      <label className={`mt-3 ${labelCls}`}>中文名称</label>
      <input
        type="text"
        value={form.name}
        onChange={(e) => update("name", e.target.value)}
        placeholder="商品中文名称"
        className={inputCls}
      />

      <label className={`mt-3 ${labelCls}`}>英文名称</label>
      <input
        type="text"
        value={form.nameEn}
        onChange={(e) => update("nameEn", e.target.value)}
        placeholder="商品英文名称"
        className={inputCls}
      />

      <div className="mt-3 flex gap-3">
        {NUM_FIELDS.map((f) => (
          <div key={f.field} className="flex-1">
            <label className={labelCls}>{f.label}</label>
            <input
              type="number"
              value={form[f.field]}
              onChange={(e) => update(f.field, e.target.value)}
              placeholder="0"
              className={inputCls}
            />
          </div>
        ))}
      </div>

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
        {cats.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <div className="mt-5 flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 rounded-full border border-blush py-2.5 text-sm font-medium text-ink"
        >
          取消
        </button>
        <button
          onClick={handleSave}
          className="flex-[2] rounded-full bg-accent py-2.5 text-sm font-medium text-white active:scale-95"
        >
          保存
        </button>
      </div>
    </div>
  );
}
