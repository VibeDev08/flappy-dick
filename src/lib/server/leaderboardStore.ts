import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import type { LeaderboardEntry } from "@/lib/leaderboard/shared";

type StoreShape = {
  entries: LeaderboardEntry[];
  usedTokenIds: string[];
};

const dataDirectory = path.join(process.cwd(), "data");
const dataFile = path.join(dataDirectory, "leaderboard.json");

const defaultStore: StoreShape = {
  entries: [],
  usedTokenIds: [],
};

async function ensureStore(): Promise<StoreShape> {
  await mkdir(dataDirectory, { recursive: true });

  try {
    const raw = await readFile(dataFile, "utf8");
    return JSON.parse(raw) as StoreShape;
  } catch {
    await writeFile(dataFile, JSON.stringify(defaultStore, null, 2), "utf8");
    return structuredClone(defaultStore);
  }
}

export async function readStore(): Promise<StoreShape> {
  return ensureStore();
}

export async function writeStore(store: StoreShape): Promise<void> {
  await mkdir(dataDirectory, { recursive: true });
  await writeFile(dataFile, JSON.stringify(store, null, 2), "utf8");
}
