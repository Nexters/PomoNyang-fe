import { useState } from 'react';

import { useStateMachineInput } from '@rive-app/react-canvas';

// @note: useStateMachineInput의 반환값에 value를 할당해도 리렌더링이 일어나지 않아 커스텀 훅을 만듬
export const useRiveStateMachineInput = (...args: Parameters<typeof useStateMachineInput>) => {
  const [rive, stateMachineName, inputName, initialValue] = args;
  const [_value, _setValue] = useState(initialValue);
  const input = useStateMachineInput(rive, stateMachineName, inputName, _value);

  const setValue = (newValue: number) => {
    if (input && input.value !== newValue) {
      input.value = newValue;
      _setValue(input.value);
    }
  };

  return [_value, setValue, input] as const;
};
