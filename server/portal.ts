import { TRPCError } from "@trpc/server";
import { SignJWT, jwtVerify } from "jose";
import { parse } from "cookie";
import { z } from "zod";
import { adSlots } from "../shared/ads";
import { publicProcedure, router } from "./_core/trpc";
import { ENV } from "./_core/env";
import { matchPortalAccount, type PortalAccount } from "./portal-auth";
import { getPortalAdBanners, getPortalFavorites, listPortalGames, setPortalFavorite, updatePortalGame, updatePortalAdBanner } from "./portal-db";
import { storagePut } from "./storage";

const SESSION_COOKIE = "gamehaven_session";
const SESSION_MAX_AGE = 14 * 24 * 60 * 60;
const cookieOptions = (secure: boolean) => ({ httpOnly: true, secure, sameSite: "lax" as const, path: "/", maxAge: SESSION_MAX_AGE });
const signingKey = () => {
  if (!ENV.cookieSecret) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Session signing key is not configured." });
  return new TextEncoder().encode(ENV.cookieSecret);
};

type PortalContext = { username: "admin" | "igrok"; role: "admin" | "player" };
async function sessionFromRequest(ctx: { req: { headers: { cookie?: string } } }): Promise<PortalContext | null> {
  const token = parse(ctx.req.headers.cookie ?? "")[SESSION_COOKIE];
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, signingKey());
    if ((payload.sub !== "admin" && payload.sub !== "igrok") || (payload.role !== "admin" && payload.role !== "player")) return null;
    return { username: payload.sub, role: payload.role };
  } catch {
    return null;
  }
}

const signedInProcedure = publicProcedure.use(async ({ ctx, next }) => {
  const portalUser = await sessionFromRequest(ctx);
  if (!portalUser) throw new TRPCError({ code: "UNAUTHORIZED", message: "Please sign in to continue." });
  return next({ ctx: { ...ctx, portalUser } });
});
const adminProcedure = signedInProcedure.use(({ ctx, next }) => {
  if (ctx.portalUser.role !== "admin") throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required." });
  return next({ ctx });
});
const playerProcedure = signedInProcedure.use(({ ctx, next }) => {
  if (ctx.portalUser.role !== "player") throw new TRPCError({ code: "FORBIDDEN", message: "Player access required." });
  return next({ ctx });
});

async function makeSession(account: PortalAccount) {
  return new SignJWT({ role: account.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(account.username)
    .setIssuedAt()
    .setExpirationTime("14d")
    .sign(signingKey());
}

const localizedTitle = z.object({ ru: z.string().trim().min(1).max(100), en: z.string().trim().min(1).max(100), zh: z.string().trim().min(1).max(100) });
const imageDataUrl = z.string().max(7_500_000).regex(/^data:image\/(?:jpeg|png|webp);base64,[a-zA-Z0-9+/=]+$/).optional();
const safeHttpsUrl = z.string().trim().max(2048).refine(value => value === "" || /^https?:\/\//i.test(value), "Only HTTP(S) links are allowed");
const safeImageUrl = z.string().trim().max(2048).refine(value => value === "" || /^https:\/\//i.test(value) || /^\/manus-storage\/[a-zA-Z0-9._/-]+$/.test(value), "Use HTTPS or a /manus-storage image path");
const safeAdUrl = z.string().trim().max(2048).refine(value => {
  if (!value) return true;
  try { return new URL(value).protocol === "https:"; } catch { return false; }
}, "Use a secure HTTPS link");

export const portalRouter = router({
  me: publicProcedure.query(async ({ ctx }) => sessionFromRequest(ctx)),
  login: publicProcedure.input(z.object({ username: z.string().trim().min(1).max(32), password: z.string().min(1).max(120) })).mutation(async ({ ctx, input }) => {
    const account = matchPortalAccount(input.username, input.password, process.env.GAME_ADMIN_PASSWORD, process.env.GAME_PLAYER_PASSWORD);
    if (!account) throw new TRPCError({ code: "UNAUTHORIZED", message: "Incorrect username or password." });
    const token = await makeSession(account);
    ctx.res.cookie(SESSION_COOKIE, token, cookieOptions(ENV.isProduction));
    return { username: account.username, role: account.role };
  }),
  logout: publicProcedure.mutation(({ ctx }) => {
    ctx.res.clearCookie(SESSION_COOKIE, { ...cookieOptions(ENV.isProduction), maxAge: 0 });
    return { success: true };
  }),
  games: publicProcedure.query(async () => listPortalGames()),
  adBanners: publicProcedure.query(async () => getPortalAdBanners()),
  updateAdBanner: adminProcedure.input(z.object({
    slot: z.enum(adSlots),
    imageUrl: safeImageUrl,
    targetUrl: safeAdUrl,
  })).mutation(async ({ input }) => {
    await updatePortalAdBanner(input.slot, input.imageUrl.trim(), input.targetUrl.trim());
    return { success: true };
  }),
  myFavorites: playerProcedure.query(({ ctx }) => getPortalFavorites(ctx.portalUser.username)),
  setFavorite: playerProcedure.input(z.object({ slug: z.string().min(1).max(64), favorite: z.boolean() })).mutation(async ({ ctx, input }) => {
    const games = await listPortalGames();
    if (!games.some(game => game.slug === input.slug)) throw new TRPCError({ code: "NOT_FOUND", message: "Game not found." });
    return setPortalFavorite(ctx.portalUser.username, input.slug, input.favorite);
  }),
  updateGame: adminProcedure.input(z.object({
    slug: z.string().min(1).max(64),
    titles: localizedTitle,
    gameUrl: safeHttpsUrl,
    imageUrl: safeImageUrl.optional(),
    imageData: imageDataUrl,
  })).mutation(async ({ input }) => {
    let imageUrl = input.imageUrl?.trim() || undefined;
    if (input.imageData) {
      const match = input.imageData.match(/^data:(image\/(?:jpeg|png|webp));base64,(.+)$/);
      if (!match) throw new TRPCError({ code: "BAD_REQUEST", message: "Upload a JPG, PNG or WebP image." });
      const bytes = Buffer.from(match[2], "base64");
      if (bytes.length > 5 * 1024 * 1024) throw new TRPCError({ code: "PAYLOAD_TOO_LARGE", message: "Cover images must be 5 MB or smaller." });
      const ext = match[1] === "image/jpeg" ? "jpg" : match[1].split("/")[1];
      const stored = await storagePut(`game-covers/${input.slug}.${ext}`, bytes, match[1]);
      imageUrl = stored.url;
    }
    const games = await listPortalGames();
    const current = games.find(game => game.slug === input.slug);
    if (!current) throw new TRPCError({ code: "NOT_FOUND", message: "Game not found." });
    await updatePortalGame(input.slug, { titles: input.titles, gameUrl: input.gameUrl.trim() || null, imageUrl: imageUrl || current.imageUrl });
    return { success: true, imageUrl: imageUrl || current.imageUrl };
  }),
});
