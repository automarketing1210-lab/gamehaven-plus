import { describe, expect, it } from "vitest";
import { matchPortalAccount } from "./portal-auth";

describe("portal credential roles", () => {
  const adminSecret = process.env.GAME_ADMIN_PASSWORD ?? "111";
  const playerSecret = process.env.GAME_PLAYER_PASSWORD ?? "222";

  it("maps the configured admin account to the admin role", () => {
    expect(matchPortalAccount("admin", adminSecret, adminSecret, playerSecret)).toEqual({ username: "admin", role: "admin" });
  });

  it("maps the configured player account to the player role", () => {
    expect(matchPortalAccount("igrok", playerSecret, adminSecret, playerSecret)).toEqual({ username: "igrok", role: "player" });
  });

  it("does not allow role escalation or unknown usernames", () => {
    expect(matchPortalAccount("admin", playerSecret, adminSecret, playerSecret)).toBeNull();
    expect(matchPortalAccount("igrok", adminSecret, adminSecret, playerSecret)).toBeNull();
    expect(matchPortalAccount("root", adminSecret, adminSecret, playerSecret)).toBeNull();
  });
});
