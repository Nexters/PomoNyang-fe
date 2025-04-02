'use client';

import * as PopoverPrimitive from '@radix-ui/react-popover';

import { cn } from '../utils';

export type PopoverProps = {
  children: React.ReactNode;
  content: React.ReactNode;
  contentProps?: React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>;
};

export const Popover = ({ children, content, contentProps }: PopoverProps) => {
  const { align = 'center', sideOffset = 4, className, ...restContentProps } = contentProps ?? {};
  return (
    <PopoverPrimitive.Root>
      <PopoverPrimitive.Trigger asChild>{children}</PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align={align}
          sideOffset={sideOffset}
          className={cn(
            'pointer-events-auto z-50 w-fit rounded-[16px] bg-background-primary px-2 py-3 shadow-[0px_2px_8px_0px_#0000001F] outline-none',
            'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
            className,
          )}
          {...restContentProps}
        >
          {content}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
};
