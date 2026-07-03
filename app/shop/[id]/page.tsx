"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Store } from "lucide-react";

/**
 * 店铺概念已移除（数据层改为 Product.category 主键）。
 * 旧链接统一重定向回首页，避免外链 404。
 */
export default function ShopRedirectPage() {
  const router = useRouter();
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setLeaving(true);
      router.replace("/");
    }, 1000);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-light">
        <Store size={30} className="text-accent" />
      </div>
      <p className="text-sm font-medium text-ink">店铺已下线</p>
      <p className="text-xs text-muted">
        {leaving ? "正在回首页…" : "跟着包裹一起消失了，1 秒后回首页"}
      </p>
    </div>
  );
}
