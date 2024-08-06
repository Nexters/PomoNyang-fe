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

type IconName = keyof typeof icons;
type IconSize = keyof typeof sizes;

type IconProps = {
  name?: IconName;
  size?: IconSize;
} & Omit<JSX.IntrinsicElements['img'], 'size'>;

function Icon({
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

export { Icon, type IconProps, type IconName, type IconSize };
