import { Icon, IconName } from '@/shared/ui';

const mockRanks = [
  {
    category: '집중',
    time: '1시간 30분',
  },
  {
    category: '휴식',
    time: '1시간 15분',
  },
  {
    category: '기타',
    time: '45분',
  },
];

export const StatsRanks = () => {
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
  const noRank = mockRanks.length === 0;

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
      {mockRanks.slice(0, 3).map((rank, index) => (
        <div key={index} className="flex items-center justify-start gap-[10px]">
          <Icon name={getRankIconName(index)} size={28} />
          <span className="body-sb flex-1 text-text-primary">{rank.category}</span>
          <span className="body-r tabular-nums text-text-tertiary">{rank.time}</span>
        </div>
      ))}
    </div>
  );
};
