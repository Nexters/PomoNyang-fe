import { Button, Dialog, DialogProps } from '@/shared/ui';

type TimeoutDialogProps = Pick<DialogProps, 'open' | 'onOpenChange'> & {
  title: string;
  description: string;
};

export const TimeoutDialog = ({ open, onOpenChange, title, description }: TimeoutDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} hasCloseButton={false}>
      <div className="flex flex-col gap-xl">
        <div>
          <div className="header-4 py-[7.5px] text-text-primary">{title}</div>
          <div className="subBody-r text-text-secondary">{description}</div>
        </div>
        <Button
          className="w-full"
          variant="tertiary"
          onClick={() => {
            onOpenChange?.(false);
          }}
        >
          확인
        </Button>
      </div>
    </Dialog>
  );
};
