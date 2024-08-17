import { useQuery } from '@tanstack/react-query';

import { Cat } from '@/entities/cat';
import { QUERY_KEY } from '@/shared/constants';
import { useAuthClient } from '@/shared/hooks';

export const useCats = () => {
  const authClient = useAuthClient();
  return useQuery({
    queryKey: QUERY_KEY.CATS,
    queryFn: async () => {
      return await authClient?.get<Cat[]>('/api/v1/cats');
    },
    enabled: !!authClient,
  });
};
