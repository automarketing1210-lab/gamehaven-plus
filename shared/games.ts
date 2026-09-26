export type Locale = "ru" | "en" | "zh";
export type Role = "admin" | "player" | "user";
export type CategoryKey = "racing" | "action" | "shooters" | "puzzles" | "sports" | "io" | "adventure" | "casual";
export type LocalizedText = Record<Locale, string>;
export type LocalizedList = Record<Locale, string[]>;

export type PortalGame = {
  slug: string;
  titles: LocalizedText;
  category: CategoryKey;
  tags: string[];
  descriptions: LocalizedText;
  controls: LocalizedList;
  imageUrl: string;
  gameUrl: string | null;
  rating: number;
  plays: number;
  year: number;
  badge: "hit" | "new" | "top" | null;
};

export const categories: CategoryKey[] = ["racing", "action", "shooters", "puzzles", "sports", "io", "adventure", "casual"];

// The original four cover artworks and names stay first. Each following game gets its own artwork.
export const defaultGames: PortalGame[] = [
  {
    slug: "neon-drift", titles: { ru: "Neon Drift", en: "Neon Drift", zh: "Neon Drift" }, category: "racing", tags: ["дрифт", "гонки", "3D"],
    descriptions: { ru: "Ночные заезды по неоновому мегаполису. Дрифтуйте в миллиметрах от соперников и собирайте нитро.", en: "Race through a neon metropolis at night. Drift past rivals and collect nitro boosts.", zh: "在霓虹都市展开夜间竞速，贴身漂移超越对手并收集氮气加速。" },
    controls: { ru: ["WASD — движение", "Пробел — ручной тормоз", "Shift — нитро"], en: ["WASD — drive", "Space — handbrake", "Shift — nitro"], zh: ["WASD — 驾驶", "空格 — 手刹", "Shift — 氮气"] },
    imageUrl: "/manus-storage/game-racing_26c9d0e9.jpg", gameUrl: null, rating: 4.9, plays: 12800000, year: 2026, badge: "hit",
  },
  {
    slug: "skyline-raider", titles: { ru: "Skyline Raider", en: "Skyline Raider", zh: "Skyline Raider" }, category: "adventure", tags: ["паркур", "экшен", "герой"],
    descriptions: { ru: "Покоряйте летающий город с крюком-кошкой и пробирайтесь через головокружительные уровни.", en: "Swing across a floating city with a grappling hook and conquer dizzying levels.", zh: "使用抓钩穿越漂浮城市，挑战令人目眩的关卡。" },
    controls: { ru: ["WASD — движение", "Мышь — прицел", "E — крюк"], en: ["WASD — move", "Mouse — aim", "E — grapple"], zh: ["WASD — 移动", "鼠标 — 瞄准", "E — 抓钩"] },
    imageUrl: "/manus-storage/game-action_e9a7e28f.jpg", gameUrl: null, rating: 4.8, plays: 7600000, year: 2026, badge: "new",
  },
  {
    slug: "prism-shift", titles: { ru: "Prism Shift", en: "Prism Shift", zh: "Prism Shift" }, category: "puzzles", tags: ["логика", "порталы", "блоки"],
    descriptions: { ru: "Меняйте гравитацию, соединяйте кристаллы и открывайте порталы в футуристической лаборатории.", en: "Shift gravity, connect crystals and unlock portals in a futuristic lab.", zh: "在未来实验室切换重力、连接水晶并开启传送门。" },
    controls: { ru: ["Мышь — выбор", "R — перезапуск", "Z — отмена"], en: ["Mouse — select", "R — restart", "Z — undo"], zh: ["鼠标 — 选择", "R — 重玩", "Z — 撤销"] },
    imageUrl: "/manus-storage/game-puzzle_bae12f0f.jpg", gameUrl: null, rating: 4.7, plays: 4200000, year: 2025, badge: "top",
  },
  {
    slug: "hover-arena", titles: { ru: "Hover Arena", en: "Hover Arena", zh: "Hover Arena" }, category: "io", tags: ["мультиплеер", "арена", "гонки"],
    descriptions: { ru: "Соревнуйтесь на воздушных аренах, сталкивайте соперников и останьтесь последним пилотом.", en: "Battle on hover arenas, bump rivals out and become the last pilot standing.", zh: "在悬浮竞技场中与对手碰撞，成为最后的飞行员。" },
    controls: { ru: ["WASD — движение", "Мышь — камера", "Пробел — ускорение"], en: ["WASD — move", "Mouse — camera", "Space — boost"], zh: ["WASD — 移动", "鼠标 — 镜头", "空格 — 加速"] },
    imageUrl: "/manus-storage/game-io_846bbfae.jpg", gameUrl: null, rating: 4.6, plays: 9100000, year: 2026, badge: "hit",
  },
  {
    slug: "strike-point", titles: { ru: "Strike Point", en: "Strike Point", zh: "Strike Point" }, category: "shooters", tags: ["FPS", "тактика", "онлайн"],
    descriptions: { ru: "Быстрые тактические матчи на компактных аренах с точной стрельбой и мгновенным стартом.", en: "Fast tactical matches on compact arenas with precise shooting and instant action.", zh: "在紧凑地图上展开快速战术对决，精准射击，即刻开战。" },
    controls: { ru: ["WASD — движение", "Мышь — прицел", "R — перезарядка"], en: ["WASD — move", "Mouse — aim", "R — reload"], zh: ["WASD — 移动", "鼠标 — 瞄准", "R — 换弹"] },
    imageUrl: "/manus-storage/strike-point_0e5df852.jpg", gameUrl: null, rating: 4.5, plays: 6500000, year: 2025, badge: null,
  },
  {
    slug: "turbo-league", titles: { ru: "Turbo League", en: "Turbo League", zh: "Turbo League" }, category: "sports", tags: ["футбол", "машины", "аркада"],
    descriptions: { ru: "Футбол на реактивных машинах: забивайте с воздуха и защищайте ворота вместе с командой.", en: "Rocket-powered car football: score from the air and defend your goal as a team.", zh: "驾驶火箭赛车踢足球：腾空射门，与队友一起守护球门。" },
    controls: { ru: ["Стрелки — движение", "X — прыжок", "C — ускорение"], en: ["Arrows — drive", "X — jump", "C — boost"], zh: ["方向键 — 驾驶", "X — 跳跃", "C — 加速"] },
    imageUrl: "/manus-storage/turbo-league_38b4985b.jpg", gameUrl: null, rating: 4.7, plays: 5900000, year: 2024, badge: null,
  },
  {
    slug: "block-bloom", titles: { ru: "Block Bloom", en: "Block Bloom", zh: "Block Bloom" }, category: "casual", tags: ["блоки", "релакс", "комбо"],
    descriptions: { ru: "Собирайте сияющие фигуры в линии и создавайте длинные цепочки комбо без таймера.", en: "Line up glowing shapes and build satisfying combos at your own pace — no timer.", zh: "将发光方块排成直线，轻松连击，没有时间限制。" },
    controls: { ru: ["Мышь — перемещение", "Клик — разместить", "Esc — пауза"], en: ["Mouse — move", "Click — place", "Esc — pause"], zh: ["鼠标 — 移动", "点击 — 放置", "Esc — 暂停"] },
    imageUrl: "/manus-storage/block-bloom_5b4762f2.jpg", gameUrl: null, rating: 4.4, plays: 3800000, year: 2026, badge: "new",
  },
  {
    slug: "zero-zone", titles: { ru: "Zero Zone", en: "Zero Zone", zh: "Zero Zone" }, category: "action", tags: ["выживание", "арена", "волны"],
    descriptions: { ru: "Отбивайтесь от волн дронов, комбинируйте оружие и продержитесь до эвакуации.", en: "Survive waves of drones, combine weapons and hold out until extraction.", zh: "抵御一波波无人机，组合武器并坚持到撤离时刻。" },
    controls: { ru: ["WASD — движение", "Мышь — атака", "1–3 — оружие"], en: ["WASD — move", "Mouse — attack", "1–3 — weapons"], zh: ["WASD — 移动", "鼠标 — 攻击", "1–3 — 武器"] },
    imageUrl: "/manus-storage/zero-zone_376d2d43.jpg", gameUrl: null, rating: 4.6, plays: 8100000, year: 2025, badge: null,
  },
  {
    slug: "circuit-sprint", titles: { ru: "Circuit Sprint", en: "Circuit Sprint", zh: "Circuit Sprint" }, category: "racing", tags: ["скорость", "тайм-атак", "аркада"],
    descriptions: { ru: "Короткие техничные трассы, призрачные соперники и борьба за сотые доли секунды.", en: "Technical short tracks, ghost rivals and a fight for every fraction of a second.", zh: "挑战高技巧短赛道，与幽灵对手争夺每一毫秒。" },
    controls: { ru: ["WASD — движение", "Shift — нитро", "R — рестарт"], en: ["WASD — drive", "Shift — nitro", "R — restart"], zh: ["WASD — 驾驶", "Shift — 氮气", "R — 重来"] },
    imageUrl: "/manus-storage/circuit-sprint_c7aeca2c.jpg", gameUrl: null, rating: 4.3, plays: 2700000, year: 2024, badge: null,
  },
  {
    slug: "portal-paws", titles: { ru: "Portal Paws", en: "Portal Paws", zh: "Portal Paws" }, category: "adventure", tags: ["платформер", "головоломка", "кот"],
    descriptions: { ru: "Помогите космическому коту вернуться домой, прыгая между измерениями и собирая звёзды.", en: "Help a space cat get home by jumping between dimensions and collecting stars.", zh: "帮助太空猫穿梭不同维度、收集星星并回到家园。" },
    controls: { ru: ["Стрелки — движение", "Пробел — прыжок", "E — портал"], en: ["Arrows — move", "Space — jump", "E — portal"], zh: ["方向键 — 移动", "空格 — 跳跃", "E — 传送门"] },
    imageUrl: "/manus-storage/portal-paws_66edbb6b.jpg", gameUrl: null, rating: 4.8, plays: 3400000, year: 2026, badge: "new",
  },
  {
    slug: "goal-rush", titles: { ru: "Goal Rush", en: "Goal Rush", zh: "Goal Rush" }, category: "sports", tags: ["футбол", "пенальти", "быстрая"],
    descriptions: { ru: "Серия пенальти с идеальной физикой удара. Читайте вратаря и попадайте в девятку.", en: "A penalty shootout with satisfying shot physics. Read the keeper and hit the top corner.", zh: "体验畅快的点球大战，看准门将，将球射入死角。" },
    controls: { ru: ["Мышь — направление", "Удержание — сила", "Пробел — удар"], en: ["Mouse — direction", "Hold — power", "Space — shoot"], zh: ["鼠标 — 方向", "按住 — 力量", "空格 — 射门"] },
    imageUrl: "/manus-storage/goal-rush_deaf24c8.jpg", gameUrl: null, rating: 4.2, plays: 2100000, year: 2025, badge: null,
  },
  {
    slug: "pixel-frontier", titles: { ru: "Pixel Frontier", en: "Pixel Frontier", zh: "Pixel Frontier" }, category: "casual", tags: ["крафт", "исследование", "пиксели"],
    descriptions: { ru: "Исследуйте уютный бесконечный мир, собирайте ресурсы и стройте собственную базу.", en: "Explore a cozy endless world, gather resources and build a base of your own.", zh: "探索舒适无尽的世界，采集资源并建造自己的基地。" },
    controls: { ru: ["WASD — движение", "Мышь — действие", "I — инвентарь"], en: ["WASD — move", "Mouse — interact", "I — inventory"], zh: ["WASD — 移动", "鼠标 — 互动", "I — 背包"] },
    imageUrl: "/manus-storage/pixel-frontier_df01fd37.jpg", gameUrl: null, rating: 4.5, plays: 4700000, year: 2024, badge: null,
  },
];

export const localeLabels: Record<Locale, string> = { ru: "Русский", en: "English", zh: "简体中文" };
