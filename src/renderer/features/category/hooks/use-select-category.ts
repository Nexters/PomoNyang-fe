import { useQueryClient, useMutation } from '@tanstack/react-query';

import { Category } from '@/entities/category';
import { MUTATION_KEY, QUERY_KEY } from '@/shared/constants';
import { useAuthClient } from '@/shared/hooks';

type SelectCategoryParams = {
  no: number;
};

export const useSelectCategory = () => {
  const queryClient = useQueryClient();
  const authClient = useAuthClient();
  return useMutation({
    mutationKey: MUTATION_KEY.SELECT_CATEGORY,
    mutationFn: async ({ no }: SelectCategoryParams) => {
      return await authClient?.patch<unknown, undefined>(
        `/api/v1/categories/select/${no}`,
        undefined,
      );
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
