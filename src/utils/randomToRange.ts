export const randomToRange = (seed: number, amount: number) =>
  Math.round((seed + 1) * 0.5 * amount);
