"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Home, ShoppingCart, User, LucideIcon } from "lucide-react";
import { useCartState } from "@/lib/cart-context";

interface NavItem {
  href: string;
  icon: LucideIcon;
  label: string;
}

const NAVS: NavItem[] = [
  { href: "/", icon: Home, label: "首页" },
  { href: "/cart", icon: ShoppingCart, label: "购物车" },
  { href: "/profile", icon: User, label: "我的" },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { totalCount } = useCartState();
  const [cartBump, setCartBump] = useState(false);

  useEffect(() => {
    if (totalCount === 0) return;
    setCartBump(true);
    const t = setTimeout(() => setCartBump(false), 300);
    return () => clearTimeout(t);
  }, [totalCount]);

  if (pathname.startsWith("/product")) {
    return null;
  }

  return (
    <nav className="sticky bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t border-blush/50 bg-white/95 backdrop-blur-md shadow-[0_-4px_20px_rgba(93,64,55,0.04)] md:hidden">
      {NAVS.map(({ href, icon: Icon, label }) => {
        const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-label={label}
            className="relative flex h-full flex-1 items-center justify-center"
          >
            <span className="relative inline-flex">
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-2xl transition-all ${
                  active
                    ? "bg-accent/10 scale-105"
                    : ""
                }`}
              >
                <Icon
                  size={22}
                  strokeWidth={active ? 2.5 : 2}
                  className={active ? "text-accent" : "text-muted"}
                />
              </div>
              {href === "/cart" && totalCount > 0 && (
                <span
                  className={`absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-accent px-1.5 text-[10px] font-bold text-white shadow-card ${
                    cartBump ? "animate-bump" : ""
                  }`}
                >
                  {totalCount > 99 ? "99+" : totalCount}
                </span>
              )}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
