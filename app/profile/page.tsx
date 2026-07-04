"use client";

import { useState, useEffect } from "react";
import {
  getUserProfile,
  setUserProfile,
  AVATAR_OPTIONS,
  DEFAULT_PROFILE,
} from "@/lib/profile-store";

export default function ProfilePage() {
  const [name, setName] = useState(DEFAULT_PROFILE.name);
  const [avatar, setAvatar] = useState(DEFAULT_PROFILE.avatar);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const profile = getUserProfile();
    setName(profile.name);
    setAvatar(profile.avatar);
  }, []);

  useEffect(() => {
    if (!saved) return;
    const t = setTimeout(() => setSaved(false), 1500);
    return () => clearTimeout(t);
  }, [saved]);

  const handleNameBlur = () => {
    const trimmed = name.trim() || DEFAULT_PROFILE.name;
    setName(trimmed);
    setUserProfile({ name: trimmed, avatar });
    setSaved(true);
  };

  const handleAvatarChange = (src: string) => {
    setAvatar(src);
    setUserProfile({ name: name.trim() || DEFAULT_PROFILE.name, avatar: src });
    setSaved(true);
  };

  return (
    <div className="mx-auto max-w-site px-4 py-6 md:px-8">
      <div className="rounded-2xl bg-white p-6 shadow-card">
        <div className="flex flex-col items-center gap-4">
          <div className="h-20 w-20 overflow-hidden rounded-full bg-cream shadow-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={avatar}
              alt="用户头像"
              className="h-full w-full object-cover"
            />
          </div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={handleNameBlur}
            className="w-full max-w-[12rem] rounded-2xl border border-blush bg-cream/50 px-4 py-2 text-center text-xl font-semibold text-ink outline-none focus:border-accent"
          />
        </div>

        <div className="mt-6">
          <p className="mb-3 text-center text-xs text-muted">点击切换头像</p>
          <div className="flex flex-wrap justify-center gap-3">
            {AVATAR_OPTIONS.map((src, idx) => (
              <button
                key={src}
                onClick={() => handleAvatarChange(src)}
                className={`h-12 w-12 overflow-hidden rounded-full transition ${
                  avatar === src
                    ? "ring-2 ring-accent ring-offset-2"
                    : "opacity-70 hover:opacity-100"
                }`}
                aria-label={`选择头像 ${idx + 1}${
                  avatar === src ? "（已选中）" : ""
                }`}
                aria-pressed={avatar === src}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={`头像选项 ${idx + 1}`}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {saved && (
        <div
          className="pointer-events-none fixed bottom-8 left-1/2 z-50 -translate-x-1/2 rounded-2xl bg-ink/80 px-4 py-2 text-sm text-white"
          role="status"
          aria-live="polite"
        >
          已保存
        </div>
      )}
    </div>
  );
}
