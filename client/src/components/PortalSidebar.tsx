import { BadgeCheck, Clock3, Flame, Gamepad2, Heart, House, RefreshCw, Sparkles, Trophy, UsersRound } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import AdBannerView from "@/components/AdBannerView";
import type { AdBanner, AdSlot } from "../../../shared/ads";
import type { CategoryKey, PortalGame, PortalView } from "../../../shared/games";

type NavView = PortalView;
type Labels = {
  all: string;
  history: string;
  favorites: string;
  new: string;
  hot: string;
  updated: string;
  originals: string;
  multiplayer: string;
  leaderboards: string;
  categories: string;
  ad: string;
};

type Props = {
  collapsed: boolean;
  labels: Labels;
  categoryLabels: Record<CategoryKey, string>;
  categoryIcons: Record<CategoryKey, LucideIcon>;
  categories: CategoryKey[];
  games: PortalGame[];
  view: NavView;
  category: CategoryKey | "all";
  isPlayer: boolean;
  sidebarBanner?: AdBanner;
  onView: (view: NavView) => void;
  onCategory: (category: CategoryKey) => void;
};

export default function PortalSidebar({ collapsed, labels, categoryLabels, categoryIcons, categories, games, view, category, isPlayer, sidebarBanner, onView, onCategory }: Props) {
  const navigation: { key: NavView; label: string; Icon: LucideIcon }[] = [
    { key: "all", label: labels.all, Icon: House },
    { key: "history", label: labels.history, Icon: Clock3 },
    ...(isPlayer ? [{ key: "favorites" as const, label: labels.favorites, Icon: Heart }] : []),
    { key: "new", label: labels.new, Icon: Sparkles },
    { key: "hot", label: labels.hot, Icon: Flame },
    { key: "updated", label: labels.updated, Icon: RefreshCw },
    { key: "originals", label: labels.originals, Icon: BadgeCheck },
    { key: "multiplayer", label: labels.multiplayer, Icon: UsersRound },
    { key: "leaderboards", label: labels.leaderboards, Icon: Trophy },
  ];

  return <div className="flex h-full flex-col gap-5">
    <div className={`flex items-center gap-2.5 px-1 ${collapsed ? "justify-center" : ""}`}>
      <span title="GameHaven" className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground shadow-[0_0_28px_rgba(183,255,66,.18)]"><Gamepad2 className="size-5" /></span>
      {!collapsed && <span className="text-lg font-black">GAME<span className="text-primary">HAVEN</span><span className="ml-1 text-[10px] text-muted-foreground">PLUS</span></span>}
    </div>

    <nav className="space-y-1 border-b border-border pb-4" aria-label="Quick navigation">
      {navigation.map(({ key, label, Icon }) => {
        const active = view === key && category === "all";
        return <button key={key} type="button" data-nav-view={key} onClick={() => onView(key)} title={collapsed ? label : undefined} aria-label={label} aria-current={active ? "page" : undefined} className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors ${active ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent/70 hover:text-foreground"} ${collapsed ? "justify-center px-0" : ""}`}>
          <Icon className="size-4 shrink-0" />{!collapsed && <span>{label}</span>}
        </button>;
      })}
    </nav>

    <div>
      {!collapsed && <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[.12em] text-muted-foreground">{labels.categories}</p>}
      <nav className="space-y-1" aria-label="Game genres">
        {categories.map(key => {
          const Icon = categoryIcons[key];
          return <button key={key} type="button" data-game-genre={key} onClick={() => onCategory(key)} title={collapsed ? categoryLabels[key] : undefined} aria-label={categoryLabels[key]} aria-current={category === key ? "page" : undefined} className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors ${category === key ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent/70 hover:text-foreground"} ${collapsed ? "justify-center px-0" : ""}`}>
            <Icon className="size-4 shrink-0" />
            {!collapsed && <><span className="min-w-0 flex-1 truncate text-left">{categoryLabels[key]}</span><span className="text-xs text-muted-foreground">{games.filter(game => game.category === key).length}</span></>}
          </button>;
        })}
      </nav>
    </div>

    {!collapsed && <AdBannerView banner={sidebarBanner} label={labels.ad} dimensions="300 × 250" className="mt-auto aspect-[6/5] w-full" />}
  </div>;
}
