import { useQueryClient, useMutation } from '@tanstack/react-query';

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY.CATEGORIES });
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY.CATEGORIES });
    },
  });
};
