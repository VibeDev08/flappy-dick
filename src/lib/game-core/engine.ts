import { avatars } from "@/lib/content/gameContent";
import { GAME_CONSTANTS, WORLD_HEIGHT, WORLD_WIDTH } from "@/lib/game-core/constants";
import type { GameInput, GameState, ObstacleState } from "@/lib/game-core/types";

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function getDifficulty(score: number) {
  // Speed and spacing ramp over first 30 points, gap ramps over first 45 points
  const tSpeed = Math.min(score / 30, 1);
  const tGap = Math.min(score / 45, 1);
  return {
    obstacleSpeed: GAME_CONSTANTS.obstacleSpeed + tSpeed * 120,  // 180 → 300
    gapHeight: GAME_CONSTANTS.minGapHeight - tGap * 44,          // 172 → 128
    spacingMs: GAME_CONSTANTS.obstacleSpacingMs - tSpeed * 450,  // 1400 → 950
  };
}

function randomReliefGapInterval(): number {
  return 8 + Math.floor(Math.random() * 3);
}

function nextGapCenter(): number {
  const groundTop = WORLD_HEIGHT - GAME_CONSTANTS.groundHeight;
  const shaftBottom = groundTop + GAME_CONSTANTS.grassHeight;
  const halfGap = GAME_CONSTANTS.minGapHeight / 2;
  const minShaft = 85;
  const min = halfGap + minShaft;
  const max = shaftBottom - halfGap - minShaft;
  return min + Math.random() * (max - min);
}

function spawnObstacle(state: GameState): ObstacleState {
  return {
    id: state.nextObstacleId,
    variantId: `variant-${state.nextObstacleId}`,
    x: WORLD_WIDTH + GAME_CONSTANTS.obstacleWidth,
    width: GAME_CONSTANTS.obstacleWidth,
    gapY: nextGapCenter(),
    gapHeight: GAME_CONSTANTS.minGapHeight,
    scored: false,
  };
}

function collidesWithObstacle(state: GameState, obstacle: ObstacleState): boolean {
  const avatar = avatars.find((a) => a.id === state.characterId) ?? avatars[0];
  const ex = (avatar.lengthScale - 1) * 32;
  const s = avatar.sizeScale;

  // Hitbox matches the shaft's actual visual extents, with ~52% forgiveness on the tip
  const playerLeft = state.player.x - 14 * s;
  const playerRight = state.player.x + (36 + ex) * s * 0.52;
  const playerTop = state.player.y - 9 * s;
  const playerBottom = state.player.y + 9 * s;

  // Trim obstacle hitbox to match drawn shaft width (~64% of column)
  const trim = obstacle.width * 0.18;
  const obstacleLeft = obstacle.x + trim;
  const obstacleRight = obstacle.x + obstacle.width - trim;
  const inColumn = playerRight > obstacleLeft && playerLeft < obstacleRight;
  if (!inColumn) {
    return false;
  }

  const gapTop = obstacle.gapY - obstacle.gapHeight / 2;
  const gapBottom = obstacle.gapY + obstacle.gapHeight / 2;
  return playerTop < gapTop || playerBottom > gapBottom;
}

export function createInitialState(characterId: GameState["characterId"]): GameState {
  return {
    phase: "ready",
    score: 0,
    elapsedMs: 0,
    nextObstacleId: 1,
    spawnCooldownMs: GAME_CONSTANTS.firstObstacleDelayMs,
    obstaclesSinceReliefGap: 0,
    nextReliefGapInterval: randomReliefGapInterval(),
    player: {
      x: GAME_CONSTANTS.playerX,
      y: WORLD_HEIGHT / 2,
      velocityY: 0,
      width: GAME_CONSTANTS.playerBaseWidth,
      height: GAME_CONSTANTS.playerBaseHeight,
      rotation: 0,
    },
    obstacles: [],
    characterId,
  };
}

export function restartState(previous: GameState): GameState {
  return createInitialState(previous.characterId);
}

export function updateGame(state: GameState, input: GameInput, deltaMs: number): GameState {
  if (state.phase === "dead") {
    return {
      ...state,
      elapsedMs: state.elapsedMs + deltaMs,
    };
  }

  if (state.phase === "ready") {
    if (!input.flap) {
      return state;
    }

    return updateGame(
      {
        ...state,
        phase: "running",
      },
      { flap: true },
      deltaMs,
    );
  }

  const deltaSeconds = deltaMs / 1000;
  const difficulty = getDifficulty(state.score);
  let nextVelocityY = state.player.velocityY + GAME_CONSTANTS.gravity * deltaSeconds;
  if (input.flap) {
    nextVelocityY = GAME_CONSTANTS.flapVelocity;
  }

  const nextY = state.player.y + nextVelocityY * deltaSeconds;
  const targetRotation = clamp(nextVelocityY / 680, -0.8, 1.2);
  const nextRotation = state.player.rotation * 0.7 + targetRotation * 0.3;
  const movedObstacles = state.obstacles
    .map((obstacle) => ({
      ...obstacle,
      x: obstacle.x - difficulty.obstacleSpeed * deltaSeconds,
    }))
    .filter((obstacle) => obstacle.x + obstacle.width > -18);

  const elapsedMs = state.elapsedMs + deltaMs;
  let spawnCooldownMs = state.spawnCooldownMs - deltaMs;
  let nextObstacleId = state.nextObstacleId;
  let obstaclesSinceReliefGap = state.obstaclesSinceReliefGap;
  let nextReliefGapInterval = state.nextReliefGapInterval;
  if (spawnCooldownMs <= 0) {
    const canUseReliefGap = state.score >= 45;
    const shouldUseReliefGap =
      canUseReliefGap && obstaclesSinceReliefGap >= nextReliefGapInterval;
    const spawnedGapHeight = shouldUseReliefGap ? difficulty.gapHeight + 20 : difficulty.gapHeight;
    const spawned = {
      ...spawnObstacle({ ...state, elapsedMs, nextObstacleId }),
      gapHeight: spawnedGapHeight,
    };
    movedObstacles.push(spawned);
    nextObstacleId += 1;
    spawnCooldownMs += difficulty.spacingMs;
    if (shouldUseReliefGap) {
      obstaclesSinceReliefGap = 0;
      nextReliefGapInterval = randomReliefGapInterval();
    } else if (canUseReliefGap) {
      obstaclesSinceReliefGap += 1;
    }
  }

  let score = state.score;
  const scoredObstacles = movedObstacles.map((obstacle) => {
    if (!obstacle.scored && obstacle.x + obstacle.width < state.player.x) {
      score += 1;
      return {
        ...obstacle,
        scored: true,
      };
    }

    return obstacle;
  });

  const nextState: GameState = {
    ...state,
    score,
    elapsedMs,
    nextObstacleId,
    spawnCooldownMs,
    obstaclesSinceReliefGap,
    nextReliefGapInterval,
    player: {
      ...state.player,
      y: nextY,
      velocityY: nextVelocityY,
      rotation: nextRotation,
    },
    obstacles: scoredObstacles,
  };

  const topOut = nextState.player.y - nextState.player.height / 2 < GAME_CONSTANTS.topHudHeight;
  const bottomOut = nextState.player.y + nextState.player.height / 2 > WORLD_HEIGHT - GAME_CONSTANTS.safeMargin;
  const hitObstacle = nextState.obstacles.some((obstacle) => collidesWithObstacle(nextState, obstacle));
  if (topOut || bottomOut || hitObstacle) {
    return {
      ...nextState,
      phase: "dead",
    };
  }

  return nextState;
}
