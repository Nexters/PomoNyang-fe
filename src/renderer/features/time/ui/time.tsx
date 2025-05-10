import { padNumber } from 'shared/util';

import { cn } from '@/shared/utils';

type TimeProps = {
  minutes: number;
  seconds: number;
  className?: string;
};

export const Time = ({ minutes, seconds, className }: TimeProps) => {
  return (
    <div className={cn('flex items-center justify-center', className)}>
      <span className="tabular-nums">{padNumber(minutes)}</span>
      <span>:</span>
      <span className="tabular-nums">{padNumber(seconds)}</span>
    </div>
  );
};
