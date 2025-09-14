import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Category, CategoryIconType } from '@/entities/category';
import { MUTATION_KEY, QUERY_KEY } from '@/shared/constants';
import * as db from '@/shared/utils/db';

type CreateCategoryBody = {
  title: string;
  iconType: CategoryIconType;
};
type CreateCategoryParams = {
  body: CreateCategoryBody;
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: MUTATION_KEY.CREATE_CATEGORY,
    mutationFn: async ({ body }: CreateCategoryParams) => {
      return await db.createCategory(body);
    },
    onMutate: ({ body }) => {
      queryClient.cancelQueries({ queryKey: QUERY_KEY.CATEGORIES });

      const categories = queryClient.getQueryData<Category[]>(QUERY_KEY.CATEGORIES);
      if (!categories) return;

      const lastCategory = categories[categories.length - 1];
      const optimisticCategory: Category = {
        no: Date.now(),
        title: body.title,
        iconType: body.iconType,
        position: lastCategory.position + 1,
        focusTime: 'PT25M',
        restTime: 'PT10M',
        isSelected: false,
      };
      queryClient.setQueryData<Category[]>(QUERY_KEY.CATEGORIES, [
        ...categories,
        optimisticCategory,
      ]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY.CATEGORIES });
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY.CATEGORIES });
    },
  });
};
