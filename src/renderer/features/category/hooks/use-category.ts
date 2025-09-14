import { useQuery } from '@tanstack/react-query';

import { Category } from '@/entities/category';
import { QUERY_KEY } from '@/shared/constants';
import * as db from '@/shared/utils/db';

export const useCategory = (no?: number) => {
  return useQuery<Category>({
    queryKey: [...QUERY_KEY.CATEGORIES, no],
    queryFn: async () => {
      return await db.getCategory(no!);
    },
    enabled: no != null,
  });
};
