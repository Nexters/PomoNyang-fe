import { Category } from '@/entities/category';
import { Icon } from '@/shared/ui';
import { getCategoryIconName } from '@/shared/utils';

type CategoryChipProps = {
  category: Category;
  onClick?: () => void;
};

export const CategoryChip = ({ category, onClick }: CategoryChipProps) => {
  return (
    <div
      className="subBody-sb flex min-w-[80px] gap-sm rounded-xs bg-background-secondary p-md text-text-tertiary"
      onClick={onClick}
    >
      <Icon name={getCategoryIconName(category.iconType)} size="sm" />
      {category.title}
    </div>
  );
};
