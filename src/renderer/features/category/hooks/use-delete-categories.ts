import { useQueryClient, useMutation } from '@tanstack/react-query';

import { Category } from '@/entities/category';
import { MUTATION_KEY, QUERY_KEY } from '@/shared/constants';
import * as db from '@/shared/utils/db';

type DeleteCategoriesParams = {
  body: {
    no: number[];
  };
};

export const useDeleteCategories = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: MUTATION_KEY.DELETE_CATEGORY,
    mutationFn: async ({ body }: DeleteCategoriesParams) => {
      return await db.deleteCategories(body.no);
    },
    onMutate: ({ body }) => {
      queryClient.cancelQueries({ queryKey: QUERY_KEY.CATEGORIES });

      const categories = queryClient.getQueryData<Category[]>(QUERY_KEY.CATEGORIES);
      if (!categories) return;

      const optimisticCategories = categories.filter((category) => !body.no.includes(category.no));
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
