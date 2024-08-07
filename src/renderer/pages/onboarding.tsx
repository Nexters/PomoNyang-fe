import { useNavigate } from 'react-router-dom';

import { PATH } from '@/shared/constants';
import {
  Button,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  useCarousel,
} from '@/shared/ui';
import { cn } from '@/shared/utils';

const Onboarding = () => {
  return (
    <Carousel className="w-full h-full" opts={{ loop: true }}>
      {/* @note: useCarousel를 사용하기 위해 별도 컴포넌트로 분리 */}
      <OnboardingContent />
    </Carousel>
  );
};

const contents = [
  {
    title: '모하냥과 함께 집중시간을 늘려보세요',
    description: '고양이 종에 따라 성격이 달라요.\n취향에 맞는 고양이를 선택해 몰입해 보세요.',
  },
  {
    title: '다른 앱을 실행하면 방해 알림을 보내요',
    description: '뽀모도로를 실행한 후, 다른 앱을 사용하면\n설정한 주기로 방해 알림을 보내드려요.',
  },
  {
    title: '집중과 휴식 반복을 통해 몰입을 관리해요',
    description:
      '일정 시간 집중과 휴식을 반복해 번아웃을 방지하고\n짧은 시간의 몰입을 경험해보세요.',
  },
];

const OnboardingContent = () => {
  const { currentIndex } = useCarousel();
  const navigate = useNavigate();

  return (
    <div className="h-full flex flex-col items-center justify-center gap-6">
      <div
        className={cn(
          'w-full flex flex-col justify-center items-center gap-8 overflow-hidden',
          // TODO: 가운데 정렬하고 최소 간격으로 하고 싶은데 잘 안되서 일단 주석처리함
          // 'h-sm:pt-[40px] h-md:pt-[60px] h-lg:pt-[100px] h-xl:pt-[140px]',
        )}
      >
        <CarouselContent>
          {contents.map((_, index) => (
            <CarouselItem key={index}>
              <div className="flex flex-col items-center justify-center gap-8 select-none">
                <div className="w-[240px] aspect-square bg-background-secondary" />

                <div className="flex flex-col gap-2 text-center">
                  <h2 className="header-4 text-text-primary">{contents[index].title}</h2>
                  <p className="body-r text-text-secondary whitespace-pre-line">
                    {contents[index].description}
                  </p>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious />
        <CarouselNext />

        <ul className="flex gap-2">
          {contents.map((_, index) => (
            <li
              key={index}
              className={`w-2 h-2 rounded-full ${index === currentIndex ? 'bg-background-tertiary' : 'bg-background-secondary'}`}
            />
          ))}
        </ul>
      </div>

      <div className="flex gap-1">
        <Button size="lg" className="w-[200px]" onClick={() => navigate(PATH.HOME)}>
          시작하기
        </Button>
      </div>
    </div>
  );
};

export default Onboarding;
