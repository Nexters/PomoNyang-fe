import { useQuery } from '@tanstack/react-query';

import { User } from '@/entities/user';
import { useAuthClient } from '@/shared/hooks';

export const useUser = () => {
  const authClient = useAuthClient();
  return useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      return await authClient?.get<User>('/api/v1/users/me');
    },
    enabled: !!authClient,
  });
};
