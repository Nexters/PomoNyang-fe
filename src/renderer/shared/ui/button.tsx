import * as React from 'react';

import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/shared/utils';

const buttonVariants = cva(
  'inline-flex gap-[8px] items-center justify-center whitespace-nowrap ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-bg-accent-1 text-text-inverse disabled:bg-bg-secondary disabled:text-text-disabled', // primary
        secondary: 'bg-bg-inverse text-text-inverse',
        tertiary: 'bg-bg-secondary text-text-tertiary',
        'text-primary': 'bg-transparent text-text-secondary',
        'text-secondary': 'bg-transparent text-text-tertiary',
        icon: 'bg-bg-inverse',
      },
      size: {
        default: 'rounded-sm p-[16px] body-sb', // md
        sm: 'rounded-xs px-[12px] py-[8px] subBody-sb',
        lg: 'rounded-sm p-[20px] header-5',
        round: 'rounded-full p-[28px] w-fit h-fit',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
