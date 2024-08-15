import { IconName } from '../ui';

export const getCategoryIconName = (type: string): IconName => {
  if (type === '기본') return 'categoryDefault';
  if (type === '공부') return 'categoryStudy';
  if (type === '작업') return 'categoryWork';
  if (type === '독서') return 'categoryBook';
  return 'categoryDefault';
};
