import { int, json, mysqlEnum, mysqlTable, text, timestamp, varchar, double, uniqueIndex, index } from "drizzle-orm/mysql-core";
import type { LocalizedList, LocalizedText, PortalGame } from "../shared/games";
import type { AdSlot } from "../shared/ads";

/** Manus OAuth user table. Kept for the built-in auth integration. */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const portalGames = mysqlTable("portal_games", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 64 }).notNull(),
  titles: json("titles").$type<LocalizedText>().notNull(),
  category: varchar("category", { length: 32 }).notNull(),
  tags: json("tags").$type<string[]>().notNull(),
  descriptions: json("descriptions").$type<LocalizedText>().notNull(),
  controls: json("controls").$type<LocalizedList>().notNull(),
  imageUrl: text("imageUrl").notNull(),
  gameUrl: text("gameUrl"),
  rating: double("rating").notNull(),
  plays: int("plays").notNull(),
  year: int("year").notNull(),
  badge: varchar("badge", { length: 16 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => ({ slugUnique: uniqueIndex("portal_games_slug_uq").on(table.slug) }));

export type PortalGameRow = typeof portalGames.$inferSelect;

export const portalFavorites = mysqlTable("portal_favorites", {
  id: int("id").autoincrement().primaryKey(),
  username: varchar("username", { length: 32 }).notNull(),
  gameSlug: varchar("gameSlug", { length: 64 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, table => ({ userGameUnique: uniqueIndex("portal_favorite_user_game_uq").on(table.username, table.gameSlug), userIndex: index("portal_favorite_user_idx").on(table.username) }));

export const portalAdBanners = mysqlTable("portal_ad_banners", {
  slot: varchar("slot", { length: 20 }).$type<AdSlot>().primaryKey(),
  imageUrl: text("imageUrl").notNull(),
  targetUrl: text("targetUrl").notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
