import { Icon } from '@/shared/ui';

export type StatsTotalTimeProps = {
  totalTimeMs?: number;
};

export const StatsTotalTime = ({ totalTimeMs }: StatsTotalTimeProps) => {
  if (totalTimeMs) {
    const hours = Math.floor(totalTimeMs / (1000 * 60 * 60));
    const minutes = Math.floor((totalTimeMs % (1000 * 60 * 60)) / (1000 * 60));
    const timeText = hours > 0 ? `${hours}시간 ${minutes}분` : `${minutes}분`;
    return (
      <div className="flex min-h-[100px] w-full items-center justify-between rounded-[16px] bg-background-accent-1 px-6">
        <div>
          <h3 className="text-text-inverse">
            <span className="header-3 tabular-nums">{timeText}</span>
            <br />
            <span className="body-sb">집중했어요!</span>
          </h3>
        </div>
        <Icon name="categoryFire" size="xl" />
      </div>
    );
  }

  return (
    <div className="flex min-h-[100px] w-full items-center justify-between rounded-[16px] bg-background-secondary px-6">
      <h3 className="header-5 text-text-disabled">집중한 기록이 없어요</h3>
      <Icon name="bubble" size="xl" />
    </div>
  );
};
