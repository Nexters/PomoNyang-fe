import { Button } from '@/shared/ui';

import { usePomodoroMutation } from '../hooks/usePomodoroMutation';

type TUpdatePomodoroButton = {
  title: string;
  id: number;
};

export const UpdatePomodoroButton = (props: TUpdatePomodoroButton) => {
  const { id, title } = props;
  const { mutate } = usePomodoroMutation();
  return (
    <Button
      onClick={() => {
        mutate({ title, id });
      }}
    >
      update todo
    </Button>
  );
};
