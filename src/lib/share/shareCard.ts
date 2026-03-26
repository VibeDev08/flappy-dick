import type { AvatarDefinition } from "@/lib/content/gameContent";

type ShareCardInput = {
  score: number;
  funnyLine: string;
  avatar: AvatarDefinition;
  origin: string;
};

export async function createShareCardDataUrl(input: ShareCardInput): Promise<string> {
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1920;
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Canvas 2D context unavailable.");
  }

  context.fillStyle = "#110f18";
  context.fillRect(0, 0, canvas.width, canvas.height);

  const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "#1d2235");
  gradient.addColorStop(1, "#2f183a");
  context.fillStyle = gradient;
  context.fillRect(90, 90, canvas.width - 180, canvas.height - 180);

  context.fillStyle = "#ffffff";
  context.font = "700 76px Arial";
  context.fillText("FLAPPY DICK", 130, 220);

  context.font = "600 58px Arial";
  context.fillText(`Score: ${input.score}`, 130, 360);
  context.fillText(`Character: ${input.avatar.label}`, 130, 450);

  // Organic splat shape closer to the reference image
  context.fillStyle = "#ffffff";
  context.beginPath();
  const cx = canvas.width / 2;
  const cy = 980;
  const r = 260;
  
  context.moveTo(cx - r * 0.85, cy - r * 0.45);
  context.quadraticCurveTo(cx - r * 0.65, cy - r * 0.85, cx - r * 0.15, cy - r * 0.78);
  context.quadraticCurveTo(cx + r * 0.45, cy - r * 0.88, cx + r * 0.72, cy - r * 0.48);
  context.quadraticCurveTo(cx + r * 0.88, cy - r * 0.12, cx + r * 0.65, cy + r * 0.38);
  context.quadraticCurveTo(cx + r * 0.28, cy + r * 0.72, cx - r * 0.35, cy + r * 0.58);
  context.quadraticCurveTo(cx - r * 0.78, cy + r * 0.35, cx - r * 0.85, cy - r * 0.45);
  context.closePath();
  context.fill();

  const avatar = input.avatar;

  // Draw penis like the avatar and obstacles
  context.fillStyle = avatar.outline;
  context.fillRect(460, 670, 160, 620);
  context.fillStyle = avatar.shaftColor;
  context.fillRect(472, 682, 136, 596);

  // Penis head - matching avatar style
  context.fillStyle = "#e88a75";
  context.beginPath();
  context.ellipse(540, 650, 85, 65, 0, 0, Math.PI * 2);
  context.fill();

  context.fillStyle = avatar.headColor;
  context.beginPath();
  context.ellipse(540, 635, 68, 52, 0, 0, Math.PI * 2);
  context.fill();

  context.fillStyle = "#ffffff";
  context.font = "600 52px Arial";
  wrapText(context, input.funnyLine, 130, 1480, 820, 72);

  context.font = "600 42px Arial";
  context.fillText(input.origin, 130, 1770);
  return canvas.toDataURL("image/png");
}

function wrapText(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
): void {
  const words = text.split(" ");
  let line = "";
  let row = 0;

  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (context.measureText(candidate).width > maxWidth && line) {
      context.fillText(line, x, y + row * lineHeight);
      line = word;
      row += 1;
    } else {
      line = candidate;
    }
  }

  if (line) {
    context.fillText(line, x, y + row * lineHeight);
  }
}
