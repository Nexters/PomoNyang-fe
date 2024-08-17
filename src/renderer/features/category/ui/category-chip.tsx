import { Icon } from '@/shared/ui';
import { getCategoryIconName } from '@/shared/utils';

type CategoryChipProps = {
  category: string;
};

export const CategoryChip = ({ category }: CategoryChipProps) => {
  return (
    <div className="flex gap-sm subBody-sb text-text-tertiary bg-background-secondary p-md rounded-xs w-[80px]">
      <Icon name={getCategoryIconName(category)} size="sm" />
      {category}
    </div>
  );
};
