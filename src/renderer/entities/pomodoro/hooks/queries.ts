import { queryOptions } from '@tanstack/react-query';

import { fetchPomodoro } from '../api';

export const pomodoroQueries = {
  all: () => ['pomodoro'],
  lists: () => [...pomodoroQueries.all(), 'list'],
  detail: (id: number) =>
    queryOptions({
      queryKey: [...pomodoroQueries.all(), 'detail', id],
      queryFn: () => fetchPomodoro(id),
    }),
};
