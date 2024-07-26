import { PropsWithChildren } from 'react';

import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { Mutation, QueryClient } from '@tanstack/react-query';
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
  serialize: (client) => {
    const optimizedClient = {
      ...client,
      clientState: {
        ...client.clientState,
        mutations: client.clientState.mutations.reduceRight<typeof client.clientState.mutations>(
          (mutations, mutation) => {
            const key = JSON.stringify(mutation.mutationKey);
            if (mutations.some((m) => JSON.stringify(m.mutationKey) === key)) {
              return mutations;
            }
            return [...mutations, mutation];
          },
          [],
        ),
      },
    };
    const mutationCache = queryClient.getMutationCache();
    const pausedMutations = mutationCache.getAll().filter((mutation) => mutation.state.isPaused);
    // 가장 최신의 mutation만 map으로 저장
    const latestMutationMap = new Map<string, Mutation>();
    pausedMutations.forEach((mutation) => {
      const key = JSON.stringify(mutation.options.mutationKey);
      if (!latestMutationMap.has(key)) {
        return latestMutationMap.set(key, mutation);
      }
      const latestMutation = latestMutationMap.get(key) as Mutation;
      if (mutation.state.submittedAt > latestMutation.state.submittedAt) {
        return latestMutationMap.set(key, mutation);
      }
    });
    // 최신이 아닌 mutation은 mutationCache에서 제거
    pausedMutations.forEach((mutation) => {
      const key = JSON.stringify(mutation.options.mutationKey);
      if (latestMutationMap.get(key) !== mutation) {
        return mutationCache.remove(mutation);
      }
    });

    console.log('serialize: ', optimizedClient, mutationCache.getAll());
    return JSON.stringify(optimizedClient);
  },
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
