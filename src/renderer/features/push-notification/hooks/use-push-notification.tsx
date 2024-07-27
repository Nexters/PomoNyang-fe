import { useEffect, useState } from 'react';

import { getAnalytics } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, type Messaging, onMessage, isSupported } from 'firebase/messaging';

import { firebaseConfig, vapidKey } from '../config';

export const usePushNotification = () => {
  const [messaging, setMessaging] = useState<Messaging>();

  // Notification 권한 요청
  const requestPermission = async () => {
    return Notification.requestPermission();
  };

  // firebase messaging 초기화
  const initMessaging = async () => {
    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);
    console.log(analytics);
    const messaging = getMessaging(app);

    const supported = await isSupported();
    console.log(supported);
    const permission = await requestPermission();

    if (supported && permission === 'granted') {
      setMessaging(messaging);
    }
  };

  // 토큰 발급
  const getFcmToken = async () => {
    if (!messaging) return;

    const currentToken = await getToken(messaging, { vapidKey });
    if (currentToken) {
      // @TODO: 푸쉬 알림 토큰 서버로 전송 /api/v1/device-tokens
      console.log('currentToken: ', currentToken);

      return currentToken;
    } else {
      console.log('No registration token available. Request permission to generate one.');
    }
  };

  // 푸쉬 알림 수신
  const subscribe = () => {
    if (!messaging) return;

    return onMessage(messaging, ({ notification }) => {
      const { title = '', body, icon } = notification ?? {};

      console.log('onMessage: ', title, body, icon);
      new Notification(title, { body, icon });
    });
  };

  useEffect(() => {
    initMessaging();
  }, []);

  useEffect(() => {
    getFcmToken();

    const unSubscribe = subscribe();

    return () => {
      unSubscribe?.();
    };
  }, [messaging]);

  return {};
};
