export const parse = <T>(value: string | null, fallback: T): T => {
  if (value == null) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch (error) {
    console.error(error);
    return fallback;
  }
};
