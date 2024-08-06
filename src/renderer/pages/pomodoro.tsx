import { useEffect, useLayoutEffect, useRef, useState } from 'react';

import { Button, Icon } from '@/shared/ui';
import { __localStorage } from '@/shared/utils';

const guideMessages = ['눌러서 카테고리를 변경할 수 있어요', '눌러서 시간을 조정할 수 있어요'];

type TGuide = {
  isGuideOpen: boolean;
};

type TGuideState = {
  ref: React.RefObject<HTMLElement>;
  message: string;
};

const Pomodoro = () => {
  const [guides, setGuides] = useState<TGuideState[]>([]);
  const [viewGuide, setViewGuide] = useState(false);
  const [currentGuideIndex, setCurrentGuideIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [, forceUpdate] = useState({});

  // 여러 ref를 생성하는 함수
  const createRef = () => useRef<HTMLElement>(null);

  const guideRefs = {
    category: createRef(),
    timeAdjust: createRef(),
  };

  useEffect(() => {
    setGuides([
      { ref: guideRefs.category, message: guideMessages[0] },
      { ref: guideRefs.timeAdjust, message: guideMessages[1] },
    ]);
    const handleResize = () => {
      // forceUpdate를 사용하여 컴포넌트 리렌더링
      forceUpdate({});
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useLayoutEffect(() => {
    const isGuide = __localStorage.getItem<TGuide>('isGuideOpen');
    if (!isGuide) {
      setViewGuide(true);
    }
  }, []);

  useEffect(() => {
    if (viewGuide) {
      setIsAnimating(true);
      const timeout = setTimeout(() => setIsAnimating(false), 300); // Adjust duration as needed
      return () => clearTimeout(timeout);
    }
  }, [currentGuideIndex, viewGuide]);

  const handleGuideClick = () => {
    setIsAnimating(true);
    setTimeout(() => {
      if (currentGuideIndex < guides.length - 1) {
        setCurrentGuideIndex((prevIndex) => prevIndex + 1);
      } else {
        setViewGuide(false);
      }
    }, 300); // Adjust duration to match animation
  };

  return (
    <>
      <div className="flex flex-col h-full">
        <header className="flex justify-end p-4">
          <Button variant="text-primary" size="md" className="p-[8px] rounded-none bg-gray-50">
            <Icon name="placeholder" size="md" />
          </Button>
        </header>
        <main className="flex flex-col gap-[25px] items-center justify-center flex-1">
          <div className="w-[240px] h-[240px] bg-background-secondary" />
          <div className="flex flex-col p-lg gap-md">
            <Button
              variant="tertiary"
              className="w-[80px] mx-auto"
              size="sm"
              ref={guideRefs.category as React.RefObject<HTMLButtonElement>}
            >
              <Icon name="placeholder" size="sm" />
              집중
            </Button>
            <div
              className="flex items-center text-gray-500 p-xs gap-md"
              ref={guideRefs.timeAdjust as React.RefObject<HTMLDivElement>}
            >
              <div className="flex items-center cursor-pointer p-sm gap-sm">
                <span className="body-sb">집중</span>
                <span className="header-3">25분</span>
              </div>
              <div className="w-[2px] h-[20px] bg-gray-200 rounded-full" />
              <div className="flex items-center cursor-pointer p-sm gap-sm">
                <span className="body-sb">휴식</span>
                <span className="header-3">25분</span>
              </div>
            </div>
          </div>
          <Button variant="primary" className="p-[28px]" size="icon">
            <Icon name="placeholder" size="lg" />
          </Button>
        </main>
      </div>
      {viewGuide && guides[currentGuideIndex] && guides[currentGuideIndex].ref.current && (
        <div
          className="absolute top-0 left-0 w-full h-full cursor-pointer"
          onClick={handleGuideClick}
        >
          <div
            className="absolute duration-300 rounded-xs w-fit transition-position"
            style={{
              boxShadow: `0 0 0 100vmax rgba(0, 0, 0, 0.5),
          0 0 0 ${guides[currentGuideIndex].ref.current.getBoundingClientRect().width}px rgba(0, 0, 0, 0) inset`,
              top: `${guides[currentGuideIndex].ref.current.getBoundingClientRect().top}px`,
              left: `${guides[currentGuideIndex].ref.current.getBoundingClientRect().left}px`,
              width: `${guides[currentGuideIndex].ref.current.getBoundingClientRect().width}px`,
              height: `${guides[currentGuideIndex].ref.current.getBoundingClientRect().height}px`,
            }}
          />
          <div
            className={`bg-white rounded-xs p-md text-text-secondary transition-position duration-300 ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}
            style={{
              position: 'absolute',
              top: `${guides[currentGuideIndex].ref.current.getBoundingClientRect().top - 20}px`,
              left: `${guides[currentGuideIndex].ref.current.getBoundingClientRect().left + guides[currentGuideIndex].ref.current.getBoundingClientRect().width / 2}px`,
              transform: 'translate(-50%, -100%)',
            }}
          >
            {guides[currentGuideIndex].message}
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
      )}
    </>
  );
};

export default Pomodoro;
