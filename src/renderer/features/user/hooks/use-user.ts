import { useQuery } from '@tanstack/react-query';

import { User } from '@/entities/user';
import { QUERY_KEY } from '@/shared/constants';
import * as db from '@/shared/utils/db';

export const useUser = () => {
  return useQuery<User>({
    queryKey: QUERY_KEY.ME,
    queryFn: async () => {
      return await db.getUser();
    },
  });
};
