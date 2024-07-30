import { useTimer } from '@/shared/hooks';

const __localStorage = {
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

type TTimer = {
  currentTime: number;
};

const TWENTY_FIVE_MINUTES = 1000 * 60 * 25;

export const usePomodoro = () => {
  const INITIAL_TIME = __localStorage.getItem<TTimer>('timer')?.currentTime || TWENTY_FIVE_MINUTES; // 25분

  return useTimer(INITIAL_TIME, TWENTY_FIVE_MINUTES, {
    onFinish: () => {
      new Notification('모하냥', {
        body: '수고했다냥',
      });
    },
    onStop: () => {
      localStorage.removeItem('timer');
    },
    onRunning: (ms) => {
      __localStorage.setItem('timer', {
        currentTime: ms,
      });
    },
  });
};
