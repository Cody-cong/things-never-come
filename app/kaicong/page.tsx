"use client";

import Link from "next/link";
import { Package, Tags, HelpCircle, MessageSquare, Trophy } from "lucide-react";
import AdminGuard from "./components/AdminGuard";

const ITEMS = [
  {
    href: "/kaicong/products",
    label: "商品管理",
    icon: Package,
    color: "bg-mint",
  },
  {
    href: "/kaicong/categories",
    label: "分类管理",
    icon: Tags,
    color: "bg-blush",
  },
  {
    href: "/kaicong/faqs",
    label: "FAQ管理",
    icon: HelpCircle,
    color: "bg-lavender",
  },
  {
    href: "/kaicong/feedbacks",
    label: "用户反馈查看",
    icon: MessageSquare,
    color: "bg-sky",
  },
  {
    href: "/kaicong/achievements",
    label: "成就管理",
    icon: Trophy,
    color: "bg-mint",
  },
];

export default function AdminDashboardPage() {
  return (
    <AdminGuard>
      <div className="mx-auto max-w-site px-6 py-10 md:px-8">
        <h1 className="mb-2 text-center text-xl font-semibold text-ink">管理后台</h1>
        <p className="mb-8 text-center text-sm text-muted">选择一个功能进入</p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {ITEMS.map(({ href, label, icon: Icon, color }) => (
            <Link
              key={href}
              href={href}
              className="pastel-card flex items-center gap-4 p-5 transition hover:shadow-soft active:scale-[0.98]"
            >
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${color}`}
              >
                <Icon size={24} className="text-ink" />
              </div>
              <div>
                <p className="text-base font-semibold text-ink">{label}</p>
                <p className="mt-0.5 text-xs text-muted">点击进入管理</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AdminGuard>
  );
}
