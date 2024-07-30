import { useQuery } from '@tanstack/react-query';

import { httpClient } from '../api';
import { __localStorage } from '../utils';

import { useMachineId } from './machine-id';

type AuthToken = {
  accessToken: string;
  accessTokenExpiredAt: string;
  refreshToken: string;
  refreshTokenExpiredAt: string;
};
type AuthTokenMeta = {
  command: 'refresh-all' | 'refresh-access';
  refreshToken: string;
};

export const AUTH_TOKEN_QUERY_KEY = ['authToken'];

// FIXME: enabled 제거
export const useAuthToken = (enabled?: boolean) => {
  const deviceId = useMachineId();
  const authTokenQuery = useQuery<AuthToken | null>({
    queryKey: AUTH_TOKEN_QUERY_KEY,
    queryFn: async ({ meta }) => {
      // deviceId 가 있어야 query 실행되므로, 없다면 에러 발생하도록 한다.
      // enabled 값에 deviceId 여부를 확인하므로 실제 에러는 발생하지는 않는다.
      if (!deviceId) throw new Error('Device ID is not provided');

      const { command = 'refresh-all', refreshToken = '' } = (meta as AuthTokenMeta) ?? {};

      if (command === 'refresh-access' || refreshToken !== '') {
        return await refreshAuthToken(refreshToken);
      }

      return await fetchAuthToken(deviceId);
    },
    initialData: () => {
      const prevAuthToken = __localStorage.getItem<AuthToken>('authToken');
      if (!prevAuthToken) return null;

      // 만약 access token 만료 시점이 지났다면, null 반환
      if (new Date(prevAuthToken.accessTokenExpiredAt) < new Date()) return null;

      // 그렇지 않다면 유효하다고 판단하고 값 반환
      return prevAuthToken;
    },
    refetchInterval: (query) => {
      const currAuthToken = query.state.data;
      // 만약 auth token 이 없다면, 1초 뒤에 다시 시도
      // TODO: 1초 뒤에 다시 시도하는 것은 너무 빠를 수 있음. 더 늘리거나, exponential backoff 적용
      if (!currAuthToken) return 1000;

      // 다음 access token, refresh token 만료 시점까지 남은 시간 계산
      const accessTokenDiff = getDiffFromNow(new Date(currAuthToken.accessTokenExpiredAt));
      const refreshTokenDiff = getDiffFromNow(new Date(currAuthToken.refreshTokenExpiredAt));

      // 만약 access token, refresh token 둘 중 하나라도 만료 시점이 지났다면, 모두 갱신
      if (accessTokenDiff <= 0 || refreshTokenDiff <= 0) {
        query.options.meta = {
          ...query.options.meta,
          command: 'refresh-all',
        };
        return 1000;
      }

      // 만약 access token 만료가 더 가깝다면, access token 갱신
      if (accessTokenDiff < refreshTokenDiff) {
        query.options.meta = {
          ...query.options.meta,
          command: 'refresh-access',
          refreshToken: currAuthToken.refreshToken,
        };
        return accessTokenDiff;
      }

      // 그렇지 않다면(= refresh token 만료가 더 가깝다면), 모두 갱신
      query.options.meta = {
        ...query.options.meta,
        command: 'refresh-all',
      };
      return refreshTokenDiff;
    },
    meta: {
      command: 'refresh-all',
      refreshToken: '',
    } as AuthTokenMeta,
    enabled: !!deviceId && enabled,
  });

  return authTokenQuery;
};

const fetchAuthToken = (deviceId: string): Promise<AuthToken> => {
  return httpClient.post<AuthToken>('/papi/v1/tokens', { deviceId });
};

const refreshAuthToken = (refreshToken: string): Promise<AuthToken> => {
  return httpClient.post<AuthToken>('/papi/v1/tokens/refresh', { refreshToken });
};

const getDiffFromNow = (date: Date) => {
  const now = new Date();
  return date.getTime() - now.getTime();
};
