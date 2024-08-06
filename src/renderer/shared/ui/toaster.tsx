import { Icon } from './icon';
import { Toast, ToastClose, ToastTitle, ToastProvider, ToastViewport } from './toast';
import { useToast } from './use-toast';

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(({ id, message, iconName, ...props }) => {
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
