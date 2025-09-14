import { useMutation } from '@tanstack/react-query';
import { Pomodoro } from 'shared/type';

import * as db from '@/shared/utils/db';

type AddPomodoroBody = Pomodoro[];

export const useAddPomodoro = () => {
  return useMutation({
    mutationFn: async ({ body }: { body: AddPomodoroBody }) => {
      return await db.addPomodoro(body);
    },
  });
};
