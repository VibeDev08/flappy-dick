import { avatars, obstacleStyles } from "@/lib/content/gameContent";
import { GAME_CONSTANTS, WORLD_HEIGHT, WORLD_WIDTH } from "@/lib/game-core/constants";
import type { GameState, ObstacleState } from "@/lib/game-core/types";


function getAvatar(characterId: GameState["characterId"]) {
  return avatars.find((avatar) => avatar.id === characterId) ?? avatars[0];
}

function getObstacleStyle(index: number): (typeof obstacleStyles)[0] {
  return obstacleStyles[index % obstacleStyles.length];
}

let backdropCache: OffscreenCanvas | null = null;
let backdropCacheWidth = 0;
let backdropCacheHeight = 0;

export function drawScene(
  context: CanvasRenderingContext2D,
  state: GameState,
  size: { width: number; height: number },
  hidePlayer = false,
): void {
  const scale = Math.max(size.width / WORLD_WIDTH, size.height / WORLD_HEIGHT);
  const offsetX = (size.width - WORLD_WIDTH * scale) / 2;
  const offsetY = (size.height - WORLD_HEIGHT * scale) / 2;

  if (
    !backdropCache ||
    backdropCacheWidth !== size.width ||
    backdropCacheHeight !== size.height
  ) {
    backdropCache = new OffscreenCanvas(size.width, size.height);
    backdropCacheWidth = size.width;
    backdropCacheHeight = size.height;
    const offCtx = backdropCache.getContext("2d") as OffscreenCanvasRenderingContext2D;
    drawBackdrop(offCtx, size.width, size.height);
  }

  context.clearRect(0, 0, size.width, size.height);
  context.drawImage(backdropCache, 0, 0);

  const scrollX = state.phase === "running"
    ? (state.elapsedMs / 1000 * GAME_CONSTANTS.obstacleSpeed) % WORLD_WIDTH
    : 0;

  // Ground drawn first so it sits behind obstacles
  const groundTopCanvas = GROUND_TOP * scale + offsetY;
  drawGround(context, size.width, size.height, groundTopCanvas, scale);

  context.save();
  context.translate(offsetX, offsetY);
  context.scale(scale, scale);
  drawScrolledClouds(context, 0);
  drawCityscape(context, 0);          // buildings static
  drawBushes(context, scrollX);       // bushes scroll with obstacles
  state.obstacles.forEach((obstacle) => drawObstacle(context, obstacle));
  const bobOffset = state.phase === "ready" ? Math.sin(Date.now() / 380) * 10 : 0;
  if (!hidePlayer) {
    drawPlayer(context, state, bobOffset);
  }
  context.restore();

  drawHud(context, state, size);
}

function drawBackdrop(
  context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
): void {
  context.fillStyle = "#87ceeb";
  context.fillRect(0, 0, canvasWidth, canvasHeight);
}

function drawScrolledClouds(context: CanvasRenderingContext2D, scrollX: number): void {
  const count = 6;
  const spacing = WORLD_WIDTH / count;
  const sizes =   [1, 0.75, 0.9, 0.7, 0.85, 0.95];
  const yOffsets = [70, 52, 80, 60, 72, 58];

  // Draw two full sets so the wrap is seamless
  for (let set = 0; set < 2; set++) {
    for (let i = 0; i < count; i++) {
      const cx = (spacing * i + spacing * 0.5) - (scrollX % WORLD_WIDTH) + set * WORLD_WIDTH;
      if (cx < -60 || cx > WORLD_WIDTH + 60) continue;
      drawCloud(context, cx, yOffsets[i % yOffsets.length], sizes[i % sizes.length]);
    }
  }
}

const BUILDINGS: { x: number; w: number; h: number; color: string; windowColor: string }[] = [
  { x: -5,   w: 55,  h: 110, color: "#7ec8d8", windowColor: "#fffde0" },
  { x: 62,   w: 38,  h: 68,  color: "#9dd4e0", windowColor: "#fffde0" },
  { x: 105,  w: 65,  h: 140, color: "#6ab8cc", windowColor: "#fffde0" },
  { x: 184,  w: 45,  h: 90,  color: "#8ecfdf", windowColor: "#fffde0" },
  { x: 236,  w: 32,  h: 54,  color: "#a4d8e4", windowColor: "#fffde0" },
  { x: 272,  w: 55,  h: 118, color: "#72c0d0", windowColor: "#fffde0" },
  { x: 338,  w: 44,  h: 75,  color: "#90d0df", windowColor: "#fffde0" },
  { x: 390,  w: 58,  h: 104, color: "#68b8cc", windowColor: "#fffde0" },
];

function drawCityscape(context: CanvasRenderingContext2D, scrollX: number): void {
  const groundY = GROUND_TOP;
  const offset = scrollX % WORLD_WIDTH;

  for (let set = 0; set < 2; set++) {
    const sx = -offset + set * WORLD_WIDTH;
    for (const b of BUILDINGS) {
      const bx = b.x + sx;
      if (bx + b.w < -10 || bx > WORLD_WIDTH + 10) continue;
      const top = groundY - b.h;

      context.fillStyle = b.color;
      context.fillRect(bx, top, b.w, b.h);
      context.fillStyle = "rgba(0,0,0,0.12)";
      context.fillRect(bx, top, 6, b.h);
      context.fillStyle = "rgba(255,255,255,0.15)";
      context.fillRect(bx + b.w - 6, top, 6, b.h);
      context.fillStyle = "rgba(0,0,0,0.18)";
      context.fillRect(bx, top, b.w, 5);

      const winW = 8, winH = 8, colGap = 12, rowGap = 14, paddingX = 10, paddingY = 14;
      for (let wy = top + paddingY; wy + winH < groundY - 6; wy += rowGap) {
        for (let wx = bx + paddingX; wx + winW < bx + b.w - paddingX; wx += colGap) {
          const lit = ((wx * 7 + wy * 13) % 5) !== 0;
          context.fillStyle = lit ? b.windowColor : "rgba(0,0,0,0.25)";
          context.fillRect(wx, wy, winW, winH);
        }
      }
    }
  }
}

function drawBushes(context: CanvasRenderingContext2D, scrollX: number): void {
  const groundY = GROUND_TOP;
  const offset = scrollX % WORLD_WIDTH;
  const bushColors = ["#52a820", "#3d8c18", "#61b82a", "#4aa01e"];
  const bushSpacing = 38;

  for (let set = 0; set < 2; set++) {
    for (let i = 0; i * bushSpacing < WORLD_WIDTH; i++) {
      const bx = i * bushSpacing + 8 - offset + set * WORLD_WIDTH;
      if (bx < -20 || bx > WORLD_WIDTH + 20) continue;
      const r = 11 + ((i * bushSpacing * 3) % 5);
      context.fillStyle = bushColors[i % bushColors.length];
      context.beginPath();
      context.arc(bx, groundY - r * 0.6, r, 0, Math.PI * 2);
      context.fill();
      context.fillStyle = "rgba(255,255,255,0.15)";
      context.beginPath();
      context.arc(bx - r * 0.25, groundY - r * 0.85, r * 0.4, 0, Math.PI * 2);
      context.fill();
    }
  }
}

const GROUND_TOP = WORLD_HEIGHT - GAME_CONSTANTS.groundHeight;
const GRASS_HEIGHT = GAME_CONSTANTS.grassHeight;

function drawGround(context: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number, groundTopCanvas: number, scale: number): void {
  const grassH = Math.max(4, GRASS_HEIGHT * scale);
  const dirtTop = groundTopCanvas + grassH;
  const dirtH = canvasHeight - dirtTop;

  // Tan dirt band
  context.fillStyle = "#ded895";
  context.fillRect(0, dirtTop, canvasWidth, dirtH);

  // Darker border between grass and dirt
  context.fillStyle = "#b8b050";
  context.fillRect(0, dirtTop, canvasWidth, Math.max(2, 3 * scale));

  // Solid green grass strip
  context.fillStyle = "#74bf2e";
  context.fillRect(0, groundTopCanvas, canvasWidth, grassH);

  // Bright top highlight on grass
  context.fillStyle = "#9cdc42";
  context.fillRect(0, groundTopCanvas, canvasWidth, Math.max(2, 5 * scale));
}

function drawCloud(context: CanvasRenderingContext2D, cx: number, cy: number, s: number): void {
  const r = 28 * s;
  const circles: [number, number, number][] = [
    [cx,              cy,             r],
    [cx - r,          cy + r * 0.3,   r * 0.7],
    [cx + r,          cy + r * 0.3,   r * 0.7],
    [cx - r * 0.5,    cy + r * 0.7,   r * 0.55],
    [cx + r * 0.5,    cy + r * 0.7,   r * 0.55],
  ];

  // Fill pass
  context.fillStyle = "#fffcf0";
  for (const [x, y, radius] of circles) {
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();
  }

  // Round shading on main bubble only — dark shadow lower-right, highlight upper-left
  context.fillStyle = "rgba(0,0,0,0.07)";
  context.beginPath();
  context.arc(cx + r * 0.28, cy + r * 0.3, r * 0.52, 0, Math.PI * 2);
  context.fill();

  context.fillStyle = "rgba(255,255,255,0.45)";
  context.beginPath();
  context.arc(cx - r * 0.28, cy - r * 0.28, r * 0.36, 0, Math.PI * 2);
  context.fill();
}

function drawHud(context: CanvasRenderingContext2D, state: GameState, size: { width: number; height: number }): void {
  if (state.phase === "ready") {
    return;
  }

  const text = String(state.score);
  const cx = size.width / 2;
  const cy = 38;
  const radius = 28;

  // White circle background
  context.beginPath();
  context.arc(cx, cy, radius, 0, Math.PI * 2);
  context.fillStyle = "#ffffff";
  context.fill();

  // Score text centered in circle
  context.fillStyle = "#1a1a1a";
  context.font = "700 28px Arial";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(text, cx, cy + 1);
  context.textAlign = "left";
  context.textBaseline = "alphabetic";
}

function drawPlayer(context: CanvasRenderingContext2D, state: GameState, bobOffset = 0): void {
  const avatar = getAvatar(state.characterId);
  const ss = avatar.sackScale;
  const ex = (avatar.lengthScale - 1) * 32; // extra shaft length in world units

  context.save();
  context.translate(state.player.x, state.player.y + bobOffset);
  context.rotate(state.player.rotation);
  context.scale(avatar.sizeScale, avatar.sizeScale);

  // ── Single blob path: shaft + sack ──
  // Sack coords stay fixed; shaft tip coords shift right by ex
  context.beginPath();
  context.moveTo(-14, -9);
  context.lineTo(18 + ex, -9);
  context.quadraticCurveTo(36 + ex, -9, 36 + ex, 0);
  context.quadraticCurveTo(36 + ex, 9, 18 + ex, 9);
  context.lineTo(-2, 9);
  context.quadraticCurveTo(-2, 9 + 9 * ss, -10, 9 + 15 * ss);
  context.quadraticCurveTo(-16, 9 + 21 * ss, -26, 9 + 17 * ss);
  context.quadraticCurveTo(-34, 9 + 11 * ss, -30, 9 + ss);
  context.quadraticCurveTo(-28, -9, -14, -9);
  context.closePath();

  context.fillStyle = avatar.shaftColor;
  context.fill();

  context.strokeStyle = avatar.outline;
  context.lineWidth = 3.5;
  context.lineJoin = "round";
  context.stroke();

  // Corona line
  context.beginPath();
  context.moveTo(18 + ex, -9);
  context.quadraticCurveTo(16 + ex, 0, 18 + ex, 9);
  context.strokeStyle = avatar.outline;
  context.lineWidth = 2.5;
  context.stroke();

  // Scrotal divide
  context.beginPath();
  context.moveTo(-10, 9 + 15 * ss);
  context.quadraticCurveTo(-18, 9 + 17 * ss, -26, 9 + 13 * ss);
  context.lineWidth = 2;
  context.stroke();

  // Glans colour
  context.fillStyle = avatar.headColor;
  context.beginPath();
  context.moveTo(18 + ex, -7);
  context.quadraticCurveTo(34 + ex, -7, 34 + ex, 0);
  context.quadraticCurveTo(34 + ex, 7, 18 + ex, 7);
  context.quadraticCurveTo(16 + ex, 0, 18 + ex, -7);
  context.fill();

  // Glans shine
  context.fillStyle = "rgba(255,255,255,0.28)";
  context.beginPath();
  context.ellipse(24 + ex, -5, 5, 3, -0.4, 0, Math.PI * 2);
  context.fill();

  context.restore();
}

function drawObstacle(context: CanvasRenderingContext2D, obstacle: ObstacleState): void {
  const x = obstacle.x;
  const gapTop = obstacle.gapY - obstacle.gapHeight / 2;
  const gapBottom = obstacle.gapY + obstacle.gapHeight / 2;

  drawObstaclePiece(context, x, 0, obstacle.width, gapTop, false, obstacle.id * 2);
  drawObstaclePiece(context, x, gapBottom, obstacle.width, GROUND_TOP + GRASS_HEIGHT - gapBottom, true, obstacle.id * 2 + 1);
}

function drawObstaclePiece(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  headAtTop: boolean,
  styleIndex: number,
): void {
  drawPipeFallback(context, x, y, width, height, headAtTop, styleIndex);
}

function drawPipeFallback(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  headAtTop: boolean,
  styleIndex: number,
): void {
  const style = getObstacleStyle(styleIndex);

  context.save();
  if (!headAtTop) {
    context.translate(0, y + height);
    context.scale(1, -1);
    y = 0;
  }

  const cx = x + width / 2;
  const shw = width * 0.32;          // shaft half-width (narrower)
  const ghw = width * 0.46;          // glans half-width (wider = mushroom flare)
  const capH = width * 0.75;         // glans cap height
  const shaftTop = y + capH;
  const shaftBot = y + height;

  // ── Shaft body ──
  context.beginPath();
  context.moveTo(cx - shw, shaftTop);
  context.lineTo(cx - shw, shaftBot);
  context.lineTo(cx + shw, shaftBot);
  context.lineTo(cx + shw, shaftTop);
  context.closePath();
  context.fillStyle = style.shaftColor;
  context.fill();
  context.strokeStyle = style.outline;
  context.lineWidth = 3.5;
  context.lineJoin = "round";
  context.stroke();

  // ── Glans — mushroom dome with rounded base corners and tiny V tip ──
  const vDip = y + capH * 0.06;
  const cr = capH * 0.18;            // corner rounding radius
  context.beginPath();
  context.moveTo(cx - ghw + cr, shaftTop);
  // left base corner (rounded)
  context.quadraticCurveTo(cx - ghw, shaftTop, cx - ghw, shaftTop - cr);
  // left arch up to V tip
  context.quadraticCurveTo(cx - ghw, y, cx - ghw * 0.08, vDip);
  // tiny V at top
  context.quadraticCurveTo(cx, vDip + capH * 0.02, cx + ghw * 0.08, vDip);
  // right arch down
  context.quadraticCurveTo(cx + ghw, y, cx + ghw, shaftTop - cr);
  // right base corner (rounded)
  context.quadraticCurveTo(cx + ghw, shaftTop, cx + ghw - cr, shaftTop);
  context.lineTo(cx - ghw + cr, shaftTop);
  context.closePath();
  context.fillStyle = style.headColor;
  context.fill();
  context.strokeStyle = style.outline;
  context.lineWidth = 3.5;
  context.lineJoin = "round";
  context.stroke();

  // Glans shine
  context.fillStyle = "rgba(255,255,255,0.28)";
  context.beginPath();
  context.ellipse(cx - ghw * 0.3, y + capH * 0.25, ghw * 0.28, capH * 0.18, -0.3, 0, Math.PI * 2);
  context.fill();

  // Shaft vein (offset from center)
  context.beginPath();
  context.moveTo(cx - shw * 0.2, shaftTop + 6);
  context.lineTo(cx - shw * 0.2, shaftBot - 6);
  context.strokeStyle = style.veinColor;
  context.lineWidth = 2;
  context.stroke();

  // Shaft side highlight
  context.fillStyle = "rgba(255,255,255,0.14)";
  context.fillRect(cx - shw + 4, shaftTop, shw * 0.28, shaftBot - shaftTop);

  context.restore();
}

export function logicalCanvasSize(bounds: DOMRectReadOnly): { width: number; height: number } {
  return {
    width: bounds.width,
    height: bounds.height,
  };
}

export function gameOverlayPrompt(phase: GameState["phase"]): string {
  return phase === "dead" ? "Crash landed." : "";
}

export const retryDelayMs = GAME_CONSTANTS.retryDelayMs;
