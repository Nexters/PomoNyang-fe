import React, { ReactNode } from 'react';

import * as TooltipPrimitive from '@radix-ui/react-tooltip';

import { cn } from '../utils';

export type TooltipProps = {
  content?: ReactNode;
  children?: ReactNode;
  color?: 'black' | 'white';
} & React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>;

export const Tooltip = ({
  content,
  children,
  color = 'black',
  sideOffset = 4,
  className,
  ...contentProps
}: TooltipProps) => {
  return (
    <TooltipPrimitive.Provider delayDuration={100}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Content
          sideOffset={sideOffset}
          // @see: https://github.com/shadcn-ui/ui/issues/2753
          // TooltipPrimitive.Content에 overflow: hidden을 적용하면 arrow가 뒤늦게 보여지는 버그가 있어 제거
          className={cn(
            color === 'black' && 'text-white bg-gray-900',
            color === 'white' && 'text-gray-600 bg-white',
            'z-50 rounded-xs px-lg py-md shadow-xs body-sb',
            'animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
            className,
          )}
          {...contentProps}
        >
          <div>{content}</div>
          <TooltipPrimitive.Arrow
            className={cn(color === 'black' && 'fill-gray-900', color === 'white' && 'fill-white')}
          />
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
};
