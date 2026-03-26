export function scoreToSplatterScale(score: number): number {
  const minScale = 0.34;
  const maxScale = 0.92;
  const eased = 1 - Math.exp(-score / 16);
  return minScale + (maxScale - minScale) * eased;
}
