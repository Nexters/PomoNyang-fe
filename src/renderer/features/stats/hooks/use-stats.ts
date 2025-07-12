import { useQuery } from '@tanstack/react-query';

import { Stats } from '@/entities/stats';
import { QUERY_KEY } from '@/shared/constants';
import { useAuthClient } from '@/shared/hooks';

/**
 * @param date ISO 8601 형식, KST 기준 (예: '2025-10-01')
 */
export const useStats = (date: string) => {
  const authClient = useAuthClient();
  return useQuery({
    queryKey: [...QUERY_KEY.STATS, date],
    queryFn: async () => {
      return await authClient?.get<Stats>(`/api/v1/statistics/${date}`);
    },
    enabled: !!authClient && !!date,
    staleTime: 0,
  });
};
