import { Category } from '../category';

export type Stats = {
  data: string;
  totalFocusTime: string;
  focusTimes: Array<{
    no: number;
    category: Pick<Category, 'no' | 'title' | 'iconType'>;
    totalFocusTime: string;
    startedAt: string;
    doneAt: string;
  }>;
  weaklyFocusTimeTrend: {
    startDate: string;
    endDate: string;
    dateToFocusTimeStatistics: Array<{
      date: string;
      totalFocusTime: string;
    }>;
  };
  categoryRanking: {
    startDate: string;
    endDate: string;
    rankingItems: Array<{
      rank: number;
      category: Pick<Category, 'no' | 'title' | 'iconType'>;
      totalFocusTime: string;
    }>;
  };
};
