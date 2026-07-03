"use client";

import Link from "next/link";
import type { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
  bg?: string;
}

export default function ProductCard({ product, bg = "bg-blush" }: ProductCardProps) {
  return (
    <Link
      href={`/product/${product.id}`}
      className="group flex flex-col gap-2.5 rounded-3xl bg-white p-3 shadow-card transition active:scale-[0.97]"
    >
      <div
        className={`relative aspect-square w-full overflow-hidden rounded-2xl ${bg}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute left-2 top-2 h-1.5 w-1.5 rounded-full bg-white/60" />
        <div className="absolute right-3 top-4 h-1 w-1 rounded-full bg-white/50" />
        <div className="absolute bottom-3 right-2 h-2 w-2 rounded-full bg-white/40" />
      </div>
      <p className="line-clamp-1 text-sm font-semibold text-ink">
        {product.name}
      </p>
      <div className="flex items-center justify-between">
        <span className="text-base font-bold text-accent">
          ${product.price}
        </span>
      </div>
    </Link>
  );
}
