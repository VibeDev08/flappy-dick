import { NextResponse } from "next/server";

import { issueRunToken } from "@/lib/server/runToken";

export const runtime = "nodejs";

export async function POST(): Promise<NextResponse> {
  return NextResponse.json(issueRunToken());
}
