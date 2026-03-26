import { minRunDurationMsForScore } from "@/lib/game-core/constants";
import { isTopTen, normalizeName, type LeaderboardEntry } from "@/lib/leaderboard/shared";
import { verifyRunToken } from "@/lib/server/runToken";
import { getSupabaseAdminClient } from "@/lib/server/supabaseAdmin";

import type { AvatarId } from "@/lib/content/gameContent";

const NAME_PATTERN = /^[a-zA-Z0-9 _.'-]{1,12}$/;

type LeaderboardRow = {
  id: string;
  name: string;
  score: number;
  character_id: AvatarId;
  created_at: string;
};

function mapLeaderboardRow(row: LeaderboardRow): LeaderboardEntry {
  return {
    id: row.id,
    name: row.name,
    score: row.score,
    characterId: row.character_id,
    createdAt: row.created_at,
  };
}

async function fetchTopEntries(limit = 10): Promise<LeaderboardEntry[]> {
  const supabase = getSupabaseAdminClient() as any;
  const { data, error } = await supabase
    .from("leaderboard_entries")
    .select("id,name,score,character_id,created_at")
    .order("score", { ascending: false })
    .order("created_at", { ascending: true })
    .limit(limit);

  if (error) {
    throw new Error(`Unable to read leaderboard: ${error.message}`);
  }

  return (data as LeaderboardRow[]).map(mapLeaderboardRow);
}

async function reserveRunToken(tokenId: string): Promise<void> {
  const supabase = getSupabaseAdminClient() as any;
  const { error } = await supabase.from("used_run_tokens").insert({ token_id: tokenId });
  if (!error) {
    return;
  }

  if (error.code === "23505") {
    throw new Error("Run token already used.");
  }

  throw new Error(`Unable to reserve run token: ${error.message}`);
}

async function insertLeaderboardEntry(input: {
  id: string;
  name: string;
  score: number;
  characterId: AvatarId;
}): Promise<void> {
  const supabase = getSupabaseAdminClient() as any;
  const { error } = await supabase.from("leaderboard_entries").insert({
    id: input.id,
    name: input.name,
    score: input.score,
    character_id: input.characterId,
  });

  if (error) {
    throw new Error(`Unable to save leaderboard entry: ${error.message}`);
  }
}

async function trimLeaderboard(limit = 10): Promise<void> {
  const supabase = getSupabaseAdminClient() as any;
  const { data, error } = await supabase
    .from("leaderboard_entries")
    .select("id")
    .order("score", { ascending: false })
    .order("created_at", { ascending: true })
    .range(limit, 2000);

  if (error) {
    throw new Error(`Unable to trim leaderboard: ${error.message}`);
  }

  const staleIds = (data ?? []).map((row: { id: string }) => row.id);
  if (staleIds.length === 0) {
    return;
  }

  const { error: deleteError } = await supabase.from("leaderboard_entries").delete().in("id", staleIds);
  if (deleteError) {
    throw new Error(`Unable to trim leaderboard: ${deleteError.message}`);
  }
}

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  return fetchTopEntries();
}

export async function submitLeaderboardEntry(input: {
  name: string;
  score: number;
  characterId: AvatarId;
  token: string;
}): Promise<{ entries: LeaderboardEntry[] }> {
  const token = verifyRunToken(input.token);
  if (!token) {
    throw new Error("Invalid run token.");
  }

  const name = normalizeName(input.name);
  if (!NAME_PATTERN.test(name)) {
    throw new Error("Name must be 1-12 characters and use simple symbols.");
  }

  const elapsedMs = Date.now() - token.issuedAt;
  if (elapsedMs < minRunDurationMsForScore(input.score)) {
    throw new Error("Submitted score is not believable for the run duration.");
  }

  const entries = await fetchTopEntries();
  if (!isTopTen(entries, input.score)) {
    throw new Error("Score does not qualify for the top 10.");
  }

  await reserveRunToken(token.id);
  await insertLeaderboardEntry({
    id: token.id,
    name,
    score: input.score,
    characterId: input.characterId,
  });
  await trimLeaderboard();

  return { entries: await fetchTopEntries() };
}
