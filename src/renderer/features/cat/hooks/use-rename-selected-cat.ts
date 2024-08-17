import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Cat } from '@/entities/cat';
import { User } from '@/entities/user';
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
    onMutate: (catName) => {
      // cancel current queries
      queryClient.cancelQueries({ queryKey: QUERY_KEY.CATS });
      queryClient.cancelQueries({ queryKey: QUERY_KEY.ME });

      // create optimistic cat
      const user = queryClient.getQueryData<User>(QUERY_KEY.ME);
      const currentCat = user?.cat;
      if (!currentCat) return;

      // set optimistic cat
      const optimisticCat = { ...currentCat, name: catName };
      queryClient.setQueryData<User>(QUERY_KEY.ME, (old) => {
        if (old) return { ...old, cat: optimisticCat };
        return old;
      });
      queryClient.setQueryData<Cat[]>(QUERY_KEY.CATS, (old) => {
        if (old) return old.map((cat) => (cat.no === optimisticCat.no ? optimisticCat : cat));
        return old;
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY.CATS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEY.ME });
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY.CATS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEY.ME });
    },
  });
};
