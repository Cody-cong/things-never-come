"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, User } from "lucide-react";
import { getNickname, setNickname } from "@/lib/mock-data";

export default function SettingsPage() {
  const router = useRouter();
  const [name, setName] = useState("");

  useEffect(() => {
    setName(getNickname());
  }, []);

  const handleSave = () => {
    setNickname(name);
    router.push("/profile");
  };

  return (
    <div className="flex flex-1 flex-col bg-[#f2f5ff]">
      {/* Header */}
      <div className="sticky top-0 z-30 flex items-center gap-3 bg-[#f2f5ff]/90 px-4 py-3.5 backdrop-blur-md">
        <button
          onClick={() => router.back()}
          aria-label="返回"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-card transition active:scale-95"
        >
          <ChevronLeft size={22} className="text-ink" />
        </button>
        <h1 className="text-lg font-bold text-ink">设置</h1>
      </div>

      {/* Avatar + name input */}
      <div className="flex flex-col items-center gap-4 px-6 pt-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent text-white shadow-card">
          <User size={40} strokeWidth={2} />
        </div>
        <div className="w-full">
          <label
            htmlFor="nickname"
            className="mb-2 block text-sm font-medium text-ink"
          >
            用户名
          </label>
          <input
            id="nickname"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="请输入用户名"
            className="w-full rounded-2xl bg-white px-4 py-3 text-sm text-ink shadow-card placeholder:text-muted focus:outline-none"
          />
        </div>
      </div>

      {/* Save button */}
      <div className="mt-auto px-6 pb-28 pt-8">
        <button
          onClick={handleSave}
          className="w-full rounded-2xl bg-accent py-3.5 text-sm font-bold text-white shadow-card transition active:scale-[0.98]"
        >
          保存
        </button>
      </div>
    </div>
  );
}
