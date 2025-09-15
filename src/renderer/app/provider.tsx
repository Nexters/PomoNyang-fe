import { PropsWithChildren } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { Toaster } from '@/shared/ui';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
    },
  },
});

export const Provider = ({ children }: PropsWithChildren) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster />
      <ReactQueryDevtools buttonPosition="bottom-right" initialIsOpen={false} />
    </QueryClientProvider>
  );
};
