import { useQuery } from '@tanstack/react-query';

import { Cat } from '@/entities/cat';
import { QUERY_KEY } from '@/shared/constants';
import * as db from '@/shared/utils/db';

export const useCats = () => {
  return useQuery<Cat[]>({
    queryKey: QUERY_KEY.CATS,
    queryFn: async () => {
      return await db.getCats();
    },
  });
};
