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
    return permission;
  };

  // TODO: 아이콘도 넣고 개선 필요
  const createNotification = (title: string, options?: NotificationOptions) => {
    if (permission === 'granted') {
      return new Notification(title, options);
    }
  };

  return { permission, requestPermission, createNotification };
};
