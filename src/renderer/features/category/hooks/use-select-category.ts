import { useQueryClient, useMutation } from '@tanstack/react-query';

import { Category } from '@/entities/category';
import { MUTATION_KEY, QUERY_KEY } from '@/shared/constants';
import * as db from '@/shared/utils/db';

type SelectCategoryParams = {
  no: number;
};

export const useSelectCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: MUTATION_KEY.SELECT_CATEGORY,
    mutationFn: async ({ no }: SelectCategoryParams) => {
      return await db.selectCategory(no);
    },
    onMutate: ({ no }) => {
      queryClient.cancelQueries({ queryKey: QUERY_KEY.CATEGORIES });

      const categories = queryClient.getQueryData<Category[]>(QUERY_KEY.CATEGORIES);
      if (!categories) return;

      const optimisticCategories = categories.map((category) => ({
        ...category,
        isSelected: category.no === no,
      }));
      queryClient.setQueryData<Category[]>(QUERY_KEY.CATEGORIES, optimisticCategories);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY.CATEGORIES });
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY.CATEGORIES });
    },
  });
};
