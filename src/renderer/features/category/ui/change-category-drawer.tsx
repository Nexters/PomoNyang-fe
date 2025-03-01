/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';

import { useCategories } from '@/features/category';
import {
  Icon,
  Drawer,
  DrawerContent,
  DrawerTitle,
  SelectGroup,
  SelectGroupItem,
  DrawerDescription,
  Popover,
} from '@/shared/ui';
import { cn, getCategoryIconName } from '@/shared/utils';

type ChangeCategoryDrawerProps = {
  open: boolean;
  defaultCategory: string;
  onOpenChange: (isOpen: boolean) => void;
  onChangeCategory: (category: string) => void;
};
type ChangeCategoryDrawerMode = 'select' | 'edit' | 'delete';

export const ChangeCategoryDrawer = ({
  open,
  defaultCategory,
  onOpenChange,
  onChangeCategory,
}: ChangeCategoryDrawerProps) => {
  const [selectedCategory, setSelectedCategory] = useState(defaultCategory);
  const [mode, setMode] = useState<ChangeCategoryDrawerMode>('select');
  const { data: categories } = useCategories();
  const hasMultipleCategories = !!categories && categories.length > 1;

  useEffect(() => {
    setSelectedCategory(defaultCategory);
  }, [defaultCategory]);

  useEffect(() => {
    if (open) {
      setMode('select');
    }
  }, [open]);

  const SelectModeDrawerContent = () => (
    <>
      <DrawerTitle asChild>
        <div className="ml-xl mr-sm flex items-center justify-between gap-2">
          <h2 className="header-3 py-1">카테고리</h2>
          <div className="flex gap-2">
            <button
              className="p-2"
              onClick={() => {
                // TODO: 카테고리 추가 모달 열기
              }}
            >
              <Icon name="plusSvg" size="md" className="[&>path]:stroke-icon-primary" />
            </button>
            <Popover
              content={
                <div>
                  <button
                    className="body-sb flex items-center gap-2 px-3 py-2 text-text-secondary"
                    onClick={() => setMode('edit')}
                  >
                    <Icon
                      name="pen"
                      size="sm"
                      className="[&>path]:fill-icon-primary [&>path]:stroke-icon-primary"
                    />
                    수정
                  </button>
                  <button
                    className="body-sb flex items-center gap-2 px-3 py-2 text-text-secondary"
                    onClick={() => setMode('delete')}
                  >
                    <Icon
                      name="trash"
                      size="sm"
                      className="[&>path]:fill-icon-primary [&>path]:stroke-icon-primary"
                    />
                    삭제
                  </button>
                </div>
              }
              contentProps={{ align: 'end' }}
            >
              <button className="p-2">
                <Icon name="ellipsis" size="md" className="[&>path]:stroke-icon-primary" />
              </button>
            </Popover>
          </div>
        </div>
      </DrawerTitle>
      <DrawerDescription asChild>
        <SelectGroup
          value={selectedCategory}
          onValueChange={(value) => {
            if (!value) return;
            onChangeCategory(value);
          }}
          className={cn(
            'grid min-h-[120px] gap-2 px-4 py-5',
            hasMultipleCategories ? 'grid-cols-2' : 'grid-cols-1',
          )}
        >
          {categories?.map((category) => (
            <SelectGroupItem
              key={category.no}
              value={category.title}
              className="flex w-full flex-row items-center justify-start gap-2 p-5"
            >
              <Icon name={getCategoryIconName(category.title)} size="sm" />
              <span className="body-sb text-text-primary">{category.title}</span>
            </SelectGroupItem>
          ))}
        </SelectGroup>
      </DrawerDescription>
    </>
  );
  const EditModeDrawerContent = () => <></>;
  const DeleteModeDrawerContent = () => <></>;

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      onClose={() => {
        setSelectedCategory(defaultCategory);
      }}
    >
      <DrawerContent>
        {mode === 'select' && <SelectModeDrawerContent />}
        {mode === 'edit' && <EditModeDrawerContent />}
        {mode === 'delete' && <DeleteModeDrawerContent />}
      </DrawerContent>
    </Drawer>
  );
};
