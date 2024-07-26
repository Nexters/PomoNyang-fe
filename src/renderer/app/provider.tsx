import { PropsWithChildren } from 'react';

import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { dehydrate, Mutation, QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { PersistedClient, PersistQueryClientProvider } from '@tanstack/react-query-persist-client';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      // staleTime: 1000 * 60 * 60, // 60분
    },
  },
});

const persister = createSyncStoragePersister({
  storage: window.localStorage,
  serialize: (persistedClient) => {
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
    // 최신 Mutation들의 variables 수정
    latestMutationMap.forEach((mutation) => {
      // const prevVariables = mutation.state.variables as { title: string; id: number };
      // const nextVariables = { ...prevVariables, title: 'modified' };
      // @note: 객체를 직접 수정하면 수정된 데이터가 보내짐.
      // 그러나 새로운 객체를 할당하면 수정전 원본 데이터가 보내진다.
      (mutation.state.variables as { title: string; id: number }).title = 'modified';
    });

    // queryClient로 persistedClient 새로 생성하기...
    // @see: https://github.com/TanStack/query/blob/v5.51.4/packages/query-persist-client-core/src/persist.ts#L117-L121
    const newPersistClient: PersistedClient = {
      buster: persistedClient.buster,
      timestamp: persistedClient.timestamp,
      // note: 두번째 인자인 DehydrateOptions은 PersistQueryClientProvider > persistOptions 에 준 값으로 할당해야함
      // 여기선 할당하지 않았으니, undefined로 할당함
      clientState: dehydrate(queryClient, undefined),
    };
    console.log('serialize: ', newPersistClient, mutationCache.getAll());

    return JSON.stringify(newPersistClient);
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
