import { useRef, useState } from 'react';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from 'recharts';

import { cn } from '@/shared/utils';

const data = [
  { date: '5/8', time: 15 },
  { date: '5/9', time: 30 },
  { date: '5/10', time: 0 },
  { date: '5/11', time: 45 },
  { date: '5/12', time: 0 },
  { date: '5/13', time: 15 },
  { date: '5/14', time: 348 }, // 5시간 48분을 분 단위로 변환 (5*60 + 48)
];

export const StatsChart = () => {
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [tooltipContent, setTooltipContent] = useState('');
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="rounded-[16px] bg-white p-4">
      <h3 className="header-4 mb-[50px] text-text-secondary">총 9시간 51분</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tick={{
              fontSize: 11,
              fill: '#8F867E',
            }}
            axisLine={{ stroke: '#DFD8D2' }}
          />
          <YAxis
            width={30}
            tick={{
              fontSize: 11,
              fill: '#8F867E',
            }}
            tickFormatter={(tick) => {
              if (tick === 0) return '0';
              if (tick < 60) return `${tick}m`;
              const hours = Math.floor(tick / 60);
              return `${hours}h`;
            }}
            axisLine={false}
            tickLine={false}
            orientation="right"
          />
          <Tooltip
            cursor={false}
            position={tooltipPosition}
            content={(data) => {
              const { active, payload } = data;
              if (!active || !payload || payload.length === 0) return null;
              const noVisible = tooltipContent === '';
              return (
                <div
                  ref={tooltipRef}
                  className={cn(
                    'caption-sb rounded-[8px] bg-icon-primary px-2 py-1 text-white',
                    noVisible && 'opacity-0',
                  )}
                >
                  {tooltipContent}
                </div>
              );
            }}
          />
          <Bar
            dataKey="time"
            barSize={20}
            radius={[6, 6, 0, 0]}
            minPointSize={8}
            onMouseOver={async (data) => {
              if (!tooltipRef.current) return;
              setTooltipContent(
                `${data.payload.date} - ${data.payload.time === 0 ? '집중 시간 없음' : `${data.payload.time}분`}`,
              );

              // getBoundingClientRect 실행을 위해 렌더링이 완료될 때까지 기다림
              await new Promise((resolve) => window.requestAnimationFrame(resolve));

              const gap = 20;
              const tooltipSize = tooltipRef.current.getBoundingClientRect();
              const tooltipX = data.x + data.width / 2 - tooltipSize.width / 2; // 막대의 중앙 x 좌표
              const tooltipY = data.y - gap - tooltipSize.height / 2; // 막대의 꼭대기 위치에서 약간 위로 올림
              setTooltipPosition({
                x: tooltipX,
                y: tooltipY,
              });
            }}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.time === 0 ? '#DFD8D2' : entry.time === 348 ? '#F47A0A' : '#8F867E'} // 5시간 48분인 경우 빨간색
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
