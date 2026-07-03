const IMAGE_BASE =
  "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image";

/** Build a generated-image URL for a given SDXL prompt + size. */
export function buildImageUrl(
  prompt: string,
  size: "square" | "portrait_4_3" | "portrait_16_9" | "landscape_4_3" | "landscape_16_9" = "square"
): string {
  return `${IMAGE_BASE}?prompt=${encodeURIComponent(prompt)}&image_size=${size}`;
}

/** 当前模拟用户（avatar 留空，前端用图标代替） */
export const mockUser = {
  nickname: "Zara",
  avatar: "",
};

import { getUserProfile, setUserProfile } from "./profile-store";

const NICKNAME_KEY = "gnickname";

export function getNickname(): string {
  if (typeof window === "undefined") return mockUser.nickname;
  return getUserProfile().name || mockUser.nickname;
}

export function setNickname(name: string): void {
  if (typeof window === "undefined") return;
  const current = getUserProfile();
  setUserProfile({ ...current, name: name.trim() || mockUser.nickname });
  // 保持旧 key 同步，避免其他旧逻辑读到旧值
  localStorage.setItem(NICKNAME_KEY, name.trim() || mockUser.nickname);
}
