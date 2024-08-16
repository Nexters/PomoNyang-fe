import { useState } from 'react';

import { useLocalStorage } from 'usehooks-ts';

import { CatType } from '@/entities/cat';
import { useCategories, useUpdateCategory } from '@/features/category';
import { ChangeTimeDialog } from '@/features/time';
import { useUser } from '@/features/user';
import { useDisclosure } from '@/shared/hooks';
import {
  Guide,
  Button,
  Icon,
  Tooltip,
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
  SelectGroup,
  SelectGroupItem,
} from '@/shared/ui';
import { createIsoDuration, getCategoryIconName, parseIsoDuration } from '@/shared/utils';

const steps = [
  { id: 'categoryButton', message: '눌러서 카테고리를 변경할 수 있어요' },
  { id: 'timeAdjustDiv', message: '눌러서 시간을 조정할 수 있어요' },
];

const Pomodoro = () => {
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);

  const [currentCategory, setCurrentCategory] = useState('기본');
  const [selectedCategory, setSelectedCategory] = useState(currentCategory);
  const [showGuide, setShowGuide] = useLocalStorage<boolean>(
    'showGuide',
    !(localStorage.getItem('showGuide') === 'false'),
  );

  const { data: user } = useUser();
  const { data: categories } = useCategories();
  const { mutate: updateCategory } = useUpdateCategory();

  const changeTimeDialogProps = useDisclosure();
  const [clickedMode, setClickedMode] = useState<'focus' | 'rest'>('focus');

  const categoryData = categories?.find((category) => category.title === currentCategory);

  const currentFocusMinutes =
    parseIsoDuration(categoryData?.focusTime).hours * 60 +
    parseIsoDuration(categoryData?.focusTime).minutes;
  const currentRestMinutes =
    parseIsoDuration(categoryData?.restTime).hours * 60 +
    parseIsoDuration(categoryData?.restTime).minutes;

  return (
    <>
      <div className="flex flex-col h-full">
        <header className="flex justify-end p-4">
          <Button variant="text-primary" size="md" className="p-[8px] rounded-none bg-gray-50">
            <Icon name="menu" size="md" />
          </Button>
        </header>
        <main className="flex flex-col gap-[25px] items-center justify-center flex-1">
          <Tooltip
            content="오랜만이다냥"
            color="white"
            sideOffset={-40}
            rootProps={{ open: !showGuide }}
          />
          {/* TODO: 고양이 유형에 따라 다른 이미지 */}
          <div className="w-[240px] h-[240px] bg-background-secondary" />
          <div className="header-4 text-text-tertiary">{catName(user?.cat?.type ?? 'CHEESE')}</div>
          <div className="flex flex-col p-lg gap-md">
            <Button
              variant="tertiary"
              className="w-[80px] mx-auto"
              size="sm"
              id="categoryButton"
              onClick={() => {
                setIsOpenDrawer(true);
              }}
            >
              <Icon name={getCategoryIconName(currentCategory)} size="sm" />
              {currentCategory}
            </Button>
            <div className="flex items-center p-xs gap-md" id="timeAdjustDiv">
              <button
                className="flex items-center cursor-pointer p-sm gap-sm"
                onClick={() => {
                  setClickedMode('focus');
                  changeTimeDialogProps.onOpen();
                }}
              >
                <span className="text-gray-500 body-sb">집중</span>
                <span className="header-3 text-text-secondary">{currentFocusMinutes}분</span>
              </button>
              <div className="w-[2px] h-[20px] bg-gray-200 rounded-full" />
              <button
                className="flex items-center cursor-pointer p-sm gap-sm"
                onClick={() => {
                  setClickedMode('rest');
                  changeTimeDialogProps.onOpen();
                }}
              >
                <span className="text-gray-500 body-sb">휴식</span>
                <span className="header-3 text-text-secondary">{currentRestMinutes}분</span>
              </button>
            </div>
          </div>
          <Button variant="primary" className="p-[28px]" size="icon">
            <Icon name="play" size="lg" />
          </Button>
        </main>
      </div>
      <Drawer
        open={isOpenDrawer}
        onOpenChange={setIsOpenDrawer}
        onClose={() => {
          setSelectedCategory(currentCategory);
        }}
      >
        <DrawerContent>
          <div className="flex items-center justify-between gap-2 ml-xl mr-sm">
            <DrawerTitle className="py-1 header-3">카테고리 변경</DrawerTitle>
            <DrawerClose className="p-sm">
              <Icon name="close" size="sm" />
            </DrawerClose>
          </div>
          <SelectGroup
            defaultValue={selectedCategory}
            onValueChange={(value) => {
              setSelectedCategory(value);
            }}
            className="flex flex-col gap-4 mt-lg px-lg"
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
                  className="flex flex-row items-center justify-start w-full p-xl gap-md"
                >
                  <div className="flex gap-sm">
                    <Icon name={getCategoryIconName(category.title)} size="sm" />
                    <span className="body-sb text-text-primary">{category.title}</span>
                  </div>
                  <div className="flex items-center subBody-r text-text-tertiary gap-xs">
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
                  setCurrentCategory(selectedCategory);
                }
                setIsOpenDrawer(false);
              }}
            >
              확인
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      {showGuide && (
        <Guide
          steps={steps}
          handler={{
            onGuideEnd: () => setShowGuide(false),
          }}
        />
      )}
      <ChangeTimeDialog
        open={changeTimeDialogProps.isOpen}
        onOpenChange={changeTimeDialogProps.setIsOpen}
        mode={clickedMode}
        category={currentCategory}
        onChangeCategoryTime={(category, minutes) => {
          const body =
            clickedMode === 'focus'
              ? { focusTime: createIsoDuration({ minutes }) }
              : { restTime: createIsoDuration({ minutes }) };
          updateCategory({
            no: categories?.find((_category) => _category.title === category)?.no ?? 0,
            body,
          });
        }}
        categoryTimeMinutes={clickedMode === 'focus' ? currentFocusMinutes : currentRestMinutes}
        categoryTimeSeconds={0}
      />
    </>
  );
};

export default Pomodoro;

const catName = (type: CatType) => {
  if (type === 'CHEESE') return '치즈냥';
  if (type === 'BLACK') return '까만냥';
  if (type === 'THREE_COLOR') return '삼색냥';
  return '';
};
