import { useEffect, useMemo, useState } from 'react';

import {
  MAX_FOCUS_MINUTES,
  MAX_REST_MINUTES,
  MIN_FOCUS_MINUTES,
  MIN_REST_MINUTES,
  MINUTES_GAP,
} from '@/shared/constants';
import { Button, Dialog, DialogProps, Icon } from '@/shared/ui';
import { getCategoryIconName, padNumber } from '@/shared/utils';

export type ChangeTimeDialogProps = Pick<DialogProps, 'open' | 'onOpenChange'> & {
  mode: 'focus' | 'rest';
  category: string;
  // FIXME: 분, 초를 나누어서 받는게 괜찮을지 다시 확인 필요
  categoryTimeMinutes: number;
  categoryTimeSeconds: number;
  onChangeCategoryTime?: (category: string, minutes: number, seconds: number) => void;
};

export const ChangeTimeDialog = ({
  open,
  onOpenChange,
  mode,
  category,
  categoryTimeMinutes,
  categoryTimeSeconds,
  onChangeCategoryTime,
}: ChangeTimeDialogProps) => {
  const [minutes, setMinutes] = useState(categoryTimeMinutes);
  const [seconds, setSeconds] = useState(categoryTimeSeconds);

  useEffect(() => {
    setMinutes(categoryTimeMinutes);
    setSeconds(categoryTimeSeconds);
  }, [categoryTimeMinutes, categoryTimeSeconds]);

  const isMaxMinutes =
    mode === 'focus' ? minutes >= MAX_FOCUS_MINUTES : minutes >= MAX_REST_MINUTES;
  const isMinMinutes =
    mode === 'focus' ? minutes <= MIN_FOCUS_MINUTES : minutes <= MIN_REST_MINUTES;

  const errorMessage = useMemo(() => {
    if (isMaxMinutes) {
      return mode === 'focus'
        ? `최대 ${MAX_FOCUS_MINUTES}분까지 집중할 수 있어요`
        : `최대 ${MAX_REST_MINUTES}분까지 휴식할 수 있어요`;
    }

    if (isMinMinutes) {
      return mode === 'focus'
        ? `최소 ${MIN_FOCUS_MINUTES}분은 집중하는 걸 추천해요`
        : `최소 ${MIN_REST_MINUTES}분은 휴식하는 걸 추천해요`;
    }
  }, [isMaxMinutes, isMinMinutes, mode]);

  const increaseMinutes = () => {
    if (isMaxMinutes) return;

    setMinutes(minutes + MINUTES_GAP);
    setSeconds(0);
  };
  const decreaseMinutes = () => {
    if (isMinMinutes) return;

    setMinutes(minutes - MINUTES_GAP);
    setSeconds(0);
  };
  const applyTime = () => {
    onChangeCategoryTime?.(category, minutes, seconds);
    onOpenChange?.(false);
  };

  useEffect(() => {
    if (!open) {
      setMinutes(categoryTimeMinutes);
      setSeconds(categoryTimeSeconds);
    }
  }, [open, categoryTimeMinutes, categoryTimeSeconds]);

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      fullScreen={false}
      animated={false}
      contentClassname="w-[335px]"
    >
      <div className="flex h-full flex-col gap-1">
        <div className="h-[40px]" />
        <div className="flex flex-col">
          <div className="mb-3 inline-flex items-center justify-center gap-2 px-4 py-2">
            <Icon name={getCategoryIconName(category)} size="sm" />
            <span className="body-sb text-text-secondary">{category}</span>
          </div>

          <div className="relative flex select-none items-center justify-center gap-3">
            <Button
              variant="primary"
              size="none"
              className="rounded-sm p-2"
              disabled={isMinMinutes}
              onClick={decreaseMinutes}
            >
              <Icon name="minus" size="md" />
            </Button>

            <div className="flex items-center justify-center gap-3 rounded-md bg-background-secondary p-5">
              <Icon name={mode === 'focus' ? 'focusTime' : 'restTime'} size="md" />
              <div className="header-2 flex items-center justify-center gap-0.5 tabular-nums text-text-primary">
                <span>{padNumber(minutes)}</span>
                {/* @note: 콜론 가운데 정렬이 되지 않아 이렇게 표시함 */}
                <span className="mt-[-8px]">:</span>
                <span>{padNumber(seconds)}</span>
              </div>
            </div>

            <Button
              variant="primary"
              size="none"
              className="rounded-sm p-2"
              disabled={isMaxMinutes}
              onClick={increaseMinutes}
            >
              <Icon name="plus" size="md" />
            </Button>

            <div className="absolute bottom-0 left-0 w-full">
              <div className="subBody-r absolute left-0 top-3 w-full text-center text-text-accent-1">
                {errorMessage}
              </div>
            </div>
          </div>

          <div className="mt-11 w-full pb-3 text-center">
            <Button
              variant="secondary"
              size="icon"
              className="aspect-square p-7"
              onClick={applyTime}
            >
              <Icon name="check" size="lg" />
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};
