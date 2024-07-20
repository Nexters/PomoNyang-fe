import React, { useState } from 'react';

import { useQuery, useQueryClient } from '@tanstack/react-query';

import { pomodoroQueries } from '@/entities/pomodoro';
import { UpdatePomodoroButton } from '@/features/update-pomodoro/ui/button';
import { Button } from '@/shared/ui';

const Second = () => {
  const [todoId, setTodoId] = useState(1);
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery(pomodoroQueries.detail(todoId));
  const [title, setTitle] = useState('');

  return (
    <div>
      <Button onClick={() => setTodoId((prev) => Math.max(1, prev - 1))}>이전</Button>
      <Button onClick={() => setTodoId((prev) => prev + 1)}>다음</Button>
      <Button
        onClick={() => {
          queryClient.invalidateQueries({
            queryKey: ['todo', todoId],
          });
        }}
      >
        invalidate!
      </Button>
      <label>title 입력: </label>
      <input
        onChange={(e) => {
          setTitle(e.target.value);
        }}
      />
      <UpdatePomodoroButton title={title} id={todoId} />
      {isLoading && <div>로딩 중...</div>}
      {error && <div>에러 발생: {error.message}</div>}
      <h3>
        {todoId} : {data?.title}
      </h3>
    </div>
  );
};

export default Second;
