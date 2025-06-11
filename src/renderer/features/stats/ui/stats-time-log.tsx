import { useState } from 'react';

import { Stats } from '@/entities/stats';
import { Icon } from '@/shared/ui';
import { getCategoryIconName, isoDurationToString } from '@/shared/utils';

export type StatsTimeLogProps = {
  logs: Stats['focusTimes'];
};

export const StatsTimeLog = ({ logs }: StatsTimeLogProps) => {
  const [renderedLog, setRenderedLog] = useState(logs.slice(0, 3));
  const isShowMoreButton = logs.length > renderedLog.length;

  const showMore = () => {
    const nextLogs = logs.slice(renderedLog.length, renderedLog.length + 3);
    setRenderedLog((prev) => [...prev, ...nextLogs]);
  };

  return (
    <div>
      {renderedLog.map((log, index) => {
        // FIXME:
        const startAt = '11:00'; // format(log.startAt, 'HH:mm');
        const endAt = '12:00'; // format(log.endAt, 'HH:mm');
        const duration = isoDurationToString(log.totalFocusTime, true); // log.endAt.getTime() - log.startAt.getTime();
        return (
          <div key={index}>
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

      {isShowMoreButton && (
        <button
          className="mx-auto flex items-center gap-2 px-4 py-2 text-text-tertiary"
          onClick={showMore}
        >
          <span className="body-sb">더 보기</span>
          <Icon name="chevronRight" size="sm" className="rotate-90" />
        </button>
      )}
    </div>
  );
};
