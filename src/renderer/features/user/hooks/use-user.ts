import { useQuery } from '@tanstack/react-query';

import { User } from '@/entities/user';
import { QUERY_KEY } from '@/shared/constants';
import { useAuthClient } from '@/shared/hooks';

export const useUser = () => {
  const authClient = useAuthClient();
  return useQuery({
    queryKey: QUERY_KEY.ME,
    queryFn: async () => {
      return await authClient?.get<User>('/api/v1/users/me');
    },
    enabled: !!authClient,
  });
};
