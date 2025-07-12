export const msToTime = (ms: number) => {
  const seconds = Math.floor(ms / 1000) % 60 || 0;
  const minutes = Math.floor(ms / (1000 * 60)) || 0;

  return { minutes, seconds };
};

export const minutesToMs = (minutes: number) => minutes * 60 * 1000;

export const msToMinutes = (ms: number) => Math.floor(ms / 1000 / 60);

export const msToTimeString = (ms: number, withSeconds = false) => {
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((ms % (1000 * 60)) / 1000);

  const array: string[] = [];
  if (hours > 0) {
    array.push(`${hours}시간`);
  }
  if (minutes > 0) {
    array.push(`${minutes}분`);
  }
  if (withSeconds && seconds > 0) {
    array.push(`${seconds}초`);
  }
  if (array.length === 0) {
    return withSeconds ? '0초' : '0분';
  }
  return array.join(' ');
};
