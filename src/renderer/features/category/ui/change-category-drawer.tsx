import { useEffect, useState } from 'react';

import { useCategories } from '@/features/category';
import {
  Button,
  Icon,
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
  SelectGroup,
  SelectGroupItem,
} from '@/shared/ui';
import { getCategoryIconName, parseIsoDuration } from '@/shared/utils';

type ChangeCategoryDrawerProps = {
  open: boolean;
  defaultCategory: string;
  onOpenChange: (isOpen: boolean) => void;
  onChangeCategory: (category: string) => void;
};

export const ChangeCategoryDrawer = ({
  open,
  defaultCategory,
  onOpenChange,
  onChangeCategory,
}: ChangeCategoryDrawerProps) => {
  const [selectedCategory, setSelectedCategory] = useState(defaultCategory);
  const { data: categories } = useCategories();

  useEffect(() => {
    setSelectedCategory(defaultCategory);
  }, [defaultCategory]);

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      onClose={() => {
        setSelectedCategory(defaultCategory);
      }}
    >
      <DrawerContent>
        <div className="ml-xl mr-sm flex items-center justify-between gap-2">
          <DrawerTitle className="header-3 py-1">카테고리 변경</DrawerTitle>
          <DrawerClose className="p-sm">
            <Icon name="close" size="sm" />
          </DrawerClose>
        </div>
        <SelectGroup
          defaultValue={selectedCategory}
          onValueChange={(value) => {
            setSelectedCategory(value);
          }}
          className="mt-lg flex flex-col gap-4 px-lg"
        >
          {categories?.map((category) => {
            const focusTime =
              parseIsoDuration(category.focusTime).hours * 60 +
              parseIsoDuration(category.focusTime).minutes;
            const restTime =
              parseIsoDuration(category.restTime).hours * 60 +
              parseIsoDuration(category.restTime).minutes;
            return (
              <SelectGroupItem
                key={category.no}
                value={category.title}
                className="flex w-full flex-row items-center justify-start gap-md p-xl"
              >
                <div className="flex gap-sm">
                  <Icon name={getCategoryIconName(category.title)} size="sm" />
                  <span className="body-sb text-text-primary">{category.title}</span>
                </div>
                <div className="subBody-r flex items-center gap-xs text-text-tertiary">
                  <span>집중 {focusTime}분</span>
                  <span>|</span>
                  <span>휴식 {restTime}분</span>
                </div>
              </SelectGroupItem>
            );
          })}
        </SelectGroup>

        <DrawerFooter>
          <Button
            variant="secondary"
            className="w-full"
            size="lg"
            onClick={() => {
              if (selectedCategory) {
                onChangeCategory(selectedCategory);
              }
              onOpenChange(false);
            }}
          >
            확인
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
