import { Stats } from './types';

import { createIsoDuration } from '@/shared/utils';

export const mockTrend: Stats['weaklyFocusTimeTrend'] = {
  startDate: '2025-06-19',
  endDate: '2025-06-25',
  dateToFocusTimeStatistics: [
    {
      date: '2025-06-19',
      totalFocusTime: createIsoDuration({ hours: 20, minutes: 59 }),
    },
    {
      date: '2025-06-20',
      totalFocusTime: 'PT30M',
    },
    {
      date: '2025-06-21',
      totalFocusTime: 'PT30M',
    },
    {
      date: '2025-06-22',
      totalFocusTime: 'PT30M',
    },
    {
      date: '2025-06-23',
      totalFocusTime: 'PT30M',
    },
    {
      date: '2025-06-24',
      totalFocusTime: 'PT30M',
    },
    {
      date: '2025-06-25',
      totalFocusTime: 'PT30M',
    },
  ],
};
