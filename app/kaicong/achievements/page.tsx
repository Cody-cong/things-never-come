"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import AdminGuard from "../components/AdminGuard";
import AchievementManager from "../AchievementManager";

export default function AdminAchievementsPage() {
  return (
    <AdminGuard>
      <div className="px-4 pt-5 pb-24">
        <div className="mb-4 flex items-center gap-2">
          <Link
            href="/kaicong"
            aria-label="返回"
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-blush"
          >
            <ChevronLeft size={22} className="text-ink" />
          </Link>
          <h1 className="text-base font-semibold text-ink">成就管理</h1>
        </div>
        <AchievementManager />
      </div>
    </AdminGuard>
  );
}
