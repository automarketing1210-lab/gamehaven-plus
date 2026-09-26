import { timingSafeEqual } from "node:crypto";

export type PortalAccount = { username: "admin" | "igrok"; role: "admin" | "player" };

function safeEqual(candidate: string, expected: string | undefined): boolean {
  if (!expected) return false;
  const left = Buffer.from(candidate, "utf8");
  const right = Buffer.from(expected, "utf8");
  if (left.length !== right.length) {
    // Keep a constant-time comparison even for differently sized input.
    const padded = Buffer.alloc(right.length);
    left.copy(padded, 0, 0, right.length);
    timingSafeEqual(padded, right);
    return false;
  }
  return timingSafeEqual(left, right);
}

export function matchPortalAccount(username: string, password: string, adminPassword?: string, playerPassword?: string): PortalAccount | null {
  if (username === "admin" && safeEqual(password, adminPassword)) return { username: "admin", role: "admin" };
  if (username === "igrok" && safeEqual(password, playerPassword)) return { username: "igrok", role: "player" };
  return null;
}
