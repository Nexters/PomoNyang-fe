'use client';

import * as React from 'react';
import React__default from 'react';

import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';
import { cva, type VariantProps } from 'class-variance-authority';

import { ToggleGroupItem, ToggleGroup } from './toggle-group';

import { cn } from '@/shared/utils';

declare const CustomSingleSelectGroup: React__default.ForwardRefExoticComponent<
  Omit<ToggleGroupPrimitive.ToggleGroupSingleProps, 'type'> &
    React__default.RefAttributes<HTMLDivElement>
>;

declare const CustomSingleSelectGroupItem: React__default.ForwardRefExoticComponent<
  Omit<ToggleGroupPrimitive.ToggleGroupItemProps, 'value'> &
    React__default.RefAttributes<HTMLButtonElement>
>;

const selectVariants = cva(
  'flex-col items-center justify-center rounded-xs ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ',
  {
    variants: {
      variant: {
        default:
          'bg-bg-secondary hover:bg-bg-secondary data-[state=on]:bg-bg-accent-2 data-[state=on]:border-bg-accent-1 border-bg-secondary border data-[state=on]:text-text-primary text-text-secondary hover:text-text-secondary',
      },
      size: {
        default: 'h-fit w-fit',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

const ToggleGroupContext = React.createContext<VariantProps<typeof selectVariants>>({
  size: 'default',
  variant: 'default',
});

const SelectGroup = React.forwardRef<
  React.ElementRef<typeof CustomSingleSelectGroup>,
  React.ComponentPropsWithoutRef<typeof CustomSingleSelectGroup> &
    VariantProps<typeof selectVariants>
>(({ className, variant, size, children, ...props }, ref) => {
  return (
    <ToggleGroup
      ref={ref}
      type="single"
      className={cn('flex items-center justify-center gap-1', className)}
      {...props}
    >
      <ToggleGroupContext.Provider value={{ variant, size }}>
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroup>
  );
});

SelectGroup.displayName = ToggleGroupPrimitive.Root.displayName;

const SelectGroupItem = React.forwardRef<
  React.ElementRef<typeof CustomSingleSelectGroupItem>,
  React.ComponentPropsWithoutRef<typeof CustomSingleSelectGroupItem> &
    VariantProps<typeof selectVariants> & {
      title: string;
      subTitle?: string;
      leftIcon?: React.ReactNode;
      rightIcon?: React.ReactNode;
    }
>(({ className, title, subTitle, leftIcon, rightIcon, variant, size, ...props }, ref) => {
  const context = React.useContext(ToggleGroupContext);

  return (
    <ToggleGroupItem
      ref={ref}
      value={title}
      className={cn(
        selectVariants({
          variant: context.variant || variant,
          size: context.size || size,
        }),
        className,
      )}
      {...props}
    >
      <div className="flex flex-row gap-xs">
        {leftIcon}
        <span className="subBody-r text-text-tertiary">{subTitle}</span>
        {rightIcon}
      </div>
      <div className="header-5">{title}</div>
    </ToggleGroupItem>
  );
});

SelectGroupItem.displayName = ToggleGroupPrimitive.Item.displayName;

export { SelectGroup, SelectGroupItem };