type params = {
  years?: number;
  months?: number;
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
};

export const createIsoDuration = ({
  years = 0,
  months = 0,
  days = 0,
  hours = 0,
  minutes = 0,
  seconds = 0,
}: params): string => {
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
