import { useState, useEffect } from 'react';

import { useRive, StateMachineInput, StateMachineInputType } from '@rive-app/react-canvas';

import { CatType } from '@/entities/cat';

export const userCatTypeAliasMap: Record<CatType, string> = {
  CHEESE: 'cheese',
  BLACK: 'black',
  THREE_COLOR: 'calico',
};

export type UseRiveCatParams = {
  src: string;
  stateMachines: string;
  userCatType?: CatType;
};

export const useRiveCat = ({ src, stateMachines, userCatType }: UseRiveCatParams) => {
  const { rive, RiveComponent } = useRive({
    src,
    stateMachines,
  });
  const [clickCatInput, setClickCatInput] = useState<StateMachineInput>();

  useEffect(() => {
    if (!rive || !userCatType) return;

    const userCatTypeAlias = userCatTypeAliasMap[userCatType];
    const inputs = rive.stateMachineInputs(stateMachines);

    const booleanInputs = inputs.filter((input) => input.type === StateMachineInputType.Boolean);
    const triggerInputs = inputs.filter((input) => input.type === StateMachineInputType.Trigger);

    // boolean input들 중 user의 고양이 타입에 해당하는 input만 true로 설정
    booleanInputs.forEach((input) => {
      input.value = input.name.toLowerCase().includes(userCatTypeAlias);
    });
    // trigger input들 중 user의 고양이 타입에 해당하는 input을 클릭할 수 있도록 설정
    const clickCatInput = triggerInputs.find((input) => {
      return input.name.toLowerCase().includes(userCatTypeAlias);
    });
    setClickCatInput(clickCatInput);

    rive.play();
  }, [rive, userCatType, stateMachines]);

  return { rive, RiveComponent, clickCatInput };
};
