"use client";

import { useEffect, useRef } from "react";

import { createInitialState, updateGame } from "@/lib/game-core/engine";
import type { GameState } from "@/lib/game-core/types";
import { drawScene, logicalCanvasSize } from "@/lib/render/drawGame";

import type { AvatarId } from "@/lib/content/gameContent";

const STEP_MS = 1000 / 60;

type GameCanvasProps = {
  acceptInput: boolean;
  characterId: AvatarId;
  hidePlayer?: boolean;
  onFlap: () => void;
  onRunStart: () => void;
  onScore: () => void;
  onCrash: (state: GameState) => void;
  restartSeed: number;
};

export function GameCanvas({
  acceptInput,
  characterId,
  hidePlayer = false,
  onFlap,
  onRunStart,
  onScore,
  onCrash,
  restartSeed,
}: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const hostRef = useRef<HTMLDivElement | null>(null);
  const stateRef = useRef<GameState>(createInitialState(characterId));
  const flapRef = useRef(false);
  const reportedDeadRef = useRef(false);

  useEffect(() => {
    stateRef.current = createInitialState(characterId);
    reportedDeadRef.current = false;
  }, [characterId, restartSeed]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!acceptInput) {
        return;
      }

      if (event.code !== "Space") {
        return;
      }

      event.preventDefault();
      flapRef.current = true;
      if (stateRef.current.phase !== "dead") {
        onFlap();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [acceptInput, onFlap]);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) {
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    let frameId = 0;
    let lastTime = 0;
    let accumulator = 0;
    let lastWidth = 0;
    let lastHeight = 0;

    const render = (time: number) => {
      const hostBounds = host.getBoundingClientRect();
      const logicalSize = logicalCanvasSize(hostBounds);
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      const physW = Math.round(logicalSize.width * ratio);
      const physH = Math.round(logicalSize.height * ratio);

      if (physW !== lastWidth || physH !== lastHeight) {
        canvas.width = physW;
        canvas.height = physH;
        canvas.style.width = `${logicalSize.width}px`;
        canvas.style.height = `${logicalSize.height}px`;
        context.setTransform(ratio, 0, 0, ratio, 0, 0);
        lastWidth = physW;
        lastHeight = physH;
      }

      if (!lastTime) {
        lastTime = time;
      }

      accumulator += Math.min(time - lastTime, 48);
      lastTime = time;

      while (accumulator >= STEP_MS) {
        const previousPhase = stateRef.current.phase;
        const previousScore = stateRef.current.score;
        stateRef.current = updateGame(stateRef.current, { flap: flapRef.current }, STEP_MS);
        flapRef.current = false;
        if (previousPhase === "ready" && stateRef.current.phase === "running") {
          onRunStart();
        }
        if (stateRef.current.score > previousScore) {
          onScore();
        }
        if (stateRef.current.phase === "dead" && !reportedDeadRef.current) {
          reportedDeadRef.current = true;
          onCrash(stateRef.current);
        }
        accumulator -= STEP_MS;
      }

      drawScene(context, stateRef.current, logicalSize, hidePlayer);
      frameId = window.requestAnimationFrame(render);
    };

    frameId = window.requestAnimationFrame(render);
    return () => window.cancelAnimationFrame(frameId);
  }, [onCrash, onRunStart, onScore]);

  return (
    <div
      className="gameCanvasHost"
      onPointerDown={() => {
        if (!acceptInput) {
          return;
        }

        flapRef.current = true;
        if (stateRef.current.phase !== "dead") {
          onFlap();
        }
      }}
      ref={hostRef}
      role="presentation"
    >
      <canvas ref={canvasRef} />
    </div>
  );
}
