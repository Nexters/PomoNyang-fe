import { useNavigate } from 'react-router-dom';

import { PATH } from '@/shared/constants';
import { Button, Carousel, CarouselContent, CarouselItem, useCarousel } from '@/shared/ui';

const Onboarding = () => {
  return (
    <div className="flex flex-col max-w-md min-h-screen mx-auto">
      <Carousel className="w-full">
        {/* @note: useCarousel를 사용하기 위해 별도 컴포넌트로 분리 */}
        <OnboardingContent />
      </Carousel>
    </div>
  );
};

const OnboardingContent = () => {
  const { api, scrollNext, scrollPrev, canScrollNext, canScrollPrev } = useCarousel();
  const navigate = useNavigate();
  return (
    <div className="flex flex-col flex-grow gap-4">
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index}>
            <div className="p-1 border rounded select-none">
              <div className="flex items-center justify-center p-6 aspect-square">
                <span className="text-4xl font-semibold">{index + 1}</span>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      {/* <CarouselPrevious />
      <CarouselNext /> */}

      {/* @note: api를 활용하여 다음 step으로 이동 */}
      <div className="flex gap-1">
        <Button disabled={!canScrollPrev} onClick={() => scrollPrev()}>
          prev
        </Button>
        <Button disabled={!canScrollNext} onClick={() => scrollNext()}>
          next
        </Button>
        <Button disabled={!canScrollNext} onClick={() => api?.scrollTo(5)}>
          skip
        </Button>
        <Button disabled={canScrollNext} onClick={() => navigate(PATH.HOME)}>
          start
        </Button>
      </div>
    </div>
  );
};

export default Onboarding;