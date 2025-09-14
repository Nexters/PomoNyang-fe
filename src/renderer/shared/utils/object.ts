// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const pick = <T extends Record<string, any>, K extends keyof T>(
  object: T,
  condition: (v: T[K]) => boolean,
) => {
  return Object.fromEntries(Object.entries(object).filter(([, v]) => condition(v)));
};
