import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Cat } from '@/entities/cat';
import { MUTATION_KEY, QUERY_KEY } from '@/shared/constants';
import { useAuthClient } from '@/shared/hooks';

export const useSelectCat = () => {
  const queryClient = useQueryClient();
  const authClient = useAuthClient();

  return useMutation({
    mutationKey: MUTATION_KEY.SELECT_CAT,
    mutationFn: async (catNo: Cat['no']) => {
      return await authClient?.put<unknown>('/api/v1/users/cats', { catNo });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY.CATS,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY.ME,
      });
    },
  });
};
