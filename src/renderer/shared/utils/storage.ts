export const __localStorage = {
  getItem<T = unknown>(key: string) {
    const stored = localStorage.getItem(key);
    if (stored == null) return null;
    try {
      return JSON.parse(stored) as T;
    } catch (error) {
      console.error(error);
      return null;
    }
  },
  setItem<T = unknown>(key: string, value: T) {
    localStorage.setItem(key, JSON.stringify(value));
  },
};
