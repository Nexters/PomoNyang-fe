import { useState } from 'react';

import { format } from 'date-fns';

import { StatsTimeLog, StatsTitle, StatsTotalTime, StatsChart, StatsRanks } from '@/features/stats';
import { useStats } from '@/features/stats/hooks/use-stats';
import { SidebarLayout } from '@/shared/ui';
import { isoDurationToMs } from '@/shared/utils';

const StatsPage = () => {
  const [date, setDate] = useState<Date>(new Date());
  const { data: stats } = useStats(format(date, 'yyyy-MM-dd'));
  const totalTimeMs = isoDurationToMs(stats?.totalFocusTime);

  if (!stats) {
    return (
      <SidebarLayout title={<StatsTitle date={date} onDateChange={setDate} />}>
        loading...
      </SidebarLayout>
    );
  }
  return (
    <SidebarLayout title={<StatsTitle date={date} onDateChange={setDate} />}>
      <div className="flex h-full flex-col gap-5 overflow-y-auto pb-10 pt-3">
        <div>
          <h2 className="header-4 px-4 py-5">총 집중시간</h2>
          <div className="px-4 pb-5">
            <StatsTotalTime totalTimeMs={totalTimeMs} />
          </div>
        </div>
        {stats.focusTimes.length > 0 && (
          <div>
            <h2 className="header-4 px-4 py-5">
              집중 기록 <span className="text-text-accent-1">{stats.focusTimes.length}</span>
            </h2>
            <div className="px-4 pb-5">
              <StatsTimeLog logs={stats.focusTimes} />
            </div>
          </div>
        )}
        <div>
          <h2 className="header-4 px-4 py-5">집중 추세</h2>
          <div className="px-4 pb-5">
            <StatsChart />
          </div>
        </div>
        <div>
          <h2 className="header-4 flex items-center gap-2 px-4 py-5">
            <span>카테고리 랭킹</span>
            <span className="subBody-r text-text-tertiary">5월 8일 - 5월 14일</span>
          </h2>
          <div className="px-4 pb-5">
            <StatsRanks />
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default StatsPage;
