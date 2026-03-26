export const WORLD_WIDTH = 460;
export const WORLD_HEIGHT = 640;

export const GAME_CONSTANTS = {
  gravity: 1850,
  flapVelocity: -520,
  obstacleSpeed: 180,
  obstacleWidth: 110,
  obstacleSpacingMs: 1400,
  firstObstacleDelayMs: 0,
  minGapHeight: 172,
  gapJitter: 84,
  playerX: 230,
  playerBaseWidth: 54,
  playerBaseHeight: 28,
  safeMargin: 72,
  topHudHeight: 54,
  retryDelayMs: 260,
} as const;

export function minRunDurationMsForScore(score: number): number {
  if (score <= 0) {
    return 0;
  }

  const travelDistance = WORLD_WIDTH + GAME_CONSTANTS.obstacleWidth - GAME_CONSTANTS.playerX;
  const firstPointMs = GAME_CONSTANTS.firstObstacleDelayMs + (travelDistance / GAME_CONSTANTS.obstacleSpeed) * 1000;
  const additionalPointMs = GAME_CONSTANTS.obstacleSpacingMs;
  return Math.floor(firstPointMs + (score - 1) * additionalPointMs * 0.92);
}
