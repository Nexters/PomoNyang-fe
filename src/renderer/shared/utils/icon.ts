import { IconName } from '../ui';

import { CategoryIconType } from '@/entities/category';

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

export const getCategoryIconName = (type: CategoryIconType): IconName => {
  return CategoryIconTypeMap[type];
};
