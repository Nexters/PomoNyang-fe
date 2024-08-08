import { cn } from '../utils';

import PlaceholderIcon from '@/shared/assets/svgs/placeholder.svg';

const icons = {
  placeholder: PlaceholderIcon,
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
