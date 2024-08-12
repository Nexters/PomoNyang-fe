import { useEffect, useMemo, useState } from 'react';

import { Button, Dialog, DialogProps, Icon } from '@/shared/ui';
import { getCategoryIconName } from '@/shared/utils';

export type ChangeTimeDialogProps = Pick<DialogProps, 'open' | 'onOpenChange'> & {
  mode: 'focus' | 'rest';
  category: string;
  // FIXME: 분, 초를 나누어서 받는게 괜찮을지 다시 확인 필요
  categoryTimeMinutes: number;
  categoryTimeSeconds: number;
  onChangeCategoryTime?: (category: string, minutes: number, seconds: number) => void;
};

const MAX_FOCUS_MINUTES = 60;
const MIN_FOCUS_MINUTES = 10;
const MAX_REST_MINUTES = 30;
const MIN_REST_MINUTES = 5;

const MINUTES_GAP = 5;

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
    <Dialog open={open} onOpenChange={onOpenChange} fullScreen animated={false}>
      <div className="h-full flex flex-col">
        <div className="flex-1 flex flex-col gap-8 justify-center items-center">
          <div className="flex justify-center items-center gap-2 px-4 py-2">
            <Icon name={getCategoryIconName(category)} size="sm" />
            <span className="body-sb text-text-secondary">{category}</span>
          </div>

          <div className="relative flex justify-center items-center gap-3 select-none">
            <Button
              variant="primary"
              size="none"
              className="p-2 rounded-sm"
              disabled={isMinMinutes}
              onClick={decreaseMinutes}
            >
              <Icon name="minus" size="md" />
            </Button>

            <div className="flex justify-center items-center gap-3 bg-background-secondary rounded-md px-4 py-5">
              <Icon name={mode === 'focus' ? 'focusTime' : 'restTime'} size="md" />
              <div className="flex justify-center items-center gap-0.5 header-1 text-text-primary tabular-nums">
                <span>{padNumber(minutes)}</span>
                {/* @note: 콜론 가운데 정렬이 되지 않아 이렇게 표시함 */}
                <span className="mt-[-8px]">:</span>
                <span>{padNumber(seconds)}</span>
              </div>
            </div>

            <Button
              variant="primary"
              size="none"
              className="p-2 rounded-sm"
              disabled={isMaxMinutes}
              onClick={increaseMinutes}
            >
              <Icon name="plus" size="md" />
            </Button>

            <div className="absolute bottom-0 left-0 w-full">
              <div className="absolute top-3 left-0 w-full text-center subBody-r text-text-accent-1">
                {errorMessage}
              </div>
            </div>
          </div>
        </div>

        <div className="w-full pb-[54px] text-center">
          <Button variant="secondary" size="icon" className="p-7 aspect-square" onClick={applyTime}>
            <Icon name="check" size="lg" />
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

const padNumber = (num: number) => num.toString().padStart(2, '0');
