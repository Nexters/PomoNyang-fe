import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';

import { pomodoroQueries, TRequest, TResponse, updatePomodoro } from '@/entities/pomodoro';

export const usePomodoroMutation = (
  options?: Omit<UseMutationOptions<TResponse, Error, TRequest>, 'mutationKey' | 'mutationFn'>,
) => {
  const queryClient = useQueryClient();

  // 오프라인 상황에서 mutation을 저장하고, 온라인 상황에서 다시 실행
  queryClient.setMutationDefaults(pomodoroQueries.all(), {
    mutationFn: updatePomodoro,
  });

  return useMutation({
    mutationKey: pomodoroQueries.all(),
    mutationFn: ({ title, id }: { title: string; id: number }) => updatePomodoro({ title, id }),
    onError: (error, variables) => {
      queryClient.invalidateQueries({
        queryKey: pomodoroQueries.detail(variables.id).queryKey,
      });
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: pomodoroQueries.detail(variables.id).queryKey });

      const optimisticTodo = { title: variables.title };

      queryClient.setQueryData([...pomodoroQueries.detail(variables.id).queryKey], optimisticTodo);
      return { optimisticTodo };
    },
    ...options,
  });
};
