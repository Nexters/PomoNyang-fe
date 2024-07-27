import { PropsWithChildren } from 'react';

import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { dehydrate, Mutation, QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import type { PersistedClient } from '@tanstack/react-query-persist-client';

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
  serialize: (persistedClient) => {
    const mutationCache = queryClient.getMutationCache();
    const pausedMutations = mutationCache.getAll().filter((mutation) => mutation.state.isPaused);

    // 가장 최신의 mutation만 map으로 저장
    const lastMutationMap = new Map<string, Mutation>();
    pausedMutations.forEach((mutation) => {
      const key = JSON.stringify(mutation.options.mutationKey);
      if (!lastMutationMap.has(key)) {
        return lastMutationMap.set(key, mutation);
      }
      const latestMutation = lastMutationMap.get(key) as Mutation;
      if (mutation.state.submittedAt > latestMutation.state.submittedAt) {
        return lastMutationMap.set(key, mutation);
      }
    });
    // 최신이 아닌 mutation은 mutationCache에서 제거
    pausedMutations.forEach((mutation) => {
      const key = JSON.stringify(mutation.options.mutationKey);
      if (lastMutationMap.get(key) !== mutation) {
        return mutationCache.remove(mutation);
      }
    });
    // 최신 Mutation들의 variables 수정
    // TODO: mutation key로 분기해서 개별로 관리하기
    // ex) 특정 mutation은 마지막 한번만 보내거나,
    //     또 보내더라도 요청 variables를 기존것까지 합쳐서 보내거나
    lastMutationMap.forEach((mutation) => {
      // @note: 객체를 직접 수정하면 수정된 데이터가 보내짐.
      // 그러나 새로운 객체를 할당하면 수정전 원본 데이터가 보내진다.
      // 그래서 variables 객체를 직접 수정해야함...!

      // const prevVariables = mutation.state.variables as { title: string; id: number };
      // const nextVariables = { ...prevVariables, title: 'modified' };
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
