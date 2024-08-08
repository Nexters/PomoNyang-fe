import { useRef } from 'react';

// 모든 타입의 인자를 다 받을 수 있으며 어떠한 타입으로도 반환될 수 있음
type TDebounceFunction<T extends unknown[]> = (...args: T) => unknown;

export const useDebounce = <T extends unknown[]>(callback: TDebounceFunction<T>, delay: number) => {
  const timeoutRef = useRef<NodeJS.Timeout>();

  // 디바운싱된 함수를 반환
  // callback 함수와 동일한 인자를 받아서 delay 시간이 지난 후에 callback 함수를 실행
  return function debounced(...arg: T) {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => callback(...arg), delay);
  };
};
