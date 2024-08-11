import { cn } from '../utils';

import BackIcon from '@/shared/assets/svgs/back.svg';
import CategoryDefaultIcon from '@/shared/assets/svgs/category-default.svg';
import CategoryExerciseIcon from '@/shared/assets/svgs/category-exercise.svg';
import CategoryStudyIcon from '@/shared/assets/svgs/category-study.svg';
import CategoryWorkIcon from '@/shared/assets/svgs/category-work.svg';
import CloseIcon from '@/shared/assets/svgs/close.svg';
import MenuIcon from '@/shared/assets/svgs/menu.svg';
import PlaceholderIcon from '@/shared/assets/svgs/placeholder.svg';
import PlayIcon from '@/shared/assets/svgs/play.svg';

const icons = {
  placeholder: PlaceholderIcon,
  back: BackIcon,
  menu: MenuIcon,
  categoryDefault: CategoryDefaultIcon,
  categoryStudy: CategoryStudyIcon,
  categoryWork: CategoryWorkIcon,
  categoryExercise: CategoryExerciseIcon,
  play: PlayIcon,
  close: CloseIcon,
} as const;
const sizes = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 32,
  xl: 48,
} as const;

export type IconName = keyof typeof icons;
export type IconSize = keyof typeof sizes;

export type IconProps = {
  name?: IconName;
  size?: IconSize;
} & Omit<JSX.IntrinsicElements['img'], 'size'>;

export function Icon({
  name = 'placeholder',
  size = 'xs',
  className,
  ...restProps
}: IconProps): JSX.Element {
  const icon = icons[name];
  const sizeValue = sizes[size];
  return (
    <img
      src={icon}
      className={cn('icon', className)}
      width={sizeValue}
      height={sizeValue}
      {...restProps}
    />
  );
}
