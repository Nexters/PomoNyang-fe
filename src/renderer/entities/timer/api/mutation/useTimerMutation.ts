import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import { httpClient } from '@/shared/api/httpClient';

import { DEFAULT_KEY } from '../../constants';

type TResponse = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};

type TRequest = {
  title: string;
  id: number;
};

// 임시 api
export const updateTimer = async ({ title, id }: { title: string; id: number }) => {
  return await httpClient.put(`https://jsonplaceholder.typicode.com/todos/${id}`, {
    title,
  });
};

export const useTimerMutation = (
  options?: Omit<UseMutationOptions<TResponse, Error, TRequest>, 'mutationKey' | 'mutationFn'>,
) => {
  return useMutation({
    mutationKey: [DEFAULT_KEY],
    mutationFn: ({ title, id }: { title: string; id: number }) => updateTimer({ title, id }),
    ...options,
  });
};
