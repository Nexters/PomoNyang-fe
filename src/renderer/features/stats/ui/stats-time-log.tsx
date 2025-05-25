import { useState } from 'react';

import { format } from 'date-fns';
import { msToTimeString } from 'shared/util';

import { CategoryIconType } from '@/entities/category';
import { Icon } from '@/shared/ui';
import { getCategoryIconName } from '@/shared/utils';

export type StatsTimeLogProps = {
  log: {
    startAt: Date;
    endAt: Date;
    category: string;
  }[];
};

const mockTimeLog = [
  {
    startAt: new Date('2023-10-01T09:00:00'),
    endAt: new Date('2023-10-01T10:00:00'),
    category: 'Work',
  },
  {
    startAt: new Date('2023-10-01T11:00:00'),
    endAt: new Date('2023-10-01T12:30:00'),
    category: 'Break',
  },
  {
    startAt: new Date('2023-10-01T13:00:00'),
    endAt: new Date('2023-10-01T15:00:00'),
    category: 'Work',
  },
  {
    startAt: new Date('2023-10-01T15:30:00'),
    endAt: new Date('2023-10-01T16:00:00'),
    category: 'Meeting',
  },
  {
    startAt: new Date('2023-10-01T16:30:00'),
    endAt: new Date('2023-10-01T18:00:00'),
    category: 'Work',
  },
];

export const StatsTimeLog = () => {
  // TODO: 실제 데이터로 교체
  const [renderedLog, setRenderedLog] = useState(mockTimeLog.slice(0, 3));
  const isShowMoreButton = mockTimeLog.length > renderedLog.length;

  const showMore = () => {
    const nextLogs = mockTimeLog.slice(renderedLog.length, renderedLog.length + 3);
    setRenderedLog((prev) => [...prev, ...nextLogs]);
  };

  return (
    <div>
      {renderedLog.map((log, index) => {
        const startAt = format(log.startAt, 'HH:mm');
        const endAt = format(log.endAt, 'HH:mm');
        const duration = log.endAt.getTime() - log.startAt.getTime();
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
                    {/* FIXME: */}
                    <Icon name={getCategoryIconName(log.category as CategoryIconType)} size="lg" />
                  </div>
                  <div>
                    <h4 className="header-5 text-text-primary">{log.category}</h4>
                    <p className="subBody-r text-text-secondary">
                      {msToTimeString(duration, true)}
                    </p>
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
