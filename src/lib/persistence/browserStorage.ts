import type { AvatarId } from "@/lib/content/gameContent";

export const storageKeys = {
  ageConfirmed: "flappy-dick.age-confirmed",
  selectedCharacter: "flappy-dick.character",
  muted: "flappy-dick.muted",
  bestScore: "flappy-dick.best-score",
} as const;

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function loadBoolean(key: string, fallback = false): boolean {
  if (!canUseStorage()) {
    return fallback;
  }

  const value = window.localStorage.getItem(key);
  return value === null ? fallback : value === "true";
}

export function saveBoolean(key: string, value: boolean): void {
  if (canUseStorage()) {
    window.localStorage.setItem(key, String(value));
  }
}

export function loadNumber(key: string, fallback = 0): number {
  if (!canUseStorage()) {
    return fallback;
  }

  const value = window.localStorage.getItem(key);
  return value === null ? fallback : Number(value);
}

export function saveNumber(key: string, value: number): void {
  if (canUseStorage()) {
    window.localStorage.setItem(key, String(value));
  }
}

export function loadCharacter(fallback: AvatarId): AvatarId {
  if (!canUseStorage()) {
    return fallback;
  }

  const value = window.localStorage.getItem(storageKeys.selectedCharacter);
  return value === "onyx-twin" ? "onyx-twin" : fallback;
}

export function saveCharacter(characterId: AvatarId): void {
  if (canUseStorage()) {
    window.localStorage.setItem(storageKeys.selectedCharacter, characterId);
  }
}
