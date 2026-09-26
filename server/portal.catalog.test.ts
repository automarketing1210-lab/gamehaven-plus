import { describe, expect, it } from "vitest";
import { categories, defaultGames, matchesPortalQuickView, normalizeCategory } from "../shared/games";

describe("default HTML5 game catalog", () => {
  it("keeps the original four game slugs and covers at the top", () => {
    expect(defaultGames.slice(0, 4).map(game => [game.slug, game.imageUrl])).toEqual([
      ["neon-drift", "/manus-storage/game-racing_26c9d0e9.jpg"],
      ["skyline-raider", "/manus-storage/game-action_e9a7e28f.jpg"],
      ["prism-shift", "/manus-storage/game-puzzle_bae12f0f.jpg"],
      ["hover-arena", "/manus-storage/game-io_846bbfae.jpg"],
    ]);
  });

  it("gives every game an original title and unique cover artwork", () => {
    expect(defaultGames).toHaveLength(12);
    expect(new Set(defaultGames.map(game => game.slug)).size).toBe(defaultGames.length);
    expect(new Set(defaultGames.map(game => game.imageUrl)).size).toBe(defaultGames.length);
    expect(defaultGames.every(game => game.titles.ru.trim() && game.titles.en.trim() && game.titles.zh.trim())).toBe(true);
  });

  it("exposes the complete requested genre list in the requested order", () => {
    expect(categories).toEqual([
      "action", "adventure", "arcade", "board", "card", "clicker", "driving", "io",
      "puzzle", "shooting", "simulation", "sports", "strategy", "trivia", "word",
    ]);
  });

  it("assigns every existing game to one of the visible genres", () => {
    expect(defaultGames.every(game => categories.includes(game.category))).toBe(true);
  });

  it("filters quick sections by new, hot, updated and multiplayer metadata", () => {
    const hot = new Set(["neon-drift"]);
    const now = Date.UTC(2026, 8, 26);
    const edited = { ...defaultGames[0]!, createdAt: new Date(now - 86_400_000), updatedAt: new Date(now - 3_600_000) };
    const seeded = { ...defaultGames[0]!, createdAt: new Date(now - 3_600_000), updatedAt: new Date(now - 3_600_000) };
    expect(defaultGames.filter(game => matchesPortalQuickView(game, "new", hot)).map(game => game.slug)).toEqual(["skyline-raider", "block-bloom", "portal-paws"]);
    expect(matchesPortalQuickView(defaultGames[0]!, "hot", hot)).toBe(true);
    expect(matchesPortalQuickView(edited, "updated", hot, now)).toBe(true);
    expect(matchesPortalQuickView(seeded, "updated", hot, now)).toBe(false);
    expect(matchesPortalQuickView(defaultGames[3]!, "multiplayer", hot)).toBe(true);
    expect(matchesPortalQuickView(defaultGames[0]!, "multiplayer", hot)).toBe(false);
  });

  it("normalizes legacy database genres without dropping saved games", () => {
    expect(normalizeCategory("racing")).toBe("driving");
    expect(normalizeCategory("shooters")).toBe("shooting");
    expect(normalizeCategory("puzzles")).toBe("puzzle");
    expect(normalizeCategory("casual", "block-bloom")).toBe("arcade");
    expect(normalizeCategory("casual", "pixel-frontier")).toBe("simulation");
    expect(normalizeCategory("unrecognized")).toBe("arcade");
  });
});
