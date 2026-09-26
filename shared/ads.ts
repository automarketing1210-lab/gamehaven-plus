export const adSlots = ["leaderboard", "sidebar"] as const;
export type AdSlot = (typeof adSlots)[number];

export type AdBanner = {
  imageUrl: string;
  targetUrl: string;
};

export type AdBannerSettings = Record<AdSlot, AdBanner>;

export const emptyAdBannerSettings: AdBannerSettings = {
  leaderboard: { imageUrl: "", targetUrl: "" },
  sidebar: { imageUrl: "", targetUrl: "" },
};
