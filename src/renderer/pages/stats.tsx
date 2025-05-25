import { useState } from 'react';

import { StatsTitle, StatsTotalTime } from '@/features/stats';
import { SidebarLayout } from '@/shared/ui';

const StatsPage = () => {
  const [date, setDate] = useState<Date>(new Date());
  const totalTimeMs = 12960000; // 예시로 3시간 36분을 밀리초로 표현

  return (
    <SidebarLayout title={<StatsTitle date={date} onDateChange={setDate} />}>
      <div className="flex h-full flex-col gap-5 overflow-y-auto pt-3">
        <div>
          <h2 className="header-4 px-4 py-5">총 집중시간</h2>
          <div className="px-4 pb-5">
            <StatsTotalTime totalTimeMs={totalTimeMs} />
          </div>
        </div>
        <div>
          <h2 className="header-4 px-4 py-5">
            집중 기록 <span className="text-text-accent-1">5</span>
          </h2>
          <div className="px-4 pb-5">
            <div className="h-[450px] w-full bg-slate-400">기록 영역</div>
          </div>
        </div>
        <div>
          <h2 className="header-4 px-4 py-5">집중 추세</h2>
          <div className="px-4 pb-5">
            <div className="h-[300px] w-full bg-slate-400">그래프 영역</div>
          </div>
        </div>
        <div>
          <h2 className="header-4 flex items-center gap-2 px-4 py-5">
            <span>카테고리 랭킹</span>
            <span className="subBody-r text-text-tertiary">5월 8일 - 5월 14일</span>
          </h2>
          <div className="px-4 pb-5">
            <div className="h-[150px] w-full bg-slate-400">랭킹 영역</div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default StatsPage;
