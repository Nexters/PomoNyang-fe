import { useEffect, useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { CategoryIconType } from '@/entities/category';
import { useUpdateCategory, useCategory, useCreateCategory } from '@/features/category';
import { PATH } from '@/shared/constants';
import { useDisclosure } from '@/shared/hooks';
import {
  Button,
  Drawer,
  DrawerContent,
  DrawerDescription,
  Frame,
  Icon,
  IconName,
  SimpleLayout,
} from '@/shared/ui';
import { cn } from '@/shared/utils';

const CategoryIconTypeMap: Record<CategoryIconType, IconName> = {
  CAT: 'categoryCat',
  BOX_PEN: 'categoryBoxPen',
  OPEN_BOOK: 'categoryOpenBook',
  BRIEFCASE: 'categoryBriefcase',
  //
  LAPTOP: 'categoryLaptop',
  DUMBBELL: 'categoryDumbbell',
  LIGHTNING: 'categoryLightning',
  FIRE: 'categoryFire',
  //
  HEART: 'categoryHeart',
  ASTERISK: 'categoryAsterisk',
  SUN: 'categorySun',
  MOON: 'categoryMoon',
};

const CategoryPage = () => {
  const { id } = useParams();
  const categoryId = id != null ? +id : undefined;
  const isEditMode = !!categoryId;
  const navigate = useNavigate();
  const drawerProps = useDisclosure();

  const { data: category } = useCategory(categoryId);
  const { mutateAsync: createCategory } = useCreateCategory();
  const { mutateAsync: updateCategory } = useUpdateCategory();

  const [typedCategoryName, setTypedCategoryName] = useState(category?.title || '');
  const trimmedCategoryName = typedCategoryName.trim();
  const isEmptyCategoryName = !trimmedCategoryName;

  const [selectedCategoryIconType, setSelectedCategoryIconType] = useState<CategoryIconType>(
    category?.iconType || 'CAT',
  );

  useEffect(() => {
    // sync
    if (category) {
      setTypedCategoryName(category.title);
      setSelectedCategoryIconType(category.iconType as CategoryIconType);
    }
  }, [category]);

  const handleClickChangeIconButton = () => {
    drawerProps.setIsOpen(true);
  };
  const handleClickBackButton = () => {
    navigate(PATH.POMODORO, { state: { openChangeCategoryDrawer: true } });
  };
  const handleClickCompleteButton = async () => {
    // TODO:
    // - 카테고리 api 호출 에러 처리
    //  - 이미 존재하는 카테고리인 경우
    //  - 카테고리 이름이 너무 긴 경우

    if (isEditMode) {
      await updateCategory({
        no: categoryId,
        body: {
          title: trimmedCategoryName,
          iconType: selectedCategoryIconType,
        },
      });
    } else {
      await createCategory({
        body: {
          title: trimmedCategoryName,
          iconType: selectedCategoryIconType,
        },
      });
    }
    navigate(PATH.POMODORO, { state: { openChangeCategoryDrawer: true } });
  };

  return (
    <SimpleLayout>
      <Frame>
        <Frame.NavBar
          title={isEditMode ? '카테고리 수정' : '카테고리 생성'}
          onBack={handleClickBackButton}
        />
        <div className="flex h-full w-full flex-col items-center">
          <button className="relative mt-8 h-[80px] w-[80px]" onClick={handleClickChangeIconButton}>
            <div className="flex h-full w-full items-center justify-center rounded-md bg-background-secondary">
              <Icon name={CategoryIconTypeMap[selectedCategoryIconType]} size={30} />
            </div>
            <div className="absolute bottom-0 right-[-8px] h-[36px] w-[36px] rounded-full bg-background-inverse p-2">
              <Icon
                name="pen"
                size={20}
                className="[&>path]:fill-icon-inverse [&>path]:stroke-icon-inverse"
              />
            </div>
          </button>

          <input
            value={typedCategoryName}
            onChange={(e) => setTypedCategoryName(e.target.value)}
            type="text"
            placeholder="카테고리 이름"
            className="body-sb mt-6 w-full rounded-sm bg-white p-lg text-text-primary caret-text-accent-1 placeholder:text-text-disabled"
          />
        </div>

        <Frame.BottomBar>
          <Button
            className="w-full"
            disabled={isEmptyCategoryName}
            onClick={handleClickCompleteButton}
          >
            확인
          </Button>
        </Frame.BottomBar>
      </Frame>

      <Drawer open={drawerProps.isOpen} onOpenChange={drawerProps.setIsOpen}>
        <DrawerContent>
          <DrawerDescription className="p-5">
            <div className="grid grid-cols-[repeat(4,minmax(0,56px))] justify-between gap-y-2 p-3">
              {Object.entries(CategoryIconTypeMap).map(([categoryIconType, iconName], index) => (
                <button
                  key={index}
                  className={cn(
                    'flex h-[56px] w-[56px] items-center justify-center rounded-xs hover:bg-background-secondary',
                    selectedCategoryIconType === categoryIconType &&
                      'border-[1px] border-background-accent-1',
                  )}
                  onClick={() => {
                    setSelectedCategoryIconType(categoryIconType as CategoryIconType);
                    drawerProps.setIsOpen(false);
                  }}
                >
                  <Icon name={iconName} size={24} />
                </button>
              ))}
            </div>
          </DrawerDescription>
        </DrawerContent>
      </Drawer>
    </SimpleLayout>
  );
};

export default CategoryPage;
