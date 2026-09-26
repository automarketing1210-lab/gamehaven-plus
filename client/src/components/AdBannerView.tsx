import type { AdBanner } from "../../../shared/ads";

type Props = {
  banner?: AdBanner;
  label: string;
  dimensions: string;
  className: string;
};

export default function AdBannerView({ banner, label, dimensions, className }: Props) {
  const imageUrl = banner?.imageUrl?.trim() ?? "";
  const targetUrl = banner?.targetUrl?.trim() ?? "";
  const image = imageUrl ? <img src={imageUrl} alt={label} loading="lazy" className="h-full w-full object-cover" /> : null;
  const frameClass = `block overflow-hidden rounded-md ${className}`;

  if (!image) {
    return <div className={`grid place-items-center border border-dashed border-border bg-secondary/30 text-center text-[10px] uppercase tracking-[.1em] text-muted-foreground ${frameClass}`}>
      <span>{label}<br />{dimensions}</span>
    </div>;
  }

  if (/^https?:\/\//i.test(targetUrl)) {
    return <a href={targetUrl} target="_blank" rel="noopener noreferrer sponsored" aria-label={label} className={`${frameClass} transition-opacity hover:opacity-90`}>{image}</a>;
  }

  return <div className={frameClass}>{image}</div>;
}
