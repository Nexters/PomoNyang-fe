export const msToTime = (ms: number) => {
  const seconds = Math.floor(ms / 1000) % 60 || 0;
  const minutes = Math.floor(ms / (1000 * 60)) % 60 || 0;

  return { minutes, seconds };
};
