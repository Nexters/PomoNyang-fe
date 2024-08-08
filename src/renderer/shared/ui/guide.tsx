import { useEffect, useState } from 'react';

import { useWindowSize } from '../hooks';

type TSteps = {
  id: string;
  message: string;
}[];

type TGuideProps = {
  steps: TSteps;
  handler?: {
    onGuideStart?: () => void;
    onGuideEnd?: () => void;
  };
};

export const Guide = ({ steps, handler }: TGuideProps) => {
  const { onGuideStart, onGuideEnd } = handler || {};

  const [isStart, setIsStart] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentGuideIndex, setCurrentGuideIndex] = useState(0);

  // windowSize 바뀔때마다 자동 리렌더링 되도록 훅만 호출
  useWindowSize();

  useEffect(() => {
    if (steps.length > 0) {
      onGuideStart?.();
    }
  }, [steps]);

  useEffect(() => {
    setIsAnimating(true);
    const timeout = setTimeout(() => setIsAnimating(false), 500);
    return () => clearTimeout(timeout);
  }, [currentGuideIndex]);

  if (!isStart) return null;

  if (!steps[currentGuideIndex]) {
    return null;
  }

  const element = document.getElementById(steps[currentGuideIndex].id);
  if (!element) {
    return null;
  }

  const rect = element.getBoundingClientRect();

  const handleGuideClick = () => {
    if (currentGuideIndex < steps.length - 1) {
      setCurrentGuideIndex((prevIndex) => prevIndex + 1);
    } else {
      setIsStart(false);
      onGuideEnd?.();
    }
  };

  return (
    // 1. 전체 오버레이
    <div className="fixed inset-0 cursor-pointer" onClick={handleGuideClick}>
      {/* 2. 빵꾸 뚫을 영역 */}
      <div
        className="absolute duration-300 rounded-xs w-fit transition-position"
        style={{
          // boxShadow로 뷰포트 덮는 검정 반투명 영역 만들고 가이드 하려는 영역 빵꾸 뚫기
          boxShadow: `0 0 0 100vmax rgba(0, 0, 0, 0.5),
            0 0 0 ${rect.width}px rgba(0, 0, 0, 0) inset`,
          top: `${rect.top}px`,
          left: `${rect.left}px`,
          width: `${rect.width}px`,
          height: `${rect.height}px`,
        }}
      />

      {/* 3. 툴팁 메세지 */}
      <div
        className={`bg-white rounded-xs p-md text-text-secondary transition-position duration-300 ${
          isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
        }`}
        style={{
          position: 'absolute',
          top: `${rect.top - 20}px`,
          left: `${rect.left + rect.width / 2}px`,
          transform: 'translate(-50%, -100%)',
        }}
      >
        {steps[currentGuideIndex].message}
        <div
          className="absolute w-0 h-0"
          style={{
            bottom: '-8px',
            left: '50%',
            transform: 'translateX(-50%)',
            borderLeft: '8px solid transparent',
            borderRight: '8px solid transparent',
            borderTop: '8px solid white',
          }}
        />
      </div>
    </div>
  );
};
