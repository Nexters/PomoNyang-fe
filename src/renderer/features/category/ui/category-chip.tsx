import { Category } from '@/entities/category';
import { Icon } from '@/shared/ui';
import { getCategoryIconName } from '@/shared/utils';

type CategoryChipProps = {
  category: Category;
};

export const CategoryChip = ({ category }: CategoryChipProps) => {
  return (
    <div className="subBody-sb flex w-[80px] gap-sm rounded-xs bg-background-secondary p-md text-text-tertiary">
      <Icon name={getCategoryIconName(category.iconType)} size="sm" />
      {category.title}
    </div>
  );
};
