import Autoplay from 'embla-carousel-autoplay';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from 'usehooks-ts';

import { useUser } from '@/features/user';
import onboardingImage1 from '@/shared/assets/images/onboarding-1.png';
import onboardingImage2 from '@/shared/assets/images/onboarding-2.png';
import onboardingImage3 from '@/shared/assets/images/onboarding-3.png';
import { LOCAL_STORAGE_KEY, PATH } from '@/shared/constants';
import { Button, Carousel, CarouselContent, CarouselItem, useCarousel } from '@/shared/ui';
import { cn } from '@/shared/utils';

const Onboarding = () => {
  return (
    <Carousel className="h-full w-full" opts={{ loop: true }} plugins={[Autoplay({ delay: 3000 })]}>
      {/* @note: useCarousel를 사용하기 위해 별도 컴포넌트로 분리 */}
      <OnboardingContent />
    </Carousel>
  );
};

const contents = [
  {
    title: '모하냥과 함께 집중시간을 늘려보세요',
    description: '고양이 종에 따라 성격이 달라요.\n취향에 맞는 고양이를 선택해 몰입해 보세요.',
    imageSrc: onboardingImage1,
  },
  {
    title: '집중, 휴식시간이 끝나면 알림을 보내요',
    description: '뽀모도로를 실행한 후, 목표 시간이 지나면\n시간이 끝났다는 알림을 보내드려요.',
    imageSrc: onboardingImage2,
  },
  {
    title: '집중과 휴식 반복을 통해 몰입을 관리해요',
    description:
      '일정 시간 집중과 휴식을 반복해 번아웃을 방지하고\n짧은 시간의 몰입을 경험해보세요.',
    imageSrc: onboardingImage3,
  },
];

const OnboardingContent = () => {
  const { currentIndex } = useCarousel();
  const navigate = useNavigate();
  const { data: user } = useUser();
  const [, setIsCompleted] = useLocalStorage(LOCAL_STORAGE_KEY.ONBOARDING_COMPLETED, false);

  return (
    <div className="flex h-full flex-col items-center justify-center gap-12">
      <div
        className={cn(
          'flex w-full flex-col items-center justify-center gap-3xl overflow-hidden',
          // TODO: 가운데 정렬하고 최소 간격으로 하고 싶은데 잘 안되서 일단 주석처리함
          // 'h-sm:pt-[40px] h-md:pt-[60px] h-lg:pt-[100px] h-xl:pt-[140px]',
        )}
      >
        <CarouselContent>
          {contents.map(({ title, description, imageSrc }, index) => (
            <CarouselItem key={index}>
              <div className="flex select-none flex-col items-center justify-center gap-8">
                <img src={imageSrc} width={240} height={240} />

                <div className="flex flex-col gap-2 text-center">
                  <h2 className="header-4 text-text-primary">{title}</h2>
                  <p className="body-r whitespace-pre-line text-text-secondary">{description}</p>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <ul className="flex gap-2">
          {contents.map((_, index) => (
            <li
              key={index}
              className={cn(
                'h-2 w-2 rounded-full',
                index === currentIndex ? 'bg-background-tertiary' : 'bg-background-secondary',
              )}
            />
          ))}
        </ul>
      </div>

      <div className="flex gap-1">
        <Button
          size="lg"
          className="w-[200px]"
          onClick={() => {
            setIsCompleted(true);
            // @note: 고양이가 없을때만 다음 페이지가 선택페이지가 되도록
            navigate(!user?.cat ? PATH.SELECTION : PATH.POMODORO);
          }}
        >
          시작하기
        </Button>
      </div>
    </div>
  );
};

export default Onboarding;
