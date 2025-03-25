/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';

import { generatePath, useNavigate } from 'react-router-dom';

import { Category } from '@/entities/category';
import { useCategories, useDeleteCategories } from '@/features/category';
import { PATH } from '@/shared/constants';
import { useDisclosure } from '@/shared/hooks';
import {
  Icon,
  Drawer,
  DrawerContent,
  DrawerTitle,
  SelectGroup,
  SelectGroupItem,
  DrawerDescription,
  Popover,
  Button,
  DrawerFooter,
  Dialog,
} from '@/shared/ui';
import { cn, getCategoryIconNameByIconType } from '@/shared/utils';

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
  const navigate = useNavigate();
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
                navigate(PATH.CATEGORY);
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
          type="single"
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
              <Icon name={getCategoryIconNameByIconType(category.iconType)} size="sm" />
              <span className="body-sb text-text-primary">{category.title}</span>
            </SelectGroupItem>
          ))}
        </SelectGroup>
      </DrawerDescription>
    </>
  );
  const EditModeDrawerContent = () => (
    <>
      <DrawerTitle asChild>
        <div className="ml-xl mr-sm">
          <div className="mb-1 flex items-center justify-between gap-2">
            <h2 className="header-3 py-1">카테고리 수정</h2>
            <button
              className="body-sb px-4 py-2 text-text-secondary"
              onClick={() => setMode('select')}
            >
              취소
            </button>
          </div>
          <p className="body-r text-text-secondary">수정할 카테고리를 선택해주세요.</p>
        </div>
      </DrawerTitle>
      <DrawerDescription asChild>
        <SelectGroup
          type="single"
          // @hack: lock 걸린 SelectGroupItem 클릭 시 선택되었다는 표시를 보여주지 않기 위함
          value={undefined}
          className={cn(
            'grid min-h-[120px] gap-2 px-4 py-5',
            hasMultipleCategories ? 'grid-cols-2' : 'grid-cols-1',
          )}
        >
          {categories?.map((category, index) => {
            const disabled = index === 0;
            return (
              <SelectGroupItem
                key={category.no}
                value={category.title}
                className="flex w-full flex-row items-center justify-start gap-2 p-5"
                onClick={() => {
                  if (disabled) return;
                  navigate(generatePath(PATH.CATEGORY, { id: `${category.no}` }));
                }}
              >
                <Icon
                  name={disabled ? 'lock' : getCategoryIconNameByIconType(category.iconType)}
                  size="sm"
                />
                <span
                  className={cn('body-sb', disabled ? 'text-text-disabled' : 'text-text-primary')}
                >
                  {category.title}
                </span>
              </SelectGroupItem>
            );
          })}
        </SelectGroup>
      </DrawerDescription>
    </>
  );

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
        {mode === 'delete' && <DeleteModeDrawerContent categories={categories} setMode={setMode} />}
      </DrawerContent>
    </Drawer>
  );
};

type DeleteModeDrawerContentProps = {
  categories?: Category[];
  setMode: (mode: ChangeCategoryDrawerMode) => void;
};
const DeleteModeDrawerContent = ({ categories, setMode }: DeleteModeDrawerContentProps) => {
  const { mutateAsync: deleteCategories } = useDeleteCategories();
  const confirmDeleteDialogProps = useDisclosure();

  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const hasMultipleCategories = !!categories && categories.length > 1;
  const isDisabledCompleteButton = selectedCategoryIds.length === 0;

  const handleClickDeleteButton = async () => {
    confirmDeleteDialogProps.setIsOpen(true);
  };
  const handleDeleteCategories = async () => {
    // TODO: api 호출 실패시 에러 처리
    await deleteCategories({ body: { no: selectedCategoryIds.map(Number) } });
    setMode('select');
  };

  return (
    <>
      <DrawerTitle asChild>
        <div className="ml-xl mr-sm">
          <div className="mb-1 flex items-center justify-between gap-2">
            <h2 className="header-3 py-1">카테고리 삭제</h2>
            <button
              className="body-sb px-4 py-2 text-text-secondary"
              onClick={() => setMode('select')}
            >
              취소
            </button>
          </div>
        </div>
      </DrawerTitle>
      <DrawerDescription asChild>
        <SelectGroup
          type="multiple"
          value={selectedCategoryIds}
          onValueChange={(values) => {
            setSelectedCategoryIds(values);
          }}
          className={cn(
            'grid min-h-[120px] gap-2 px-4 py-5',
            hasMultipleCategories ? 'grid-cols-2' : 'grid-cols-1',
          )}
        >
          {categories?.map((category, index) => {
            const disabled = index === 0;
            const checked = selectedCategoryIds.includes(`${category.no}`);
            return (
              <SelectGroupItem
                key={category.no}
                value={`${category.no}`}
                className="flex w-full flex-row items-center justify-start gap-2 p-5"
              >
                <Icon
                  name={disabled ? 'lock' : checked ? 'circleCheck' : 'circleUncheck'}
                  size="md"
                />
                <span
                  className={cn('body-sb', disabled ? 'text-text-disabled' : 'text-text-primary')}
                >
                  {category.title}
                </span>
              </SelectGroupItem>
            );
          })}
        </SelectGroup>
      </DrawerDescription>
      <DrawerFooter>
        <Button
          className="w-full"
          disabled={isDisabledCompleteButton}
          onClick={handleClickDeleteButton}
        >
          {selectedCategoryIds.length}개 삭제하기
        </Button>
      </DrawerFooter>

      <Dialog
        open={confirmDeleteDialogProps.isOpen}
        onOpenChange={confirmDeleteDialogProps.setIsOpen}
        hasCloseButton={false}
      >
        <div>
          <h1 className="header-4 text-text-primary">카테고리를 삭제할까요?</h1>
          <p className="subBody-r text-text-secondary">카테고리로 집중한 기록도 함께 사라져요.</p>
          <div className="mt-4 flex gap-3">
            <Button
              className="w-full"
              variant="tertiary"
              onClick={() => confirmDeleteDialogProps.setIsOpen(false)}
            >
              취소
            </Button>
            <Button className="w-full" variant="secondary" onClick={handleDeleteCategories}>
              삭제하기
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
};
