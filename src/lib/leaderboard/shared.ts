import type { AvatarId } from "@/lib/content/gameContent";

export type LeaderboardEntry = {
  id: string;
  name: string;
  score: number;
  characterId: AvatarId;
  createdAt: string;
};

export function normalizeName(name: string): string {
  return name.trim().slice(0, 10);
}

export function isTopTen(entries: LeaderboardEntry[], score: number): boolean {
  if (score <= 0) {
    return false;
  }

  if (entries.length < 10) {
    return true;
  }

  return score > entries[entries.length - 1].score;
}
