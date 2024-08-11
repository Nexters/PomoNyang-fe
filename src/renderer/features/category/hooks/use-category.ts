import { useQuery } from '@tanstack/react-query';

import { Category } from '@/entities/category';
import { useAuthClient } from '@/shared/hooks';

export const useCategory = () => {
  const authClient = useAuthClient();
  return useQuery({
    queryKey: ['category'],
    queryFn: async () => {
      return await authClient?.get<Category[]>('/api/v1/categories');
    },
    enabled: !!authClient,
  });
};
