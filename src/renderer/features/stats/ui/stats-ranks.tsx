import { Stats } from '@/entities/stats';
import { Icon, IconName } from '@/shared/ui';
import { isoDurationToString } from '@/shared/utils';

const getRankIconName = (index: number): IconName | undefined => {
  switch (index) {
    case 0:
      return 'rank1st';
    case 1:
      return 'rank2nd';
    case 2:
      return 'rank3rd';
  }
};

export type StatsRanksProps = {
  rankingData: Stats['categoryRanking'];
};

export const StatsRanks = ({ rankingData }: StatsRanksProps) => {
  const ranks = rankingData.rankingItems.sort((a, b) => a.rank - b.rank);
  const noRank = ranks.length === 0;

  if (noRank) {
    return (
      <div className="flex items-center justify-start rounded-sm bg-background-secondary px-6 py-7">
        <span className="header-5 flex-1 text-text-disabled">집중한 기록이 없어요</span>
        <Icon name="bubble" size="xl" />
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-4 rounded-[16px] bg-white p-4">
      {ranks.slice(0, 3).map((rank, index) => (
        <div key={index} className="flex items-center justify-start gap-[10px]">
          <Icon name={getRankIconName(index)} size={28} />
          <span className="body-sb flex-1 text-text-primary">{rank.category.title}</span>
          <span className="body-r tabular-nums text-text-tertiary">
            {isoDurationToString(rank.totalFocusTime)}
          </span>
        </div>
      ))}
    </div>
  );
};
