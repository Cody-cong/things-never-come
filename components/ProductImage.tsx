"use client";

import { useState } from "react";
import { ImageOff } from "lucide-react";

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  lazy?: boolean;
}

export default function ProductImage({
  src,
  alt,
  className = "h-full w-full object-cover",
  containerClassName = "h-full w-full",
  lazy = true,
}: ProductImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`${containerClassName} flex items-center justify-center bg-cream`}
        style={{ aspectRatio: "1 / 1" }}
      >
        <div className="flex flex-col items-center text-muted/70">
          <ImageOff size={24} />
          <span className="mt-1 text-[10px]">图片加载失败</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className={className}
        loading={lazy ? "lazy" : undefined}
        decoding="async"
        onError={() => setFailed(true)}
      />
    </>
  );
}
