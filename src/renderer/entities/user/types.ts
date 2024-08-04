import { Cat } from '../cat';

export type User = {
  // 디바이스 고유 번호
  registeredDeviceNo: number;

  // 푸시 알림 동의 여부
  isPushEnabled: boolean;

  // 선택되어있는 고양이 정보
  cat: Cat | null;
};
