import type { AvatarId } from "@/lib/content/gameContent";

export type GamePhase = "ready" | "running" | "dead";

export type PlayerState = {
  x: number;
  y: number;
  velocityY: number;
  width: number;
  height: number;
  rotation: number;
};

export type ObstacleState = {
  id: number;
  variantId: string;
  x: number;
  width: number;
  gapY: number;
  gapHeight: number;
  scored: boolean;
};

export type GameState = {
  phase: GamePhase;
  score: number;
  elapsedMs: number;
  nextObstacleId: number;
  spawnCooldownMs: number;
  obstaclesSinceReliefGap: number;
  nextReliefGapInterval: number;
  player: PlayerState;
  obstacles: ObstacleState[];
  characterId: AvatarId;
};

export type GameInput = {
  flap: boolean;
};
