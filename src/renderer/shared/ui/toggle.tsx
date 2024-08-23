import * as React from 'react';

import * as TogglePrimitive from '@radix-ui/react-toggle';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/shared/utils';

const toggleVariants = cva(
  'inline-flex items-center justify-start rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-icon-disabled data-[state=on]:bg-background-accent-1',
      },
      size: {
        default: 'h-[28px] w-[44px] py-2 px-1',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> & VariantProps<typeof toggleVariants>
>(({ className, variant, size, pressed, ...props }, ref) => {
  return (
    <TogglePrimitive.Root
      ref={ref}
      data-state={pressed ? 'on' : 'off'}
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    >
      <div
        className={cn(
          pressed ? 'translate-x-4' : 'translate-x-0',
          'h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-200 ease-in-out',
        )}
      />
    </TogglePrimitive.Root>
  );
});

Toggle.displayName = TogglePrimitive.Root.displayName;

export { Toggle, toggleVariants };
