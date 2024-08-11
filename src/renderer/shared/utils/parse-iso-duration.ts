const isoRegex = /P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?/;
export const parseIsoDuration = (isoDuration: string) => {
  const matches = isoDuration.match(isoRegex);

  if (!matches) {
    throw new Error('Invalid ISO 8601 duration format');
  }

  const years = matches[1] || 0;
  const months = matches[2] || 0;
  const days = matches[3] || 0;
  const hours = matches[4] || 0;
  const minutes = matches[5] || 0;
  const seconds = matches[6] || 0;

  return {
    years,
    months,
    days,
    hours,
    minutes,
    seconds,
  };
};