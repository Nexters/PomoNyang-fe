import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Cat } from '@/entities/cat';
import { MUTATION_KEY, QUERY_KEY } from '@/shared/constants';
import { useAuthClient } from '@/shared/hooks';

export const useRenameSelectedCat = () => {
  const queryClient = useQueryClient();
  const authClient = useAuthClient();

  return useMutation({
    mutationKey: MUTATION_KEY.RENAME_SELECTED_CAT,
    mutationFn: async (catName: Cat['name']) => {
      return await authClient?.put('/api/v1/cats', { name: catName });
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
