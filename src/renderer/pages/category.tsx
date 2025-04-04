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
  SimpleLayout,
} from '@/shared/ui';
import { CategoryIconTypeMap, cn } from '@/shared/utils';
import { isErrorResponse } from '@/shared/utils/error';

const CATEGORY_NAME_MAX_LENGTH = 10;

const CategoryPage = () => {
  const { id } = useParams();
  const categoryNo = id ? +id : undefined;
  const isEditMode = !!categoryNo;
  const navigate = useNavigate();
  const drawerProps = useDisclosure();

  const { data: category } = useCategory(categoryNo);
  const { mutateAsync: createCategory, isPending: isCreating } = useCreateCategory();
  const { mutateAsync: updateCategory, isPending: isUpdating } = useUpdateCategory();
  const isPending = isCreating || isUpdating;

  const [typedCategoryName, setTypedCategoryName] = useState(category?.title || '');
  const [selectedCategoryIconType, setSelectedCategoryIconType] = useState<CategoryIconType>(
    category?.iconType || 'CAT',
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const trimmedCategoryName = typedCategoryName.trim();
  const isEmptyCategoryName = !trimmedCategoryName;
  const isNotSavable = isEditMode
    ? isEmptyCategoryName ||
      (category?.title === trimmedCategoryName && category?.iconType === selectedCategoryIconType)
    : isEmptyCategoryName;
  const isDisabledCompleteButton = isPending || isNotSavable || !!errorMessage;

  useEffect(() => {
    // sync
    if (category) {
      setTypedCategoryName(category.title);
      setSelectedCategoryIconType(category.iconType as CategoryIconType);
    }
  }, [category]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTypedCategoryName(e.target.value);
    if (e.target.value.length > CATEGORY_NAME_MAX_LENGTH) {
      setErrorMessage(`카테고리 이름은 ${CATEGORY_NAME_MAX_LENGTH}자 이내로 입력해주세요.`);
    } else {
      setErrorMessage(null);
    }
  };
  const handleClickChangeIconButton = () => {
    drawerProps.setIsOpen(true);
  };
  const handleClickBackButton = () => {
    navigate(PATH.POMODORO, { state: { openChangeCategoryDrawer: true } });
  };
  const handleClickCompleteButton = async () => {
    try {
      if (isEditMode) {
        await updateCategory({
          no: categoryNo,
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
    } catch (error) {
      const errorMessage = isErrorResponse(error)
        ? error.message
        : '알 수 없는 오류가 발생했습니다.';

      setErrorMessage(errorMessage);
    }
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
              <Icon name={CategoryIconTypeMap[selectedCategoryIconType]} size={40} />
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
            onChange={handleInput}
            type="text"
            placeholder="카테고리 이름"
            className="body-sb mt-6 w-full rounded-sm bg-white p-lg text-text-primary caret-text-accent-1 placeholder:text-text-disabled"
          />

          {/* FIXME: 에러 메시지 스타일 임의로 지정 */}
          {errorMessage && (
            <p className="subBody-r mt-3 w-full text-left text-text-accent-1">{errorMessage}</p>
          )}
        </div>

        <Frame.BottomBar>
          <Button
            className="w-full"
            disabled={isDisabledCompleteButton}
            onClick={handleClickCompleteButton}
          >
            확인
          </Button>
        </Frame.BottomBar>
      </Frame>

      <Drawer open={drawerProps.isOpen} onOpenChange={drawerProps.setIsOpen}>
        <DrawerContent>
          <DrawerDescription className="p-5">
            <div className="mx-auto grid max-w-md grid-cols-[repeat(4,minmax(0,56px))] justify-between gap-y-2 p-3">
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
                  <Icon name={iconName} size={32} />
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
