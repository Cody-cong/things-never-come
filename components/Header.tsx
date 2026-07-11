"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/lib/cart-context";
import Logo from "@/components/Logo";

const NAVS = [
  { href: "/", label: "首页" },
  { href: "/category", label: "分类" },
  { href: "/#howto", label: "玩法" },
  { href: "/#faq", label: "FAQ" },
  { href: "/#feedback", label: "反馈" },
  { href: "/profile", label: "我的" },
];

export default function Header() {
  const pathname = usePathname();
  const { totalCount } = useCart();
  const [hidden, setHidden] = useState(false);
  const [cartBump, setCartBump] = useState(false);
  const rafRef = useRef<number | null>(null);
  const pendingY = useRef(0);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    function handleScroll() {
      pendingY.current = window.scrollY;
      if (rafRef.current !== null) return;

      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        const currentY = pendingY.current;

        // 页面顶部时始终显示
        if (currentY < 20) {
          setHidden(false);
          lastScrollYRef.current = currentY;
          return;
        }
        // 往下滑动超过阈值时收起，往上翻时出现
        if (currentY > lastScrollYRef.current && currentY > 60) {
          setHidden(true);
        } else if (currentY < lastScrollYRef.current) {
          setHidden(false);
        }
        lastScrollYRef.current = currentY;
      });
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (totalCount === 0) return;
    setCartBump(true);
    const t = setTimeout(() => setCartBump(false), 350);
    return () => clearTimeout(t);
  }, [totalCount]);

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 w-full border-b border-ink/5 bg-cream/80 backdrop-blur-sm transition-transform duration-300 ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="mx-auto flex max-w-site items-center justify-between px-6 py-4 md:px-8">
        <Logo size={36} />

        <nav className="hidden items-center gap-8 md:flex">
          {NAVS.map(({ href, label }) => {
            const isHash = href.includes("#");
            const active = !isHash && (href === "/" ? pathname === "/" : pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={`text-sm font-medium transition hover:text-accent ${
                  active ? "text-accent" : "text-muted"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            id="cart-target"
            href="/cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-card transition hover:shadow-soft"
            aria-label="购物车"
          >
            <span className={cartBump ? "icon-bounce inline-flex" : "inline-flex"}>
              <ShoppingCart size={18} className="text-ink" />
            </span>
            {totalCount > 0 && (
              <span
                key={totalCount}
                className="badge-pop absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-accent px-1.5 text-[10px] font-bold text-white"
              >
                {totalCount > 99 ? "99+" : totalCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
