export function calculateRhythm(actionsCount: number) {
  return Math.min(100, actionsCount * 12)
}
