import { Icon } from './icon';

import { Toast, ToastClose, ToastTitle, ToastProvider, ToastViewport } from '@/shared/ui/toast';
import { useToast } from '@/shared/ui/use-toast';

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(({ id, message, iconName = 'clock', ...props }) => {
        return (
          <Toast key={id} {...props}>
            <Icon name={iconName} size="md" />
            <ToastTitle>{message}</ToastTitle>
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
