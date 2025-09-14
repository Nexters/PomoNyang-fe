import { useQuery } from '@tanstack/react-query';

import { Stats } from '@/entities/stats';
import { QUERY_KEY } from '@/shared/constants';
import * as db from '@/shared/utils/db';

/**
 * @param date ISO 8601 형식, KST 기준 (예: '2025-10-01')
 */
export const useStats = (date: string) => {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return useQuery<Stats>({
    queryKey: [...QUERY_KEY.STATS, date, timezone],
    queryFn: async () => {
      return await db.getStatsByDate(new Date(date));
    },
    staleTime: 0,
    gcTime: 0,
  });
};
