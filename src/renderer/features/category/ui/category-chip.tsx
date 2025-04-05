import { Category } from '@/entities/category';
import { Icon } from '@/shared/ui';
import { cn, getCategoryIconName } from '@/shared/utils';

type CategoryChipProps = {
  category: Category;
  onClick?: () => void;
};

export const CategoryChip = ({ category, onClick }: CategoryChipProps) => {
  return (
    <div
      className={cn(
        'subBody-sb flex min-w-[80px] select-none gap-sm rounded-xs bg-background-secondary p-md text-text-tertiary',
        onClick && 'cursor-pointer',
      )}
      onClick={onClick}
    >
      <Icon name={getCategoryIconName(category.iconType)} size="sm" />
      {category.title}
    </div>
  );
};
