import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createContext(): { ctx: TrpcContext; cookies: unknown[] } {
  const cookies: unknown[] = [];
  const ctx: TrpcContext = {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { cookie: (...args: unknown[]) => cookies.push(args) } as unknown as TrpcContext["res"],
  };
  return { ctx, cookies };
}

describe("portal login secrets", () => {
  it("accepts the configured admin password via the API endpoint", async () => {
    const configuredPassword = process.env.GAME_ADMIN_PASSWORD;
    expect(configuredPassword, "GAME_ADMIN_PASSWORD must be injected into the test runtime").toBeTruthy();
    const { ctx, cookies } = createContext();
    const result = await appRouter.createCaller(ctx).portal.login({ username: "admin", password: configuredPassword! });
    expect(result).toEqual({ username: "admin", role: "admin" });
    expect(cookies).toHaveLength(1);
  });

  it("accepts the configured player password via the API endpoint", async () => {
    const configuredPassword = process.env.GAME_PLAYER_PASSWORD;
    expect(configuredPassword, "GAME_PLAYER_PASSWORD must be injected into the test runtime").toBeTruthy();
    const { ctx, cookies } = createContext();
    const result = await appRouter.createCaller(ctx).portal.login({ username: "igrok", password: configuredPassword! });
    expect(result).toEqual({ username: "igrok", role: "player" });
    expect(cookies).toHaveLength(1);
  });
});
