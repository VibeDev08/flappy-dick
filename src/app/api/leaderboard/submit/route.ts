import { NextResponse } from "next/server";
import { z } from "zod";

import { submitLeaderboardEntry } from "@/lib/server/leaderboardService";

export const runtime = "edge";

const schema = z.object({
  name: z.string(),
  score: z.number().int().nonnegative(),
  characterId: z.union([z.literal("ivory-twin"), z.literal("onyx-twin")]),
  token: z.string(),
});

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const parsed = schema.parse(await request.json());
    const result = await submitLeaderboardEntry(parsed);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to submit score.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
