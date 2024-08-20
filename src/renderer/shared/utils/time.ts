export const msToTime = (ms: number) => {
  const seconds = Math.floor(ms / 1000) % 60 || 0;
  const minutes = Math.floor(ms / (1000 * 60)) || 0;

  return { minutes, seconds };
};

export const minutesToMs = (minutes: number) => minutes * 60 * 1000;
