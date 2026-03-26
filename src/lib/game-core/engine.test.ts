import { describe, expect, it } from "vitest";

import { GAME_CONSTANTS, minRunDurationMsForScore } from "@/lib/game-core/constants";
import { createInitialState, updateGame } from "@/lib/game-core/engine";

describe("game engine", () => {
  it("starts in a ready state", () => {
    const state = createInitialState("ivory-twin");

    expect(state.phase).toBe("ready");
    expect(state.obstacles).toHaveLength(0);
  });

  it("applies a flap impulse", () => {
    const state = createInitialState("ivory-twin");
    const next = updateGame(state, { flap: true }, 16);

    expect(next.player.velocityY).toBe(GAME_CONSTANTS.flapVelocity);
    expect(next.phase).toBe("running");
  });

  it("spawns obstacles after the initial delay", () => {
    const state = createInitialState("onyx-twin");
    const running = { ...state, phase: "running" as const };
    const next = updateGame(running, { flap: false }, GAME_CONSTANTS.firstObstacleDelayMs + 1);

    expect(next.obstacles).toHaveLength(1);
  });

  it("increments score after clearing an obstacle", () => {
    const state = createInitialState("ivory-twin");
    const seeded = {
      ...state,
      phase: "running" as const,
      obstacles: [
        {
          id: 1,
          variantId: "seed",
          x: state.player.x - 100,
          width: 80,
          gapY: 320,
          gapHeight: 200,
          scored: false,
        },
      ],
    };

    const next = updateGame(seeded, { flap: false }, 16);
    expect(next.score).toBe(1);
  });

  it("ends the run on collision", () => {
    const state = createInitialState("ivory-twin");
    const seeded = {
      ...state,
      phase: "running" as const,
      obstacles: [
        {
          id: 1,
          variantId: "seed",
          x: state.player.x - 10,
          width: 80,
          gapY: 120,
          gapHeight: 60,
          scored: false,
        },
      ],
    };

    const next = updateGame(seeded, { flap: false }, 16);
    expect(next.phase).toBe("dead");
  });
});

describe("minimum run duration", () => {
  it("grows as the score increases", () => {
    expect(minRunDurationMsForScore(5)).toBeGreaterThan(minRunDurationMsForScore(1));
  });
});
