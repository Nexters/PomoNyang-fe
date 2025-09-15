import { useQuery } from '@tanstack/react-query';

import { QUERY_KEY } from '@/shared/constants';
import * as db from '@/shared/utils/db';

export const useCategories = () => {
  const query = useQuery({
    queryKey: QUERY_KEY.CATEGORIES,
    queryFn: async () => {
      return await db.getCategories();
    },
  });
  const sortedData = query.data?.sort((a, b) => a.position - b.position);
  const currentCategory = query.data?.find((category) => category.isSelected) ?? sortedData?.[0];
  return { ...query, data: sortedData, currentCategory };
};
