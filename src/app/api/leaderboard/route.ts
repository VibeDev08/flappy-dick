import { NextResponse } from "next/server";

import { getLeaderboard } from "@/lib/server/leaderboardService";

export const runtime = "edge";

export async function GET(): Promise<NextResponse> {
  const entries = await getLeaderboard();
  return NextResponse.json({ entries });
}
