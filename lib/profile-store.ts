export interface UserProfile {
  name: string;
  avatar: string;
  address: string;
}

const KEY = "gnc_user_profile_v1";
const LEGACY_NICKNAME_KEY = "gnickname";

const AVATAR_BASE = "/头像";

export const AVATAR_OPTIONS = [
  `${AVATAR_BASE}/keroro军曹_1_幻夜灵猫🐱_来自小红书网页版.jpg`,
  `${AVATAR_BASE}/tamama头像_2_看见彩虹了_来自小红书网页版.jpg`,
  `${AVATAR_BASE}/军曹keroro头像来啦hhhhh_3_Luna Wallpaper Lab_来自小红书网页版.jpg`,
  `${AVATAR_BASE}/军曹keroro头像来啦hhhhh_4_Luna Wallpaper Lab_来自小红书网页版.jpg`,
  `${AVATAR_BASE}/军曹keroro头像来啦hhhhh_5_Luna Wallpaper Lab_来自小红书网页版.jpg`,
];

export const DEFAULT_ADDRESS = "trae创意小镇";

export const DEFAULT_PROFILE: UserProfile = {
  name: "Zara",
  avatar: AVATAR_OPTIONS[1],
  address: DEFAULT_ADDRESS,
};

function read(): UserProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<UserProfile>;
    if (parsed && typeof parsed.name === "string" && typeof parsed.avatar === "string") {
      return {
        name: parsed.name,
        avatar: parsed.avatar,
        address: typeof parsed.address === "string" ? parsed.address : DEFAULT_ADDRESS,
      };
    }
    return null;
  } catch {
    return null;
  }
}

export function hasUserProfile(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(KEY) !== null;
}

export function getUserProfile(): UserProfile {
  const stored = read();
  if (stored) return stored;

  // 兼容旧版昵称数据
  if (typeof window !== "undefined") {
    const legacy = localStorage.getItem(LEGACY_NICKNAME_KEY);
    if (legacy) {
      return { name: legacy, avatar: DEFAULT_PROFILE.avatar, address: DEFAULT_ADDRESS };
    }
  }

  return DEFAULT_PROFILE;
}

export function setUserProfile(profile: UserProfile): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    KEY,
    JSON.stringify({
      name: profile.name.trim() || DEFAULT_PROFILE.name,
      avatar: profile.avatar || DEFAULT_PROFILE.avatar,
      address: profile.address.trim() || DEFAULT_ADDRESS,
    })
  );
}
