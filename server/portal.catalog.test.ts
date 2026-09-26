import { describe, expect, it } from "vitest";
import { defaultGames } from "../shared/games";

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
});
