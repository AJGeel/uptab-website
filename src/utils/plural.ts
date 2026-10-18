/** "1 photo", "2 photos". For nouns that just take an "s". */
export const plural = (count: number, noun: string) =>
  `${count} ${noun}${count === 1 ? "" : "s"}`;
