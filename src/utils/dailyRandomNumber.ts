export const dailyRandomNumber = () => {
  const seed = new Date().getDate() * Math.pow(9, 18);
  return Math.sin(seed);
};
