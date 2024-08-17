import { useLocalStorage } from 'usehooks-ts';

import { useNotification } from '@/shared/hooks';

export const useFocusNotification = () => {
  const { permission, requestPermission, createNotification } = useNotification();
  const [isEnabled, setIsEnabled] = useLocalStorage('isPushFocusEnabled', permission === 'granted');
  const isUnavailable = permission === 'not-supported' || permission === 'denied';

  const changeEnabled = async (nextEnabled: boolean) => {
    if (isUnavailable) {
      return setIsEnabled(false);
    }
    if (permission === 'granted') {
      return setIsEnabled(nextEnabled);
    }

    const nextPermission = await requestPermission();
    setIsEnabled(nextPermission === 'granted' ? nextEnabled : false);
  };
  const createNotificationByMode = async (mode: string) => {
    if (!isEnabled) return;

    // TODO: 개선 필요
    createNotification(mode === 'focus' ? '휴식' : '집중');
  };

  return { isEnabled, isUnavailable, changeEnabled, createNotificationByMode };
};
