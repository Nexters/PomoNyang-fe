import { ComponentProps, useMemo, useState } from 'react';

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
import { msToTimeString } from 'shared/util';

import { Stats } from '@/entities/stats';
import { cn, isoDurationToMs } from '@/shared/utils';

export type StatsChartProps = {
  dataFromServer: Stats['weaklyFocusTimeTrend'];
};

type YAxisProps = ComponentProps<typeof YAxis>;

const oneMinute = 60 * 1000; // 1분을 ms로 변환
const oneHour = 60 * oneMinute; // 1시간을 ms로 변환

const toFormattedDate = (str: string) => {
  const date = new Date(str);
  return `${date.getMonth() + 1}/${date.getDate()}`;
};
const toFixed = (num: number, digit = 2) => Number(num.toFixed(digit));
const toMinutes = (ms: number) => toFixed(ms / oneMinute);
const toHours = (ms: number) => toFixed(ms / oneHour);

const range = ({ start, step, count }: { start: number; step: number; count: number }) => {
  return Array.from({ length: count + 1 }, (_, i) => start + i * step);
};
const minmax = (min: number, value: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

export const StatsChart = ({ dataFromServer }: StatsChartProps) => {
  const [activeIndex, setActiveIndex] = useState(6);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | undefined>();

  const dataWithMs = useMemo(() => {
    return dataFromServer.dateToFocusTimeStatistics.map((item) => ({
      date: item.date,
      time: isoDurationToMs(item.totalFocusTime),
    }));
  }, [dataFromServer]);

  const totalFocusTime = useMemo(() => {
    const totalMs = dataWithMs.reduce((acc, item) => acc + item.time, 0);
    if (totalMs === 0) return '0분';
    return msToTimeString(totalMs);
  }, []);

  const { data, ticks, tickUnit } = useMemo<{
    ticks: YAxisProps['ticks'];
    tickUnit: 'minute' | 'hour';
    data: typeof dataWithMs;
  }>(() => {
    const maxTime = Math.max(...dataWithMs.map((item) => item.time));

    if (maxTime === 0) {
      return {
        ticks: [0, 10],
        tickUnit: 'minute',
        data: dataWithMs.map((item) => ({
          date: toFormattedDate(item.date),
          time: toMinutes(item.time),
        })),
      };
    }
    if (maxTime < oneHour) {
      return {
        ticks: [0, 15, 30, 45, 60],
        tickUnit: 'minute',
        data: dataWithMs.map((item) => ({
          date: toFormattedDate(item.date),
          time: toMinutes(item.time),
        })),
      };
    }
    if (maxTime < oneHour * 5) {
      // min: [0, 1, 2]
      // max: [0, 1, 2, 3, 4, 5]
      const ticks = range({
        start: 0,
        step: 1,
        count: minmax(2, Math.ceil(maxTime / oneHour), 5),
      });
      return {
        ticks: ticks,
        tickUnit: 'hour',
        data: dataWithMs.map((item) => ({
          date: toFormattedDate(item.date),
          time: toHours(item.time),
        })),
      };
    }
    if (maxTime < oneHour * 8) {
      return {
        // [0, 2, 4, 6, 8]
        ticks: range({ start: 0, step: 2, count: 4 }),
        tickUnit: 'hour',
        data: dataWithMs.map((item) => ({
          date: toFormattedDate(item.date),
          time: toHours(item.time),
        })),
      };
    }
    if (maxTime < oneHour * 20) {
      // min: [0, 5, 10]
      // max: [0, 5, 10, 15, 20]
      const ticks = range({
        start: 0,
        step: 5,
        count: minmax(2, Math.ceil(maxTime / (5 * oneHour)), 5),
      });
      return {
        ticks: ticks,
        tickUnit: 'hour',
        data: dataWithMs.map((item) => ({
          date: toFormattedDate(item.date),
          time: toHours(item.time),
        })),
      };
    }
    return {
      // [0, 6, 12, 18, 24]
      ticks: range({ start: 0, step: 6, count: 4 }),
      tickUnit: 'hour',
      data: dataWithMs.map((item) => ({
        date: toFormattedDate(item.date),
        time: toHours(item.time),
      })),
    };
  }, [dataWithMs]);

  return (
    <div className="rounded-[16px] bg-white p-4">
      <h3 className="header-4 mb-[50px] text-text-secondary">총 {totalFocusTime}</h3>
      <ResponsiveContainer width="100%" minHeight={240}>
        <BarChart
          data={data}
          onMouseMove={(state) => {
            if (state.isTooltipActive && state.activeTooltipIndex != null) {
              setActiveIndex(state.activeTooltipIndex);

              const barRects = document.querySelectorAll('.recharts-bar-rectangle');
              const rect = barRects[state.activeTooltipIndex] as SVGGraphicsElement | undefined;
              if (rect) {
                const { x, y, width } = rect.getBBox();
                setTooltipPosition({ x: x + width / 2, y: y - 8 });
              }
            }
          }}
        >
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
            width={36}
            tick={{
              fontSize: 11,
              fill: '#8F867E',
            }}
            domain={[0, 'dataMax']}
            ticks={ticks}
            tickFormatter={(tick) => `${tick}${tickUnit === 'minute' ? 'm' : 'h'}`}
            axisLine={false}
            tickLine={false}
            orientation="right"
          />
          <Tooltip
            cursor={false}
            wrapperStyle={{
              pointerEvents: 'none',
              top: tooltipPosition?.y,
              left: tooltipPosition?.x,
              transform: 'translate(-50%, -100%)',
            }}
            content={(data) => {
              const { active, payload } = data;
              if (!active || !payload || payload.length === 0) return null;
              const realPayload = payload[0].payload;
              if (realPayload.time === 0) return null;
              let content = '';
              if (tickUnit === 'minute') {
                content = `${realPayload.time}분`;
              } else {
                const hour = Math.floor(realPayload.time);
                const minute = Math.round((realPayload.time - hour) * 60);
                content = [hour > 0 ? `${hour}시간` : '', minute > 0 ? `${minute}분` : '']
                  .filter(Boolean)
                  .join('\n');
              }
              return (
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      'caption-sb whitespace-pre-wrap rounded-[8px] bg-icon-primary px-2 py-1 text-center text-white',
                    )}
                  >
                    {content}
                  </div>
                  <div className="-mt-[7px] h-0 w-0 border-l-[7px] border-r-[7px] border-t-[14px] border-l-transparent border-r-transparent border-t-icon-primary" />
                </div>
              );
            }}
          />
          <Bar dataKey="time" barSize={20} radius={[6, 6, 0, 0]} minPointSize={8}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.time === 0 ? '#DFD8D2' : activeIndex === index ? '#F47A0A' : '#8F867E'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
