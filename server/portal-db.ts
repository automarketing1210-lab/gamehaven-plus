import { and, asc, eq } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { defaultGames } from "../shared/games";
import { emptyAdBannerSettings, type AdSlot } from "../shared/ads";
import { portalAdBanners, portalFavorites, portalGames } from "../drizzle/schema";
import { getDb } from "./db";
import type { PortalGame } from "../shared/games";

export async function listPortalGames(): Promise<PortalGame[]> {
  const db = await getDb();
  if (!db) throw new Error("Database is unavailable");
  const existing = await db.select({ id: portalGames.id }).from(portalGames).limit(1);
  if (existing.length === 0) {
    for (const game of defaultGames) {
      await db.insert(portalGames).values(game).onDuplicateKeyUpdate({ set: { slug: sql`slug` } });
    }
  }
  const rows = await db.select().from(portalGames).orderBy(asc(portalGames.id));
  return rows.map(row => ({
    slug: row.slug,
    titles: row.titles,
    category: row.category as PortalGame["category"],
    tags: row.tags,
    descriptions: row.descriptions,
    controls: row.controls,
    imageUrl: row.imageUrl,
    gameUrl: row.gameUrl,
    rating: row.rating,
    plays: row.plays,
    year: row.year,
    badge: row.badge as PortalGame["badge"],
  }));
}

export async function updatePortalGame(slug: string, patch: { titles: PortalGame["titles"]; gameUrl: string | null; imageUrl: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database is unavailable");
  await db.update(portalGames).set(patch).where(eq(portalGames.slug, slug));
}

export async function getPortalFavorites(username: string): Promise<string[]> {
  const db = await getDb();
  if (!db) throw new Error("Database is unavailable");
  const rows = await db.select({ gameSlug: portalFavorites.gameSlug }).from(portalFavorites).where(eq(portalFavorites.username, username)).orderBy(asc(portalFavorites.id));
  return rows.map(row => row.gameSlug);
}

export async function setPortalFavorite(username: string, gameSlug: string, favorite: boolean): Promise<string[]> {
  const db = await getDb();
  if (!db) throw new Error("Database is unavailable");
  const condition = and(eq(portalFavorites.username, username), eq(portalFavorites.gameSlug, gameSlug));
  if (favorite) {
    await db.insert(portalFavorites).values({ username, gameSlug }).onDuplicateKeyUpdate({ set: { gameSlug: sql`gameSlug` } });
  } else {
    await db.delete(portalFavorites).where(condition);
  }
  return getPortalFavorites(username);
}

export async function getPortalAdBanners() {
  const db = await getDb();
  if (!db) throw new Error("Database is unavailable");
  const rows = await db.select().from(portalAdBanners);
  const settings = structuredClone(emptyAdBannerSettings);
  for (const row of rows) settings[row.slot as AdSlot] = { imageUrl: row.imageUrl, targetUrl: row.targetUrl };
  return settings;
}

export async function updatePortalAdBanner(slot: AdSlot, imageUrl: string, targetUrl: string) {
  const db = await getDb();
  if (!db) throw new Error("Database is unavailable");
  await db.insert(portalAdBanners).values({ slot, imageUrl, targetUrl }).onDuplicateKeyUpdate({ set: { imageUrl, targetUrl } });
  return getPortalAdBanners();
}
