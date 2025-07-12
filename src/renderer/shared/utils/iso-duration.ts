export type Duration = {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const isoDurationRegex =
  /P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?/;
const defaultDuration: Duration = {
  years: 0,
  months: 0,
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
};

export const parseIsoDuration = (isoDuration?: string) => {
  if (!isoDuration) return defaultDuration;

  const matches = isoDuration.match(isoDurationRegex);
  if (!matches) return defaultDuration;

  const years = Number(matches[1]) || 0;
  const months = Number(matches[2]) || 0;
  const days = Number(matches[3]) || 0;
  const hours = Number(matches[4]) || 0;
  const minutes = Number(matches[5]) || 0;
  const seconds = Number(matches[6]) || 0;

  return {
    years,
    months,
    days,
    hours,
    minutes,
    seconds,
  };
};

export const createIsoDuration = ({
  years = 0,
  months = 0,
  days = 0,
  hours = 0,
  minutes = 0,
  seconds = 0,
}: Partial<Duration>): string => {
  const parts: string[] = [];
  if (years > 0) parts.push(`${years}Y`);
  if (months > 0) parts.push(`${months}M`);
  if (days > 0) parts.push(`${days}D`);

  const timeParts: string[] = [];
  if (hours > 0) timeParts.push(`${hours}H`);
  if (minutes > 0) timeParts.push(`${minutes}M`);
  if (seconds > 0) timeParts.push(`${seconds}S`);

  if (timeParts.length > 0) {
    parts.push('T' + timeParts.join(''));
  }

  return parts.length > 0 ? 'P' + parts.join('') : 'PT0S';
};

export const msToIsoDuration = (ms: number): string => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  return createIsoDuration({
    days: days % 365,
    hours: hours % 24,
    minutes: minutes % 60,
    seconds: seconds % 60,
  });
};

export const isoDurationToMs = (isoDuration?: string) => {
  const { hours, minutes, seconds } = parseIsoDuration(isoDuration);
  return hours * 60 * 60 * 1000 + minutes * 60 * 1000 + seconds * 1000;
};

export const isoDurationToString = (isoDuration?: string, withSeconds = false) => {
  const { years, months, days, hours, minutes, seconds } = parseIsoDuration(isoDuration);
  const parts: string[] = [];

  if (years > 0) parts.push(`${years}년`);
  if (months > 0) parts.push(`${months}개월`);
  if (days > 0) parts.push(`${days}일`);
  if (hours > 0) parts.push(`${hours}시간`);
  if (minutes > 0) parts.push(`${minutes}분`);
  if (withSeconds && seconds > 0) parts.push(`${seconds}초`);

  if (parts.length === 0) {
    return withSeconds ? '0초' : '0분';
  }
  return parts.join(' ');
};
