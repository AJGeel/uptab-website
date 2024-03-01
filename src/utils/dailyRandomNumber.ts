export const dailyRandomNumber = (seedOffset = 0) => {
  const seed = (new Date().getDate() + seedOffset) * Math.pow(9, 18);
  return Math.sin(seed);
};
