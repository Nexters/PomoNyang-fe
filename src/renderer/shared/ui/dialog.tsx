import * as React from 'react';

import * as DialogPrimitive from '@radix-ui/react-dialog';

import { cn } from '../utils/cn';

import { Icon } from './icon';

type DialogProps = {
  open: boolean;
  title?: string;
  fullScreen?: boolean;
  children: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
};

export const Dialog = ({
  open,
  title,
  fullScreen = false,
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
            'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          )}
        />
        <DialogPrimitive.Content
          className={cn(
            fullScreen && 'fixed left-[50%] top-0 bottom-0 translate-x-[-50%]',
            !fullScreen &&
              'fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] p-[20px] rounded-md',
            'z-50 w-full max-w-md bg-background-primary shadow-lg pt-[56px]',
            'duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]',
          )}
        >
          <DialogPrimitive.Close
            className={cn(
              fullScreen && 'absolute top-[10px] right-[8px] p-2',
              !fullScreen && 'absolute top-[20px] right-[20px] p-2',
            )}
          >
            <Icon name="placeholder" size="md" />
            <span className="sr-only">닫기</span>
          </DialogPrimitive.Close>

          <DialogPrimitive.Title
            className={cn(
              fullScreen &&
                'absolute top-0 left-0 right-0 h-[56px] flex justify-center items-center',
              !fullScreen &&
                'absolute top-[20px] left-[20px] h-[40px] flex justify-start items-center',
              'header-4 text-text-primary pointer-events-none',
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
