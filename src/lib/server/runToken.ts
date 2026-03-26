import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";

const secret = process.env.RUN_TOKEN_SECRET ?? "local-dev-run-token-secret";

type TokenPayload = {
  id: string;
  issuedAt: number;
};

function sign(payload: TokenPayload): string {
  return createHmac("sha256", secret)
    .update(`${payload.id}:${payload.issuedAt}`)
    .digest("hex");
}

export function issueRunToken(): { token: string; issuedAt: number; id: string } {
  const payload = {
    id: randomUUID(),
    issuedAt: Date.now(),
  };

  const signature = sign(payload);
  return {
    token: `${payload.id}.${payload.issuedAt}.${signature}`,
    issuedAt: payload.issuedAt,
    id: payload.id,
  };
}

export function verifyRunToken(token: string): TokenPayload | null {
  const [id, issuedAtRaw, signature] = token.split(".");
  const issuedAt = Number(issuedAtRaw);

  if (!id || !signature || Number.isNaN(issuedAt)) {
    return null;
  }

  const expected = sign({ id, issuedAt });
  const left = Buffer.from(signature);
  const right = Buffer.from(expected);
  if (left.length !== right.length || !timingSafeEqual(left, right)) {
    return null;
  }

  return { id, issuedAt };
}
