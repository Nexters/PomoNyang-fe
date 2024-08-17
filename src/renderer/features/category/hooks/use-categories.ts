import { useQuery } from '@tanstack/react-query';

import { Category } from '@/entities/category';
import { QUERY_KEY } from '@/shared/constants';
import { useAuthClient } from '@/shared/hooks';

export const useCategories = () => {
  const authClient = useAuthClient();
  return useQuery({
    queryKey: QUERY_KEY.CATEGORIES,
    queryFn: async () => {
      return await authClient?.get<Category[]>('/api/v1/categories');
    },
    enabled: !!authClient,
  });
};
