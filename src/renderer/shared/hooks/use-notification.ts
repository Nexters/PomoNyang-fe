import { useState } from 'react';

export type Permission = NotificationPermission | 'not-supported';

export const useNotification = () => {
  const [permission, setPermission] = useState<Permission>(() => {
    if (!('Notification' in window)) {
      return 'not-supported';
    }
    return Notification.permission;
  });

  const requestPermission = async (): Promise<Permission> => {
    if (!('Notification' in window)) return 'not-supported';

    const permission = await Notification.requestPermission();
    setPermission(permission);
    // @note: notification이 처음 생성되었을때 권한여부를 물어본다.
    createNotification('반갑다냥');
    return permission;
  };

  // TODO: 아이콘도 넣고 개선 필요 -> 앱아이콘이 설정되면 알아서 보임
  const createNotification = (body: string, options?: NotificationOptions) => {
    if (permission === 'granted') {
      return new Notification('모하냥', {
        body,
        ...options,
      });
    }
  };

  return { permission, requestPermission, createNotification };
};
