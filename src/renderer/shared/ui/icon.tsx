import { cn } from '../utils';

import BackIcon from '@/shared/assets/svgs/back.svg';
import CategoryBookIcon from '@/shared/assets/svgs/category-book.svg';
import CategoryDefaultIcon from '@/shared/assets/svgs/category-default.svg';
import CategoryStudyIcon from '@/shared/assets/svgs/category-study.svg';
import CategoryWorkIcon from '@/shared/assets/svgs/category-work.svg';
import CheckIcon from '@/shared/assets/svgs/check.svg?react';
import CheerIcon from '@/shared/assets/svgs/cheer.svg';
import ChevronRightIcon from '@/shared/assets/svgs/chevron-right.svg';
import ClockLineIcon from '@/shared/assets/svgs/clock-line.svg?react';
import ClockIcon from '@/shared/assets/svgs/clock.svg';
import CloseIcon from '@/shared/assets/svgs/close.svg';
import EllipsisIcon from '@/shared/assets/svgs/ellipsis.svg?react';
import FocusTimeIcon from '@/shared/assets/svgs/focus-time.svg';
import MenuIcon from '@/shared/assets/svgs/menu.svg?react';
import MinimizeOff from '@/shared/assets/svgs/minimize-off.svg';
import MinimizeOn from '@/shared/assets/svgs/minimize-on.svg';
import MinusIcon from '@/shared/assets/svgs/minus.svg';
import MinusSvgIcon from '@/shared/assets/svgs/minus.svg?react';
import PenIcon from '@/shared/assets/svgs/pen.svg';
import PinOff from '@/shared/assets/svgs/pin-off.svg';
import PinOn from '@/shared/assets/svgs/pin-on.svg';
import PlaceholderIcon from '@/shared/assets/svgs/placeholder.svg';
import PlayIcon from '@/shared/assets/svgs/play.svg';
import PlusIcon from '@/shared/assets/svgs/plus.svg';
import PlusSvgIcon from '@/shared/assets/svgs/plus.svg?react';
import PositiveIcon from '@/shared/assets/svgs/positive.svg';
import ReadyForStatIcon from '@/shared/assets/svgs/ready-for-stat.svg';
import RestTimeIcon from '@/shared/assets/svgs/rest-time.svg';
import StimulusIcon from '@/shared/assets/svgs/stimulus.svg';

const icons = {
  placeholder: PlaceholderIcon,
  back: BackIcon,
  menu: MenuIcon,
  categoryDefault: CategoryDefaultIcon,
  categoryStudy: CategoryStudyIcon,
  categoryWork: CategoryWorkIcon,
  categoryBook: CategoryBookIcon,
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
  readyForStat: ReadyForStatIcon,
  clockLine: ClockLineIcon,
  pinOff: PinOff,
  pinOn: PinOn,
  minimizeOff: MinimizeOff,
  minimizeOn: MinimizeOn,
  ellipsis: EllipsisIcon,
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
  style,
  ...restProps
}: IconProps): JSX.Element {
  const Icon = icons[name];
  const sizeValue = sizes[size];

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
