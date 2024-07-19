import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { httpClient } from '@/shared/api/httpClient';

import { DEFAULT_KEY } from '../../constants';

type TTimer = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};

// 임시 api
const fetchTimer = async (id: number): Promise<TTimer> => {
  const response = await httpClient.get<TTimer>(`https://jsonplaceholder.typicode.com/todos/${id}`);
  return response;
};

export const useTimerQuery = (id: number): UseQueryResult<TTimer, Error> => {
  return useQuery({
    queryKey: [DEFAULT_KEY, id],
    queryFn: () => fetchTimer(id),
  });
};
