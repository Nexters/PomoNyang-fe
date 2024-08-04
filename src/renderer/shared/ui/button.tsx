import * as React from 'react';

import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/shared/utils';

const buttonVariants = cva(
  'inline-flex gap-sm items-center justify-center whitespace-nowrap ring-offset-background transition-colors active:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:bg-background-secondary disabled:text-text-disabled',
  {
    variants: {
      variant: {
        primary: 'bg-background-accent-1 text-text-inverse hover:opacity-90',
        secondary: 'bg-background-inverse text-text-inverse hover:opacity-90',
        tertiary: 'bg-background-secondary text-text-tertiary hover:opacity-90',
        'text-primary': 'bg-transparent active:bg-black/5 text-text-secondary',
        'text-secondary': 'bg-transparent active:bg-black/5 text-text-tertiary',
      },
      size: {
        md: 'rounded-sm p-lg body-sb',
        sm: 'rounded-xs px-md py-sm subBody-sb',
        lg: 'rounded-sm p-xl header-5',
        icon: 'rounded-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
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
