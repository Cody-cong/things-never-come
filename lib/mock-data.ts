const IMAGE_BASE =
  "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image";

/** Build a generated-image URL for a given SDXL prompt + size. */
export function buildImageUrl(
  prompt: string,
  size: "square" | "portrait_4_3" | "portrait_16_9" | "landscape_4_3" | "landscape_16_9" = "square"
): string {
  return `${IMAGE_BASE}?prompt=${encodeURIComponent(prompt)}&image_size=${size}`;
}

/** 默认模拟用户（实际用户名/头像由 profile-store 维护） */
export const mockUser = {
  nickname: "Zara",
  avatar: "",
};
