import { useMemo, useState } from 'react';

import { format } from 'date-fns';

import { Stats } from '@/entities/stats';
import { Icon } from '@/shared/ui';
import { cn, getCategoryIconName, isoDurationToString } from '@/shared/utils';

export type StatsTimeLogProps = {
  logs: Stats['focusTimes'];
};

const MIN_LOG_ITEM = 3;

export const StatsTimeLog = ({ logs }: StatsTimeLogProps) => {
  const sortedLogs = useMemo(
    () =>
      logs.toSorted((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()),
    [],
  );
  const [renderedLog, setRenderedLog] = useState(sortedLogs.slice(0, MIN_LOG_ITEM));
  const isShowButton = sortedLogs.length > MIN_LOG_ITEM;
  const isExpanded = isShowButton && renderedLog.length === sortedLogs.length;

  const showMore = () => {
    setRenderedLog(sortedLogs);
  };
  const foldLog = () => {
    setRenderedLog(sortedLogs.slice(0, MIN_LOG_ITEM));
  };

  return (
    <div>
      {renderedLog.map((log) => {
        const startAt = format(log.startedAt, 'HH:mm');
        const endAt = format(log.doneAt, 'HH:mm');
        const duration = isoDurationToString(log.totalFocusTime, true);
        return (
          <div key={log.no}>
            <div className="flex items-center gap-1">
              <Icon name="circle" size="sm" />
              <span className="subBody-r text-text-tertiary">
                {startAt} - {endAt}
              </span>
            </div>
            <div className="flex w-full gap-1">
              <div className="flex h-full w-[20px] items-center justify-center">
                <div className="h-full min-h-[100px] border-l-[1px] border-dashed border-icon-disabled" />
              </div>
              <div className="w-full pb-3 pt-2">
                <div className="flex items-center gap-4 rounded-lg bg-white p-4">
                  <div className="rounded-[12px] bg-background-primary p-3">
                    <Icon name={getCategoryIconName(log.category.iconType)} size="lg" />
                  </div>
                  <div>
                    <h4 className="header-5 text-text-primary">{log.category.title}</h4>
                    <p className="subBody-r text-text-secondary">{duration}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {isShowButton && (
        <button
          className="mx-auto flex items-center gap-2 px-4 py-2 text-text-tertiary"
          onClick={isExpanded ? foldLog : showMore}
        >
          <span className="body-sb">{isExpanded ? '접기' : '더 보기'}</span>
          <Icon
            name="chevronRight"
            size="sm"
            className={cn(isExpanded ? '-rotate-90' : 'rotate-90')}
          />
        </button>
      )}
    </div>
  );
};
