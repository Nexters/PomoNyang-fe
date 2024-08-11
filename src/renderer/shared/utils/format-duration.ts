export const formatDuration = (isoDuration: string) => {
  const regex = /P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?/;

  // Parse the ISO 8601 duration string
  const matches = isoDuration.match(regex);

  if (!matches) {
    throw new Error('Invalid ISO 8601 duration format');
  }

  // Extract the components or use 0 if they are undefined
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
