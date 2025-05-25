import { addDays, format, isAfter, isSameDay } from 'date-fns';

import { Calendar, Icon, Popover } from '@/shared/ui';
import { cn } from '@/shared/utils';

// output: 3월 19일 (년도는 오늘과 같으면 생략)
const formatTitleDate = (date: Date) => {
  const selectedYear = date.getFullYear();
  const currentYear = new Date().getFullYear();

  return selectedYear === currentYear ? format(date, 'M월 d일') : format(date, 'yyyy년 M월 d일');
};

export type StatsTitleProps = {
  date: Date;
  onDateChange: (date: Date) => void;
};

export const StatsTitle = ({ date, onDateChange }: StatsTitleProps) => {
  const today = new Date();
  const userCreatedAt = addDays(today, -1); // FIXME: 유저 가입일
  const isDisabledPrev = !isAfter(date, userCreatedAt);
  const isDisabledNext = isSameDay(date, today) || isAfter(date, today);

  const setPrevDate = () => {
    if (isDisabledPrev) return;
    onDateChange(addDays(date, -1));
  };
  const setNextDate = () => {
    if (isDisabledNext) return;
    onDateChange(addDays(date, 1));
  };

  return (
    <div className="drag-region flex items-center justify-between px-3 py-2">
      <button
        className={cn(
          'rotate-180 p-2 text-icon-primary',
          isDisabledPrev && 'pointer-events-none opacity-0',
        )}
        disabled={isDisabledPrev}
        onClick={setPrevDate}
      >
        <Icon name="chevronRight" size="sm" className="*:stroke-current" />
      </button>
      <div>
        <Popover
          content={
            <Calendar
              mode="single"
              selected={date}
              defaultMonth={date}
              onSelect={(date) => {
                // @note: 날짜 선택 해제는 불가
                date && onDateChange(date);
              }}
              fromDate={userCreatedAt}
              toDate={today}
            />
          }
        >
          <button className="flex min-w-[128px] items-center justify-center gap-1 p-1">
            <span className="header-5 tabular-nums text-text-primary">{formatTitleDate(date)}</span>
            <span className="rounded-full bg-background-secondary p-2">
              <Icon name="chevronRight" className="rotate-90" />
            </span>
          </button>
        </Popover>
      </div>
      <button
        className={cn('p-2 text-icon-primary', isDisabledNext && 'pointer-events-none opacity-0')}
        disabled={isDisabledNext}
        onClick={setNextDate}
      >
        <Icon name="chevronRight" size="sm" className="*:stroke-current" />
      </button>
    </div>
  );
};
