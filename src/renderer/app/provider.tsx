import { PropsWithChildren } from 'react';

import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import {
  // PersistedClient,
  PersistQueryClientProvider,
  // PersistRetryer,
} from '@tanstack/react-query-persist-client';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      staleTime: 1000 * 60 * 60, // 60분
    },
  },
});

// 가장 최신의 mutation만 유지하는 함수
// const keepLatestMutations: PersistRetryer = ({ persistedClient }) => {
//   const mutations = [...persistedClient.clientState.mutations];
//   const queries = [...persistedClient.clientState.queries];

//   // mutationKey를 기준으로 가장 최신의 mutation만 유지
//   const latestMutations = mutations.reduce(
//     (acc, mutation) => {
//       const key = JSON.stringify(mutation.mutationKey);
//       acc[key] = mutation;
//       return acc;
//     },
//     {} as Record<string, (typeof mutations)[0]>,
//   );

//   const client: PersistedClient = {
//     ...persistedClient,
//     clientState: {
//       mutations: Object.values(latestMutations),
//       queries,
//     },
//   };
//   return client;
// };

const persister = createSyncStoragePersister({
  storage: window.localStorage,
  // serialize: (client) => {
  //   const optimizedClient = keepLatestMutations({
  //     persistedClient: client as PersistedClient,
  //     error: new Error(),
  //     errorCount: 0,
  //   });

  //   console.log('serialize: ', optimizedClient || client);
  //   return JSON.stringify(optimizedClient || client);
  // },
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
