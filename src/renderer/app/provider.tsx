import { PropsWithChildren } from 'react';

import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';

import { Toaster } from '@/shared/ui';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 디바이스와 서버간 데이터는 달라질 일이 거의 없을거라고 가정하여, 캐시를 무제한으로 설정
      gcTime: Infinity,
      staleTime: Infinity,
      retry: 0,
    },
  },
});

const persister = createSyncStoragePersister({
  storage: window.localStorage,
});

export const Provider = ({ children }: PropsWithChildren) => {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
      onSuccess={async () => {
        await queryClient.resumePausedMutations();
      }}
    >
      {children}
      <Toaster />
      <ReactQueryDevtools buttonPosition="bottom-left" initialIsOpen={false} />
    </PersistQueryClientProvider>
  );
};
