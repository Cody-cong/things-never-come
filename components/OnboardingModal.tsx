"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  setUserProfile,
  DEFAULT_PROFILE,
  AVATAR_OPTIONS,
  DEFAULT_ADDRESS,
} from "@/lib/profile-store";

interface OnboardingModalProps {
  onComplete: () => void;
}

export default function OnboardingModal({ onComplete }: OnboardingModalProps) {
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(DEFAULT_PROFILE.avatar);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function handleDefault() {
    setUserProfile(DEFAULT_PROFILE);
    onComplete();
  }

  function handleConfirm() {
    const trimmed = name.trim();
    if (!trimmed) return;
    setUserProfile({ name: trimmed, avatar, address: DEFAULT_ADDRESS });
    onComplete();
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
    >
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-float">
        <h2
          id="onboarding-title"
          className="text-center text-lg font-semibold text-ink"
        >
          欢迎来到 things never come
        </h2>
        <p className="mt-1 text-center text-xs text-muted">
          选择你的头像和名字，开始虚拟购物
        </p>

        <div className="mt-6 flex justify-center">
          <div className="relative h-20 w-20 overflow-hidden rounded-full bg-cream shadow-card">
            <Image
              src={avatar}
              alt="选中的头像"
              fill
              sizes="80px"
              className="object-cover"
              priority
            />
          </div>
        </div>

        <div className="mt-5 grid grid-cols-5 gap-2">
          {AVATAR_OPTIONS.map((src, idx) => (
            <button
              key={src}
              onClick={() => setAvatar(src)}
              className={`relative h-12 w-12 overflow-hidden rounded-full transition ${
                avatar === src
                  ? "ring-2 ring-accent ring-offset-2"
                  : "opacity-80 hover:opacity-100"
              }`}
              aria-label={`选择头像 ${idx + 1}${
                avatar === src ? "（已选中）" : ""
              }`}
              aria-pressed={avatar === src}
            >
              <Image
                src={src}
                alt={`头像选项 ${idx + 1}`}
                fill
                sizes="48px"
                className="object-cover"
              />
            </button>
          ))}
        </div>

        <label htmlFor="onboarding-name" className="mt-5 block text-xs text-muted">
          你的名字
        </label>
        <input
          ref={inputRef}
          id="onboarding-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
          placeholder="怎么称呼您？"
          className="mt-1 w-full rounded-2xl border border-blush bg-cream/50 px-4 py-2.5 text-sm text-ink outline-none focus:border-accent"
        />

        <div className="mt-5 flex gap-3">
          <button
            onClick={handleDefault}
            className="flex-1 rounded-full border border-blush py-2.5 text-sm font-medium text-ink transition hover:bg-blush"
          >
            默认
          </button>
          <button
            onClick={handleConfirm}
            disabled={!name.trim()}
            className="flex-[2] rounded-full bg-accent py-2.5 text-sm font-medium text-white transition hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-50"
          >
            开始体验
          </button>
        </div>
      </div>
    </div>
  );
}
