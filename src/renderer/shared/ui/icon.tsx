import { cn } from '../utils';

import BackIcon from '@/shared/assets/svgs/back.svg';
import CategoryAsteriskIcon from '@/shared/assets/svgs/category-asterisk.svg';
import CategoryBoxPenIcon from '@/shared/assets/svgs/category-box-pen.svg';
import CategoryBriefcaseIcon from '@/shared/assets/svgs/category-briefcase.svg';
import CategoryCatIcon from '@/shared/assets/svgs/category-cat.svg';
import CategoryDumbbellIcon from '@/shared/assets/svgs/category-dumbbell.svg';
import CategoryFireIcon from '@/shared/assets/svgs/category-fire.svg';
import CategoryHeartIcon from '@/shared/assets/svgs/category-heart.svg';
import CategoryLaptopIcon from '@/shared/assets/svgs/category-laptop.svg';
import CategoryLightningIcon from '@/shared/assets/svgs/category-lightning.svg';
import CategoryMoonIcon from '@/shared/assets/svgs/category-moon.svg';
import CategoryOpenBookIcon from '@/shared/assets/svgs/category-open-book.svg';
import CategorySunIcon from '@/shared/assets/svgs/category-sun.svg';
import ChartFillIcon from '@/shared/assets/svgs/chart-fill.svg';
import ChartLineIcon from '@/shared/assets/svgs/chart-line.svg';
import CheckIcon from '@/shared/assets/svgs/check.svg?react';
import CheerIcon from '@/shared/assets/svgs/cheer.svg';
import ChevronRightIcon from '@/shared/assets/svgs/chevron-right.svg';
import CircleCheck from '@/shared/assets/svgs/circle-check.svg';
import CircleUncheck from '@/shared/assets/svgs/circle-uncheck.svg';
import ClockIcon from '@/shared/assets/svgs/clock.svg';
import CloseIcon from '@/shared/assets/svgs/close.svg';
import EllipsisIcon from '@/shared/assets/svgs/ellipsis.svg?react';
import FocusTimeIcon from '@/shared/assets/svgs/focus-time.svg';
import HouseFillIcon from '@/shared/assets/svgs/house-fill.svg';
import HouseLineIcon from '@/shared/assets/svgs/house-line.svg';
import LockIcon from '@/shared/assets/svgs/lock.svg?react';
import MinimizeOff from '@/shared/assets/svgs/minimize-off.svg';
import MinimizeOn from '@/shared/assets/svgs/minimize-on.svg';
import MinusIcon from '@/shared/assets/svgs/minus.svg';
import MinusSvgIcon from '@/shared/assets/svgs/minus.svg?react';
import PenIcon from '@/shared/assets/svgs/pen.svg?react';
import PinOff from '@/shared/assets/svgs/pin-off.svg';
import PinOn from '@/shared/assets/svgs/pin-on.svg';
import PlaceholderIcon from '@/shared/assets/svgs/placeholder.svg';
import PlayIcon from '@/shared/assets/svgs/play.svg';
import PlusIcon from '@/shared/assets/svgs/plus.svg';
import PlusSvgIcon from '@/shared/assets/svgs/plus.svg?react';
import PositiveIcon from '@/shared/assets/svgs/positive.svg';
import RestTimeIcon from '@/shared/assets/svgs/rest-time.svg';
import StimulusIcon from '@/shared/assets/svgs/stimulus.svg';
import TrashIcon from '@/shared/assets/svgs/trash.svg';
import UserFillIcon from '@/shared/assets/svgs/user-fill.svg';
import UserLineIcon from '@/shared/assets/svgs/user-line.svg';

const icons = {
  placeholder: PlaceholderIcon,
  back: BackIcon,
  categoryCat: CategoryCatIcon,
  categoryBoxPen: CategoryBoxPenIcon,
  categoryOpenBook: CategoryOpenBookIcon,
  categoryBriefcase: CategoryBriefcaseIcon,
  categoryLaptop: CategoryLaptopIcon,
  categoryDumbbell: CategoryDumbbellIcon,
  categoryLightning: CategoryLightningIcon,
  categoryFire: CategoryFireIcon,
  categoryHeart: CategoryHeartIcon,
  categoryAsterisk: CategoryAsteriskIcon,
  categorySun: CategorySunIcon,
  categoryMoon: CategoryMoonIcon,
  play: PlayIcon,
  close: CloseIcon,
  focusTime: FocusTimeIcon,
  restTime: RestTimeIcon,
  check: CheckIcon,
  minus: MinusIcon,
  minusSvg: MinusSvgIcon,
  plus: PlusIcon,
  plusSvg: PlusSvgIcon,
  chevronRight: ChevronRightIcon,
  cheer: CheerIcon,
  positive: PositiveIcon,
  stimulus: StimulusIcon,
  pen: PenIcon,
  clock: ClockIcon,
  pinOff: PinOff,
  pinOn: PinOn,
  minimizeOff: MinimizeOff,
  minimizeOn: MinimizeOn,
  ellipsis: EllipsisIcon,
  trash: TrashIcon,
  lock: LockIcon,
  circleCheck: CircleCheck,
  circleUncheck: CircleUncheck,
  userFill: UserFillIcon,
  userLine: UserLineIcon,
  houseFill: HouseFillIcon,
  houseLine: HouseLineIcon,
  chartFill: ChartFillIcon,
  chartLine: ChartLineIcon,
} as const;
const sizes = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 32,
  xl: 48,
} as const;

export type IconName = keyof typeof icons;
export type IconSize = keyof typeof sizes | number;

export type IconProps = {
  name?: IconName;
  size?: IconSize;
} & Omit<JSX.IntrinsicElements['img'], 'size'>;

export function Icon({
  name = 'placeholder',
  size = 'xs',
  className,
  style,
  ...restProps
}: IconProps): JSX.Element {
  const Icon = icons[name];
  const sizeValue = typeof size === 'string' ? sizes[size] : size;

  return typeof Icon === 'function' ? (
    <Icon className={className} style={{ ...style, width: sizeValue, height: sizeValue }} />
  ) : (
    <img
      src={Icon}
      className={cn('icon', className)}
      width={sizeValue}
      height={sizeValue}
      style={style}
      {...restProps}
    />
  );
}
