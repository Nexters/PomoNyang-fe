export type Category = {
  no: number;
  title: string;
  focusTime: string;
  restTime: string;
  /** 카테고리 노출 순서. 0부터 시작 */
  position: number;
  iconType: string;
  isSelected: boolean;
};
