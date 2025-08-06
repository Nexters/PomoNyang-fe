import { useMutation } from '@tanstack/react-query';
import { Pomodoro } from 'shared/type';

import { useAuthClient } from '@/shared/hooks';

type AddPomodoroBody = Pomodoro[];

export const useAddPomodoro = () => {
  const authClient = useAuthClient();
  return useMutation({
    mutationFn: async ({ body }: { body: AddPomodoroBody }) => {
      return await authClient?.post<void, AddPomodoroBody>('/api/v2/focus-times', body);
    },
  });
};
