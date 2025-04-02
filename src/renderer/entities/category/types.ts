export type Category = {
  no: number;
  title: string;
  focusTime: string;
  restTime: string;
  /** 카테고리 노출 순서. 0부터 시작 */
  position: number;
  iconType: CategoryIconType;
  isSelected: boolean;
};

// 아래는 서버에 저장된 타입들
export type CategoryIconType =
  | 'CAT'
  | 'BOX_PEN'
  | 'OPEN_BOOK'
  | 'BRIEFCASE'
  //
  | 'LAPTOP'
  | 'DUMBBELL'
  | 'LIGHTNING'
  | 'FIRE'
  //
  | 'HEART'
  | 'ASTERISK'
  | 'SUN'
  | 'MOON';
// 서버에는 있으나 아직 디자인까지 넘어오지 않는 것들
// | 'BELL'
// | 'MONITOR'
// | 'ALARM'
// | 'BUBBLE_ELLIPSES'
// | 'CHECK_CIRCLE';
