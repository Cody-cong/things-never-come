"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "lucide-react";
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
    <div className="mx-auto max-w-site px-6 py-8 md:px-8">
      <h1 className="text-2xl font-bold text-ink">设置</h1>

      <div className="mt-8 max-w-md">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent text-white shadow-card">
            <User size={40} strokeWidth={2} />
          </div>
        </div>

        <div className="mt-6">
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
            className="w-full rounded-xl bg-white px-4 py-3 text-sm text-ink shadow-card placeholder:text-muted outline-none focus:ring-2 focus:ring-accent/20"
          />
        </div>

        <button
          onClick={handleSave}
          className="mt-6 w-full rounded-full bg-accent py-3 text-sm font-bold text-white transition hover:bg-accent-dark"
        >
          保存
        </button>
      </div>
    </div>
  );
}
