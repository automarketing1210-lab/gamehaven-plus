import { describe, expect, it } from "vitest";
import { SignJWT } from "jose";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

async function createContext(username: "admin" | "igrok", role: "admin" | "player"): Promise<TrpcContext> {
  const secret = process.env.JWT_SECRET ?? "test-only-secret-that-is-long-enough-for-hmac";
  const token = await new SignJWT({ role }).setProtectedHeader({ alg: "HS256" }).setSubject(username).setIssuedAt().setExpirationTime("15m").sign(new TextEncoder().encode(secret));
  return {
    user: null,
    req: { protocol: "https", headers: { cookie: `gamehaven_session=${token}` } } as TrpcContext["req"],
    res: { cookie: () => undefined } as unknown as TrpcContext["res"],
  };
}

describe("portal role authorization", () => {
  it("rejects a player attempting to edit the games catalog", async () => {
    const ctx = await createContext("igrok", "player");
    const call = appRouter.createCaller(ctx).portal.updateGame({ slug: "neon-drift", titles: { ru: "A", en: "A", zh: "A" }, gameUrl: "", imageData: undefined });
    await expect(call).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("rejects the administrator from the player-only favorites endpoint", async () => {
    const ctx = await createContext("admin", "admin");
    const call = appRouter.createCaller(ctx).portal.myFavorites();
    await expect(call).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("rejects an administrator from liking or unliking games", async () => {
    const ctx = await createContext("admin", "admin");
    const call = appRouter.createCaller(ctx).portal.setFavorite({ slug: "neon-drift", favorite: true });
    await expect(call).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});
