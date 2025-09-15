import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Category } from '@/entities/category';
import { MUTATION_KEY, QUERY_KEY } from '@/shared/constants';
import * as db from '@/shared/utils/db';

type UpdateCategoryBody = Partial<Pick<Category, 'title' | 'iconType' | 'focusTime' | 'restTime'>>;

type UpdateCategoryParams = {
  no: number;
  body: UpdateCategoryBody;
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: MUTATION_KEY.UPDATE_CATEGORY,
    mutationFn: async ({ no, body }: UpdateCategoryParams) => {
      return await db.updateCategory(no, body);
    },
    onMutate: ({ no, body }) => {
      queryClient.cancelQueries({ queryKey: QUERY_KEY.CATEGORIES });

      const categories = queryClient.getQueryData<Category[]>(QUERY_KEY.CATEGORIES);
      const foundCategory = categories?.find((category) => category.no === no);
      if (!foundCategory) return;

      const optimisticCategory: Category = { ...foundCategory, ...body };
      queryClient.setQueryData<Category[]>(QUERY_KEY.CATEGORIES, (old) => {
        if (old) {
          return old.map((category) => (category.no === no ? optimisticCategory : category));
        }
        return old;
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY.CATEGORIES });
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY.CATEGORIES });
    },
  });
};
