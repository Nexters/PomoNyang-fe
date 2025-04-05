import { useEffect, useState } from 'react';

import { generatePath, useNavigate } from 'react-router-dom';

import { useCategories, useDeleteCategories, useSelectCategory } from '@/features/category';
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
  useToast,
} from '@/shared/ui';
import { cn, getCategoryIconName } from '@/shared/utils';
import { isErrorResponse } from '@/shared/utils/error';

type ChangeCategoryDrawerProps = {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onClose: () => void;
};
type ChangeCategoryDrawerMode = 'select' | 'edit' | 'delete';

export const ChangeCategoryDrawer = ({
  open,
  onOpenChange,
  onClose,
}: ChangeCategoryDrawerProps) => {
  const [mode, setMode] = useState<ChangeCategoryDrawerMode>('select');

  useEffect(() => {
    if (open) {
      setMode('select');
    }
  }, [open]);

  return (
    <Drawer open={open} onOpenChange={onOpenChange} onClose={onClose}>
      <DrawerContent>
        {mode === 'select' && (
          <SelectModeDrawerContent setMode={setMode} onClose={() => onOpenChange(false)} />
        )}
        {mode === 'edit' && <EditModeDrawerContent setMode={setMode} />}
        {mode === 'delete' && <DeleteModeDrawerContent setMode={setMode} />}
      </DrawerContent>
    </Drawer>
  );
};

const MAX_CATEGORY_COUNT = 10;

type SelectModeDrawerContentProps = {
  setMode: (mode: ChangeCategoryDrawerMode) => void;
  onClose: () => void;
};
const SelectModeDrawerContent = ({ setMode, onClose }: SelectModeDrawerContentProps) => {
  const navigate = useNavigate();
  // const { toast } = useToast();

  const { mutateAsync: selectCategory } = useSelectCategory();
  const { data: categories, currentCategory } = useCategories();
  const hasMultipleCategories = !!categories && categories.length > 1;
  const showAddButton = !!categories && categories.length < MAX_CATEGORY_COUNT;

  return (
    <>
      <DrawerTitle asChild>
        <div className="ml-xl mr-sm flex items-center justify-between gap-2">
          <h2 className="header-3 py-1">카테고리</h2>
          <div className="flex gap-2">
            {showAddButton && (
              <button
                className="p-2"
                onClick={() => {
                  navigate(generatePath(PATH.CATEGORY));
                }}
              >
                <Icon name="plusSvg" size="md" className="[&>path]:stroke-icon-primary" />
              </button>
            )}
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
          value={`${currentCategory?.no}`}
          onValueChange={async (value) => {
            if (!value) return;
            if (value === `${currentCategory?.no}`) return;
            await selectCategory({ no: Number(value) });
            onClose();
            // 닫히고 토스트 띄우는게 별로인 것 같아 임의 주석처리
            // toast({
            //   iconName: 'check',
            //   iconClassName: '[&>path]:stroke-icon-tertiary',
            //   message: '카테고리를 변경했어요',
            // });
          }}
          className={cn(
            'grid min-h-[120px] gap-2 px-4 py-5',
            hasMultipleCategories ? 'grid-cols-2' : 'grid-cols-1',
          )}
        >
          {categories?.map((category) => (
            <SelectGroupItem
              key={category.no}
              value={`${category.no}`}
              className="flex w-full flex-row items-center justify-start gap-2 p-5"
            >
              <Icon name={getCategoryIconName(category.iconType)} size="sm" />
              <span className="body-sb truncate text-text-primary">{category.title}</span>
            </SelectGroupItem>
          ))}
        </SelectGroup>
      </DrawerDescription>
    </>
  );
};

//
type EditModeDrawerContentProps = {
  setMode: (mode: ChangeCategoryDrawerMode) => void;
};
const EditModeDrawerContent = ({ setMode }: EditModeDrawerContentProps) => {
  const navigate = useNavigate();
  const { data: categories } = useCategories();
  const hasMultipleCategories = !!categories && categories.length > 1;
  return (
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
                value={`${category.no}`}
                className="flex w-full flex-row items-center justify-start gap-2 p-5"
                disabled={disabled}
                onClick={() => {
                  navigate(generatePath(PATH.CATEGORY, { id: `${category.no}` }));
                }}
              >
                <Icon name={disabled ? 'lock' : getCategoryIconName(category.iconType)} size="sm" />
                <span
                  className={cn(
                    'body-sb truncate',
                    disabled ? 'text-text-disabled' : 'text-text-primary',
                  )}
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
};

//

type DeleteModeDrawerContentProps = {
  setMode: (mode: ChangeCategoryDrawerMode) => void;
};
const DeleteModeDrawerContent = ({ setMode }: DeleteModeDrawerContentProps) => {
  const { data: categories } = useCategories();
  const hasMultipleCategories = !!categories && categories.length > 1;

  const { mutateAsync: deleteCategories } = useDeleteCategories();
  const confirmDeleteDialogProps = useDisclosure();
  const { toast } = useToast();

  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const isDisabledCompleteButton = selectedCategoryIds.length === 0;

  const handleClickDeleteButton = async () => {
    confirmDeleteDialogProps.setIsOpen(true);
  };
  const handleDeleteCategories = async () => {
    try {
      await deleteCategories({ body: { no: selectedCategoryIds.map(Number) } });
      setMode('select');
    } catch (error) {
      const errorMessage = isErrorResponse(error)
        ? error.message
        : '알 수 없는 오류가 발생했습니다.';
      // TODO: 토스트 아이콘 적용?
      toast({ message: errorMessage });
    }
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
                disabled={disabled}
                className="flex w-full flex-row items-center justify-start gap-2 p-5"
              >
                <Icon
                  name={disabled ? 'lock' : checked ? 'circleCheck' : 'circleUncheck'}
                  size="md"
                />
                <span
                  className={cn(
                    'body-sb truncate',
                    disabled ? 'text-text-disabled' : 'text-text-primary',
                  )}
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
          variant="secondary"
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
