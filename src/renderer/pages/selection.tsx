import { useState } from 'react';

import { useRive, useStateMachineInput } from '@rive-app/react-canvas';

import riveFile from '@/shared/assets/rivs/skills.riv';
import { Button } from '@/shared/ui/button';

const STATE_MACHINE_NAME = 'State Machine ';
const INPUT_NAME = 'Level';

// @note: useStateMachineInput의 반환값에 value를 할당해도 리렌더링이 일어나지 않아 커스텀 훅을 만듬
const useRiveStateMachineInput = (...args: Parameters<typeof useStateMachineInput>) => {
  const [rive, stateMachineName, inputName, initialValue] = args;
  const [value, _setValue] = useState(initialValue);
  const input = useStateMachineInput(rive, stateMachineName, inputName, value);

  const setValue = (newValue: number) => {
    if (input) {
      input.value = newValue;
      _setValue(newValue);
    }
  };

  return [value, setValue, input] as const;
};

// @see: https://rive-app.github.io/rive-react/?path=/docs/react-runtime-state-machines--number-input
// 위의 예제를 그대로 가져와서 일부만 수정함
const Selection = () => {
  const { rive, RiveComponent } = useRive({
    src: riveFile,
    stateMachines: STATE_MACHINE_NAME,
    artboard: 'New Artboard',
    autoplay: true,
  });
  const [value, setValue] = useRiveStateMachineInput(rive, STATE_MACHINE_NAME, INPUT_NAME, 0);

  return (
    <div className="flex flex-col max-w-md min-h-screen mx-auto">
      <RiveComponent className="w-full aspect-square" />
      <div className="flex gap-2">
        Choose a level:
        {new Array(3).fill(null).map((_, index) => (
          <Button key={index} disabled={value === index} onClick={() => setValue(index)}>
            {index}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default Selection;
