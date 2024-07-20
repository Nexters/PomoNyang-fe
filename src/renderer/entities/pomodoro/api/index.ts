import { httpClient } from '@/shared/api';

export type TResponse = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};

export type TRequest = {
  title: string;
};

export type TTimer = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};

// 임시 api
export const fetchPomodoro = async (id: number): Promise<TTimer> => {
  const response = await httpClient.get<TTimer>(`https://jsonplaceholder.typicode.com/todos/${id}`);
  return response;
};

export const updatePomodoro = async ({ title, id }: { title: string; id: number }) => {
  return await httpClient.put<TResponse, TRequest>(
    `https://jsonplaceholder.typicode.com/todos/${id}`,
    {
      title,
    },
  );
};
