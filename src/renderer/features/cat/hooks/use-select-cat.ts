import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Cat } from '@/entities/cat';
import { User } from '@/entities/user';
import { MUTATION_KEY, QUERY_KEY } from '@/shared/constants';
import * as db from '@/shared/utils/db';

export const useSelectCat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: MUTATION_KEY.SELECT_CAT,
    mutationFn: async (catNo: Cat['no']) => {
      return await db.selectCat(catNo);
    },
    onMutate: (catNo) => {
      // cancel current queries
      queryClient.cancelQueries({ queryKey: QUERY_KEY.CATS });
      queryClient.cancelQueries({ queryKey: QUERY_KEY.ME });

      // get cat
      const cats = queryClient.getQueryData<Cat[]>(QUERY_KEY.CATS);
      const foundCat = cats?.find((cat) => cat.no === catNo);
      if (!foundCat) return;

      // set optimistic user
      const user = queryClient.getQueryData<User>(QUERY_KEY.ME);
      if (!user) return;

      const optimisticUser = { ...user, cat: foundCat };
      queryClient.setQueryData<User>(QUERY_KEY.ME, optimisticUser);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY.ME });
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY.ME });
    },
  });
};
