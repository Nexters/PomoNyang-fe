import React, { useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { DEFAULT_KEY, useTimerMutation } from '@/entities/timer';
import { useTimerQuery } from '@/entities/timer/api/query/useTimerQuery';
import { Button } from '@/shared/ui/button';

const Second = () => {
  const [todoId, setTodoId] = useState(1);
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useTimerQuery(todoId);
  const [title, setTitle] = useState('');

  const { mutate } = useTimerMutation({
    onSuccess: () => {
      queryClient.setQueryData([DEFAULT_KEY, todoId], { ...data, title });
      // queryClient.invalidateQueries({
      //   queryKey: [DEFAULT_KEY, todoId],
      // });
    },
    onError: () => {
      queryClient.invalidateQueries({
        queryKey: [DEFAULT_KEY, todoId],
      });
    },
  });

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
      <Button
        onClick={() => {
          mutate({ title, id: todoId });
          queryClient.setQueryData([DEFAULT_KEY, todoId], { ...data, title });
        }}
      >
        update todo
      </Button>
      {isLoading && <div>로딩 중...</div>}
      {error && <div>에러 발생: {error.message}</div>}
      <h3>
        {todoId} : {data?.title}
      </h3>
    </div>
  );
};

export default Second;
