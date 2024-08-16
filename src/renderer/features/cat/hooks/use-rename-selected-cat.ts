import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Cat } from '@/entities/cat';
import { useAuthClient } from '@/shared/hooks';

export const useRenameSelectedCat = () => {
  const queryClient = useQueryClient();
  const authClient = useAuthClient();

  return useMutation({
    mutationKey: ['renameSelectedCat'],
    mutationFn: async (catName: Cat['name']) => {
      return await authClient?.put('/api/v1/cats', { name: catName });
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
