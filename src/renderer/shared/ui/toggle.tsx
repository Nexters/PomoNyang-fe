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
>(({ className, variant, size, ...props }, ref) => {
  const [checked, setChecked] = React.useState(false);
  return (
    <TogglePrimitive.Root
      ref={ref}
      data-state={checked ? 'on' : 'off'}
      onClick={(e) => {
        setChecked(e.currentTarget.dataset.state === 'on' ? false : true);
      }}
      onChange={(e) => {
        console.log(e.currentTarget);
      }}
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    >
      <div
        className={cn(
          checked ? 'translate-x-4' : 'translate-x-0',
          'w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 ease-in-out',
        )}
      />
    </TogglePrimitive.Root>
  );
});

Toggle.displayName = TogglePrimitive.Root.displayName;

export { Toggle, toggleVariants };
