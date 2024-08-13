const isoRegex = /P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?/;
export const parseIsoDuration = (isoDuration: string) => {
  const matches = isoDuration.match(isoRegex);

  if (!matches) {
    throw new Error('Invalid ISO 8601 duration format');
  }

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
