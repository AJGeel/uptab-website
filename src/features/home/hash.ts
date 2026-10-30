/** A small, well-mixed string hash (FNV-1a), so consecutive inputs give unrelated results. */
export const hash = (value: string) => {
  let result = 0x811c9dc5;

  for (const char of value) {
    result = Math.imul(result ^ char.charCodeAt(0), 0x01000193);
  }

  return result >>> 0;
};
