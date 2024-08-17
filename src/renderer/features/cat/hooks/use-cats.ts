import { useQuery } from '@tanstack/react-query';

import { Cat } from '@/entities/cat';
import { useAuthClient } from '@/shared/hooks';

export const useCats = () => {
  const authClient = useAuthClient();
  return useQuery({
    queryKey: ['cats'],
    queryFn: async () => {
      return await authClient?.get<Cat[]>('/api/v1/cats');
    },
    enabled: !!authClient,
  });
};
