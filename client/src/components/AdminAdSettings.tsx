import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import type { AdBanner, AdSlot } from "../../../shared/ads";
import type { Locale } from "../../../shared/games";
import { trpc } from "@/lib/trpc";
import AdBannerView from "./AdBannerView";

const labels = {
  ru: {
    title: "Рекламные баннеры",
    hint: "Укажите прямую HTTPS-ссылку на изображение и адрес, куда должен вести баннер. Оставьте поля пустыми, чтобы убрать рекламу.",
    leaderboard: "Верхний баннер — 728 × 90",
    sidebar: "Боковой баннер — 300 × 250",
    image: "URL изображения баннера",
    target: "Ссылка при нажатии",
    save: "Сохранить баннер",
    saving: "Сохранение…",
    saved: "Баннер сохранён",
    imageHint: "Прямая ссылка на JPG, PNG, WebP или GIF",
    targetHint: "Можно оставить пустым, тогда баннер не будет кликабельным.",
  },
  en: {
    title: "Advertising banners",
    hint: "Enter a direct HTTPS image URL and the destination opened by the banner. Leave both fields empty to remove it.",
    leaderboard: "Top banner — 728 × 90",
    sidebar: "Sidebar banner — 300 × 250",
    image: "Banner image URL",
    target: "Click-through URL",
    save: "Save banner",
    saving: "Saving…",
    saved: "Banner saved",
    imageHint: "Direct link to a JPG, PNG, WebP, or GIF",
    targetHint: "Optional. Leave blank to make the banner non-clickable.",
  },
  zh: {
    title: "广告横幅",
    hint: "输入图片直链和点击横幅后打开的目标地址。两个字段都留空即可移除广告。",
    leaderboard: "顶部横幅 — 728 × 90",
    sidebar: "侧边横幅 — 300 × 250",
    image: "横幅图片 URL",
    target: "点击跳转链接",
    save: "保存横幅",
    saving: "保存中…",
    saved: "横幅已保存",
    imageHint: "JPG、PNG、WebP 或 GIF 的直链",
    targetHint: "可选。留空时横幅不可点击。",
  },
} as const;

function BannerForm({ slot, banner, locale, onSaved }: { slot: AdSlot; banner?: AdBanner; locale: Locale; onSaved: () => void }) {
  const t = labels[locale];
  const [imageUrl, setImageUrl] = useState(banner?.imageUrl ?? "");
  const [targetUrl, setTargetUrl] = useState(banner?.targetUrl ?? "");
  const update = trpc.portal.updateAdBanner.useMutation({
    onSuccess: () => { toast.success(t.saved); onSaved(); },
    onError: error => toast.error(error.message),
  });
  const title = slot === "leaderboard" ? t.leaderboard : t.sidebar;
  const previewClass = slot === "leaderboard" ? "aspect-[728/90] w-full" : "aspect-[6/5] w-full";
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    update.mutate({ slot, imageUrl: imageUrl.trim(), targetUrl: targetUrl.trim() });
  };

  return <form onSubmit={handleSubmit} className="grid content-start gap-3 rounded-lg border border-border bg-secondary/30 p-4">
    <h4 className="text-sm font-bold">{title}</h4>
    <AdBannerView banner={{ imageUrl, targetUrl }} label={title} dimensions={title.split("—").at(-1)?.trim() ?? ""} className={previewClass} />
    <label className="grid gap-1.5 text-xs text-muted-foreground">{t.image}
      <input type="url" value={imageUrl} onChange={event => setImageUrl(event.target.value)} placeholder="https://cdn.example.com/banner.webp" className="min-w-0 rounded border border-border bg-secondary px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary" />
      <span>{t.imageHint}</span>
    </label>
    <label className="grid gap-1.5 text-xs text-muted-foreground">{t.target}
      <input type="url" value={targetUrl} onChange={event => setTargetUrl(event.target.value)} placeholder="https://advertiser.example.com/offer" className="min-w-0 rounded border border-border bg-secondary px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary" />
      <span>{t.targetHint}</span>
    </label>
    <button type="submit" disabled={update.isPending} className="rounded-md bg-primary px-4 py-2.5 text-sm font-black text-primary-foreground disabled:opacity-60">{update.isPending ? t.saving : t.save}</button>
  </form>;
}

export default function AdminAdSettings({ banners, locale, onSaved }: { banners?: Partial<Record<AdSlot, AdBanner>>; locale: Locale; onSaved: () => void }) {
  const t = labels[locale];
  return <section className="mb-6 rounded-xl border border-primary/25 bg-primary/5 p-4 sm:p-5">
    <div className="mb-4">
      <h3 className="text-base font-black text-primary">{t.title}</h3>
      <p className="mt-1 text-xs leading-5 text-muted-foreground">{t.hint}</p>
    </div>
    <div className="grid gap-4 lg:grid-cols-2">
      <BannerForm key={`leaderboard-${banners?.leaderboard?.imageUrl ?? ""}-${banners?.leaderboard?.targetUrl ?? ""}`} slot="leaderboard" banner={banners?.leaderboard} locale={locale} onSaved={onSaved} />
      <BannerForm key={`sidebar-${banners?.sidebar?.imageUrl ?? ""}-${banners?.sidebar?.targetUrl ?? ""}`} slot="sidebar" banner={banners?.sidebar} locale={locale} onSaved={onSaved} />
    </div>
  </section>;
}
