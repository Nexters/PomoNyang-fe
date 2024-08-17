import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Category } from '@/entities/category';
import { MUTATION_KEY, QUERY_KEY } from '@/shared/constants';
import { useAuthClient } from '@/shared/hooks';

type UpdateCategoryBody = {
  focusTime?: string;
  restTime?: string;
};

type UpdateCategoryParams = {
  no: number;
  body: UpdateCategoryBody;
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  const authClient = useAuthClient();
  return useMutation({
    mutationKey: MUTATION_KEY.UPDATE_CATEGORY,
    mutationFn: async ({ no, body }: UpdateCategoryParams) => {
      return await authClient?.patch<Category[], UpdateCategoryBody>(
        `/api/v1/categories/${no}`,
        body,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY.CATEGORIES,
      });
    },
  });
};
