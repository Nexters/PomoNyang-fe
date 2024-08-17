import { useMutation } from '@tanstack/react-query';

import { Pomodoro } from '@/entities/pomodoro';
import { useAuthClient } from '@/shared/hooks';

type AddPomodoroBody = Pomodoro[];

export const useAddPomodoro = () => {
  const authClient = useAuthClient();
  return useMutation({
    mutationFn: async ({ body }: { body: AddPomodoroBody }) => {
      return await authClient?.post<void, AddPomodoroBody>('/api/v1/focus-times', body);
    },
  });
};
