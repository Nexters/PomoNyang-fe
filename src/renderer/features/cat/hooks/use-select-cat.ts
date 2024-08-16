import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Cat } from '@/entities/cat';
import { useAuthClient } from '@/shared/hooks';

export const useSelectCat = () => {
  const queryClient = useQueryClient();
  const authClient = useAuthClient();

  return useMutation({
    mutationKey: ['selectCat'],
    mutationFn: async (catNo: Cat['no']) => {
      return await authClient?.put<unknown>('/api/v1/users/cats', { catNo });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['cats'],
      });
      queryClient.invalidateQueries({
        queryKey: ['me'],
      });
    },
  });
};
