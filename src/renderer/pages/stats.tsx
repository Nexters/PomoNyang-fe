import { useState } from 'react';

import { StatsTitle } from '@/features/stats';
import { SidebarLayout } from '@/shared/ui';

const StatsPage = () => {
  const [date, setDate] = useState<Date>(new Date());

  return (
    <SidebarLayout title={<StatsTitle date={date} onDateChange={setDate} />}>
      <h1>Stats Page</h1>
      <p>This is the stats page.</p>
    </SidebarLayout>
  );
};

export default StatsPage;
