export const WORLD_WIDTH = 460;
export const WORLD_HEIGHT = 640;

export const GAME_CONSTANTS = {
  gravity: 1850,
  flapVelocity: -520,
  obstacleSpeed: 180,
  obstacleSpeedIncrease: 120,   // ramps obstacleSpeed up by this amount at full difficulty (180 → 300)
  obstacleWidth: 110,
  obstacleSpacingMs: 1400,
  spacingMsDecrease: 450,       // ramps obstacleSpacingMs down by this amount at full difficulty (1400 → 950)
  difficultyRampScore: 30,      // score at which full speed/spacing difficulty is reached
  firstObstacleDelayMs: 0,
  minGapHeight: 172,
  playerX: 230,
  playerBaseWidth: 54,
  playerBaseHeight: 28,
  safeMargin: 116,
  topHudHeight: 54,
  groundHeight: 140,
  grassHeight: 32,
  retryDelayMs: 260,
} as const;

export function minRunDurationMsForScore(score: number): number {
  if (score <= 0) {
    return 0;
  }

  // Obstacle is scored when its left edge crosses playerX - obstacleWidth.
  // Spawn position is WORLD_WIDTH + obstacleWidth (fully off-screen right).
  const travelDist =
    WORLD_WIDTH +
    GAME_CONSTANTS.obstacleWidth * 2 -
    GAME_CONSTANTS.playerX;

  const speedAt = (s: number): number =>
    GAME_CONSTANTS.obstacleSpeed +
    Math.min(s / GAME_CONSTANTS.difficultyRampScore, 1) * GAME_CONSTANTS.obstacleSpeedIncrease;

  const spacingAt = (s: number): number =>
    GAME_CONSTANTS.obstacleSpacingMs -
    Math.min(s / GAME_CONSTANTS.difficultyRampScore, 1) * GAME_CONSTANTS.spacingMsDecrease;

  // Simulate obstacle spawn and score times, accounting for the difficulty ramp.
  const spawnTimes: number[] = [GAME_CONSTANTS.firstObstacleDelayMs];
  const scoreTimes: number[] = [];

  for (let i = 0; i < score; i++) {
    const spawnT = spawnTimes[i];
    let scoreAtSpawn = 0;
    for (let j = 0; j < scoreTimes.length; j++) {
      if ((scoreTimes[j] as number) <= spawnT) scoreAtSpawn++;
    }
    const scoreT = spawnT + (travelDist / speedAt(scoreAtSpawn)) * 1000;
    scoreTimes.push(scoreT);
    spawnTimes.push(spawnT + spacingAt(scoreAtSpawn));
  }

  return Math.floor((scoreTimes[score - 1] as number) * 0.92);
}
