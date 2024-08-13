import { IconName } from '../ui';

export const getCategoryIconName = (type: string): IconName => {
  if (type === '집중') return 'categoryDefault';
  if (type === '공부') return 'categoryStudy';
  if (type === '작업') return 'categoryWork';
  if (type === '운동') return 'categoryExercise';
  return 'categoryDefault';
};
