"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { Image as ImageIcon, Upload, X } from "lucide-react";
import { fileToCompressedDataUrl } from "@/lib/image-compress";

/**
 * 图片上传字段：选择文件后通过 canvas 压缩（最长边 800px / jpeg 0.82），
 * 输出 data URL 经 onChange 回传。受控组件，value 为 data URL 或 http URL。
 */
export default function ImageUploadField({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasImage = !!value.trim();

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const compressed = await fileToCompressedDataUrl(file);
      onChange(compressed);
    } catch {
      window.alert("图片处理失败，请换一张试试");
    } finally {
      setUploading(false);
      // 清空 value，允许重复选择同一文件触发 change
      e.target.value = "";
    }
  }

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* 预览：任意尺寸自适应填充，不变形 */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-sand">
        {hasImage ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value.trim()}
              alt="预览"
              className="h-full w-full object-cover"
              loading="lazy"
            />
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-accent-dark shadow-card backdrop-blur active:scale-95"
            >
              <X size={12} /> 移除
            </button>
          </>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted">
            <ImageIcon size={36} />
            <span className="text-xs">点击下方按钮上传图片</span>
          </div>
        )}
      </div>

      {/* 上传按钮：accent 描边 + blush 底 */}
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="mt-3 flex items-center justify-center gap-1.5 rounded-2xl border border-accent bg-blush py-2.5 text-sm font-medium text-accent-dark active:scale-[0.98] disabled:opacity-60"
      >
        <Upload size={14} />
        {uploading ? "处理中..." : hasImage ? "重新上传" : "点击上传图片"}
      </button>
    </>
  );
}
