import { useMutation, useQueryClient } from '@tanstack/react-query';

import { MUTATION_KEY, QUERY_KEY } from '@/shared/constants';
import { useAuthClient } from '@/shared/hooks';

type CreateCategoryBody = {
  title: string;
  iconType: string;
};
type CreateCategoryParams = {
  body: CreateCategoryBody;
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  const authClient = useAuthClient();
  return useMutation({
    mutationKey: MUTATION_KEY.CREATE_CATEGORY,
    mutationFn: async ({ body }: CreateCategoryParams) => {
      return await authClient?.post<unknown, CreateCategoryBody>('/api/v1/categories', body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY.CATEGORIES });
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY.CATEGORIES });
    },
  });
};
