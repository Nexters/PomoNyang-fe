import { IconName } from '../ui';

import { CategoryIconType } from '@/entities/category';

/** @deprecated */
export const getCategoryIconName = (type: string): IconName => {
  if (type === '기본') return 'categoryDefault';
  if (type === '공부') return 'categoryStudy';
  if (type === '작업') return 'categoryWork';
  if (type === '독서') return 'categoryBook';
  return 'categoryDefault';
};

export const CategoryIconTypeMap: Record<CategoryIconType, IconName> = {
  CAT: 'categoryCat',
  BOX_PEN: 'categoryBoxPen',
  OPEN_BOOK: 'categoryOpenBook',
  BRIEFCASE: 'categoryBriefcase',
  //
  LAPTOP: 'categoryLaptop',
  DUMBBELL: 'categoryDumbbell',
  LIGHTNING: 'categoryLightning',
  FIRE: 'categoryFire',
  //
  HEART: 'categoryHeart',
  ASTERISK: 'categoryAsterisk',
  SUN: 'categorySun',
  MOON: 'categoryMoon',
};
export const getCategoryIconNameByIconType = (type: CategoryIconType): IconName => {
  return CategoryIconTypeMap[type];
};
