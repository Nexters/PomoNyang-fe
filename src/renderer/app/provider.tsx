import { PropsWithChildren } from 'react';

import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';

import { DEFAULT_KEY, updateTimer } from '@/entities/timer';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      staleTime: 1000 * 60 * 60, // 60분
    },
  },
});

// 오프라인 상황에서 mutation을 저장하고, 온라인 상황에서 다시 실행
queryClient.setMutationDefaults([DEFAULT_KEY], {
  mutationFn: updateTimer,
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
      <ReactQueryDevtools buttonPosition="bottom-left" initialIsOpen={false} />
    </PersistQueryClientProvider>
  );
};
