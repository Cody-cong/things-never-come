"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageOff } from "lucide-react";

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  lazy?: boolean;
  priority?: boolean;
  sizes?: string;
}

export default function ProductImage({
  src,
  alt,
  className = "h-full w-full object-cover",
  containerClassName = "h-full w-full",
  lazy = true,
  priority = false,
  sizes = "(max-width: 768px) 50vw, 25vw",
}: ProductImageProps) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

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
    <div className={`${containerClassName} relative`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className={`${className} transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
        loading={lazy && !priority ? "lazy" : "eager"}
        priority={priority || !lazy}
        decoding="async"
        onError={() => setFailed(true)}
        onLoadingComplete={() => setLoaded(true)}
      />
    </div>
  );
}
