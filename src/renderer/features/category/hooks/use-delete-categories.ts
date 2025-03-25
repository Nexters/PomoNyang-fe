import { useQueryClient, useMutation } from '@tanstack/react-query';

import { MUTATION_KEY, QUERY_KEY } from '@/shared/constants';
import { useAuthClient } from '@/shared/hooks';

type DeleteCategoriesParams = {
  body: {
    no: number[];
  };
};

export const useDeleteCategories = () => {
  const queryClient = useQueryClient();
  const authClient = useAuthClient();
  return useMutation({
    mutationKey: MUTATION_KEY.DELETE_CATEGORY,
    mutationFn: async ({ body }: DeleteCategoriesParams) => {
      return await authClient?.delete<unknown>('api/v1/categories', body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY.CATEGORIES });
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY.CATEGORIES });
    },
  });
};
