import * as React from 'react';

import * as DialogPrimitive from '@radix-ui/react-dialog';

import { cn } from '../utils/cn';

import { Icon } from './icon';

export type DialogProps = {
  open: boolean;
  title?: string;
  hasCloseButton?: boolean;
  fullScreen?: boolean;
  animated?: boolean;
  children: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
};

export const Dialog = ({
  open,
  title,
  hasCloseButton = true,
  fullScreen = false,
  animated = true,
  children,
  onOpenChange,
}: DialogProps) => {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className={cn(
            'fixed inset-0 z-50',
            !fullScreen && 'bg-black/80',
            animated &&
              'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          )}
        />
        <DialogPrimitive.Content
          className={cn(
            fullScreen && 'fixed bottom-0 left-[50%] top-0 translate-x-[-50%] pt-[56px]',
            !fullScreen &&
              'fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] rounded-md p-[20px] shadow-lg',
            'z-50 w-full max-w-md bg-background-primary',

            animated &&
              'duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]',
          )}
        >
          {hasCloseButton && (
            <DialogPrimitive.Close
              className={cn(
                fullScreen && 'absolute right-[8px] top-[10px] p-2',
                !fullScreen && 'absolute right-[20px] top-[20px] p-2',
              )}
            >
              <Icon name="close" size="md" />
              <span className="sr-only">닫기</span>
            </DialogPrimitive.Close>
          )}

          <DialogPrimitive.Title
            className={cn(
              fullScreen &&
                'absolute left-0 right-0 top-0 flex h-[56px] items-center justify-center',
              !fullScreen &&
                'absolute left-[20px] top-[20px] flex h-[40px] items-center justify-start',
              'header-4 pointer-events-none text-text-primary',
            )}
          >
            {title}
          </DialogPrimitive.Title>
          <DialogPrimitive.Description asChild>{children}</DialogPrimitive.Description>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};
