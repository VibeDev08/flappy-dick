export type AvatarId = "ivory-twin" | "onyx-twin";

export type AvatarDefinition = {
  id: AvatarId;
  label: string;
  description: string;
  shaftColor: string;
  headColor: string;
  outline: string;
  sizeScale: number;
  lengthScale: number;
  sackScale: number;
};

export type ObstacleStyle = {
  shaftColor: string;
  headColor: string;
  ridgeColor: string;
  outline: string;
  veinColor: string;
};

export const avatars: AvatarDefinition[] = [
  {
    id: "ivory-twin",
    label: "White",
    description: "Peach shaft, pink glans. Flaps like a champ.",
    shaftColor: "#f0c0a6",
    headColor: "#ff9e85",
    outline: "#8b5e45",
    sizeScale: 0.94,
    lengthScale: 0.75,
    sackScale: 0.65,
  },
  {
    id: "onyx-twin",
    label: "Black",
    description: "Deeper tones, same flight dynamics.",
    shaftColor: "#4a2e1e",
    headColor: "#6b3a2e",
    outline: "#1e0f09",
    sizeScale: 0.94,
    lengthScale: 1.6,
    sackScale: 1.0,
  },
];

export const obstacleStyles: ObstacleStyle[] = [
  {
    // Pale peach
    shaftColor: "#f6d6c2",
    headColor: "#f19a8f",
    ridgeColor: "#e98a7c",
    outline: "#8f624e",
    veinColor: "#dca788",
  },
  {
    // Warm tan
    shaftColor: "#dbad86",
    headColor: "#e58471",
    ridgeColor: "#d77461",
    outline: "#7a503a",
    veinColor: "#be8d68",
  },
  {
    // Golden brown
    shaftColor: "#bf8655",
    headColor: "#d96d59",
    ridgeColor: "#c85d49",
    outline: "#65422f",
    veinColor: "#996749",
  },
  {
    // Cocoa
    shaftColor: "#99694b",
    headColor: "#bf6558",
    ridgeColor: "#ac5448",
    outline: "#4b3126",
    veinColor: "#7c543f",
  },
  {
    // Deep brown
    shaftColor: "#6e4736",
    headColor: "#a95a52",
    ridgeColor: "#934941",
    outline: "#2d1d17",
    veinColor: "#54382d",
  },
  {
    // Espresso
    shaftColor: "#53352a",
    headColor: "#8e4f49",
    ridgeColor: "#7a413b",
    outline: "#211512",
    veinColor: "#422b23",
  },
  {
    // Very dark umber
    shaftColor: "#402720",
    headColor: "#7a433f",
    ridgeColor: "#663632",
    outline: "#190f0d",
    veinColor: "#34211b",
  },
  {
    // Near-ebony brown
    shaftColor: "#2f1d18",
    headColor: "#643936",
    ridgeColor: "#552f2c",
    outline: "#120b09",
    veinColor: "#281813",
  },
  {
    // Rosy beige
    shaftColor: "#e8c1b0",
    headColor: "#ef8c86",
    ridgeColor: "#dd756f",
    outline: "#83584b",
    veinColor: "#cb9986",
  },
];

export const gooLines = [
  "Tube sock. No debate.",
  "Prematurely launched.",
  "Goo everywhere. Oops.",
  "The shaft has spoken.",
  "Knob, meet obstacle.",
  "Came too soon. Again.",
  "Went limp. Figures.",
  "Soft landing. Again.",
  "Unloaded on impact.",
  "Blown it. Literally.",
  "Helmet dented. Noted.",
  "That tip didn't fit.",
  "Wrong hole. Again.",
  "Sticky situation.",
  "Splooge achieved.",
  "Dribbled early. Gross.",
  "No stamina whatsoever.",
];

export const socialLinks = [
  { id: "x",        label: "X (Twitter)", href: "https://x.com/flappydickgame" },
  { id: "instagram", label: "Instagram",  href: "https://instagram.com/flappydickgame" },
  { id: "discord",  label: "Discord",     href: "https://discord.gg/flappydick" },
  { id: "reddit",   label: "Reddit",      href: "https://reddit.com/r/flappydick" },
] as const;

export const uiCopy = {
  ageGateTitle: "Adults Only Airspace",
  ageGateBody: "This is a crude parody game with adult humor. Confirm you are 18+ to keep flapping.",
  startPrompt: "Tap, click, or smack space to flap.",
  retryPrompt: "Tap, click, or hit space to go again.",
  leaderboardTitle: "Top 10 Pecking Order",
};
