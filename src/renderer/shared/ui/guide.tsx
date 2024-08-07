import { useEffect, useLayoutEffect, useState } from 'react';

import { useWindowSize } from '../hooks';
import { __localStorage } from '../utils';

type TSteps = {
  id: string;
  message: string;
}[];

type TGuideProps = {
  steps: TSteps;
};

type TGuide = {
  isGuideOpen: boolean;
};

export const Guide = (props: TGuideProps) => {
  const { steps } = props;

  const [viewGuide, setViewGuide] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentGuideIndex, setCurrentGuideIndex] = useState(0);

  // windowSize 바뀔때마다 자동 리렌더링 되도록 훅만 호출
  useWindowSize();

  useLayoutEffect(() => {
    const isGuide = __localStorage.getItem<TGuide>('isGuideOpen');
    if (!isGuide) {
      setViewGuide(true);
    }
  }, []);

  useEffect(() => {
    if (steps.length > 0) {
      setIsAnimating(true);
      const timeout = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [steps]);

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
      setViewGuide(false);
    }
  };

  if (!viewGuide) return null;

  return (
    <div className="absolute top-0 left-0 w-full h-full cursor-pointer" onClick={handleGuideClick}>
      <div
        className="absolute duration-300 rounded-xs w-fit transition-position"
        style={{
          boxShadow: `0 0 0 100vmax rgba(0, 0, 0, 0.5),
            0 0 0 ${rect.width}px rgba(0, 0, 0, 0) inset`,
          top: `${rect.top}px`,
          left: `${rect.left}px`,
          width: `${rect.width}px`,
          height: `${rect.height}px`,
        }}
      />
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
