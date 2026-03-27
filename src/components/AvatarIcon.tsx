import { avatars, type AvatarId } from "@/lib/content/gameContent";

type AvatarIconProps = {
  characterId: AvatarId;
  paletteCharacterId?: AvatarId;
  shaftExtensionX?: number;
  strokeColor?: string;
};

export function AvatarIcon({
  characterId,
  paletteCharacterId,
  shaftExtensionX = 0,
  strokeColor,
}: AvatarIconProps) {
  const avatar = avatars.find((a) => a.id === characterId) ?? avatars[0];
  const paletteAvatar = avatars.find((a) => a.id === (paletteCharacterId ?? characterId)) ?? avatar;
  const ex = (avatar.lengthScale - 1) * 32 + shaftExtensionX;
  const ss = avatar.sackScale;

  // On the dark leaderboard card (#0a0a0a), near-black outlines like the
  // onyx-twin's (#1e0f09) are invisible. Fall back to headColor as the icon
  // stroke while keeping the avatar's own palette.
  const outlineR = parseInt(paletteAvatar.outline.slice(1, 3), 16);
  const defaultIconStroke = outlineR < 50 ? paletteAvatar.headColor : paletteAvatar.outline;
  const iconStroke = strokeColor ?? defaultIconStroke;

  // Stroke half-width used as padding so strokes aren't clipped at the edges.
  const pad = 2;
  const vbX = -34 - pad;
  const vbY = -9 - pad;
  const vbW = 36 + ex - vbX + pad;
  const vbH = 9 + 21 * ss - vbY + pad;

  const body = [
    `M -14 -9`,
    `L ${18 + ex} -9`,
    `Q ${36 + ex} -9 ${36 + ex} 0`,
    `Q ${36 + ex} 9 ${18 + ex} 9`,
    `L -2 9`,
    `Q -2 ${9 + 9 * ss} -10 ${9 + 15 * ss}`,
    `Q -16 ${9 + 21 * ss} -26 ${9 + 17 * ss}`,
    `Q -34 ${9 + 11 * ss} -30 ${9 + ss}`,
    `Q -28 -9 -14 -9 Z`,
  ].join(" ");

  const corona = `M ${18 + ex} -9 Q ${16 + ex} 0 ${18 + ex} 9`;
  const sack = `M -10 ${9 + 15 * ss} Q -18 ${9 + 17 * ss} -26 ${9 + 13 * ss}`;
  const glans = `M ${18 + ex} -7 Q ${34 + ex} -7 ${34 + ex} 0 Q ${34 + ex} 7 ${18 + ex} 7 Q ${16 + ex} 0 ${18 + ex} -7 Z`;

  const shineCx = 24 + ex;
  const shineCy = -5;

  return (
    <svg
      aria-hidden="true"
      preserveAspectRatio="xMinYMid meet"
      style={{ display: "block" }}
      viewBox={`${vbX} ${vbY} ${vbW} ${vbH}`}
    >
      <path
        d={body}
        fill={paletteAvatar.shaftColor}
        stroke={iconStroke}
        strokeLinejoin="round"
        strokeWidth="3.5"
      />
      <path d={corona} fill="none" stroke={iconStroke} strokeWidth="2.5" />
      <path d={sack} fill="none" stroke={iconStroke} strokeWidth="2" />
      <path d={glans} fill={paletteAvatar.headColor} />
      <ellipse
        cx={shineCx}
        cy={shineCy}
        fill="rgba(255,255,255,0.28)"
        rx={5}
        ry={3}
        transform={`rotate(-22.9 ${shineCx} ${shineCy})`}
      />
    </svg>
  );
}
