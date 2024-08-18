import { useLocalStorage } from 'usehooks-ts';

import { CatType } from '@/entities/cat';
import { LOCAL_STORAGE_KEY } from '@/shared/constants';
import { useNotification } from '@/shared/hooks';

export const useFocusNotification = () => {
  const { permission, requestPermission, createNotification } = useNotification();
  const [isEnabled, setIsEnabled] = useLocalStorage(
    LOCAL_STORAGE_KEY.PUSH_FOCUS_ENABLED,
    permission === 'granted',
  );
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
  const createNotificationByMode = async (catType: CatType, when: 'focus-end' | 'rest-end') => {
    if (!isEnabled) return;

    if (catType === 'THREE_COLOR') {
      if (when === 'focus-end') {
        createNotification('집중이 끝났다냥! 이제 나랑 놀아달라냥');
      } else {
        createNotification('이제 다시 집중해볼까냥?');
      }
    } else {
      if (when === 'focus-end') {
        createNotification('집중이 끝났다냥! 원하는 만큼 집중했냥?');
      } else {
        createNotification('집중할 시간이다냥! 빨리 들어오라냥');
      }
    }
  };

  return { isEnabled, isUnavailable, changeEnabled, createNotificationByMode };
};
